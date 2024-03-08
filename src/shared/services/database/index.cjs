const mongoose = require("mongoose");

mongoose
	.connect(
		"mongodb+srv://lansilvah14fsa:mongoConnectRailan@cluster0.p2vehe4.mongodb.net/meu_barber?retryWrites=true&w=majority",
		{}
	)
	.then(() => {
		console.log("Conexão com MongoDB estável.");
	})
	.catch((error) => {
		console.error("Falha ao autenticar com MongoDB => ", error);
	});

mongoose.Promise = global.Promise;
module.exports = mongoose;
