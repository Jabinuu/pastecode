<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { useRoute } from 'vue-router'
import CodeArea from './components/codeArea/index.vue'
import CommentsArea from './components/commentsArea/index.vue'
import PublicCode from '@/components/PublicCode/PublicCode.vue'
import useCodeStore from '@/store/modules/codes'
import useCommentStore from '@/store/modules/comment'
import type { CodeList } from '@/types/codeContentInfo.type'
import useLoading from '@/hooks/useLoading'

const { isLoading, loadingWrapper } = useLoading()
const codeStore = useCodeStore()
const commentStore = useCommentStore()
const route = useRoute()
// provide可以是响应式的,父组件更改，子组件也会更新
const currentCode = ref<CodeList>()
provide('currentCode', currentCode)

onMounted(() => {
  getDetailById()
  getCommentList()
})

async function getDetailById() {
  const data = await loadingWrapper(codeStore.getDetailById(route.params.id as string, true))
  currentCode.value = data
}

async function getCommentList() {
  await loadingWrapper(commentStore.getCodeComment(route.params.id as string))
}
</script>

<template>
  <div class="codeDetail flex justify-center">
    <div class="left">
      <a-spin :spinning="isLoading">
        <CodeArea />
        <CommentsArea />
      </a-spin>
    </div>
    <PublicCode />
  </div>
</template>

<style lang="less" scoped>
  .codeDetail{
    padding: 0 50px;
  }
  .left{
    width: 68%;
  }
</style>
