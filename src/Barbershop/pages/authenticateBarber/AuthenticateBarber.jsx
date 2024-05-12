import { useReducer } from "react";
import { useAuth } from "../../context/BarberContext";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./AuthenticateBarber.module.css";
import { Link, useNavigate } from "react-router-dom";
import ImageLogin from "../../../shared/images/ImageLogin.svg";
import Toast from "../../../shared/custom/Toast";

const initialState = {
	email: "",
	password: ""
};

const reducer = (state, action) => {
	switch (action.type) {
		case "SET_EMAIL":
			return { ...state, email: action.data };
		case "SET_PASSWORD":
			return { ...state, password: action.data };
		default:
			throw new Error("Unexpected action type in reducer!");
	}
};

const AuthenticateBarber = () => {
	const { authToken, signIn } = useAuth();

	const [state, dispatch] = useReducer(reducer, initialState);
	const navigate = useNavigate();

	const handleInputChange = (type, event) => {
		event.preventDefault();
		dispatch({
			type: type,
			data: event.target.value
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!state.email || !state.password) {
			return;
		}
		try {
			const response = await fetch("https://meu-barber-vite-api-2.onrender.com/barberAuth/authenticateBarber", {
				method: "POST",
				headers: {
					"Content-type": "application/json"
				},
				body: JSON.stringify({
					email: state.email,
					password: state.password
				})
			});

			const data = await response.json();
			if (response.ok && data.token) {
				// Armazena o token usando a função do contexto
				console.log(data);
				authToken(data.token);
				signIn(data.barbershop);
				// console.log("data ", data);
				Toast.fire({
					icon: "success",
					title: data.message
				});
				navigate("/barber/homeBarber");
			} else {
				Toast.fire({
					icon: "error",
					title: data.message
				});
			}
		} catch (error) {
			console.log("ERROR EM HANDLE SUBMIT AUTHENTICATE ", error);
		}
	};

	return (
		<div
			className={styles.container}
			style={{
				backgroundImage: `url(${ImageLogin})`,
				backgroundSize: "cover",
				minHeight: "100vh",
				margin: 0,
				padding: 0
			}}
		>
			<div style={{ opacity: "93%" }} className={`card ${styles.card}`}>
				<div className="form-group">
					<form className={styles.input} onSubmit={handleSubmit}>
						<h1
							style={{
								fontFamily: "cursive",
								alignItems: "center",
								justifyContent: "center",
								display: "flex"
							}}
						>
							Entrar
						</h1>

						<label htmlFor="exampleInputEmail1">Endereço de email</label>
						<input
							required
							value={state.email}
							type="email"
							id="exampleInputEmail1"
							aria-describedby="emailHelp"
							placeholder="Seu email"
							onChange={(event) => {
								handleInputChange("SET_EMAIL", event);
							}}
						/>
						<small id="emailHelp" className="form-text text-muted">
							Nunca vamos compartilhar seu email, com ninguém.
						</small>
						<br />

						<label htmlFor="password">Senha </label>
						<input
							required
							value={state.password}
							type="password"
							placeholder="Senha"
							onChange={(event) => {
								handleInputChange("SET_PASSWORD", event);
							}}
						/>
						<div className={styles.link}>
							<Link to="/register" className={styles.link}>
								Sou novo aqui
							</Link>
							<Link className={styles.link}>Esqueci minha senha</Link>
						</div>

						<button
							style={{ marginTop: "4%" }}
							className="btn btn-primary"
							type="submit"
						>
							Entrar
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AuthenticateBarber;
