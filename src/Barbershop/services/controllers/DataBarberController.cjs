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

	if (!barber) {
		return res.status(401).json({
			error: true,
			message: 'Usuário não autenticado'
		})
	}
	return res.json(barber);
})

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
				error: false,
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

router.get("/unavailableTimeBarber", async (req, res) => {
	const { email } = req.headers;
	const barber = await BarberModel.findOne({ email })

	try {
		if (!barber) {
			return res.status(400).json({
				error: true,
				message: "Ops! email não encontrado."
			})
		}
		let unavailableDates = barber.unavailableDate || [];
		if (unavailableDates.length == 0) {
			return res.json({
				error: false,
				message: "Todas as datas disponíveis."
			})
		}
		
		
		return res.json({ unavailableDates })

		

		
	} catch (e) {
		console.log(e.message);
		return res.status(500).json({
			error: true,
			message: "Erro interno no servidor."
		})
	}
})


module.exports = router;
