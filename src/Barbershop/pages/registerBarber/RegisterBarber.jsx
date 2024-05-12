import { useEffect, useReducer, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import styles from "./registerBarber.module.css";
import { Form } from "react-bootstrap";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Toast from "../../../shared/custom/Toast";
import ImageLogin from "../../../shared/images/ImageLogin.svg";
import { useAuth } from "../../context/BarberContext";

const initialStateEstablishment = {
	latitude: null,
	longitude: null,
	name: null,
	email: null,
	password: null,
	file: null
};

const reducerEstablishment = (state, action) => {
	switch (action.type) {
		case "SET_NAME":
			return { ...state, name: action.data };
		case "SET_EMAIL":
			return { ...state, email: action.data };
		case "SET_PASSWORD":
			return { ...state, password: action.data };
		case "SET_LATITUDE":
			return { ...state, latitude: action.data };
		case "SET_LONGITUDE":
			return { ...state, longitude: action.data };
		case "SET_FILE":
			return { ...state, file: action.data };
		default:
			throw new Error("Unhandled action type: ", action);
	}
};

const RegisterBarber = () => {
	const [stateEstablishment, dispatchEstablishment] = useReducer(
		reducerEstablishment,
		initialStateEstablishment
	);

	const [valor, setValor] = useState("");
	const [dataAPI, setDataAPI] = useState([]);
	const [location, setLocation] = useState(null);
	const [selected, setSelected] = useState("");
	const [activeStep, setActiveStep] = useState(0);
	const [code, setCode] = useState(null);
	const { signIn, authToken } = useAuth();

	useEffect(() => {
		// Obtendo a localização atual usando a API de Geolocalização do navegador
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const { latitude, longitude } = position.coords;
					setLocation({ latitude, longitude });
				},
				(error) => {
					console.error("Erro ao obter a localização atual:", error.message);
				}
			);
		} else {
			console.error("Geolocalização não suportada pelo navegador");
		}
	}, []);

	const handleSearchBarberShop = async (inputValue) => {
		setValor(inputValue);
		if (inputValue !== "") {
			try {
				const response = await axios.get(
					`https://api.tomtom.com/search/2/poiSearch/${inputValue}.json?key=kF69KeJ1ojh59N4rUfci37jXbR69gf7p&language=pt-BR&country=Brasil&lat=${location?.latitude}&lon=${location?.longitude}&radius=30000&limit=20`
				);
				setDataAPI(response.data.results);
			} catch (error) {
				console.error("Erro na solicitação da TomTom API:", error);
			}
		}
	};

	const handleEstablishment = async (event) => {
		event.preventDefault();

		if (selected) {
			const selectedDataAPI = dataAPI.find(
				(item) => item.poi.name === selected
			);

			if (selectedDataAPI) {
				console.log("Dados do item selecionado:", selectedDataAPI);

				// aguarda a latitude e a longitude antes de dispachar
				const [latitude, longitude] = await Promise.all([
					selectedDataAPI.position?.lat,
					selectedDataAPI.position?.lon
				]);

				dispatchEstablishment({
					type: "SET_LATITUDE",
					data: latitude
				});
				dispatchEstablishment({
					type: "SET_LONGITUDE",
					data: longitude
				});
			}
			setActiveStep(2); // Move to the next step in the stepper
		}
	};

	const handleDispatchEstablishment = (type, event) => {
		dispatchEstablishment({
			type: type,
			data: event.target.value
		});
	};
	const handleDispatchFile = (type, event) => {
		dispatchEstablishment({
			type: type,
			data: event.target.files[0]
		});
	};
	const handleSubmit = async () => {
		try {
			console.log(stateEstablishment.file);

			const response = await fetch(
				"https://meu-barber-vite-api-2.onrender.com/barberAuth/registerBarber",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						name: stateEstablishment.name,
						email: stateEstablishment.email,
						password: stateEstablishment.password,
						location: {
							latitude: stateEstablishment.latitude,
							longitude: stateEstablishment.longitude
						},
					})
				}
			);
			const data = await response.json();
			if (response.ok) {
				Toast.fire({
					icon: "success",
					title: data.message
				});
				signIn(data.data);
				authToken(data.token);
			} else {
				Toast.fire({
					icon: "error",
					title: data.message
				});
			}
		} catch (error) {
			console.error("error in handle submit", error);
		}
	};
	const handleConfirmCode = async (event) => {
		event.preventDefault();
		if (code) {
			try {
				const response = await fetch(
					"https://meu-barber-vite-api-2.onrender.com/emailAuth/auth-code",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							code: code
						})
					}
				);
				const data = await response.json();
				if (response.ok) {
					Toast.fire({
						icon: "success",
						title: data.message
					});
					handleSubmit();
				} else {
					Toast.fire({
						icon: "error",
						title: data.message
					});
				}
			} catch (error) {
				console.error("error in confirm code", error);
			}
		}
	};

	const handleReqEmail = async (event) => {
		event.preventDefault();
		try {
			const response = await fetch(
				"https://meu-barber-vite-api-2.onrender.com/emailAuth/req-email-barber",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						email: stateEstablishment.email
					})
				}
			);
			const data = await response.json();
			if (response.ok) {
				Toast.fire({
					icon: "success",
					title: data.message
				});
				setActiveStep(1);
			} else {
				Toast.fire({
					icon: "error",
					title: data.message
				});
			}
		} catch (error) {
			console.log("ERROR IN HANDLE REQ EMAIL", error);
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
				padding: 0,
				color: 'black'
			}}
		>
			<div style={{ opacity: "93%" }} className={styles.card}>
				<Box sx={{ width: "100%" }}>
					<div>
						{activeStep === 0 ? (
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
									<label htmlFor="exampleInputEmail1">Endereço de email</label>
									<input
										required
										type="email"
										inputMode="email"
										id="exampleInputEmail1"
										aria-describedby="emailHelp"
										placeholder="Ex: seuemail@meubarber.com"
										onChange={(event) =>
											handleDispatchEstablishment("SET_EMAIL", event)
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
										placeholder="Use uma senha segura"
										onChange={(event) =>
											handleDispatchEstablishment("SET_PASSWORD", event)
										}
									/>
									<button
										style={{ marginTop: "2%" }}
										className="btn btn-primary"
										type="submit"
									>
										Próximo
									</button>
								</form>
							</div>
						) : activeStep === 1 ? (
							<div className="form-group">
								<Form className={styles.input} onSubmit={handleEstablishment}>
									<h3
										style={{
											fontFamily: "cursive",
											alignItems: "center",
											justifyContent: "center",
											display: "flex"
										}}
									>
										Seu estabelecimento
									</h3>
									<label>Nome da barbearia</label>
									<Form.Control
										required
										type="text"
										placeholder="Ex: Barber no stylus"
										onChange={(e) =>
											handleDispatchEstablishment("SET_NAME", e)
										}
									/>
									<label>Pesquisar barbearia</label>
									<Form.Control
										required
										type="text"
										placeholder="Pesquisar estabelecimento"
										className="text"
										value={valor}
										onChange={(e) => handleSearchBarberShop(e.target.value)}
									/>
									<small>
										Para garantir que sua barbearia seja encontrada,
										certifique-se de cadastrá-la em um aplicativo de
										localização.
									</small>
									<label style={{ marginTop: "2%" }}>
										Selecione a sua barbearia
									</label>
									<Form.Select
										required
										aria-rowcount={30}
										value={selected}
										onChange={(e) => setSelected(e.target.value)}
									>
										<option value="" disabled>
											Pesquise para selecionar
										</option>
										{dataAPI.map((item) => (
											<option key={item.id} value={item.poi.name}>
												{item.poi.name + "  -  "}
												{item.address.freeformAddress}
											</option>
										))}
									</Form.Select>
									<Form.Control
										type="file"
										name="file"
										onChange={(event) => handleDispatchFile("SET_FILE", event)}
									/>
									<button
										style={{ marginTop: "5%" }}
										className="btn btn-primary"
										type="submit"
									>
										Próximo
									</button>
									<button
										style={{ marginTop: "2%" }}
										className="btn btn-primary"
										onClick={() => setActiveStep(0)}
									>
										Voltar
									</button>
								</Form>
							</div>
						) : (
							<>
								<div className="form-group">
									<h3
										style={{
											fontFamily: "cursive",
											alignItems: "center",
											justifyContent: "center",
											display: "flex"
										}}
									>
										Verificar email
									</h3>
									<form onSubmit={handleConfirmCode} className={styles.input}>
										<label> Seu código de verificação</label>
										<input
											type="text"
											required
											pattern="[0-9]*"
											inputMode="numeric"
											placeholder="Ex: 7777"
											onChange={(e) => setCode(e.target.value)}
										/>
										<button
											style={{ marginTop: "2%" }}
											className="btn btn-primary"
										>
											Confirmar
										</button>
									</form>
								</div>
							</>
						)}
					</div>
					<div style={{ marginTop: "5%" }}>
						<Stepper nonLinear activeStep={activeStep}>
							<Step>
								<StepButton>Criar conta</StepButton>
							</Step>
							<Step>
								<StepButton>Seu estabelecimento</StepButton>
							</Step>
							<Step>
								<StepButton>Confirmar código</StepButton>
							</Step>
						</Stepper>
					</div>
				</Box>
			</div>
		</div>
	);
};

export default RegisterBarber;
