import type { RequestHandler } from "express";
import jwt, { type JwtPayload, type Secret } from "jsonwebtoken";
import { env } from "../config/env";
import { userRoles, type UserRole } from "../models/User";
import { AppError } from "../utils/AppError";

interface AccessTokenPayload extends JwtPayload {
  name: string;
  email: string;
  role: UserRole;
}

const isUserRole = (role: unknown): role is UserRole => {
  return typeof role === "string" && userRoles.includes(role as UserRole);
};

export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(new AppError(401, "Authentication token is required"));
  }

  const token = header.slice("Bearer ".length);

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET as Secret) as AccessTokenPayload;

    if (!decoded.sub || !isUserRole(decoded.role)) {
      return next(new AppError(401, "Invalid authentication token"));
    }

    req.user = {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role
    };

    return next();
  } catch {
    return next(new AppError(401, "Invalid or expired authentication token"));
  }
};
