import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing authorization token." });
  }

  const token = authHeader.replace("Bearer ", "");
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ message: "JWT secret not configured." });
  }

  try {
    const decoded = jwt.verify(token, secret) as { id: string; email: string };
    req.user = { id: decoded.id, email: decoded.email };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
