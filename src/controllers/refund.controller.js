import {pool} from '../db.js';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../config.js';

const stripe = Stripe(STRIPE_SECRET_KEY);

export const refundPayment = async (req, res) => {

    const { paymentId } = req.body;
    let paymentRecord;

    try {
        // Obtener los detalles del pago de la base de datos usando el paymentId
        const [result] = await pool.query('SELECT * FROM pagos WHERE pago_id = ?', [paymentId]);

        if (result.length === 0) return res.status(404).json({
            message: 'Pago no encontrado',
        });

        paymentRecord = result[0];

        const { payment_intent_id, amount, FK_cliente_id } = paymentRecord;

        // Crear el reembolso con Stripe
        const refund = await stripe.refunds.create({
            payment_intent: payment_intent_id,
        });

        const refundAmount = refund.amount / 100; 

        // Guardar los detalles del reembolso en la tabla de reembolso
        await pool.query (`INSERT INTO reembolsos (refund_id, payment_intent_id, FK_pago_id, FK_cliente_id, amount, status) VALUES (?, ?, ?, ?, ?, ?)`, [refund.id,payment_intent_id, paymentId, FK_cliente_id, refundAmount, refund.status]);

        // Actualizar el estado del pago en la tabla de pagos
        await pool.query('UPDATE pagos SET status = ? WHERE pago_id = ?', ['reembolsado', paymentId]);

        return res.status(200).json({
            message: 'Reembolso creado con éxito',
            refund
        });
    } catch (error) {
        console.error('Error al procesar el reembolso', error);
        return res.status(500).json({
            message: 'Error al procesar el reembolso',
            error: error.message
        });
    }
}

