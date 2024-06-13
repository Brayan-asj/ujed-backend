import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendConfirmationEmail = (email, token) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Por favor, confirma tu registro de usuario',
        html: 
        `
        <h1> BIENVENIDO A LA FACULTAD DE CIENCIAS EXACTAS </h1>
        <p> Por favor, confirma tu correo electronico haciendo click en el siguiente enlace: </p>
        <a href="http://localhost:3000/confirm/${token}">Confirmar Correo Electronico</a>
        `
    };

    return transporter.sendMail(mailOptions);
}