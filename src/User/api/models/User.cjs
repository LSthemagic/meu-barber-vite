const mongoose = require("../../../shared/services/database/index.cjs");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		lowercase: true,
		required: true
	},
	password: {
		type: String,
		select: false
		// para não mostrar a senha
	},
	createAt: {
		type: Date,
		default: Date.now
	},
	babershopFavorites: [
		{
			type: String
		}
	]
});

UserSchema.pre("save", async function (next) {
	const hash = await bcrypt.hash(this.password, 10);
	this.password = hash;
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
