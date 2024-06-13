import { Router } from "express";
import { registerClient, getClients, updateClient } from "../controllers/client.controller.js";
import { requrieAdmin, verifyToken } from "../middleware/jwt.js";
import { confirmationRegister } from "../middleware/confirmationRegister.js";

const router = Router();

router.get('/clients', verifyToken, requrieAdmin, getClients);

router.get('/confirm/:token', confirmationRegister)

router.post('/registerClientandUser', registerClient);

router.patch('/updateClient/:id', verifyToken, requrieAdmin, updateClient);

router.patch('/deactivateClient');

export default router;