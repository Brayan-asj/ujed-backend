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

export const getSalesReportByPeriod = async (req, res) => {
    const {fecha_inicio, fecha_fin} = req.query;

    try {
        
        const [rows] = await pool.query(`
        
            SELECT
                cc.fecha_creacion AS fecha_compra,
                SUM(dc.cantidad * dc.precio) AS total
            FROM
                carrito_compra cc
            JOIN
                detalle_carrito dc ON cc.carrito_compra_id = dc.FK_carrito_compra_id
            WHERE
                cc.fecha_creacion BETWEEN ? AND ?
            GROUP BY
                cc.fecha_creacion
            ORDER BY
                cc.fecha_creacion
        `, [fecha_inicio, fecha_fin]);

        res.status(200).json({
            message: "Reporte de ventas por periodo",
            report: rows
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el reporte de ventas por periodo"
        });
    }
}

export const getSalesReportByProduct = async(req, res) =>{
    const {id} = req.params;

    try {
        
        const [rows] = await pool.query(`
            SELECT
                p.nombre_producto,
                SUM(dc.cantidad) AS cantidad_vendida,
                SUM(dc.cantidad * dc.precio) AS total
            FROM
                productos p
            JOIN
                detalle_carrito dc ON p.producto_id = dc.FK_producto_id
            JOIN
                carrito_compra cc ON dc.FK_carrito_compra_id = cc.carrito_compra_id
            WHERE
                p.producto_id = ?
            GROUP BY
                p.nombre_producto
        `, [id]);

        res.status(200).json({
            message: "Reporte de ventas por producto",
            report: rows
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al obtener el reporte de ventas por producto"
        });
    }
}

export const getSalesReportByCustomer = async(req, res) => {
    const {customerId} = req.params;

    try {
        
        const [rows] = await pool.query(`
            SELECT
                c.nombre_cliente,
                c.apellido_cliente,
                SUM(dc.cantidad * dc.precio) AS total
            FROM
                cliente c
            JOIN
                carrito_compra cc ON c.cliente_id = cc.FK_cliente_id
            JOIN
                detalle_carrito dc ON cc.carrito_compra_id = dc.fk_carrito_compra_id
            WHERE
                c.cliente_id = ?
            GROUP BY
                c.nombre_cliente, c.apellido_cliente
            `, [customerId]);

            if(rows.length === 0) return res.status(404).json({
                message: "No se encontraron ventas para el cliente"
            })

            res.status(200).json({
                message: "Reporte de ventas por cliente",
                report: rows
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al obtener el reporte de ventas por cliente"
        });
    }
}