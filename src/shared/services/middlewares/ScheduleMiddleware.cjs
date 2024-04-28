const barberModel = require("../../../Barbershop/services/models/Barber.cjs");

module.exports = async (req, res, next) => {
  try {
    const { clients, date, email } = req.body;

    const barber = await barberModel.findOne({ "barbers.email": email });

    if (!barber) {
      return res.status(404).json({
        error: true,
        message: "Barbeiro não encontrado"
      });
    }


    let startDate;
    let endDate;

    if (clients) {
      startDate = new Date(clients.startDate);
      endDate = new Date(clients.endDate);
    } else {
      startDate = new Date(date.start);
      endDate = new Date(date.end);
    }

    const barberIndex = barber.barbers.findIndex(
      (barber) => barber.email === email
    );

    if (barberIndex === -1) {
      return res.status(403).json({
        error: true,
        message: "Você não tem permissão para realizar essa ação"
      });
    }

    const barberPath = `barbers[${barberIndex}].unavailableDate`;

    const conflictsUnavailableDate = await barberModel.findOne({
      [barberPath]: {
        $elemMatch: {
          startDate: { $lt: endDate },
          endDate: { $gt: startDate }
        }
      }
    });


    if (conflictsUnavailableDate) {

      return res.status(400).json({
        error: true,
        message: "O horário selecionado não está disponível.",
        conflicts: {
          conflictsUnavailableDate
        }
      });
    }

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: true,
      message: "Erro no servidor"
    });
  }

  return next();
};
