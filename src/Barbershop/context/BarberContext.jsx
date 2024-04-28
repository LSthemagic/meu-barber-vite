import { createContext, useContext, useState } from "react";

const BarberContext = createContext();

export const BarberProvider = ({ children }) => {
	const [tokenBarber, setTokenBarber] = useState(
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
		setTokenBarber(newToken);
		localStorage.setItem("tokenBarber", newToken);
		handleLogged()
	};

	const offAuthToken = () => {
		setTokenBarber(null);
		localStorage.removeItem("tokenBarber");
		handleNotLogged()
	};

	return (
		<BarberContext.Provider
			value={{
				tokenBarber,
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
