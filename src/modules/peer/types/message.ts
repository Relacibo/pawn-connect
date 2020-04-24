export default class Message {
  constructor(
    readonly id = 0,
    readonly connectionId = '',
    readonly payload = ''
  ) {}
}
