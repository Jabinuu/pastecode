import Mock from 'mockjs'
import { codesInfo } from '@/mock/modules/codeContent'
import { detailById } from '@/mock/modules/constant'

Mock.mock('/mock/getCodeInfo', codesInfo)
Mock.mock('/mock/getDetailById', detailById)
// Mock.mock('/mock/uploadCode', 'post', (options) => {
//   codesInfo.push(JSON.parse(options.body))
//   console.log(codesInfo)
// })
