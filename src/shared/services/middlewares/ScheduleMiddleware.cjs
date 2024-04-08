// Importando o modelo do barbeiro
const barberModel = require("../../../Barber/services/models/Barber.cjs");

// Exportando uma função middleware assíncrona
module.exports = async (req, res, next) => {
  try {
    // Capturando os dados do corpo da requisição
    const { clients, date } = req.body;
    let startDate;
    let endDate;

    // Verificando se há dados de clientes na requisição
    if (clients) {
      // Definindo datas de início e término a partir dos dados do cliente
      startDate = new Date(clients.startDate);
      endDate = new Date(clients.endDate);
    } else {
      // Definindo datas de início e término a partir dos dados do barbeiro
      startDate = new Date(date.start);
      endDate = new Date(date.end);
    }

    // Convertendo para o horário oficial
    startDate.setUTCDate(startDate.getUTCDate() + 3);
    endDate.setUTCHours(endDate.getUTCHours() + 3);
    
    // Verificando se o barbeiro está indisponível nas datas especificadas
    const unavailableInUnavailableDate = await barberModel.findOne({
      unavailableDate: {
        $elemMatch: {
          startDate: { $lt: endDate },
          endDate: { $gt: startDate }
        }
      }
    });

    // Verificando se o barbeiro já tem clientes agendados durante as datas especificadas
    const unavailableInClients = await barberModel.findOne({
      clientes: {
        $elemMatch: {
          startDate: { $lt: endDate },
          endDate: { $gt: startDate }
        }
      }
    });

    // Se qualquer uma das consultas retornar um resultado, há um conflito
    if (unavailableInUnavailableDate || unavailableInClients) {
      // Conflito encontrado
      console.log(`Conflito encontrado ${unavailableInClients}
      \n\n\n ${unavailableInUnavailableDate}`);
      return res.status(400).json({
        error: true,
        message: "O horário selecionado não está disponível."
      });
    } else {
      // Nenhum conflito encontrado
      console.log('Nenhum conflito encontrado');
    }

  } catch (e) {
    // Em caso de erro, retorna um erro de servidor
    console.log(e);
    return res.status(500).json({
      error: true,
      message: "Erro no servidor"
    });
  }

  // Se tudo estiver certo, passa para o próximo middleware
  return next();
};
