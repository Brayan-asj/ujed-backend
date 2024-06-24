import express from "express";
import ProductRoutes from "./routes/products.routes.js";
import UsersRoutes from './routes/users.routes.js';
import ClientRoutes from './routes/client.routes.js';
import CarritoRoutes from './routes/carrito_compra.routes.js';
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use('/api', ProductRoutes);
app.use('/api', UsersRoutes);
app.use('/api', ClientRoutes);
app.use('/api', CarritoRoutes);

export default app;