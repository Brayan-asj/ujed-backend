import Stripe from "stripe";
import { WEBHOOK_SECRET_KEY } from "../config.js";
import { pool } from "../db.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    const cliente_id = req.user.usuario_id;

    try {
        // Obtener resumen y datos necesarios para la compra
        const [cartItems] = await pool.query(`
            SELECT
                p.nombre_producto, p.precio, dc.cantidad
            FROM
                detalle_carrito dc
            JOIN
                productos p ON dc.FK_producto_id = p.producto_id
            WHERE
                dc.FK_cliente_id = ? AND dc.FK_carrito_compra_id = (
                    SELECT
                        carrito_compra_id FROM carrito_compra WHERE FK_cliente_id = ? AND estatus = 'pendiente'
                )   
        `, [cliente_id, cliente_id]);

        if (cartItems.length === 0) {
            return res.status(400).json({ msg: "No hay productos en el carrito" });
        }

        // Crear los line_items para Stripe usando los datos del carrito
        const line_items = cartItems.map(item => ({
            price_data: {
                currency: 'mxn',
                product_data: {
                    name: item.nombre_producto,
                },
                unit_amount: item.precio * 100,
            },
            quantity: item.cantidad
        }));

        // Crear la sesión de pago con Stripe utilizando el payment_intent_id creado
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: 'http://localhost:3000/success.html',
            cancel_url: 'http://localhost:3000/cancel.html',
            metadata: {
                cliente_id: cliente_id
            }
        });

        // Verificar el resultado y retornar la sesión creada
        res.status(200).json({
            id: session.id,
            session
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al crear la sesión de pago",
            error: error.message
        });
    }
};

export const webhookStripe = async(req, res) => {

    const sig = req.headers['stripe-signature']; 
    const endpointSecret = WEBHOOK_SECRET_KEY;
        
        let event;
    

        try {
            event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
        } catch (error) {
            console.error(error);
            res.status(400).json({
                message: "Error al verificar la firma del webhook",
            });
        }
    
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;

                const paymentIntent = session.payment_intent;
                const clienteId = session.metadata.cliente_id;
                const monto = session.amount_total / 100;
                const estatus = session.status;

                const [pago] = await pool.query(
                    'INSERT INTO pagos (payment_intent_id, FK_cliente_id, amount, status) VALUES (?, ?, ?, ?)',
                    [paymentIntent, clienteId, monto, estatus]
                );

                console.log('DATOS ENVIADOS CORRECTAMENTE');
                
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    
        res.json({ received: true});
    
};