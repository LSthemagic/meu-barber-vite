const express = require("express");
const BarberModel = require("../models/Barber.cjs");
const router = express.Router();

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
			existingClient.startDate = clients.startDate;
			existingClient.endDate = clients.endDate;
			
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

module.exports =  router;