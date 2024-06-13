import { Router } from "express";
import { userLogin, getUsers, updateUser, assignRoleToUser, assignPermissionToRole } from "../controllers/users.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = Router();

// LOGIN DE USUARIOS
router.get('/login', userLogin);

// VER LISTA DE USUARIOS
router.get('/users', verifyToken, getUsers);

// ACTUALIZAR USUARIO
router.patch('/users/:id',verifyToken, updateUser);

// ASIGNAR ROL A USUARIO
router.post('/assign-role', verifyToken, assignRoleToUser);

// ASIGNAR PERMISOS A USUARIO
router.post('/assign-permission', verifyToken, assignPermissionToRole);

export default router;
