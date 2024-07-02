import { Router } from "express";
import { verifyToken, requrieAdmin } from "../middleware/jwt.js";
import { getPurchases, updateStatus } from "../controllers/compras.controller.js";

const router = Router();

// Obtener la lista de las compras
router.get("/orders", verifyToken, requrieAdmin, getPurchases);

// Actualizar estado de la compra
router.patch('/order/status/:id', verifyToken, requrieAdmin, updateStatus);

export default router;