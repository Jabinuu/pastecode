/* eslint-disable @typescript-eslint/no-use-before-define */
import { computed, nextTick, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import { StarFilled } from '@ant-design/icons-vue'
import useCodesStore from '@/store/modules/codes'
import mitt from '@/utils/mitt'
import type { CodeList } from '@/types/codeContentInfo.type'
import type { CodeRequestBody } from '@/types/http.type'
import useFavorite from '@/hooks/useFavorite'
import useUserStore from '@/store/modules/user'
import useLoading from '@/hooks/useLoading'

export function useShowCodeList() {
  const placeholderDiv = ref()
  const { addFavorite, quitFavorite } = useFavorite()
  const codeStore = useCodesStore()
  const { isLoading, loadingWrapper } = useLoading()
  const listData = computed(() => {
    const total = codeStore.listData.total
    const tmp = codeStore.listData.codeList.length === 0
      ? Array(pagination.value.pageSize).fill({})
      : codeStore.listData.codeList
    return {
      total,
      codeList: tmp,
    }
  })
  // 当前所在代码分类tab
  let curTab: 'hot' | 'new' | 'qulity' = 'hot'
  // 分页器数据
  const pagination = ref({
    current: 1,
    total: computed(() => codeStore.listData?.total),
    pageSize: 5,
    onChange(page: number) {
      pagination.value.current = page
      getCodeList(curTab, queryParam, loadingWrapper)
    },
  })
  // 获取代码列表的请求体
  const queryParam: CodeRequestBody = {
    kw: '',
    languages: [],
    pn: pagination.value.current,
    ps: pagination.value.pageSize,
  }

  const observer = new IntersectionObserver((entries) => {
    const isReq = entries[0].intersectionRatio <= 0 || pagination.value.total <= codeStore.listData.codeList.length || codeStore.isRequesting
    if (isReq)
      return
    pagination.value.current += 1
    getCodeList(curTab, queryParam, loadingWrapper)
  }, {
    rootMargin: '160px 0px',
  })

  // 监听页码变化，并更新queryParam的pn值
  watchEffect(() => {
    queryParam.pn = pagination.value.current
  }, { flush: 'sync' })

  onMounted(() => {
    mitt.on('search', (val: string) => {
      queryParam.kw = val
      getCodeList(curTab, queryParam, loadingWrapper)
    })
    mitt.on('langFilter', (languages: string[]) => {
      queryParam.languages = languages
      pagination.value.current = 1
      getCodeList(curTab, queryParam, loadingWrapper)
    })
    getCodeList(curTab, queryParam, loadingWrapper).then(() => {
      nextTick(() => {
        observer.observe(placeholderDiv.value)
      })
    })
  })

  onUnmounted(() => {
    mitt.off('search')
    mitt.off('langFilter')
    observer.disconnect()
  })

  function getCodeDesc(item: CodeList) {
    return item.content?.slice(0, 100)
  }

  function onSwitchList(tab: 'hot' | 'new' | 'qulity') {
    codeStore.listData.codeList = []
    curTab = tab
    pagination.value.current = 1
  }

  async function handleClickStar(type: number, item: any) {
    if (type === 3) {
      try {
        if (item.isFilled)
          quitFavorite(item)

        else
          addFavorite(item)
      }
      catch (e: any) {
        message.error(e)
      }
    }
  }

  function computedIconType(type: any, id: number, isFilled: any) {
    if (id === 3)
      return isFilled ? StarFilled : type
    else
      return type
  }

  return {
    listData,
    pagination,
    queryParam,
    isLoading,
    placeholderDiv,
    loadingWrapper,
    getCodeDesc,
    onSwitchList,
    handleClickStar,
    computedIconType,
  }
}

export async function getCodeList(tab: string, query: CodeRequestBody, loadingWrapper: Function) {
  const codesStore = useCodesStore()
  if (tab === 'hot')
    await loadingWrapper(codesStore.getHotlist(query))
  else if (tab === 'new')
    await loadingWrapper(codesStore.getNewlist(query))
  else if (tab === 'quality')
    await loadingWrapper(codesStore.getQualitylist(query))
  handleStaredIcon(codesStore.listData?.codeList)
}

export function handleStaredIcon(list: CodeList[]) {
  const userStore = useUserStore()
  if (userStore.getUserInfo()) {
    const favoArr = userStore.getUserFavorite

    list?.forEach((elem) => {
      if (favoArr?.includes(elem.id))
        elem.isFilled = true
    })
  }
}

export function useSwitchList(loadingWrapper: Function) {
  async function switchHotlist(queryParam: CodeRequestBody, emit: any) {
    emit('switchList', 'hot')
    getCodeList('hot', queryParam, loadingWrapper)
  }
  async function switchNewlist(queryParam: CodeRequestBody, emit: any) {
    emit('switchList', 'new')
    getCodeList('new', queryParam, loadingWrapper)
  }
  async function switchQualitylist(queryParam: CodeRequestBody, emit: any) {
    emit('switchList', 'quality')
    getCodeList('quality', queryParam, loadingWrapper)
  }
  return {
    switchHotlist,
    switchNewlist,
    switchQualitylist,
  }
}
