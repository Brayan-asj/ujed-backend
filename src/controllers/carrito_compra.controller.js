import { pool } from "../db.js";

export const addProductCar = async (req, res) => {
    const { producto_id, cantidad } = req.body;
    const cliente_id = req.user.usuario_id;

    if (!cantidad) return res.status(400).json({
        message: "Campos requeridos"
    });

    try {
        const [productRows] = await pool.query(
            'SELECT precio FROM productos WHERE producto_id = ?',
            [producto_id]
        );

        if (productRows.length === 0) return res.status(404).json({
            message: "Producto no encontrado"
        });

        const precio = productRows[0].precio;

        // VERIFICAR SI EXISTE UN CARRITO ACTIVO PARA EL USUARIO
        const [carrito] = await pool.query(
            'SELECT * FROM carrito_compra WHERE FK_cliente_id = ? AND estatus = "pendiente"',
            [cliente_id]
        );

        let carrito_id;

        if(carrito.length === 0) {

            // CREAR UN NUEVO CARRITO SI NO EXISTE
            const [newCarrito] = await pool.query(
                'INSERT INTO carrito_compra (FK_cliente_id, estatus) VALUES (?, "pendiente")', 
                [cliente_id]
            );

            carrito_id = newCarrito.insertId;

        }else{

            carrito_id = carrito[0].carrito_compra_id;

        }

        // INSERTAR EL PRODUCTO EN EL CARRITO
        const [detalleRows] = await pool.query(
            'INSERT INTO detalle_carrito (FK_cliente_id, FK_carrito_compra_id, FK_producto_id, cantidad, precio) VALUES (?, ?, ?, ?, ?)',
                [cliente_id, carrito_id, producto_id, cantidad, precio]
            );

        res.status(201).json({
            message: "Producto agregado al carrito",
            detalle_id: detalleRows.insertId,
            carrito_id: carrito_id,
            producto_id: producto_id,
            cantidad: cantidad,
            precio: precio
        });

    } catch (error) {

        res.status(500).json({
            message: "Error al agregar producto al carrito"
        })

    }
}

export const deleteProductToCart = async (req, res) => {
    const {id} = req.params;
    const cliente_id = req.user.usuario_id;
    
    try {
        
        // VERIFICAR QUE EL PRODUCTO A BORRAR ESTE EN EL CARRITO Y COINCIDA CON EL CLIENTE
        const [detalleRows] = await pool.query('SELECT FK_producto_id FROM detalle_carrito WHERE FK_producto_id = ? AND FK_cliente_id = ?',
            [id, cliente_id]
        );

        const productResult = detalleRows[0].FK_producto_id;

        if (productResult.length === 0) return res.status(404).json({
            message: "Producto no encontrado en el carrito"
        });

        await pool.query('DELETE FROM detalle_carrito WHERE FK_producto_id = ? AND FK_cliente_id = ?',
            [id, cliente_id]
        );

        const [nombreEliminado] = await pool.query('SELECT nombre_producto FROM productos WHERE producto_id = ?',
            [id]
        );

        const nombreProducto = nombreEliminado[0].nombre_producto;

        res.status(200).json({
            message: `${nombreProducto} eliminado del carrito`,
        });

    } catch (error) {

        res.status(500).json({
            message: "Error al eliminar producto del carrito"
        })
        
    }
}

export const updateAmount = async (req, res) => {
    const {id} = req.params;
    const {cantidad} = req.body;
    const cliente_id = req.user.usuario_id

    try {

        // VERIFICAR QUE EL PRODUCTO ESTE EN EL CARRITO Y CORRESPONDA AL CLIENTE
        const [verProduct] = await pool.query('SELECT * FROM detalle_carrito WHERE FK_producto_id = ? AND  FK_cliente_id = ?',
            [id, cliente_id]
        );

        if (verProduct.length === 0) return res.status(404).json({
            message: "Producto no encontrado en el carrito"
        })

        const [upAmount] = await pool.query('UPDATE detalle_carrito SET cantidad = ? WHERE FK_producto_id = ? AND FK_cliente_id = ?',
            [cantidad, id, cliente_id]
        );

        if (upAmount.affectedRows === 0) return res.status(404).json({
            message: "No se pudo actualizar la cantidad"
        });

        const [productAmount] = await pool.query('SELECT cantidad FROM detalle_carrito WHERE FK_producto_id = ? AND FK_cliente_id = ?',
            [id, cliente_id]
        );

        res.json({
            message: `Cantidad actualizada a ${productAmount[0].cantidad}`,
        })

    } catch (error) {
        
        res.status(500).json({
            message: "Error al actualizar cantidad"
        })

    }
}

export const summaryCart = async(req, res) => {
    const cliente_id = req.user.usuario_id

    const [summary] = await pool.query(`
        SELECT 
            p.nombre_producto,
            dc.cantidad
        FROM
            detalle_carrito dc
        JOIN
            productos p ON dc.FK_producto_id = p.producto_id
        WHERE
            FK_cliente_id = ?
        `,
        [cliente_id]
    );

    res.status(200).json({
        message: 'Resumen del carrito obtenido con exito',
        resumen: summary
    });
}