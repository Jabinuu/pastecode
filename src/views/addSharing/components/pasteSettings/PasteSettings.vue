<script setup lang="ts">
import { rules, settingsState, useCreateNewPaste } from './hook'
import CodeSettingForm from '@/components/CodeSettingForm/CodeSettingForm.vue'

const { createNewCode, formRef } = useCreateNewPaste()
</script>

<template>
  <h3 class="settingsTitle mb-30">
    设置选项
  </h3>
  <a-form
    ref="formRef"
    :model="settingsState"
    :rules="rules"
    autocomplete="off"
    :label-col="{ style: { width: '90px' } }"
    :wrapper-col="{ span: 10 }"
  >
    <CodeSettingForm :form-state="settingsState" :is-edit="true" />
    <a-form-item :wrapper-col="{ span: 10, offset: 3 }">
      <a-button type="primary" html-type="submit" @click="createNewCode">
        创建粘贴文本
      </a-button>
    </a-form-item>
  </a-form>
</template>

<style lang="less" scoped>
  .settingsTitle{
    border-bottom: 2px solid #ddd;
    line-height: 40px;
  }
</style>
