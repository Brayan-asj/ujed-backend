import { Router } from "express";
import { userLogin, userRegister, getUsers, updateUser, assignRoleToUser, assignPermissionToRole } from "../controllers/users.controller.js";
import { verifyPermissions, verifyRole, verifyToken } from "../middleware/jwt.js";

const router = Router();

// LOGIN DE USUARIOS
router.get('/login', userLogin);

// REGISTER DE USUARIO
router.post('/register', userRegister);

// VER LISTA DE USUARIOS
router.get('/users', verifyToken, verifyRole('admin') || verifyPermissions('ver_usuarios'), getUsers);

// ACTUALIZAR USUARIO
router.patch('/users/:id',verifyToken, verifyRole('admin') || verifyPermissions('actualizar_usuario'), updateUser);

// ASIGNAR ROL A USUARIO
router.post('/assign-role', verifyToken, verifyRole('admin') || verifyPermissions('asignar_roles'), assignRoleToUser);

// ASIGNAR PERMISOS A USUARIO
router.post('/assign-permission', verifyToken, verifyRole('admin') || verifyPermissions('asignar_permisos'), assignPermissionToRole);

export default router;
