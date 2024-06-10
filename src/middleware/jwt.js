import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

export const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRETO, { expiresIn: process.env.JWT_EXPIRES_IN });
}

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({
        message: 'Token no existente'
    });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRETO);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({
            message: 'Token Inválido'
        })
    }
};

// VERIFICAR QUE EL USUARIO TENGA LOS PERMISOS NECESARIOS PARA LA ACCION
export const verifyPermissions = (requiredPermission) => {
    return async (req, res, next) => {
        const {usuario_id} = req.user;
        
        try {
            const [rows] = await pool.query(`
            SELECT p.nombre_permiso FROM permisos p
            JOIN rol_permisos rp ON p.permisos_id = rp.permiso_id
            JOIN usuario_roles ur ON rp.rol_id = ur.rol_id
            WHERE ur.usuario_id = ? AND p.nombre_permiso = ?
            `, [usuario_id, requiredPermission]);
            
            if (rows.length > 0){
                next();
            }else{
                return res.status(403).json({
                    message: 'No estás autorizado a esta acción'
                });
            }
        } catch (error) {
            res.status(500).json({
                message: 'Internal server error'
            });
        }
    }
}

export const verifyRole = (requiredRole) => {
    return async (req, res, next) => {
        const {usuario_id} = req.user;

        try {
            const [rows] = await pool.query(`
            SELECT r.nombre_rol FROM roles r
            JOIN usuario_roles ur ON r.rol_id = ur.rol_id
            WHERE ur.usuario_id = ? AND r.nombre_rol = ?
            `, [usuario_id, requiredRole]);

            if (rows.length > 0) {
                next();
            } else {
                res.status(403).json({
                    message: 'No estás autorizado a esta acción'
                })
            }
        } catch (error) {
            res.status(500).json({
                message: 'Internal server error'
            })
        }
    }
}