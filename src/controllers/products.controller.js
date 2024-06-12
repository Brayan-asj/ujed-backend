import { pool } from "../db.js";

export const getProductsLanding = async (req, res) => {
    const [rows] = await pool.query('SELECT nombre_producto, precio, imagen FROM productos')
    res.json(rows);
}

export const getProducts = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'Error en el servidor'
        });
    }
};

export const getProductName = async (req, res) => {
    const {nombre} = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM productos WHERE nombre_producto = ?', [nombre]);
        res.json(rows);
        console.log('Se obtuvieron por nombre');
    } catch (error) {
        return res.status(500).json({
            message: 'Error en el servidor'
        });
    }
};

export const getProductCategory = async (req, res) => {
    const {categoria} = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM productos WHERE categoria = ?',[categoria]);
        res.json(rows);
        console.log('Se obtuvo de categoria');
    } catch (error) {
        return res.status(500).json({
            message: 'Error en el servidor'
        });
    }
};

export const getProductAvailable = async (req, res) => {
    const {disponible} = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM productos WHERE estatus = ?', [disponible]);
        res.json(rows);
        console.log('Se obtuvo de disponible');
    } catch (error) {
        return res.status(500).json({
            message: 'Error en el servidor'
        });
    }
};


export const addProduct = async (req, res) => {
    const {nombre_producto, descripcion, precio, categoria, imagen, estatus} = req.body;
        try {
            const [rows] = await pool.query('INSERT INTO productos (nombre_producto, descripcion, precio, categoria, imagen, estatus) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre_producto, descripcion, precio, categoria, imagen, estatus]);
        res.send({
            id: rows.insertId,
            nombre_producto,
            descripcion,
            precio,
            categoria,
            imagen,
            estatus
        });
        } catch (error) {
            return res.status(500).json({
                message: 'Error en el servidor'
            });
        }
};


export const deactivateProduct = async (req, res) =>{
    const {id} = req.params;
    const {nombre_producto, descripcion, precio, categoria, imagen} = req.body;
    try {
        const [result] = await pool.query('UPDATE productos SET nombre_producto = IFNULL(?, nombre_producto), descripcion = IFNULL(?, descripcion), precio = IFNULL(?, precio), categoria = IFNULL(?, categoria), imagen = IFNULL(?, imagen), estatus = 0 WHERE producto_id = ?',
        [nombre_producto, descripcion, precio, categoria, imagen, id]);
        if (result.affectedRows <= 0) return res.json({
            message: 'PRODUCTO YA SE ENCONTRABA ACTIVADO'
        })

        const [rows] = await pool.query('SELECT * FROM productos WHERE producto_id = ?', [id]); 
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'Error en el servidor'
        });
    }
};


export const activateProduct = async (req, res) =>{
    const {id} = req.params;
    const {nombre_producto, descripcion, precio, categoria, imagen} = req.body;
    try {
        const [result] = await pool.query('UPDATE productos SET nombre_producto = IFNULL(?, nombre_producto), descripcion = IFNULL(?, descripcion), precio = IFNULL(?, precio), categoria = IFNULL(?, categoria), imagen = IFNULL(?, imagen), estatus = 1 WHERE producto_id = ?',
        [nombre_producto, descripcion, precio, categoria, imagen, id]);
        if (result.affectedRows <= 0) return res.json({
            message: 'PRODUCTO YA SE ENCONTRABA ACTIVADO'
        })

        const [rows] = await pool.query('SELECT * FROM productos WHERE producto_id = ?', [id]); 
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'Error en el servidor'
        });
    }
};

export const updateProduct = async (req, res) => {
    const {id} = req.params;
    const {nombre_producto, descripcion, precio, categoria, imagen} = req.body;
    try {
        
        const [result] = await pool.query('UPDATE productos SET nombre_producto = IFNULL(?, nombre_producto), descripcion = IFNULL(?, descripcion), precio = IFNULL(?, precio), categoria = IFNULL(?, categoria), imagen = IFNULL(?, imagen), fecha_creacion = NOW() WHERE producto_id = ?',
        [nombre_producto, descripcion, precio, categoria, imagen, id]);
        if (result.affectedRows <= 0) return res.status(404).json({
            message: 'PRODUCTO NO ENCONTRADO'
        });

        const [rows] = await pool.query('SELECT * FROM productos WHERE producto_id = ?', [id]);
        res.json(rows[0]);

    } catch (error) {
        return res.status(500).json({
            message: 'Error en el servidor'
        });
    }
};
