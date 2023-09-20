import type { Directive, DirectiveBinding } from 'vue'
import { message } from 'ant-design-vue'
import html2canvas from 'html2canvas'
import useCodeStore from '@/store/modules/codes'

interface ElType extends HTMLElement {
  targetContent: string
}

// base64转化为Blob对象
function convertBase64ToBlob(imageEditorBase64) {
  const base64Arr = imageEditorBase64.split(',')
  let imgtype = ''
  let base64String = ''
  if (base64Arr.length > 1) {
    // 如果是图片base64，去掉头信息
    base64String = base64Arr[1]
    imgtype = base64Arr[0].substring(
      base64Arr[0].indexOf(':') + 1,
      base64Arr[0].indexOf(';'),
    )
  }
  // 将base64解码
  const bytes = atob(base64String)
  // var bytes = base64;
  const bytesCode = new ArrayBuffer(bytes.length)
  // 转换为类型化数组
  const byteArray = new Uint8Array(bytesCode)
  console.log(byteArray)

  // 将base64转换为ascii码
  for (let i = 0; i < bytes.length; i++)
    byteArray[i] = bytes.charCodeAt(i)
  // 生成Blob对象（文件对象）
  return new Blob([byteArray], { type: imgtype })
}

// 下载Blob流文件
function downFileToLocal(fileName, blob) {
  // 创建用于下载文件的a标签
  const d = document.createElement('a')
  // 给blob对象创建一个专属url
  d.href = window.URL.createObjectURL(blob)
  // 设置下载文件的名字
  d.download = fileName
  // 界面上隐藏该按钮
  d.style.display = 'none'
  // 放到页面上
  document.body.appendChild(d)
  // 点击下载文件
  d.click()
  // 从页面移除掉
  document.body.removeChild(d)
  // 释放 URL.createObjectURL() 创建的 URL 对象
  window.URL.revokeObjectURL(d.href)
}

export default function useTools() {
  function pushToCitePage(curCode: any) {
    window.open(curCode.raw, '_blank')
  }

  function downloadCodeFile(codeId: string) {
    const codeStore = useCodeStore()

    codeStore.downloadCodeFile({ codeId })
  }

  function copyCodeToClipboard() {
    return {
      beforeMount(el: ElType, binding: DirectiveBinding) {
        el.targetContent = binding.value as string
        el.addEventListener('click', () => {
          if (!el.targetContent)
            message.warn('没有需要复制的内容')
          const textarea: HTMLTextAreaElement = document.createElement('textarea')
          textarea.readOnly = true
          textarea.style.position = 'fixed'
          textarea.style.top = '-99999px'
          textarea.value = el.targetContent
          document.body.appendChild(textarea)
          // 让文本域表单的内容变为选中状态
          textarea.select()
          // 参数为copy：拷贝当前选中内容到剪切板
          const res: boolean = document.execCommand('copy')
          const success = binding.arg as unknown as Function
          res && success ? success(el.targetContent) : message.success('复制成功!')
          document.body.removeChild(textarea)
        })
      },
      updated(el: ElType, binding: DirectiveBinding) {
        el.targetContent = binding.value
      },
      unmounted(el: ElType) {
        el.removeEventListener('click', () => {})
      },
    } as Directive
  }

  async function exportAsImage() {
    const scale = window.devicePixelRatio
    const canvas = await html2canvas(document.querySelector('.code-block') as HTMLElement, {
      useCORS: true,
      scale,
      width: 1300,
      backgroundColor: '#23241f',
      removeContainer: true,
    })
    const base64Img = canvas.toDataURL('image/png')
    console.log(base64Img)

    downFileToLocal('code.png', convertBase64ToBlob(base64Img))
  }

  return {
    pushToCitePage,
    downloadCodeFile,
    copyCodeToClipboard,
    exportAsImage,
  }
}
