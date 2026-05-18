import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { formatZodIssues } from "./validate";

interface MongoDuplicateError extends Error {
  code?: number;
  keyValue?: Record<string, string>;
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.details
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formatZodIssues(error)
    });
  }

  const mongoError = error as MongoDuplicateError;
  if (mongoError.code === 11000) {
    const field = Object.keys(mongoError.keyValue ?? {})[0] ?? "record";
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      errors: [{ field, message: `${field} must be unique` }]
    });
  }

  const message = process.env.NODE_ENV === "production" ? "Internal server error" : error.message;

  return res.status(500).json({
    success: false,
    message
  });
};
