import { Navigate, useLocation } from "react-router-dom"
import { useAuth as useAuthBarber } from "../../Barbershop/context/BarberContext"
import { useAuth } from "../../Client/context/AuthContext"


export const PrivateRoutes = ({ children }) => {
    const { pathname } = useLocation()
    const isBarberRoutes = pathname.startsWith("/barber")
    const auth = isBarberRoutes ? useAuthBarber() : useAuth()
    const { isLogged } = auth

    const handlePath = () => isBarberRoutes ? "/barber/authenticateBarber" : "authenticate"

  
    return isLogged ? children : <Navigate to={handlePath()} />
}