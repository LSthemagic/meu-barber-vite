import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "@fortawesome/fontawesome-free/css/all.css";
import AppRoutes from "./Client/routes/routes";
import { AuthProvider } from "./Client/context/AuthContext";
import { BarberProvider } from "./Barbershop/context/BarberContext";
import { TooltipProvider } from "../@/components/ui/tooltip";

function App() {
	return (
		<TooltipProvider>
			<AuthProvider>
				<BarberProvider>
					<AppRoutes />
				</BarberProvider>
			</AuthProvider>
		</TooltipProvider>
	);
}

export default App;
