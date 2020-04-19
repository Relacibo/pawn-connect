export default class Message {
  constructor(
    readonly id = 0,
    readonly from = '',
    readonly connectionId = '',
    readonly payload = ''
  ) {}
}
