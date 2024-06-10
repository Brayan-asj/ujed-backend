import { pool } from "../db.js";
import bcryptjs from 'bcryptjs';
import { generateToken } from "../middleware/jwt.js";

export const userLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Por favor llenar los campos" });
    }

    try {

        const [rows] = await pool.query('SELECT * FROM usuario WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = rows[0];


        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        if (user.estatus === 0) return res.status(403).json({
            message: 'Usuario Desactivado'
        })

        const token = generateToken(user);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
            sameSite: 'strict'
        });

        res.status(200).json({ message: 'Login exitoso', token, userId: user.usuario_id, nombre: user.nombre_usuario, email: user.email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getUsers = async (req, res) => {

    const [rows] = await pool.query('SELECT * FROM usuario');
    res.json(rows)

};

export const userRegister = async (req, res) => {
    const { nombre_usuario, email, password, estatus } = req.body;
    let passHash = await bcryptjs.hash(password, 8)

    const userExist = await verifyUser(email);

    if (userExist) {
        res.status(400).json({
            msg: 'El usuario ya existe'
        })
    } else {
        const [rows] = await pool.query('INSERT INTO usuario (nombre_usuario, email, password, estatus) VALUES (?, ?, ?, ?)', [nombre_usuario, email, passHash, estatus]);
        res.send({
            usuario_id: rows.insertId,
            nombre_usuario,
            email,
            password,
            estatus
        });
    }
};

const verifyUser = async (vEmail) => {
    const [ver] = await pool.query('SELECT * FROM usuario WHERE email = ?', [vEmail]);
    return ver.length > 0;
};

export const updateUser = async (req, res) => {
    const { nombre_usuario, email, password, estatus } = req.body;
    const userId = req.params.id;

    let passHash = null;
    if (password) {
        passHash = await bcryptjs.hash(password, 8)
    }

    const [currentUserRows] = await pool.query('SELECT * FROM usuario WHERE usuario_id = ?', [userId]);

    if (currentUserRows === 0) {
        res.status(400).json({
            msg: 'El usuario no existe'
        });
    }

    const currentUser = currentUserRows[0];

    const updatedNombreUsuario = nombre_usuario || currentUser.nombre_usuario;
    const updatedEmail = email || currentUser.email;
    const updatedPassword = passHash || currentUser.password;
    const updatedEstatus = typeof estatus !== 'undefined' ? estatus : currentUser.estatus;

    const [rows] = await pool.query(
        'UPDATE usuario SET nombre_usuario = ?, email = ?, password = ?, estatus = ?, fecha_creacion = NOW() WHERE usuario_id = ?',
        [updatedNombreUsuario, updatedEmail, updatedPassword, updatedEstatus, userId]
    );

    if (rows.affectedRows === 0) {
        return res.status(404).json({
            msg: 'No se pudo encontrar un usuario'
        });
    }

    const [ver] = await pool.query(
        'SELECT * FROM usuario WHERE usuario_id = ?',
        [userId]
    );

    res.json(ver[0]);

};

export const assignRoleToUser = async (req, res) => {
    const {usuario_id, rol_id} = req.body;

    try {
        const [results] = await pool.query('INSERT INTO usuario_roles (usuario_id, rol_id) VALUES (?, ?)', [usuario_id, rol_id]);
        res.json({
            msg: 'Rol asignado satisfactoriamente',
        });
        console.log(results[0]);
    } catch (error) {
        res.status(500).json({
            msg: 'Error al asignar un rol',
        });
    }
}

export const assignPermissionToRole = async (req, res) => {
    const {rol_id, permiso_id} = req.body;

    try {
        const [results] = await pool.query('INSERT INTO rol_permisos (rol_id, permiso_id) VALUES (?, ?)', [rol_id, permiso_id]);
        res.json({
            msg: 'Permiso asignado satisfactoriamente',
        })
        console.log(results[0]);
    } catch (error) {
        res.status(500).json({
            msg: 'Error al asignar el permiso',
        });
    }
}
