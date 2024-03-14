const express = require("express");
const router = express.Router();
const BarberModel = require("../models/Barber.cjs");

router.get("/barbers", async (req, res) => {
	try {
		const barbers = await BarberModel.find();

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

router.get("/profileBarber", async (req, res) => {
	const { email } = req.headers;
	const barber = await BarberModel.findOne({ email })
	
	if(!barber){
		return res.status(401).json({
			error: true,
			message: 'Usuário não autenticado'
		})
	}
	return res.json(barber);
})

module.exports = router;
