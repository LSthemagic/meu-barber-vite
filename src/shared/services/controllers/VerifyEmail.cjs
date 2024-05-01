const express = require("express");
const UserModel = require("../../../Client/services/models/User.cjs");
const BarberModel = require("../../../Barbershop/services/models/Barber.cjs");
const router = express.Router();
require("dotenv").config();
const nodemailer = require("nodemailer");

let codingRandom = () => Math.floor(10000 + Math.random() * 10000);
var random;
const sendEmail = async (email, codingRandom) => {
	const transport = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		auth: {
			user: process.env.REACT_APP_NODEMAILER_EMAIL,
			pass: process.env.REACT_APP_NODEMAILER_PASSWORD
		}
	});
	transport
		.sendMail({
			from: `MEU BARBER <${process.env.REACT_APP_NODEMAILER_EMAIL}>`,
			to: email,
			subject: "MEU BARBER",
			html: ` <html lang="PT-BR">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Meu Barber</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #2c3e50;
              color: #ecf0f1;
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
            }

            .container {
              text-align: center;
            }

            h1 {
              font-size: 3em;
              margin-bottom: 20px;
            }

            p {
              font-size: 1.2em;
              margin-bottom: 40px;
            }

            .verification-code {
              font-size: 2em;
              color: #f39c12;
              font-weight: bold;
            }

            .barber-image {
              width: 200px;
              border-radius: 50%;
              margin-bottom: 20px;
            }

          </style>
        </head>
        <body>
          <div class="container">
            <img src="https://cdn.leonardo.ai/users/4faac9a5-cda4-49fa-923b-a6a4c5d22b79/generations/2dcf1b63-30fe-43cf-b69b-2dd5e99f9c7e/variations/alchemyrefiner_alchemymagic_1_2dcf1b63-30fe-43cf-b69b-2dd5e99f9c7e_0.jpg" alt="MEU BARBER" class="barber-image">
            <h1>Bem-vindo à MEU BARBER</h1>
            <p>Estamos animados em tê-lo como parte da nossa comunidade! Utilize o código de verificação abaixo para concluir seu cadastro.</p>
            <p class="verification-code">${codingRandom}</p>
          </div>
        </body>
      </html>`
		})
		.then((resp) => console.log(""))
		.catch((err) => console.log("erro ao enviar email ", err));
};

const sendEmailRequest = async (req, res, Model) => {
	try {
		const { email } = req.body;
		if (await Model.findOne({ email })) {
			return res.status(400).json({
				error: true,
				message: "Esse email já foi cadastrado."
			});
		}
		const random = codingRandom();
		sendEmail(email, random);
		return res.json({
			error: false,
			message: "Solicitação enviada com sucesso!"
		});
	} catch (error) {
		return res.status(400).json({
			error: true,
			message: "Erro ao enviar email."
		});
	}
};

router.post("/req-email", async (req, res) => {
	await sendEmailRequest(req, res, UserModel);
});

router.post("/req-email-barber", async (req, res) => {
	await sendEmailRequest(req, res, BarberModel);
});

router.post("/auth-code", async (req, res) => {
	try {
		const { code } = req.body;
		if (code && code.toString() !== random.toString()) {
			return res.status(400).json({
				error: true,
				message: `O código enviado é inválido.`
			});
		}

		return res.json({
			error: false,
			message: `Código verificado enviado com sucesso!`,
			data: code
		});
	} catch (err) {
		console.log("error auth-code", err);
		res.status(500).json({
			error: true,
			message: "Erro interno ao processar o código de verificação."
		});
	}
});

module.exports = router;
