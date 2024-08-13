import { config } from "dotenv";

config();

// CONFIG CONEXIÓN BASE DE DATOS
export const PORT = process.env.PORT || 3000;
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'leoncampeonA12';
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_DATABASE = process.env.DB_DATABASE || 'ujedbackend';
export const DB_PORT = process.env.DB_PORT || 3306;

export const JWT_SECRETO = process.env.JWT_SECRETO;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN;

export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const WEBHOOK_SECRET_KEY = process.env.WEBHOOK_SECRET_KEY;

// console.log(WEBHOOK_SECRET_KEY);
