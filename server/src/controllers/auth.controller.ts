import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env";
import { UserModel, type UserDocument } from "../models/User";
import { AppError } from "../utils/AppError";
import { sendSuccess } from "../utils/apiResponse";
import type { loginSchema, registerSchema } from "../validations/auth.validation";

const serializeUser = (user: UserDocument) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role
});

const signAccessToken = (user: UserDocument): string => {
  const options: SignOptions = {
    subject: user._id.toString(),
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
  };

  return jwt.sign(
    {
      name: user.name,
      email: user.email,
      role: user.role
    },
    env.JWT_SECRET as Secret,
    options
  );
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { body } = req.validated as z.infer<typeof registerSchema>;

  const existingUser = await UserModel.exists({ email: body.email });
  if (existingUser) {
    throw new AppError(409, "Email already exists", [{ field: "email", message: "Email already exists" }]);
  }

  const passwordHash = await bcrypt.hash(body.password, 12);
  const user = await UserModel.create({
    name: body.name,
    email: body.email,
    passwordHash,
    role: body.role
  });

  sendSuccess(
    res,
    {
      user: serializeUser(user),
      token: signAccessToken(user)
    },
    "Registration successful",
    201
  );
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { body } = req.validated as z.infer<typeof loginSchema>;

  const user = await UserModel.findOne({ email: body.email }).select("+passwordHash").exec();
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(body.password, user.passwordHash);
  if (!passwordMatches) {
    throw new AppError(401, "Invalid email or password");
  }

  sendSuccess(res, {
    user: serializeUser(user),
    token: signAccessToken(user)
  });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, "Authentication is required");
  }

  const user = await UserModel.findById(req.user.id).exec();
  if (!user) {
    throw new AppError(401, "User no longer exists");
  }

  sendSuccess(res, {
    user: serializeUser(user)
  });
};
