import { pool } from "../db.js";

export const verifyClient = async (vEmail) => {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE email = ?', [vEmail]);
    return rows.length > 0;
}