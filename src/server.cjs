const express = require('express');
const cors = require('cors');  // Importe o middleware cors
const AdminController = require("./User/api/controllers/AdminController.cjs")
const AuthController = require("./User/api/controllers/AuthController.cjs")
const authenticateMiddleware = require("./User/api/middlewares/authenticate.cjs");
const BarberAuthController = require("./Barber/services/controllers/BarberAuthController.cjs")
const VerifyEmail = require("./shared/services/controllers/VerifyEmail.cjs")
const DataBarberController = require("./Barber/services/controllers/DataBarberController.cjs")
const app = express();

// Configuração do middleware cors
const corsOptions = {
  origin: 'http://localhost:3000',  // Troque para a URL do seu aplicativo React em produção
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

const port = process.env.REACT_APP_PORT || 3001;

app.use(cors(corsOptions));  // Use o middleware cors com as opções configuradas
app.use(express.json());
app.use("/admin", authenticateMiddleware, AdminController);
app.use("/auth", AuthController);
app.use("/barberAuth", BarberAuthController);
app.use("/emailAuth", VerifyEmail);
app.use("/dataBarber", DataBarberController);

app.listen(port, () => {
    console.log("Servidor rodando na porta 3001");
});
