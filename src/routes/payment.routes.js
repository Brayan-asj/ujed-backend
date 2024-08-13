import { Router } from "express";
import { verifyToken } from "../middleware/jwt.js";
import { createCheckoutSession, webhookStripe } from "../controllers/payment.controller.js";
import bodyParser from "body-parser";
import { STRIPE_SECRET_KEY } from "../config.js";
import Stripe from "stripe";

const stripe = new Stripe(STRIPE_SECRET_KEY);

const router = Router();

router.post('/paymentMoment', verifyToken, createCheckoutSession);
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), webhookStripe)
router.get('/success', verifyToken, (req, res) => res.send('SE HIZO EL PAGO, FELICIDADES'));
router.get('/cancel', verifyToken, (req, res) => res.send('SE CANCELO EL PROCESO'));

export default router;