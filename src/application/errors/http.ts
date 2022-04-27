export class ServerError extends Error {
  constructor (error?: Error) {
    super('Server Error. Try again in a few minutes')
    this.name = 'Server Error'
    this.stack = error?.stack
  }
}
