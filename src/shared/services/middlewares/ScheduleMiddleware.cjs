const barberModel = require("../../../Barber/services/models/Barber.cjs");

module.exports = async (req, res, next) => {
  try {
    const { clients, date } = req.body;
    let startDate;
    let endDate;

    if (clients) {
      startDate = new Date(clients.startDate);
      endDate = new Date(clients.endDate);
    } else {
      startDate = new Date(date.start);
      endDate = new Date(date.end);
    }

    const conflictsUnavailableDate = await barberModel.findOne({
      unavailableDate: {
        $elemMatch: {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate }
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
    } else {
      console.log('Nenhum conflito encontrado');
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
