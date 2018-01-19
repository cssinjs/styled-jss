export default class StyledJssError extends Error {
  constructor(message: string) {
    super(message)

    this.message = message
    this.name = 'StyledJssError'

    Error.captureStackTrace(this, StyledJssError)
  }
}
