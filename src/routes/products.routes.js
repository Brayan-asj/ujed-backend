import { Router } from "express";
import { getProducts, getProductName, getProductCategory, getProductAvailable, addProduct, deactivateProduct, activateProduct, updateProduct, getProductsLanding } from "../controllers/products.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = Router();

// Obtener productos para landing
router.get('/productsLanding', getProductsLanding);

// Filtrado de productos por (TODOS, NOMBRE, CATEGORIA Y DISPONIBILIDAD)
router.get('/products', getProducts);
router.get('/products/nombre/:nombre', getProductName);
router.get('/products/categoria/:categoria', getProductCategory);
router.get('/products/disponibilidad/:estatus', getProductAvailable);

// Agregar Un Producto
router.post('/products', verifyToken, addProduct);

// Desactivar un producto
router.patch('/products/deactivate/:id', verifyToken, deactivateProduct);
router.patch('/products/activate/:id', verifyToken, activateProduct);

// Actualizar parcial o completamente un producto
router.patch('/products/:id', verifyToken, updateProduct);


export default router;