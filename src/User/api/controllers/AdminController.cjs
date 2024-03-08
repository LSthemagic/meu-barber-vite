const express = require("express");
const router = express.Router();
const User = require("../models/User.cjs");
router.get("/users", async (req, res) => {
	console.log("controller");
	try {
		// consulta todos os documentos da coleção user
		const users = await User.find();
		if (!users) {
			return res.status(400).json({
				error: true,
				message: "Users not found"
			});
		}
		return res.json({ users });
	} catch (error) {
		console.error("Erro ao buscar usuários:", error);
		return res.status(500).json({
			error: true,
			message: "Error on list users."
		});
	}
});

module.exports = router;
