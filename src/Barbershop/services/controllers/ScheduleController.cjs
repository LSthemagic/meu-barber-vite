const express = require("express");
const BarberModel = require("../models/Barber.cjs");
const router = express.Router();

router.post("/update-clients", async (req, res) => {
    try {
        const { email, clients: clientsFront, type } = req.body;

        const barber = await BarberModel.findOne({ "barbers.email": email });

        if (!barber) {
            return res.status(404).json({
                error: true,
                message: "Barbeiro não encontrado"
            });
        }


        const barberIndex = barber.barbers.findIndex(
            (barber) => barber.email === email
        );

        barber.barbers[barberIndex].clients = barber.barbers[barberIndex].clients || [];
        barber.barbers[barberIndex].unavailableDate = barber.barbers[barberIndex].unavailableDate || [];

        const existingClientIndex = barber.barbers[barberIndex].clients.findIndex(
            (client) => client.email === clientsFront.email
        );

        const existingUnavailableIndex = barber.barbers[barberIndex].unavailableDate.findIndex(
            (unavailable) => unavailable.email === clientsFront.email
        );

        if (existingUnavailableIndex !== -1) {
            // Update existing unavailable date
            barber.barbers[barberIndex].unavailableDate[existingUnavailableIndex] = {
                email: clientsFront.email,
                startDate: clientsFront.startDate,
                endDate: clientsFront.endDate,
                type: type,
                name: clientsFront.name
            };
        } else {
            // Add new unavailable date
            barber.barbers[barberIndex].unavailableDate.push({
                email: clientsFront.email,
                startDate: clientsFront.startDate,
                endDate: clientsFront.endDate,
                type: type,
                name: clientsFront.name
            });
        }

        if (existingClientIndex !== -1) {
            // Update existing client
            barber.barbers[barberIndex].clients[existingClientIndex] = clientsFront;
        } else {
            const allBarbershops = await BarberModel.findOne({ "barbers.clients.email": clientsFront.email })
                .select('barbers')
                .exec();

            console.log(allBarbershops);
            if (allBarbershops) {
                // Remover o cliente do array barbers
                const index = allBarbershops.barbers.findIndex(barber => barber.clients.some((e) => e.email === clientsFront.email));
                console.log("\n\n\n\n");
                console.log(index);

                if (index !== -1) {
                    const barberRemove = allBarbershops.barbers[index];

                    const clientIndex = barberRemove.clients.findIndex(client => client.email === clientsFront.email);

                    const unavailableIndex = barberRemove.unavailableDate.findIndex(client => client.email === clientsFront.email);

                    if (clientIndex !== -1) {
                        barberRemove.clients.splice(clientIndex, 1);
                        barberRemove.unavailableDate.splice(unavailableIndex, 1)

                        // salvar no novo barbeiro
                        barber.barbers[barberIndex].clients.push(clientsFront);

                        // Salvar as mudanças no banco de dados
                        await allBarbershops.save();
                    } else {
                        console.log("Cliente não encontrado no array de clientes do barbeiro.");
                    }
                } else {
                    console.log("Barbeiro no encontrado.");
                }
            }


        };

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

        const barber = await BarberModel.findOne({ "barbers.email": email });

        if (!barber) {

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