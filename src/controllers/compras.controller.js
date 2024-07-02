import { pool } from "../db.js";

export const getPurchases = async (req, res) => {
    try {
        
        const [rows] = await pool.query(`
            
            SELECT
                cc.carrito_compra_id,
                cc.fecha_creacion AS fecha_compra,
                c.nombre_cliente,
                c.apellido_cliente,
                GROUP_CONCAT(p.nombre_producto SEPARATOR ', ') AS productos,
                cc.estatus,
                SUM(dc.cantidad * dc.precio) AS total
            FROM
                carrito_compra cc
            JOIN
                cliente c ON cc.FK_cliente_id = c.cliente_id
            JOIN
                detalle_carrito dc ON cc.carrito_compra_id = dc.FK_carrito_compra_id
            JOIN
                productos p ON dc.FK_producto_id = p.producto_id
            GROUP BY
                cc.carrito_compra_id, cc.fecha_creacion, c.nombre_cliente, c.apellido_cliente, cc.estatus
            ORDER BY
                cc.fecha_creacion DESC

            `);

            res.status(200).json({
                compras: rows
            })

    } catch (error) {
        
        console.error(error);
        res.status(500).json({
            message: "Error al obtener la lista de las compras"
        })

    }
}

export const updateStatus = async (req, res) => {
    const {id} = req.params;
    const {estatus} = req.body;

    try {
        
        const [rows] = await pool.query('SELECT * FROM carrito_compra WHERE carrito_compra_id = ?', [id]);


        if ( rows.affectedRows === 0) res.status(400).json({
            message: "El carrito no existe"
        });

        const [update] = await pool.query('UPDATE carrito_compra SET estatus = ? WHERE carrito_compra_id = ?', [estatus, id]);

        if (update.affectedRows === 0) res.status(404).json({
            message: 'No se pudo encontrar el carrito'
        })

        const [verStatus] = await pool.query('SELECT * FROM carrito_compra WHERE carrito_compra_id', [id]);

        res.json(verStatus[0]);

    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar el estatus del carrito"
        });
    }
}