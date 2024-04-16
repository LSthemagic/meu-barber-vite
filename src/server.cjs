
const express = require("express");
const cors = require("cors"); // Importe o middleware cors
const AdminController = require("./Client/services/controllers/AdminController.cjs");
const AuthController = require("./Client/services/controllers/AuthController.cjs");
const authenticateMiddleware = require("./Client/services/middlewares/authenticate.cjs");
const BarberAuthController = require("./Barbershop/services/controllers/BarberAuthController.cjs");
const VerifyEmail = require("./shared/services/controllers/VerifyEmail.cjs");
const DataBarberController = require("./Barbershop/services/controllers/DataBarberController.cjs");
const app = express();
const ConfirmationSchedule = require("./shared/services/controllers/ConfirmationSchedule.cjs")
const scheduleMiddleware = require("./shared/services/middlewares/ScheduleMiddleware.cjs")
const ScheduleController = require("./Barbershop/services/controllers/ScheduleController.cjs")
const DataController = require("./Client/services/controllers/DataController.cjs")

// Configuração do middleware cors
const corsOptions = {
	origin: "http://localhost:3000", // Troque para a URL do seu aplicativo React em produção
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
	optionsSuccessStatus: 204
};

const port = process.env.REACT_APP_PORT || 3001;

app.use(cors(corsOptions)); // Use o middleware cors com as opções configuradas
app.use(express.json());
app.use("/admin", authenticateMiddleware, AdminController);
app.use("/auth", AuthController);
app.use("/dataUser", DataController)
app.use("/barberAuth", BarberAuthController);
app.use("/emailAuth", VerifyEmail);
app.use("/dataBarber", DataBarberController);
app.use("/confirmationFromEmail", ConfirmationSchedule)
app.use("/calendar", scheduleMiddleware, ScheduleController);

app.listen(port, () => {
	console.log("Servidor rodando na porta 3001");
});
