const mongoose = require("../database/index.cjs")

// Schema para a coleção de usuários
const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    profileImageId: { type: Number }
});

// Schema para a coleção de imagens
const ImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    userId: { type: Number, required: true },
    type: { type: String, enum: ['profile', 'barber'], required: true },
    createdAt: { type: Date, default: Date.now }
});

// Schema para a coleção de histórico de agendamentos
const AppointmentHistorySchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    barberChefeId: { type: Number, required: true },
    appointmentDateTime: { type: Date, required: true },
    serviceId: { type: Number },
    rating: { type: Number },
    review: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports =
{
   UserSchema,  
   ImageSchema,  
   AppointmentHistorySchema, 
}