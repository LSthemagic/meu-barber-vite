const express = require("express");
const UserModel = require("../models/User.cjs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config();

const generateToken = (user = {}) => {
	return jwt.sign(
		{
			id: user.id,
			name: user.name
		},
		process.env.REACT_APP_SECRET,
		{
			expiresIn: 86400 //1 dia de validade do token
		}
	);
};

router.post("/register", async (req, res) => {
	try {
		const user = await UserModel.create(req.body);
		user.password = undefined;
		return res.json({
			error: false,
			message: "Cadastro bem-sucedido!",
			data: user,
			token: generateToken(user)
		});
	} catch (err) {
		return res.status(400).json({
			error: true,
			message: "Error on registration"
		});
	}
});

router.post("/authenticate", async (req, res) => {
	const { email, password } = req.body;
	const user = await UserModel.findOne({ email }).select("+password");

	if (!user) {
		return res.status(400).json({
			error: true,
			message: "Esse cadastro não existe."
		});
	}

	if (!(await bcrypt.compare(password, user.password))) {
		return res.status(400).json({
			error: true,
			message: "Senha inválida."
		});
	}

	user.password = undefined;
	return res.json({
		error: false,
		message: "Bem Vindo!",
		user,
		token: generateToken(user)
	});
});

router.post("/userBarbershopFav", async (req, res) => {
	const { email, id } = req.body;
	try {
		const user = await UserModel.findOne({ email });
		if (!user) {
			return res.status(401).json({
				error: true,
				message: "Só é possível favoritar caso esteja logado."
			});
		}
		user.babershopFavorites.push(id);
		await UserModel.updateOne(
			{ email },
			{ $set: { babershopFavorites: user.babershopFavorites } }
		);
		res.status(200).json({ success: true });
	} catch (error) {
		console.log("Error in userBarbershopFav:", error);
		res.status(500).json({ error: true, message: "Internal server error" });
	}
});

module.exports = router;
