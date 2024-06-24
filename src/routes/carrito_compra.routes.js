import { Router } from "express";
import { verifyToken } from "../middleware/jwt.js";
import { addProductCar, deleteProductToCart, summaryCart, updateAmount } from "../controllers/carrito_compra.controller.js";

const router = Router();

router.get('/carrito', verifyToken, summaryCart);

router.post('/carrito/detalle', verifyToken, addProductCar);

router.delete('/carrito/:id', verifyToken, deleteProductToCart);

router.patch('/carrito/:id', verifyToken, updateAmount);

export default router;