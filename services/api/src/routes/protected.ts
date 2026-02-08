import { Router } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/me", requireAuth, (req: AuthRequest, res) => {
  return res.json({
    message: "Authenticated request successful.",
    user: req.user
  });
});

export default router;
