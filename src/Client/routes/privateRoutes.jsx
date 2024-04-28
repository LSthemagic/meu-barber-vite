import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export const PrivateRoutes = ({ children }) => {
    const { isLogged } = useAuth()

    return isLogged ? children : <Navigate to={"/authenticate"} />
}