import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodError, type ZodType } from "zod";
import { AppError, type ValidationIssue } from "../utils/AppError";

export const formatZodIssues = (error: ZodError): ValidationIssue[] => {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message
  }));
};

export const validate = (schema: ZodType): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      return next(new AppError(400, "Validation failed", formatZodIssues(result.error)));
    }

    req.validated = result.data;
    return next();
  };
};
