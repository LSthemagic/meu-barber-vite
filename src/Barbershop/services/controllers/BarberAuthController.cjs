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
			clients: [],
			barbers: [],
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
			message: "Erro ao registrar o cadastro."
		});
	}
});

router.post("/addBarber", async (req, res) => {
	try {
		const { name, email, id } = req.body; // Destructure directly from req.body

		const barbershop = await BarberModel.findById(id);

		if (!barbershop) {
			return res.status(400).json({
				error: true,
				message: "Barbearia não encontrada. Por favor, tente novamente mais tarde."
			});
		}

		// Check if the barber with the provided email already exists
		const existingBarber = barbershop.barbers.find(barber => barber.email === email);
		if (existingBarber) {
			return res.status(400).json({
				error: true,
				message: `O colaborador ${existingBarber.name} já faz parte da Barbearia.`
			});
		}

		// Push new barber data to the barbershop
		barbershop.barbers.push({ name, email }); // Push name and email directly

		await barbershop.save();

		return res.json({
			error: false,
			message: `O barbeiro ${name} foi registrado com sucesso na companhia.`
		});

	} catch (e) {
		console.log(`Error from add Barber: ${e}`);
		return res.status(400).json({
			error: true,
			message: "Erro interno ao adicionar um novo barbeiro. Tente novamente mais tarde!"
		});
	}
});


module.exports = router;

