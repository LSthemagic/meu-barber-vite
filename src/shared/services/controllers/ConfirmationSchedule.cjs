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
    subject: "Agendamento com o MEU BARBER.",
    html: `<!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Confirmação de Agendamento</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td style="background-color: #007bff; padding: 20px 0; text-align: center;">
                        <h1 style="color: #fff; margin: 0;">Confirmação de Agendamento</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                            <tr>
                                <td style="padding: 30px;">
                                    <p style="color: #333; font-size: 18px; margin: 0;"><strong>Obrigado por escolher nossos serviços! Estamos ansiosos para recebê-lo(a) em breve.</strong></p>
                                    <p style="color: #333; font-size: 16px; margin: 20px 0 10px 0;"><strong>Detalhes do Agendamento:</strong></p>
                                    <p style="color: #333; font-size: 16px; margin: 10px 0;"><strong>Nome do Cliente:</strong> [Inserir nome do cliente]</p>
                                    <p style="color: #333; font-size: 16px; margin: 10px 0;"><strong>Data e Hora:</strong> [Inserir data e hora do agendamento]</p>
                                    <p style="color: #333; font-size: 16px; margin: 10px 0;"><strong>Serviço Agendado:</strong> [Inserir serviço agendado]</p>
                                    <br/>
                                    <p style="margin: 0; text-align: center;"><a href="#" style="background-color: #007bff; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size:30px;">Seu agendamento foi confirmado.</a></p>
                                    <p style="color: #333; font-size: 14px; margin-top: 20px;">Caso haja algum problema com as informações acima, entre em contato conosco o mais breve possível para que possamos fazer as alterações necessárias.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <style>
                @keyframes pulse {
                    0% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                    100% {
                        opacity: 1;
                    }
                }
            </style>
        </body>
        </html>
        
        `
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