import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = 500;
  res.status(statusCode).json({
    message: err.message || "Unexpected server error.",
    statusCode
  });
}
