import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "@fortawesome/fontawesome-free/css/all.css";
import AppRoutes from "./User/routes/routes";
import { AuthProvider } from "./User/context/AuthContext";
import { BarberProvider } from "./Barber/context/BarberContext";
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
