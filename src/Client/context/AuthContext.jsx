import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(
		() => localStorage.getItem("token") || null
	);
	const [data, setData] = useState(() =>
		localStorage.getItem("user_info")
			? JSON.parse(localStorage.getItem("user_info"))
			: null
	);

	const [isLogged, setIsLogged] = useState(
		() => localStorage.getItem("isLoggedIn") || false
	)

	const [showBarbershopFavorites, setShowBarbershopFavorites] = useState(
		() => localStorage.getItem("barbershopsFavShown") || false
	)

	const handleShowFavorites = () => {
		setShowBarbershopFavorites(true);
	  };
	  
	  const handleCloseShowFavorites = () => {
		setShowBarbershopFavorites(false);
		localStorage.removeItem("barbershopsFavShown");
	  };

	const handleLogged = () => {
		setIsLogged(true);
		localStorage.setItem("isLoggedIn", true);
	}

	const handleNotLogged = () => {
		setIsLogged(false);
		localStorage.removeItem("isLoggedIn")
	}


	const login = (newToken) => {
		setToken(newToken);
		localStorage.setItem("token", newToken);
		handleLogged()
	};

	const logout = () => {
		setToken(null);
		localStorage.removeItem("token");
		handleNotLogged()
	};

	const dataAuth = (newData) => {
		setData(newData);
		localStorage.setItem("user_info", JSON.stringify(newData));
		handleLogged()
	};

	const offDataAuth = () => {
		setData(null);
		localStorage.removeItem("user_info");
		handleNotLogged()
	};

	return (
		<AuthContext.Provider
			value={{ token, login, logout, data, dataAuth, offDataAuth, isLogged, handleShowFavorites, handleCloseShowFavorites, showBarbershopFavorites }}
		>
			{children}
		</AuthContext.Provider>
	);
};
// Adicione validação de propriedades usando PropTypes
AuthProvider.propTypes = {
	children: PropTypes.node.isRequired
};

export const useAuth = () => useContext(AuthContext);
