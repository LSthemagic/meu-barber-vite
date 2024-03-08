const express = require("express");
const router = express.Router();
const Barber = require("../models/Barber.cjs");

router.get("/barbers", async (req, res) => {
	try {
		const barbers = await Barber.find();

		if (!barbers) {
			return res.status(400).json({
				error: true,
				message: "No hay barberos registrados"
			});
		}
		return res.json(barbers);
	} catch (err) {
		console.log("Erro ao buscar barbeiros: " + err);

		return res.status(400).json({
			error: true,
			message: "Error on loading barbers"
		});
	}
});

module.exports = router;
