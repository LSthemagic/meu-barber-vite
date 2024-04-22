const express = require("express");
const BarberModel = require("../models/Barber.cjs");
const router = express.Router();

router.post("/update-clients", async (req, res) => {
    try {
        const { email, clients, type } = req.body;

        const barber = await BarberModel.findOne({ "barbers.email": email });

        console.log(clients);
        // Check if the barber was found
        if (!barber) {
            return res.status(404).json({
                error: true,
                message: "Barbeiro não encontrado"
            });
        }

        // Find the barber's index in the barbers array
        const barberIndex = barber.barbers.findIndex(
            (barber) => barber.email === email
        );

        // Check if the barber's clients and unavailableDate arrays are defined, initialize them if not
        barber.barbers[barberIndex].clients = barber.barbers[barberIndex].clients || [];
        barber.barbers[barberIndex].unavailableDate = barber.barbers[barberIndex].unavailableDate || [];

        // Find existing client by email
        const existingClientIndex = barber.barbers[barberIndex].clients.findIndex(
            (client) => client.email === clients.email
        );

        // Find existing unavailable date by email
        const existingUnavailableIndex = barber.barbers[barberIndex].unavailableDate.findIndex(
            (client) => client.email === clients.email
        );

        if (existingUnavailableIndex !== -1) {
            // Update existing unavailable date
            barber.barbers[barberIndex].unavailableDate[existingUnavailableIndex] = {
                email: clients.email,
                startDate: clients.startDate,
                endDate: clients.endDate,
                type: type,
                name: clients.name
            };
        } else {
            // Add new unavailable date
            barber.barbers[barberIndex].unavailableDate.push({
                email: clients.email,
                startDate: clients.startDate,
                endDate: clients.endDate,
                type: type,
                name: clients.name
            });
        }

        if (existingClientIndex !== -1) {
            // Update existing client
            barber.barbers[barberIndex].clients[existingClientIndex] = clients;
        } else {
            // Add new client
            barber.barbers[barberIndex].clients.push(clients);
        }

        // Save the changes
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
    const { email, date, type, name } = req.body;
    try {
        console.log(type);
        const barber = await BarberModel.findOne({ "barbers.email": email });

        if (!barber) {
            console.log(barber);
            return res.status(404).json({
                error: true,
                message: "Email não encontrado."
            });
        }

        // Create a new unavailable date object based on the schema
        const newUnavailableDate = {
            email: email,
            startDate: date.start,
            endDate: date.end,
            type: type,
            name: name
        };


        const barberIndex = barber.barbers.findIndex((item) => (
            item.email === email
        ))

        // Push the new unavailable date object into the array
        barber.barbers[barberIndex].unavailableDate.push(newUnavailableDate);

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


module.exports = router;