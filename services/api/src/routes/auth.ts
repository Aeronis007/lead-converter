import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const router = Router();

function issueToken(payload: { id: string; email: string }) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret not configured.");
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";
  return jwt.sign(payload, secret, { expiresIn });
}

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    const token = issueToken({ id: user.id, email: user.email });

    return res.status(201).json({
      user,
      token
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = issueToken({ id: user.id, email: user.email });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
