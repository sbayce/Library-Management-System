export class BadRequestError extends Error {
  public readonly statusCode: number = 400

  constructor(message: string = "Bad request") {
    super(message)
    this.name = "BadRequestError"
  }
}

export class NotFoundError extends Error {
  public readonly statusCode: number = 404

  constructor(message: string = "Not found") {
    super(message)
    this.name = "NotFoundError"
  }
}
