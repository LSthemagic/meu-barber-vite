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

const Calendar = ({ props, children }) => {
	const [dataScheduling, setDataScheduling] = useState(null);
	const [dataFromDB, setDataFromDB] = useState([]);
	const [update, setUpdate] = useState(false);
	const { data, token, offDataAuth, logout } = useAuth();
	const [allEvents, setAllEvents] = useState([])
	const navigate = useNavigate();
	const { name: nameBarber } = props;
	const { email: emailBarber } = props;

	const { name: nameService } = children;
	
	// const { price: priceService } = children;
	const { duration: durationService } = children;
	const { service_id } = children;
	

	// verificar se o user esta logado
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

	// // Combinar dados de agendamento e eventos indisponíveis quando ambos estiverem disponíveis

	useEffect(() => {
		const events = dataFromDB?.map((appointment, index) => ({
			title: appointment.name,
			start: moment(appointment.startDate).toDate(),
			end: moment(appointment.endDate).toDate(),
			color: appointment.type === "client" ? "#59b7ff" : "red",
			id: index.toString(),
		}));
		setAllEvents(events);

	}, [dataFromDB]);

	useEffect(() => {
		handleGetHoursScheduled();
	}, [update]);

	useEffect(() => {
		if (dataScheduling) {
			handleUpdateDB();
		}
	}, [dataScheduling]);

	// enviar email de confirmação de horário agendado para o user e para o barbeiro
	const confirmationSchedule = async () => {
		try {
			const response = await fetch("https://meu-barber-vite-api-2.onrender.com/confirmationFromEmail/confirmationSchedule", {
				method: "POST",
				headers: {
					"Content-type": "application/json"
				},
				body: JSON.stringify({
					emailBarber: emailBarber,
					emailClient: data?.email,
					nameClient: data?.name,
					dataScheduling: dataScheduling.start,
					service: nameService,
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

	// registrar um novo agendamento
	const handleUpdateDB = async () => {
		try {
			const response = await fetch(
				"https://meu-barber-vite-api-2.onrender.com/calendar/update-clients",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						name: nameBarber,
						email: emailBarber,
						clients: {
							name: data?.name,
							email: data?.email,
							startDate: new Date(dataScheduling?.start).toISOString(),
							endDate: new Date(dataScheduling?.end).toISOString(),
							service_id: service_id
						},
						type: dataScheduling?.type
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

	// pegar horários dos clientes agendados
	const handleGetHoursScheduled = async () => {
		try {
			const response = await axios.get(
				"https://meu-barber-vite-api-2.onrender.com/dataBarber/unavailableTimeBarber",
				{
					headers: {
						Authorization: `Bearer ${token}`,
						Email: emailBarber
					}
				}
			);

			if (await response.data.message === "Token invalid or expired.") {
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

			if (await response.data.message === "Nenhum cliente agendado.") {
				Toast.fire({
					icon: "info",
					title: "O barbeiro esta com todos os  horários disponíveis."
				});
			}

			setDataFromDB(await response.data.unavailableDates);

		} catch (err) {
			console.log("Erro ao buscar horários marcados", err);
			Toast.fire({
				icon: "error",
				title: "Erro interno ao buscar horários marcados"
			});
		}
	};

	// função para aparecer horários quando o user clica no fullcalendar
	const handleDateClick = async (info) => {
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
			const endTime = moment(timeSchedule).clone().add(durationService, "minutes");
			setDataScheduling({
				start: timeSchedule,
				end: endTime.format(),
				title: "Horário agendado",
				color: "#59b7ff",
				type: "client",
			});
		}
	};

	return (
		<div className="container">
			{data ? (
				<FullCalendar
					viewClassNames={"text-center, text-black"}
					plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
					initialView="timeGridWeek"
					headerToolbar={{
						start: "today prev,next",
						center: "",
						end: "dayGridMonth,timeGridWeek,timeGridDay"
					}}
					// validRange={(now) => ({ // Permite a partir de agora
					// 	start: now,
					//   })}
					//   selectConstraint="businessHours" // Restringe às horas de funcionamento
					// />
					validRange={(now) => ({
						start: now, //permite a partir do horário atual
					})}
					// selectConstraint={"businessHours"} //Restringe as horas de trabalho
					// businessHours={
					// 	{
					// 		daysOfWeek: [1, 2, 3, 4, 5], // Sexta e Sábado
					// 		// startTime: data.open_at,
					// 		// endTime: data.close_at,
					// 	}

					// }
					dayCellClassNames={`text-center`}
					weekNumberCalculation="ISO"
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
					allDaySlot={false}
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
					slotMinTime="08:00" // Horário mínimo (8h)
					slotMaxTime="18:00" // Horário máximo (18h)
					hiddenDays={[0]}
					editable={false}
					selectable={true}
					dayMaxEvents={true}
					eventColor="red"
					dateClick={handleDateClick}
					events={allEvents || []}
					eventDidMount={(info) => {
						// Use Bootstrap to create the popover
						return new bootstrap.Popover(info.el, {
							title: info.event.title,
							placement: "auto",
							trigger: "hover",
							customClass: "popoverStyle",
							content: `<p>Encontre um horário disponível para o agendamento..</p>`,
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
