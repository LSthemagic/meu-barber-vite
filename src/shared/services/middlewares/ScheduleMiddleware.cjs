// Importando o modelo do barbeiro
const barberModel = require("../../../Barber/services/models/Barber.cjs");

// Exportando uma função middleware assíncrona
module.exports = async (req, res, next) => {
    try {
        // Capturando os dados do corpo da requisição
        const { clients } = req.body;
        let startDate;
        let endDate;

        // Verificando se há dados de clientes na requisição
        if (clients) {
            console.log("é o cliente");
            // Definindo datas de início e término a partir dos dados do cliente
            startDate = clients.startDate;
            endDate = clients.endDate;
        } else {
            console.log("é o barbeiro");
            // Definindo datas de início e término a partir dos dados do barbeiro
            startDate = req.body.date.start;
            endDate = req.body.date.end;
        }

        // Verificando se o barbeiro está indisponível nas datas especificadas
        const unavailableInUnavailableDate = await barberModel.findOne({
            'unavailableDate.startDate': { $lte: endDate },
            'unavailableDate.endDate': { $gte: startDate }
        });

        // Verificando se o barbeiro já tem clientes agendados para as datas especificadas
        const unavailableInClients = await barberModel.findOne({
            'clients.startDate': { $lte: endDate },
            'clients.endDate': { $gte: startDate }
        });

        // Se o barbeiro estiver indisponível em uma das datas, retorna um erro
        if (unavailableInUnavailableDate || unavailableInClients) {
            return res.status(400).json({
                error: true,
                message: "O horário selecionado não está disponível"
            });
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
