import { Router } from "express";
import { registerClient, getClients, updateClient, deactivateClient } from "../controllers/client.controller.js";
import { requrieAdmin, verifyToken } from "../middleware/jwt.js";
import { confirmationRegister } from "../middleware/confirmationRegister.js";

const router = Router();

// ENDPOINT PARA PODER OBTENER LA LISTA DE CLIENTES
router.get('/clients', verifyToken, requrieAdmin, getClients);

// ENDPOINT PARA PODER CONFIRMAR EL REGISTRO DE UN CLIENTE
router.get('/confirm/:token', confirmationRegister)

// ENDPOINT PARA PODER REGISTRAR UN CLIENTE
router.post('/registerClientandUser', registerClient);

// ENDPOINT PARA PODER ACTUALIZAR UN CLIENTE
router.patch('/updateClient/:id', verifyToken, requrieAdmin, updateClient);

// ENDPOINT PARA PODER DESACTIVAR UN CLIENTE
router.patch('/deactivateClient/:id', verifyToken, requrieAdmin, deactivateClient);

export default router;