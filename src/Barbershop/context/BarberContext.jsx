import { createContext, useContext, useState } from "react";

const BarberContext = createContext();

export const BarberProvider = ({ children }) => {
	const [token, setToken] = useState(
		() => localStorage.getItem("tokenBarber") || null
	);
	const [dataBarber, setDataBarber] = useState(() =>
		localStorage.getItem("dataBarber")
			? JSON.parse(localStorage.getItem("dataBarber"))
			: null
	);


	const [isLogged, setIsLogged] = useState(
		() => localStorage.getItem("isLoggedInBarber") || false
	)

	const handleLogged = () => {
		setIsLogged(true);
		localStorage.setItem("isLoggedInBarber", true);
	}

	const handleNotLogged = () => {
		setIsLogged(false);
		localStorage.removeItem("isLoggedInBarber");
	}

	const signIn = (data) => {
		setDataBarber(data);
		localStorage.setItem("dataBarber", JSON.stringify(data));
		handleLogged();
	};

	const signOut = () => {
		setDataBarber(null);
		localStorage.removeItem("dataBarber");
		handleNotLogged();
	};

	const authToken = (newToken) => {
		setToken(newToken);
		localStorage.setItem("tokenBarber", newToken);
		handleLogged()
	};

	const offAuthToken = () => {
		setToken(null);
		localStorage.removeItem("tokenBarber");
		handleNotLogged()
	};

	return (
		<BarberContext.Provider
			value={{
				token,
				authToken,
				offAuthToken,
				signIn,
				signOut,
				dataBarber,
				isLogged
			}}
		>
			{children}
		</BarberContext.Provider>
	);
};

export const useAuth = () => useContext(BarberContext);
