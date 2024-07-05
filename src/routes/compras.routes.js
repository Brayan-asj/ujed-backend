import { Router } from "express";
import { verifyToken, requrieAdmin } from "../middleware/jwt.js";
import { getPurchases, getSalesReportByCustomer, getSalesReportByPeriod, getSalesReportByProduct, updateStatus } from "../controllers/compras.controller.js";

const router = Router();

// Obtener la lista de las compras
router.get("/orders", verifyToken, requrieAdmin, getPurchases);

// Actualizar estado de la compra
router.patch('/order/status/:id', verifyToken, requrieAdmin, updateStatus);

// Obtener reporte de ventas por periodo
router.get('/report/period', verifyToken, requrieAdmin, getSalesReportByPeriod);

// Obtener reporte de ventas por producto
router.get('/report/producto/:id', verifyToken, requrieAdmin, getSalesReportByProduct);

// Obtener reporte de venta por cliente
router.get('/report/customer/:customerId', verifyToken, requrieAdmin, getSalesReportByCustomer);

export default router;