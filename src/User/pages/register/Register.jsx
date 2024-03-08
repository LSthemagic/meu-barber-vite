import { useReducer, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./register.module.css";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../../../shared/custom/Toast";
import ImageLogin from "../../../shared/images/ImageLogin.svg";

const initialState = {
	nameCad: null,
	email: null,
	password: null,
	code: null
};

const reducer = (state, action) => {
	switch (action.type) {
		case "SET_NAME":
			return { ...state, nameCad: action.data };
		case "SET_EMAIL":
			return { ...state, email: action.data };
		case "SET_PASSWORD":
			return { ...state, password: action.data };
		case "SET_CODE":
			return { ...state, code: action.data };
		default:
			throw new Error("Unexpected action type in reducer!");
	}
};

const Register = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [emailSubmit, setEmailSubmit] = useState(false);
	const [textButton, setTextButton] = useState("Cadastrar-se");
	const { login, dataAuth } = useAuth();
	const navigate = useNavigate();

	const handleInputChange = (type, event) => {
		dispatch({
			type: type,
			data: event.target.value
		});
	};

	const handleConfirmCode = async () => {
		if (state.code) {
			try {
				const response = await fetch(
					"http://localhost:3001/emailAuth/auth-code",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							code: state.code
						})
					}
				);

				const data = await response.json();

				if (data.error) {
					Toast.fire({
						icon: "error",
						title: data.message
					});
				} else {
					handleSubmit();
					// console.log("data", data);
				}
			} catch (error) {
				console.error("Error submitting verification code:", error);
				Toast.fire({
					icon: "error",
					title: "Erro interno ao verificar código."
				});
			}
		}
	};

	const handleReqEmail = async (event) => {
		event.preventDefault();
		try {
			const response = await fetch(
				"http://localhost:3001/emailAuth/req-email",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						email: state.email
					})
				}
			);
			const data = await response.json();
			if (response.ok) {
				setTextButton("Confirmar");
				// console.log("email enviado", data);
				setEmailSubmit(true);
				handleConfirmCode();
				Toast.fire({
					icon: "success",
					title: data.message
				});
			} else {
				// console.log("error req-email", data.message);
				Toast.fire({
					icon: "error",
					title: data.message
				});
			}
		} catch (error) {
			console.log("error reqEmail", error);
		}
	};

	const handleSubmit = async () => {
		// event.preventDefault();
		try {
			const response = await fetch(
				"http://localhost:3001/auth/register",
				{
					method: "POST",
					headers: {
						"Content-type": "application/json"
					},
					body: JSON.stringify({
						name: state.nameCad,
						email: state.email,
						password: state.password
					})
				}
			);

			const data = await response.json();
			if (response.ok) {
				// console.log("Usuário registrado com sucesso!", data);
				login(data.token);
				dataAuth(data.data);
				Toast.fire({
					icon: "success",
					title: data.message
				});
				setTimeout(() => {
					navigate("/");
				}, 3000);
			} else {
				console.error("Erro ao registrar usuário:", data.message);
				Toast.fire({
					icon: "error",
					title: data.message
				});
			}
		} catch (error) {
			console.log("Error in register handle submit", error);
			alert("Ocorreu um erro no envio do formulário");
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
					<form className={styles.input} onSubmit={handleReqEmail}>
						<h1
							style={{
								fontFamily: "cursive",
								alignItems: "center",
								justifyContent: "center",
								display: "flex"
							}}
						>
							Cadastrar-se
						</h1>
						<label htmlFor="name">Nome </label>
						<input
							required
							placeholder="Seu nome"
							type="text"
							onChange={(event) =>
								handleInputChange("SET_NAME", event)
							}
						/>
						<label htmlFor="exampleInputEmail1">
							Endereço de email
						</label>
						<input
							required
							type="email"
							id="exampleInputEmail1"
							aria-describedby="emailHelp"
							placeholder="Seu email"
							onChange={(event) =>
								handleInputChange("SET_EMAIL", event)
							}
						/>
						<small id="emailHelp" className="form-text text-muted">
							Nunca vamos compartilhar seu email, com ninguém.
						</small>
						<br />

						<label htmlFor="password">Senha </label>
						<input
							required
							type="password"
							placeholder="Senha"
							onChange={(event) =>
								handleInputChange("SET_PASSWORD", event)
							}
						/>

						{emailSubmit && (
							<div>
								<label htmlFor="exampleInputEmail1">
									Código de acesso
								</label>
								<input
									required
									type="text"
									placeholder="Seu código de acesso."
									onChange={(event) =>
										handleInputChange("SET_CODE", event)
									}
								/>
								<small
									id="emailHelp"
									className="form-text text-muted"
								>
									Verifique na caixa de entrada do seu email.
								</small>
								<br />
							</div>
						)}
						<Link
							className={styles.link}
							to={"/authenticate"}
							type="submit"
						>
							Já tenho uma conta
						</Link>
						<button
							style={{ marginTop: "2%" }}
							className="btn btn-primary"
							type="submit"
						>
							{textButton}
						</button>

						<hr />
						<Link
							to="/barber/registerBarber"
							style={{ marginBottom: "1%" }}
							className="btn btn-primary"
							type="button"
						>
							Sou Barbeiro
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register;
