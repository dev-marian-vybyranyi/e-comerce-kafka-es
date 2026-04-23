import bcrypt from "bcryptjs";
import { Request, Response, Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { signAccessToken } from "./jwt";
import { authMiddleware, AuthRequest } from "./middleware";
import { prisma } from "./prisma";
import {
  deleteAllUserTokens,
  deleteRefreshToken,
  getRefreshToken,
  saveRefreshToken,
} from "./redis";

const router = Router();

// Validation schemas
const RegisterSchema = z.object({
  email: z.string().email("Invalid email"),
  username: z.string().min(3, "Too short").max(20),
  password: z.string().min(6, "Too short"),
  firstName: z.string().min(1, "Too short"),
  lastName: z.string().min(1, "Too short"),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const RefreshSchema = z.object({
  refreshToken: z.string().min(1),
});

// POST /auth/register
router.post("/auth/register", async (req: Request, res: Response) => {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }

  const { email, username, password, firstName, lastName } = parsed.data;

  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) {
      const field = existing.email === email ? "email" : "username";
      return res.status(409).json({ error: `This ${field} is already taken` });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashed,
        firstName,
        lastName,
        role: "user",
      },
    });

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });
    const refreshToken = uuidv4();
    await saveRefreshToken(refreshToken, user.id);

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("[Auth] Register error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /auth/login
router.post("/auth/login", async (req: Request, res: Response) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }

  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });
    const refreshToken = uuidv4();
    await saveRefreshToken(refreshToken, user.id);

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("[Auth] Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /auth/refresh
router.post("/auth/refresh", async (req: Request, res: Response) => {
  const parsed = RefreshSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "refreshToken required" });
  }

  const { refreshToken } = parsed.data;

  try {
    const userId = await getRefreshToken(refreshToken);
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Invalid or expired refresh token" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    await deleteRefreshToken(refreshToken);
    const newRefreshToken = uuidv4();
    await saveRefreshToken(newRefreshToken, user.id);

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    return res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error("[Auth] Refresh error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /auth/logout
router.post("/auth/logout", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (refreshToken) await deleteRefreshToken(refreshToken);
  return res.json({ message: "Logged out successfully" });
});

// POST /auth/logout-all
router.post(
  "/auth/logout-all",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    if (req.user) await deleteAllUserTokens(req.user.userId);
    return res.json({ message: "All sessions terminated" });
  },
);

// GET /auth/me
router.get(
  "/auth/me",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
      });
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.json({ user });
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
