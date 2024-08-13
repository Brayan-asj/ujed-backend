import express from "express";
import ProductRoutes from "./routes/products.routes.js";
import UsersRoutes from './routes/users.routes.js';
import ClientRoutes from './routes/client.routes.js';
import CarritoRoutes from './routes/carrito_compra.routes.js';
import ComprasRoutes from './routes/compras.routes.js';
import RefundRoutes from './routes/refund.routes.js';
import PagoRoutes from './routes/payment.routes.js';
import cookieParser from "cookie-parser";
import cors from "cors";
import path from 'path';
import { STRIPE_SECRET_KEY } from "./config.js";
import Stripe from "stripe";
import bodyParser from "body-parser";
// import morgan from "morgan";

const stripe = new Stripe(STRIPE_SECRET_KEY);

const app = express();


// app.use(morgan("short"));

// app.use(bodyParser.raw({type: 'application/json'}));

app.use(cookieParser());
app.use(express.static(path.resolve('src/public')));

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    origin: true,
}));

app.use(
    bodyParser.json({
        verify: function (req, res, buf) {
            req.rawBody = buf.toString();
        }
    })
)

app.use('/api', PagoRoutes);


app.use('/api', express.json(), ProductRoutes);
app.use('/api', express.json(), UsersRoutes);
app.use('/api', express.json(), ClientRoutes);
app.use('/api', express.json(), CarritoRoutes);
app.use('/api', express.json(), ComprasRoutes);
app.use('/api', express.json(), RefundRoutes);

export default app;