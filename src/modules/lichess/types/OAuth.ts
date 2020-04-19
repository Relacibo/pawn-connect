export default class OAuth {
  constructor(
    readonly username: string,
    readonly accessToken: string,
    readonly refreshToken: string,
    readonly expireTimeStamp: number
  ) {}
}
