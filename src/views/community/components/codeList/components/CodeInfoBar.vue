<script setup lang="ts">
import useComputedSzie from '@/hooks/useComputeSize'
import useIconLangName from '@/hooks/useIconLangName'
import { relativeTime } from '@/utils/date'
import Icon from '@/components/Icon/Icon.vue'

const props = defineProps<{
  lang?: string
  date?: number
  size?: number
}>()

const computedSize = useComputedSzie(props.size as number)
const iconName = useIconLangName(props.lang as string)
</script>

<template>
  <div>
    <span>
      <Icon :name="`${iconName}`" size="16px" />
      {{ props.lang }}</span>
    <a-divider type="vertical" style="border-width: 2px;" />
    <span>{{ relativeTime(date as number) }}</span>
    <a-divider type="vertical" style="border-width: 2px;" />
    <span>{{ computedSize }}</span>
  </div>
</template>

<style lang="less" scoped>
  div{
    vertical-align: baseline;
    font-size: 12px;
    color:#696969;
  }
</style>
