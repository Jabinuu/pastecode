import defHttp from '@/services/http'
import type { CodeFromData } from '@/types/codeContentInfo.type'
import type { ChangeCodeBody, CodeRequestBody, UserCodeReqBody } from '@/types/http.type'

export const reqGetHotlist = (data: CodeRequestBody) => defHttp.post('/code/hotlist', data)
export const reqGetNewlist = (data: CodeRequestBody) => defHttp.post('/code/newlist', data)
export const reqGetQualitylist = (data: CodeRequestBody) => defHttp.post('/code/qualitylist', data)
export const reqCreateCode = (data: CodeFromData) => defHttp.post('/code/create', data)
export const reqGetDetailById = (data: { codeId: string; isCount: boolean }) => defHttp.post('/code/single', data)
export const reqGetRecommedlist = () => defHttp.get('/recommend/list')
export const reqChangeUserCode = (data: ChangeCodeBody) => defHttp.patch('/code/changeCode', data)
export const reqDeleteUserCode = (data: { codeId: string }) => defHttp.post('/code/deleteCode', data)
export const reqGetUserCode = (data: UserCodeReqBody) => defHttp.post('/code/userCode', data)
export const reqGetFavorite = (data: { id: number }) => defHttp.post('/favorite/list', data)
export const reqAddFavorite = (data: { uid: number; cid: number }) => defHttp.post('/favorite/add', data)
export const reqQuitFavorite = (data: { uid: number; cid: number }) => defHttp.post('/favorite/quit', data)
export const reqDownloadCode = (data: { codeId: string }) => defHttp.get(`/file/download/${data.codeId}`, { responseType: 'blob' })
export const reqVerifyCodepw = (data: { codeId: string; codepw: string }) => defHttp.post('/code/verify', data)
