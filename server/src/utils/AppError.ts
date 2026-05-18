export interface ValidationIssue {
  field: string;
  message: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: ValidationIssue[];

  constructor(statusCode: number, message: string, details?: ValidationIssue[]) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}
