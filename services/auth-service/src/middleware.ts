import { NextFunction, Request, Response } from "express";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    username: string;
  };
}

export function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void {
  req.user = {
    userId: req.headers["x-user-id"] as string,
    email: req.headers["x-user-email"] as string,
    username: req.headers["x-username"] as string,
  };
  next();
}
