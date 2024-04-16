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
			clientes: [],
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


module.exports = router;

