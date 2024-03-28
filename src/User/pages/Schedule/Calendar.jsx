import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Swal from "sweetalert2";
import moment from "moment";
import "moment/locale/pt-br";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import { useAuth } from "../../context/AuthContext";
import Toast from "../../../shared/custom/Toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import PageUnauthorized from "../../../shared/images/PageUnauthorized.svg";


const Calendar = ({ props }) => {
	const [dataScheduling, setDataScheduling] = useState(null);
	const [dataFromDB, setDataFromDB] = useState([]);
	const [update, setUpdate] = useState(false);
	const { data, token, offDataAuth, logout } = useAuth();


	const navigate = useNavigate();

	console.log(props);
	const { name: nameBarber } = props;
	const { email: emailBarber } = props;

	useEffect(() => {
		if (!data) {
			Toast.fire({
				icon: "error",
				title: "É preciso estar logado para agendar seu horário",
				timer: 4000,
				background: "red",
				color: "white",
				iconColor: "white"
			});
			setTimeout(() => {
				navigate("/register");
			}, 4000);
		}
	}, []);

	useEffect(() => {
		handleGetHoursScheduled();
	}, [update]);

	useEffect(() => {
		if (dataScheduling) {
			// console.log('data ', dataScheduling);
			handleUpdateDB();
		}
	}, [dataScheduling]);

	const confirmationSchedule = async () => {
		try {
			const response = await fetch("http://localhost:3001/confirmationFromEmail/confirmationSchedule", {
				method: "POST",
				headers: {
					"Content-type": "application/json"
				},
				body: JSON.stringify({
					emailBarber: emailBarber,
					emailClient: data?.email,
				})
			})

			const dataReq = await response.json()
			if (dataReq.error) {
				Toast.fire({
					icon: "error",
					title: dataReq.message
				});
			} else {
				Toast.fire({
					icon: "success",
					title: dataReq.message
				});
			}

		} catch (err) {
			Toast.fire({
				icon: "error",
				title: dataReq.message
			});
		}
	}

	const handleUpdateDB = async () => {
		try {
			const response = await fetch(
				"http://localhost:3001/barberAuth/update-clients",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						nome: nameBarber,
						email: emailBarber,
						clients: {
							nome: data?.name,
							email: data?.email,
							date: new Date(dataScheduling?.start).toISOString()
						}
					})
				}
			);

			const dataReq = await response.json();
			if (dataReq.error) {
				Toast.fire({
					icon: "error",
					title: dataReq.message
				});
			} else {
				Toast.fire({
					icon: "success",
					title: dataReq.message
				});
				setUpdate((prevUpdate) => !prevUpdate);
				confirmationSchedule()
			}
		} catch (err) {
			console.log("ERRO EM ATT_CLIENTES_DB", err);
		}
	};

	const handleDateClick = async (info) => {
		// console.log(info);
		const formattedDate = moment(info.date).format("YYYY-MM-DDTHH:mm");

		const { value: timeSchedule } = await Swal.fire({
			title: "Marcar horário",
			input: "datetime-local",
			inputLabel: "Agende com Meu barber",
			showCancelButton: true,
			inputValue: formattedDate,
			inputValidator: (value) => {
				if (!value) {
					return "Você precisa selecionar uma data e hora!";
				}
			}
		});

		if (timeSchedule) {
			const endTime = moment(timeSchedule).clone().add(40, "minutes");
			setDataScheduling({
				start: timeSchedule,
				end: endTime.format(),
				title: "Horário agendado",
				color: "#59b7ff"
			});
		}
	};

	const handleGetHoursScheduled = async () => {
		try {
			const response = await axios.get(
				"http://localhost:3001/dataBarber/scheduled",
				{
					headers: {
						Authorization: `Bearer ${token}`,
						Email: emailBarber
					}
				}
			);

			console.log("response data", response.data.clientsScheduled);

			if (response.data.message === "Token invalid or expired.") {
				Toast.fire({
					icon: "info",
					title: "Por segurança, faça o login novamente."
				});
				offDataAuth()
				logout()
				setTimeout(() => {
					<Link to={"/register"} />
				}, 3000);
			}

			if (response.data.message === "Nenhum cliente agendado.") {
				Toast.fire({
					icon: "info",
					title: "O barbeiro esta com todos os  horários disponiveis."
				});
			}

			setDataFromDB(response.data.clientsScheduled);

		} catch (err) {
			console.log("Erro ao buscar horários marcados", err);
			Toast.fire({
				icon: "error",
				title: "Erro interno ao buscar horários marcados"
			});
		}
	};

	const events = dataFromDB?.map((appointment) => ({
		title: appointment.nome,
		start: moment(appointment.date).toDate(),
		end: moment(appointment.date).add(40, "minutes").toDate(),
		color: "#59b7ff"
	}));

	// console.log("events", events)
	return (
		<div className="container">
			{data ? (
				<FullCalendar
					plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
					initialView="timeGridWeek"
					headerToolbar={{
						start: "today prev,next",
						center: "",
						end: "dayGridMonth,timeGridWeek,timeGridDay"
					}}
					height={"90vh"}
					locale={"pt-br"}
					buttonText={{
						today: "Hoje",
						month: "Mês",
						week: "Semana",
						day: "Dia",
						list: "Lista",
						next: "Próximo",
						nextYear: "Próximo ano",
						previous: "Voltar",
						prev: "Anterior",
						prevYear: "Ano anterior"
					}}
					allDayText="Dia inteiro"
					eventTimeFormat={{
						hour: "numeric",
						minute: "2-digit",
						meridiem: "uppercase"
					}}
					slotLabelFormat={{
						hour: "numeric",
						minute: "2-digit",
						meridiem: "uppercase"
					}}
					editable={true}
					selectable={true}
					dayMaxEvents={true}
					eventColor="red"
					dateClick={handleDateClick}
					events={events || []}
					eventDidMount={(info) => {
						// Use Bootstrap to create the popover
						return new bootstrap.Popover(info.el, {
							title: info.event.title,
							placement: "auto",
							trigger: "hover",
							customClass: "popoverStyle",
							content: `<p>Horário de ${dataFromDB?.map((item) => item.nome)} agendado.</p>`,
							html: true
						});
					}}
				/>
			) : (
				<img src={PageUnauthorized} alt=""></img>
			)}
		</div>
	);
};

export default Calendar;
