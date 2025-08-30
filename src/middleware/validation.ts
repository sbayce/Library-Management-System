import { ZodObject, ZodRawShape } from "zod"
import { Request, Response, NextFunction } from "express"

export const validateBody = (schema: ZodObject<ZodRawShape>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    schema.parse(req.body)
    next()
  }
}

export const validateParams = (schema: ZodObject<ZodRawShape>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    schema.parse(req.params)
    next()
  }
}

export const validateQuery = (schema: ZodObject<ZodRawShape>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    schema.parse(req.query)
    next()
  }
}
