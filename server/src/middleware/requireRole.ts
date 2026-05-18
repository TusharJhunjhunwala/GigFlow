import type { RequestHandler } from "express";
import type { UserRole } from "../models/User";
import { AppError } from "../utils/AppError";

export const requireRole = (...roles: UserRole[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError(401, "Authentication is required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "You do not have permission to perform this action"));
    }

    return next();
  };
};
