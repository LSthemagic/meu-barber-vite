const express = require("express");
const BarberModel = require("../models/Barber.cjs");
// const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
require("dotenv").config();
const upload = require("../middlewares/Storage.cjs");
const router = express.Router();
// const nodemailer = require('nodemailer')

const generateToken = (user = {}) => {
	return jwt.sign(
		{
			id: user.id,
			name: user.name
		},
		process.env.REACT_APP_SECRET,
		{
			expiresIn: 86400
		}
	);
};
router.post("/uploadImage", upload.single("file"), async (req, res) => {
	try {
		const { file } = req;
		if (!file) {
			return res.status(400).json({
				message: "No image provided"
			});
		}
	} catch (err) {
		res.status(500).json({
			error: "Error in the server"
		});
	}
});

router.post("/registerBarber", async (req, res) => {
	try {
		const barber = await BarberModel.create({
			...req.body,
			clientes: []
		});
		barber.password = undefined;
		return res.json({
			error: false,
			data: barber,
			message: "Cadastro bem-sucedido!",
			token: generateToken(barber)
		});
	} catch (err) {
		console.log("err register barber", err);
		return res.status(400).json({
			error: true,
			message: "Error on registration"
		});
	}
});

router.post("/update-clients", async (req, res) => {
	try {
		const { email, clients } = req.body;
		const barber = await BarberModel.findOne({ email });

		// Verifica se o barbeiro foi encontrado
		if (!barber) {
			return res.status(404).json({
				error: true,
				message: "Barbeiro não encontrado"
			});
		}

		// Verifica se já existe um cliente com o email fornecido
		const existingClient = barber.clientes.find(
			(client) => client.email === clients.email
		);

		if (existingClient) {
			// Se o cliente já existe, atualiza seus dados
			existingClient.nome = clients.nome;
			existingClient.date = clients.date;
		} else {
			// Se o cliente não existe, verifica se outro barbeiro possui esse cliente
			const { email: emailClient } = clients;
			const barberExisting = await BarberModel.findOne({
				"clientes.email": emailClient
			});
			if (barberExisting) {
				// Remove o cliente da lista do barbeiro existente
				const clientIndexInExistingBarber = barberExisting.clientes.findIndex(
					(client) => client.email === emailClient
				);
				if (clientIndexInExistingBarber !== -1) {
					barberExisting.clientes.splice(clientIndexInExistingBarber, 1);
					await barberExisting.save();
				}
			}
			// Adiciona o novo cliente à lista de clientes do barbeiro atual
			barber.clientes.push(clients);
		}

		// Salva as alterações feitas no objeto do barbeiro
		await barber.save();
		return res.json({
			error: false,
			message: "Clientes atualizados com sucesso!"
		});
	} catch (err) {
		console.log("Erro ao atualizar clientes", err.message);
		return res.status(500).json({
			error: true,
			message: "Erro interno do servidor"
		});
	}
});

router.get("/scheduled", async (req, res) => {
	try {
		const { email: emailBarbeiro } = req.headers;
		const barbeiro = await BarberModel.findOne({
			email: emailBarbeiro
		}).lean();

		if (!barbeiro) {
			return res.status(404).json({
				error: true,
				message: "Barbeiro não encontrado"
			});
		}

		const clientsScheduled = barbeiro.clientes || [];

		if (clientsScheduled.length === 0) {
			return res.json({
				error: true,
				message: "Nenhum cliente agendado."
			});
		}


		return res.json({ clientsScheduled });
	} catch (err) {
		console.error("Erro ao buscar horários marcados", err);
		return res.status(500).json({
			error: true,
			message: "ERRO INTERNO NO SERVIDOR"
		});
	}
});

router.post("/unavailableTime", async (req, res) => {
    const { email, date } = req.body;
    try {
        
        const barber = await BarberModel.findOne({ email });
        
        if (!barber) {
            console.log(barber);
            return res.status(404).json({
                error: true,
                message: "Email não encontrado."
            });
        }

        // Create a new unavailable date object based on the schema
        const newUnavailableDate = {
            startDate: date.start,
            endDate: date.end
        };

        // Push the new unavailable date object into the array
        barber.unavailableDate.push(newUnavailableDate);

        // Save the changes to the barber document
        await barber.save();

        return res.json({
            error: false,
            message: "Agenda atualizada."
        });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            error: true,
            message: "Erro interno no servidor."
        });
    }
});


module.exports = router;

