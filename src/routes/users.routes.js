import { Router } from "express";
import { userLogin, getUsers, updateUser } from "../controllers/users.controller.js";
import { requrieAdmin, verifyToken } from "../middleware/jwt.js";

const router = Router();

// LOGIN DE USUARIOS
router.post('/login', userLogin);

// VER LISTA DE USUARIOS
router.get('/users', verifyToken,requrieAdmin, getUsers);

// ACTUALIZAR USUARIO
router.patch('/users/:id',verifyToken, updateUser);

export default router;
