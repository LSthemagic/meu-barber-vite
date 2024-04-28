const mongoose = require("../../../shared/services/database/index.cjs");
const bcrypt = require("bcryptjs");

const ClienteSchema = new mongoose.Schema({
	name: {
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

const BarberSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		lowercase: true
	},
	unavailableDate: [UnavailableDateSchema], // Array of dates
	clients: {
		type: [ClienteSchema],
		default: [] // Initialize as an empty array
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const EstablishmentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
	},
	password: {
		type: String,
		select: false
	},
	barbers: {
		type: [BarberSchema],
		default: [],
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
	createdAt: {
		type: Date,
		default: Date.now
	}
});

EstablishmentSchema.pre("save", async function (next) {
	if (this.password) {
		const hash = await bcrypt.hash(this.password, 10);
		this.password = hash;
	}
	next();
});

const Barber = mongoose.model("Barbershop", EstablishmentSchema);

module.exports = Barber;
