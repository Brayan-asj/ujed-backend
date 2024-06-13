import { pool } from "../db.js";
import jwt from 'jsonwebtoken';

export const confirmationRegister = async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRETO);

        await pool.query ('UPDATE usuario SET estatus = 1 WHERE usuario_id = ?',
            [decoded.id]
        );
        await pool.query ('UPDATE cliente SET estatus = 1 WHERE cliente_id = ?',
            [decoded.id]
        );

        res.send('Correo Confirmado, ya puedes iniciar sesión');
        
    } catch (error) {
        res.status(400).send('Token invalido o expirado');
    }
}