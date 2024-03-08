import { createContext, useContext, useState } from "react";
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [data, setData] = useState(() => localStorage.getItem('user_info') ? JSON.parse(localStorage.getItem('user_info')) : null);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const dataAuth = (newData) => {
    setData(newData);
    localStorage.setItem("user_info", JSON.stringify(newData));
  };

  const offDataAuth = () => {
    setData(null);
    localStorage.removeItem("user_info");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, data, dataAuth, offDataAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
// Adicione validação de propriedades usando PropTypes
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export const useAuth = () => useContext(AuthContext);
