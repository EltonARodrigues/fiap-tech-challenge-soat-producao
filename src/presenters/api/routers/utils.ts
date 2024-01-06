import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validaRequisicao =
  (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
  return next();
};
