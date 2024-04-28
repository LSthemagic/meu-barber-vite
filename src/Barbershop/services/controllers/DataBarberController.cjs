const express = require("express");
const router = express.Router();
const BarberModel = require("../models/Barber.cjs");

router.get("/barbers", async (req, res) => {
	try {
		const barbers = await BarberModel.find();

		if (!barbers) {
			return res.status(400).json({
				error: true,
				message: "Não há barbeiros registrados"
			});
		}
		return res.json(barbers);
	} catch (err) {
		console.log("Erro ao buscar barbeiros: " + err);

		return res.status(400).json({
			error: true,
			message: "Error ao carregar barbeiros"
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
		const { email: emailBarber } = req.headers;
		const barber = await BarberModel.findOne({
			"barbers.email": emailBarber
		}).lean();

		if (!barber) {
			return res.status(404).json({
				error: true,
				message: "Barbeiro não encontrado"
			});
		}

		const barberIndex = barber.barbers.findIndex((barber) => (barber.email == emailBarber));

		const clientsScheduled = barber.barbers[barberIndex].clients || [];

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
	const barber = await BarberModel.findOne({ "barbers.email": email });

	try {
		if (!barber) {
			return res.status(400).json({
				error: true,
				message: "Ops! Email não encontrado."
			});
		}

		// Find the barber's index in the barbers array
		const barberIndex = barber.barbers.findIndex(
			(barber) => barber.email === email
		);

		let unavailableDates = [];
		if (barber.barbers[barberIndex].unavailableDate) {
			unavailableDates = barber.barbers[barberIndex].unavailableDate;
		}

		if (unavailableDates.length === 0) {
			return res.json({
				error: false,
				message: "Todas as datas disponíveis."
			});
		}

		
		return res.json({ unavailableDates });
	} catch (e) {
		console.log(e.message);
		return res.status(500).json({
			error: true,
			message: "Erro interno no servidor."
		});
	}
});

router.get("/barbersPerBarbershop", async (req, res) => {
	try {
		const { id } = req.headers;
		if (!id) {
			throw new Error("Token inválido.");
		}

		const barbershop = await BarberModel.findById(id);

		if (!barbershop) {
			return res.status(401).json({
				error: true,
				message: "Barbearia não foi encontrada. Faça login novamente."
			})
		}

		const barbers = barbershop.barbers;

		return res.json({ barbers });
	} catch (e) {
		console.log(`Error from barbersPerBarbershop ${e}`)
		return res.status(500).json({
			error: true,
			message: "Erro interno no servidor. Tente novamente mais tarde!"
		})
	}
});

module.exports = router;
