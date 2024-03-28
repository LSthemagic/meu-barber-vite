import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth as useAuthBarber } from "../../context/BarberContext";
import LandingPage from "../../../shared/pages/landingPage";
import Toast from "../../../shared/custom/Toast";
import moment from "moment";
import * as bootstrap from "bootstrap";
import Swal from "sweetalert2";

const Calendar = () => {
    // Estados para armazenar os dados de agendamento e horários indisponíveis
    const [dataSchedulingDB, setDataSchedulingDB] = useState([]);
    const [unavailableTime, setUnavailableTime] = useState(null);

    // Obtém informações de autenticação do barbeiro do contexto
    const { tokenBarber, dataBarber } = useAuthBarber();

    // Se não houver token ou dados do barbeiro, redireciona para a página inicial
    if (!tokenBarber || !dataBarber) return <LandingPage />;

    // Efeito para carregar os dados de agendamento ao montar o componente
    useEffect(() => {
        handleDataSchedulingDB();
    }, []);

    // Função para lidar com a obtenção de dados de agendamento do servidor
    const handleDataSchedulingDB = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3001/barberAuth/scheduled",
                {
                    headers: {
                        Authorization: `Bearer ${tokenBarber}`,
                        email: dataBarber?.email,
                    },
                }
            );

            // Se o token for inválido ou expirado, redireciona para o registro do barbeiro
            if (response.data.message === "Token invalid or expired") {
                Toast.fire({
                    icon: "info",
                    title: "Por segurança, faça o login novamente.",
                });
                setTimeout(() => {
                    window.location.href = "/barber/registerBarber";
                }, 3000);
            }

            // Se não houver clientes agendados, exibe uma mensagem informativa
            if (response.data.message === "Nenhum cliente agendado.") {
                Toast.fire({
                    icon: "info",
                    title: response.data.message,
                });
            }

            // Define os dados de agendamento no estado
            setDataSchedulingDB(response.data.clientsScheduled);
        } catch (err) {
            console.log("error ao pegar horários agendados", err);
            Toast.fire({
                icon: "error",
                title: "Erro interno no servidor.",
            });
        }
    };

    // Efeito para lidar com a atualização de horários indisponíveis
    useEffect(() => {
        handlePostTimeUnavailable();
    }, [unavailableTime]);

    // Função para enviar horários indisponíveis para o servidor
    // Function to handle posting unavailable times to the server
const handlePostTimeUnavailable = async () => {
    const response = await fetch("http://localhost:3001/barberAuth/unavailableTime", {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            email: dataBarber?.email,
            date: unavailableTime
        })
    });

    const data = await response.json();
    if (data.error) {
        Toast.fire({
            icon: "error",
            title: data.message
        });
    } else {
        Toast.fire({
            icon: "success",
            title: data.message
        });
    }
};


    // Função para marcar horários como indisponíveis
    const handleUnavailableTime = async (info) => {
        const formattedDate = moment(info.date).format("YYYY-MM-DD");
        const { value: formValues } = await Swal.fire({
            title: "Marcar tempo como indisponível",
            html:
                `<div class="mb-3">` +
                `<label for="time">Marcar:</label>` +
                `<select id="time" class="form-control">` +
                `<option value="horario">Apenas o horário selecionado</option>` +
                `<option value="dia">O dia inteiro</option>` +
                `</select>` +
                `</div>` +
                `<div class="mb-3">` +
                `<label for="start-time">Hora de início:</label>` +
                `<input type="datetime-local" id="start-time" class="form-control">` +
                `</div>` +
                `<div class="mb-3">` +
                `<label for="end-time">Hora de término:</label>` +
                `<input type="datetime-local" id="end-time" class="form-control">` +
                `</div>`,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    time: document.getElementById('time').value,
                    start: document.getElementById('start-time').value,
                    end: document.getElementById('end-time').value
                }
            }
        });

        if (formValues && formValues.time === "dia") {
            setUnavailableTime({
                start: formattedDate,
                end: moment(formattedDate).add(1, "days").format("YYYY-MM-DD"),
                title: "Dia indisponível",
                color: "red",
            });
        } else if (formValues && formValues.start && formValues.end) {
            setUnavailableTime({
                start: formValues.start,
                end: formValues.end,
                title: "Horário indisponível",
                color: "red",
            });
        }
    };

    // Mapeia os eventos de agendamento para o formato exigido pelo FullCalendar
    const events = dataSchedulingDB ? dataSchedulingDB.map((appointment, index) => ({
        title: appointment.nome,
        start: moment(appointment.date).toDate(),
        end: moment(appointment.date).add(40, "minutes").toDate(),
        color: "#59b7ff",
        id: index.toString(),
      })) : [];
      

    // Define o evento de horário indisponível
    const unavailableEvent = {
        title: unavailableTime?.title,
        start: moment(unavailableTime?.start).toDate(),
        end: moment(unavailableTime?.end).toDate(),
        color: unavailableTime?.color,
    };

    // Função para verificar o título do evento
    const handleVerifyInfoTitle = (info) => {
        if (info.event.title === "Dia indisponível") {
            return "Dia indisponível";
        }
        return `<p>Horário de ${info.event.title} agendado.</p>`;
    };


    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    start: "today prev,next",
                    center: "",
                    end: "dayGridMonth,timeGridWeek,timeGridDay",
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
                    prevYear: "Ano anterior",
                }}
                allDayText="Dia inteiro"
                eventTimeFormat={{
                    hour: "numeric",
                    minute: "2-digit",
                    meridiem: "uppercase",
                }}
                slotLabelFormat={{
                    hour: "numeric",
                    minute: "2-digit",
                    meridiem: "uppercase",
                }}
                editable={true}
                selectable={true}
                dayMaxEvents={true}
                eventColor={"#ff6b45"}
                dateClick={handleUnavailableTime}
                events={[...events, unavailableEvent]}
                eventDidMount={(info) => {
                    const popover = new bootstrap.Popover(info.el, {
                        title: info.event.title,
                        placement: "auto",
                        trigger: "hover",
                        customClass: "popoverStyle",
                        content: handleVerifyInfoTitle(info),
                        html: true,
                    });
                    return () => popover.dispose();
                }}
            />
        </div>
    );
};

export default Calendar;
