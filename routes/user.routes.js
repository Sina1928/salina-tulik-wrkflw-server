import express from "express";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

router.get("/current_user", (req, res) => {
  res.send(req.user);
});

export default router;
