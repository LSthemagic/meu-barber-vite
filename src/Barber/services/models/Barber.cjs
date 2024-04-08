const mongoose = require("../../../shared/services/database/index.cjs");
const bcrypt = require("bcryptjs");

const ClienteSchema = new mongoose.Schema({
	nome: {
		type: String,
		required: true
	},
	email: {
		type: String,
		sparse: true, // Permite valores nulos e únicos
		lowercase: true,
		unique: true
	},
	startDate: {
		type: Date
	},
	endDate: {
		type: Date
	},
});

const EstabilishimentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	location: {
		latitude: {
			type: String,
			required: true
		},
		longitude: {
			type: String,
			required: true
		}
	},
	file: {
		type: String
	}
});

const UnavailableDateSchema = new mongoose.Schema({
	email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
	startDate: {
		type: Date
	},
	endDate: {
		type: Date
	},
	type: {
		type: String
	},
	name: {
		type: String
	}
})

const BarberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        select: false
    },
    unavailableDate: [UnavailableDateSchema], // Array of dates
    barbershop: EstabilishimentSchema,
    clientes: {
        type: [ClienteSchema],
        default: [] // Initialize as an empty array
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


BarberSchema.pre("save", async function (next) {
	if (this.password) {
		const hash = await bcrypt.hash(this.password, 10);
		this.password = hash;
	}
	next();
});

// Método personalizado para adicionar ou atualizar clientes
BarberSchema.methods.adicionarOuAtualizarCliente = async function (
	clienteData
) {
	const existingCliente = this.clientes.find(
		(cliente) => cliente.email === clienteData.email
	);

	if (existingCliente) {
		// Atualiza os dados do cliente existente se ele já existir
		existingCliente.nome = clienteData.nome;
		existingCliente.date = clienteData.date;
	} else {
		// Adiciona um novo cliente se ele não existir
		this.clientes.push(clienteData);
	}

	await this.save();
};

const Barber = mongoose.model("Barber", BarberSchema);

module.exports = Barber;
