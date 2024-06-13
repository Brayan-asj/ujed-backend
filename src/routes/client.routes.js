import { Router } from "express";
import { registerClient, getClients } from "../controllers/client.controller.js";
import { requrieAdmin, verifyToken } from "../middleware/jwt.js";

const router = Router();

router.get('/clients', verifyToken, requrieAdmin, getClients);

router.post('/registerClientandUser', registerClient);

router.patch('/updateClient');

router.patch('/deactivateClient');

export default router;