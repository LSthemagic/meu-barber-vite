const express = require("express");
const UserModel = require("../models/User.cjs");
const router = express.Router();

router.get("/getFav", async (req, res) => {
	try {
		const { email } = req.headers;
		const user = await UserModel.findOne({ email });

		if (user) {
			const IDs =  user.babershopFavorites.map((item)=> item.toString())
			return res.json({ IDs });
		}

		
	} catch (error) {
		console.error("Erro ao buscar horários marcados", error); // Use 'error' em vez de 'err' aqui
		return res.status(500).json({
			error: true,
			message: "ERRO INTERNO NO SERVIDOR"
		});
	}
})

module.exports = router;