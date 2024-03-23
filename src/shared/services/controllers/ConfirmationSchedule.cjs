const express = require("express");
const router = express.Router();
require("dotenv").config();
const nodemailer = require("nodemailer")

const sendEmail = (emailBarber, emailClient) => {
    const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.REACT_APP_NODEMAILER_EMAIL,
            pass: process.env.REACT_APP_NODEMAILER_PASSWORD
        }
    });
    transport.sendMail({
        from: `MEU BARBER <${process.env.REACT_APP_NODEMAILER_EMAIL}>`,
        to: [emailBarber, emailClient],
        subject: "Agendamento com o SEU BARBER.",
        html: ` html
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmação de Agendamento</title>
          <style>
            .root {
              --marrom-claro: #e7d7b7;
              --marrom-medio: #764217de;
              --marrom-escuro: #5c4033;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: var(--marrom-claro);
              color: var(--marrom-escuro);
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            .confirmation-box {
              background-color: white;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              text-align: center;
              color: var(--marrom-medio);
            }
            p {
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="confirmation-box">
            <h1>Agendamento Confirmado</h1>
            <p>O seu horário com o barbeiro foi agendado com sucesso!</p>
          </div>
        </body>
        </html>`
    })
        // .then((response) => console.log(response))
        .catch((err) => console.log("erro ao enviar email ", err))

}

router.post("/confirmationSchedule", async (req, res) => {
    try {
        const { emailBarber, emailClient } = req.body;

        sendEmail(emailBarber, emailClient)

        return res.json({
            error: false,
            message: "Horário agendado!"
        })

    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "ERRO INTERNO AO ENVIAR EMAIL DE CONFIRMAÇÃO."
        })
    }
})

module.exports = router;