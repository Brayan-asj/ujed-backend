import { pool } from "../db.js";
import bcryptjs from 'bcryptjs';
import { verifyClient } from "../middleware/verifyClient.js";
import { generateConfirmationToken } from "../middleware/jwt.js";
import { sendConfirmationEmail } from "../config/emailer.js";

export const registerClient = async (req, res) => {
    const { nombre_cliente, apellido_cliente, celular, nombre_usuario, email, password } = req.body;

    const clientExist = await verifyClient(email);

    if (clientExist) return res.json({
        message: 'Cliente ya existe'
    });

    try {
        await pool.query('START TRANSACTION');

        const [clientResult] = await pool.query(
            'INSERT INTO cliente (nombre_cliente, apellido_cliente, celular) VALUES (?, ?, ?)',
            [nombre_cliente, apellido_cliente, celular]
        );

        const cliente_id = clientResult.insertId;

        let passHash = await bcryptjs.hash(password, 10);

        const [userResult] = await pool.query(
            'INSERT INTO usuario (nombre_usuario, email, password, FK_cliente_id) VALUES (?, ?, ?, ?)',
            [nombre_usuario, email, passHash, cliente_id]
        );
        const userId = userResult.insertId;

        const token = generateConfirmationToken({id: userId, email});

        await sendConfirmationEmail(email, token);

        await pool.query('COMMIT');

        res.status(201).json({
            message: 'Usuario y cliente creados exitosamente. Confirma tu correo electronico',
            cliente_id: cliente_id,
            usuario_id: userResult.insertId
        });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error(error);
        res.status(500).json({
            message: 'Error al crear el usuario y cliente'
        });
    }
}

export const getClients = async(req, res) => {
    
    try {
        const [rows] = await pool.query('SELECT * FROM cliente');
        res.json(rows);
    } catch (error) {
        res.json({
            message: 'Error al obtener los clientes'
        })
    }
}

export const updateClient = async (req, res) => {
    const {nombre_cliente, apellido_cliente, celular, estatus} = req.body;
    const clienteId = req.params.id;

    const [rows] = await pool.query(
        'SELECT * FROM cliente WHERE cliente_id = ?', [clienteId]
    );

    if(rows.affectedRows === 0){
         return res.status(400).json({
            message: 'El cliente no existe'
        });
    }

    const [upClient] = await pool.query(
        'UPDATE cliente SET nombre_cliente = IFNULL(?, nombre_cliente),  apellido_cliente = IFNULL(?, apellido_cliente), celular = IFNULL(?, celular), estatus = IFNULL(?, estatus), fecha_creacion = NOW() WHERE cliente_id = ?',
        [nombre_cliente, apellido_cliente, celular, estatus, clienteId]
    );

    if (upClient.affectedRows === 0){
        return res.status(404).json({
            message: 'No se pudo encontrar al usuario'
        });
    }

    const [verCliente] = await pool.query(
        'SELECT * FROM cliente WHERE cliente_id = ?',
        [clienteId]
    );

    res.json(verCliente[0]);
}