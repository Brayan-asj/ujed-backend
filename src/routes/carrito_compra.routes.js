import { Router } from "express";
import { verifyToken } from "../middleware/jwt.js";
import { addProductCar, deleteProductToCart, summaryCart, updateAmount } from "../controllers/carrito_compra.controller.js";

const router = Router();

// VER RESUMEN DE CARRITO DEL USUARIO LOGUEADO
router.get('/carrito', verifyToken, summaryCart);

// AGREGAR PRODUCTO AL CARRITO DEL USUARIO LOGUEADO
router.post('/carrito/detalle', verifyToken, addProductCar);

// ELIMINAR PRODUCTO DE CARRITO DE COMPRA
router.delete('/carrito/:id', verifyToken, deleteProductToCart);

// ACTUALIZAR CANTIDAD DE PRODUCTO EN CARRITO DE COMPRA
router.patch('/carrito/:id', verifyToken, updateAmount);

export default router;