import { Navigate } from "react-router-dom";
import { useAuth } from "../context/BarberContext";

export const PrivateRoutes = ({ children }) => {
    const { isLogged } = useAuth();

    return isLogged ? children : <Navigate to={"/barber/authenticateBarber"} />;
}

