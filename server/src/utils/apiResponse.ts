import type { Response } from "express";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const sendSuccess = <T>(
  res: Response<ApiResponse<T>>,
  data: T,
  message = "Success",
  statusCode = 200
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};
