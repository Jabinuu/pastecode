import defHttp from '../http'
import type { ChangePasswordFormState, LoginFormState, RegisterFormState } from '@/types/auth.type'

export const reqRegister = (data: RegisterFormState) => defHttp.post('/user/register', data)
export const reqLogin = (data: LoginFormState) => defHttp.post('/user/login', data)
export const reqChangePassword = (data: ChangePasswordFormState) => defHttp.patch('/user/change', data)
