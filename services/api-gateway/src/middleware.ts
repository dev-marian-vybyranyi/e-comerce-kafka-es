import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    username: string;
    role: string;
  };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;
  const queryToken = req.query.token as string | undefined;
  const rawToken = header?.startsWith("Bearer ")
    ? header.split(" ")[1]
    : queryToken;

  if (!rawToken) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    req.user = jwt.verify(rawToken, JWT_SECRET) as AuthRequest["user"];
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
