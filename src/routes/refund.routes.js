import { Router } from "express";
import { verifyToken } from "../middleware/jwt.js";
import { refundPayment } from "../controllers/refund.controller.js";

const router = Router();

// Enpoint para poder realizar un REEMBOLSO con STRIPE
router.post('/refund', verifyToken, refundPayment);

export default router;