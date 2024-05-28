import { useReducer, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Authenticate.module.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ImageLogin from "../../../shared/images/ImageLogin.svg";
import path_url from "../../../shared/config/path_url.json"
import { BeatLoader } from "react-spinners";
import { LineChart } from "recharts";

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

const Authenticate = () => {
	const { login, dataAuth } = useAuth();

	const [state, dispatch] = useReducer(reducer, initialState);
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate();

	const handleInputChange = (type, event) => {
		event.preventDefault();
		dispatch({
			type: type,
			data: event.target.value
		});
	};

	const Toast = Swal.mixin({
		toast: true,
		position: "top-end",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.onmouseenter = Swal.stopTimer;
			toast.onmouseleave = Swal.resumeTimer;
		}
	});

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoading(true)
		if (!state.email || !state.password) {
			return;
		}
		try {
			const response = await fetch(`${path_url.remote}/auth/authenticate`, {
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
				login(data.token);
				dataAuth(data.user);
				// console.log("data ", data);
				Toast.fire({
					icon: "success",
					title: data.message
				});
				navigate("/home");
			} else {
				Toast.fire({
					icon: "error",
					title: data.message
				});
			}
		} catch (error) {
			console.log("ERROR EM HANDLE SUBMIT AUTHENTICATE ", error);
		} finally {
			setLoading(false)
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
						<button
							style={{ marginTop: "4%" }}
							className={`btn btn-primary ${styles.btn}`}
							type="submit"
						>

							{loading ? <BeatLoader color="white" /> : "ENTRAR"}
						</button>

						<hr className={styles.hr} />


						<div style={{ display: "flex", flexDirection: "column", flexWrap: "nowrap", justifyContent: "space-around" }}>
							<Link to="/register" className={styles.link}>
								SOU NOVO AQUI
							</Link>
							<Link className={styles.link}>ESQUECI MINHA SENHA</Link>
						</div>


					</form>
				</div>
			</div>
		</div>
	);
};

export default Authenticate;
