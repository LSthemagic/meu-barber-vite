const mongoose = require("../../../shared/services/database/index.cjs");
const bcrypt = require("bcryptjs");
const { ImageSchema } = require("../../../shared/services/models/SharedModel.cjs");

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

const EstablishmentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
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
	
});

const UnavailableDateSchema = new mongoose.Schema({
	email: {
		type: String,
		lowercase: true,
		sparse: true
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
});

// Schema para a coleção de funcionários
const EmployeeSchema = new mongoose.Schema({
	userId: { type: Number, required: true },
	barbershopId: { type: Number, required: true },
	createdAt: { type: Date, default: Date.now },
	unavailableDateTimeID: { type: Number, ref: 'UnavailableTime' },
	image: {type: ImageSchema}
});

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
	barbershop: EstablishmentSchema,
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

const Barber = mongoose.model("Barber", BarberSchema);

module.exports = Barber;
