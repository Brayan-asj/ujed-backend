import { Router } from "express";
import { getProducts, getProductName, getProductCategory, getProductAvailable, addProduct, deactivateProduct, activateProduct, updateProduct } from "../controllers/products.controller.js";
import { verifyToken, verifyRole, verifyPermissions } from "../middleware/jwt.js";

const router = Router();

// Filtrado de productos por (TODOS, NOMBRE, CATEGORIA Y DISPONIBILIDAD)
router.get('/products', getProducts);
router.get('/products/nombre/:nombre', getProductName);
router.get('/products/categoria/:categoria', getProductCategory);
router.get('/products/disponibilidad/:estatus', getProductAvailable);

// Agregar Un Producto
router.post('/products', verifyToken, verifyRole('admin' || 'cliente') || verifyPermissions('agregar_productos') , addProduct);

// Desactivar un producto
router.patch('/products/deactivate/:id', verifyToken, verifyRole('admin' || 'cliente') || verifyPermissions('desactivar_productos'), deactivateProduct);
router.patch('/products/activate/:id', verifyToken, verifyRole('admin' || 'cliente') || verifyPermissions('activar_productos'), activateProduct);

// Actualizar parcial o completamente un producto
router.patch('/products/:id', verifyToken, verifyRole('admin' || 'cliente') || verifyPermissions('actualizar_productos'), updateProduct);


export default router;