import type { Router } from 'vue-router'
import { message } from 'ant-design-vue'
import type { JointContent } from 'ant-design-vue/es/message/interface'
import { computed } from 'vue'
import { asyncRoutesMap, individualChidRouteMap } from '.'
import useUserStore from '@/store/modules/user'
import usePermissionStore from '@/store/modules/permission'
import { userLogout, whiteList } from '@/hooks/useAuth'
import useFootmark from '@/hooks/useFootmark'

function addAsyncRouters(router: Router, perm: number) {
  const permissionStore = usePermissionStore()

  // 添加一级路由
  permissionStore.generatePermissionRoutes(asyncRoutesMap, perm)
  permissionStore.addRouters.forEach((route) => {
    router.addRoute(route)
  })

  // 添加嵌套路由
  permissionStore.generatePermissionRoutes(individualChidRouteMap, perm)
  permissionStore.addRouters.forEach((route) => {
    router.addRoute('individual', route)
  })
}

export function createPermissionGuard(router: Router) {
  const userStore = useUserStore()
  const { recordFootmark } = useFootmark()

  router.beforeEach(async (to, from, next) => {
    const isPost = computed(() => to.path.startsWith('/post'))
    const isEncryptPage = computed(() => to.path.startsWith('/encrypt'))
    const token = userStore.getToken()

    if (!token) {
      // 白名单中的路由无须身份认证，直接放行
      if (!(whiteList.includes(to.path) || isPost.value || isEncryptPage.value))
        return next(`/login?redirect=${from.path}`)
      return next()
    }
    // 已登录便不允许访问login
    if (to.path === '/login')
      return next('/')

    // 存在token但没有用户信息
    if (!userStore.getUserInfo()) {
      try {
        // 发起请求获得userinfo 然后存入store并持久化存储
        await userStore.getUserInfoAction()
      }
      // 用promise的reject触发catch
      catch (e) {
        message.error(e as JointContent)
        userLogout()
        return next(`/login?redirect=${to.path}`)
      }
    }

    // 获取用户信息后，根据用户权限码获取并添加动态路由
    const perm = userStore.getUserPermissions
    addAsyncRouters(router, perm)
    const accessBeforeAddAsyncRoute = router.getRoutes().find(route => route.path === to.path) && to.matched.length <= 1 && to.matched[0].name === '404'
    // 由于进入路由守卫前，动态路由还没有添加，所以to.matched匹配不到要访问的路由，所以next()直接放行会出现404，要手动做一次重定向
    if (accessBeforeAddAsyncRoute)
      return next(to.path)

    // 登录状态下跳转至codeDetail 记录浏览记录
    if ((isPost.value))
      recordFootmark(to.params.id as string)

    next()
  })
}
