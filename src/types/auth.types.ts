export interface IBodyLogin {
  email: string
  password: string
}
export interface IBodyRegister extends IBodyLogin {
  name: string
  gender: string
  phone: string
}

export interface IUserLogined {
  expRefreshToken: string
  expToken: string
  refreshToken: string
  roleName: string
  tokenContent: string
  userId: string
  userName: string
}

export interface IUser {
  id: string
  name: string
  email: string
  phone: string
  gender: string
  roleName: string
}
