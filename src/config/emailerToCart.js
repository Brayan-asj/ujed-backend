import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendChangeStatus = (email, change) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Actualización de tu pedido',
        html:
        `
        <h1> ACTUALIZACIÓN DE TU PEDIDO </h1>
        <p> Tu pedido ha sido <h2> ${change} </h2></p>
        <p> Gracias por confiar en nosotros </p>
        <p> Atentamente, </p>
        <p> Equipo de Facultad de Ciencias Exactas </p>
        `
    };

    return transporter.sendMail(mailOptions);
}