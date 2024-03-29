export interface LoginFormState {
  username: string
  password: string
}

export interface RegisterFormState {
  username: string
  email: string
  password: string
  rePassword: string
}

export enum PermsEnum {
  UPDATE_CID = 1 << 0, // 00000001
  UPDATE_DATE = 1 << 1, // 00000010
  UPDATE_REF = 1 << 2, // 00000100
  UPDATE_REGISTER_TIME = 1 << 3, // 00001000
  ALL_USERS_ROUTE = 1 << 4, // 00010000
  CONSTANT_ROUTES = 1 << 5, // 00100000
  VISITOR_CODE = 1 << 6, // 01000000
}

export interface ChangePasswordFormState extends RegisterFormState {}
