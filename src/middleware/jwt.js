import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

export const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRETO, { expiresIn: process.env.JWT_EXPIRES_IN });
}

export const generateConfirmationToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRETO, {expiresIn: '1h'});
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

export const requrieAdmin = (req, res, next) => {
    if(req.user.rol !== 'admin'){
        return res.status(403).json({
            message: 'Acceso denegado. Solo un administrador puede realizar esta accion'
        })
    }
    next();
}