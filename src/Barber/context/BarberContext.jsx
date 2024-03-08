import { createContext, useContext, useState } from "react";

const BarberContext = createContext();

export const BarberProvider = ({ children }) => {
    const [tokenBarber, setTokenBarber] = useState(() => localStorage.getItem("tokenBarber") || null);
    const [dataBarber, setDataBarber] = useState(() => localStorage.getItem("dataBarber") ? JSON.parse(localStorage.getItem("dataBarber")) : null);

    const signIn = (data) => {
        setDataBarber(data)
        localStorage.setItem('dataBarber', JSON.stringify(data))
    }

    const signOut = () => {
        setDataBarber(null)
        localStorage.removeItem("dataBarber")
    }

    const authToken = (newToken) => {
        setTokenBarber(newToken)
        localStorage.setItem("tokenBarber", newToken)
    }

    const offAuthToken = () => {
        setTokenBarber(null)
        localStorage.removeItem("tokenBarber")
    }

    return (
        <BarberContext.Provider value={{ tokenBarber, authToken, offAuthToken, signIn, signOut, dataBarber }}>
            {children}
        </BarberContext.Provider>
    );
};

export const useAuth = () => useContext(BarberContext);