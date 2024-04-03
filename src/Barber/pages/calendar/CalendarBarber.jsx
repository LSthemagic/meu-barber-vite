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
    // Estados para armazenar dados de agendamento e horários indisponíveis
    const [dataSchedulingDB, setDataSchedulingDB] = useState([]);
    const [unavailableTime, setUnavailableTime] = useState(null);
    const [unavailableBarberDB, setUnavailableBarberDB] = useState([])
    const [allEvents, setAllEvents] = useState([])
    const [unavailableEvent, setUnavailableEvent] = useState([]);

    // Obter informações de autenticação do barbeiro do contexto
    const { tokenBarber, dataBarber } = useAuthBarber();

    // Redirecionar para a página inicial se não houver token ou dados do barbeiro
    if (!tokenBarber || !dataBarber) return <LandingPage />;

    // Carregar dados de agendamento e horários indisponíveis ao montar o componente
    useEffect(() => {
        handleDataSchedulingDB();
        handleGetInvalidHoursDB();
    }, []);

    useEffect(() => {
        handlePostTimeUnavailable()

    }, [unavailableTime])


    // Atualizar eventos indisponíveis quando os horários indisponíveis mudam
    useEffect(() => {
        const unavailableEvents = unavailableBarberDB ? unavailableBarberDB.map((item, index) => ({
            title: "Indisponível",
            start: moment(item.startDate).toDate(),
            end: moment(item.endDate).toDate(),
            color: "red",
            id: index.toString()
        })) : [];
        setUnavailableEvent(unavailableEvents);
    }, [unavailableBarberDB, unavailableTime]);

    // Combinar dados de agendamento e eventos indisponíveis quando ambos estiverem disponíveis

    useEffect(() => {
        const events = dataSchedulingDB?.map((appointment, index) => ({
            title: appointment.nome,
            start: moment(appointment.startDate).toDate(),
            end: moment(appointment.endDate).toDate(),
            color: "#59b7ff",
            id: index.toString(),
        }));

        setAllEvents([...unavailableEvent, ...events || []]);
    }, [dataSchedulingDB, unavailableEvent]);


    // Buscar dados de agendamento do servidor
    const handleDataSchedulingDB = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3001/dataBarber/scheduled",
                {
                    headers: {
                        Authorization: `Bearer ${tokenBarber}`,
                        email: dataBarber?.email,
                    },
                }
            );

            // Lidar com expiração do token
            if (response.data.message === "Token inválido ou expirado") {
                Toast.fire({
                    icon: "info",
                    title: "Por segurança, faça o login novamente.",
                });
                setTimeout(() => {
                    window.location.href = "/barber/registerBarber";
                }, 3000);
            }

            // Lidar com nenhum cliente agendado
            if (response.data.message === "Nenhum cliente agendado.") {
                Toast.fire({
                    icon: "info",
                    title: response.data.message,
                });
            }

            setDataSchedulingDB(response.data.clientsScheduled);
        } catch (err) {
            console.log("Erro ao buscar horários agendados", err);
            Toast.fire({
                icon: "error",
                title: "Erro interno no servidor.",
            });
        }
    };

    // Buscar horários indisponíveis do servidor
    const handleGetInvalidHoursDB = async () => {
        try {
            const response = await axios.get("http://localhost:3001/dataBarber/unavailableTimeBarber", {
                headers: {
                    authorization: `Bearer ${tokenBarber}`,
                    email: dataBarber?.email,
                }
            })

            // Lidar com expiração do token
            if (response.data.message === "Token inválido ou expirado") {
                Toast.fire({
                    icon: "info",
                    title: "Por segurança, faça o login novamente.",
                });
                setTimeout(() => {
                    window.location.href = "/barber/registerBarber";
                }, 3000);
            }

            setUnavailableBarberDB(response.data.unavailableDates);
        } catch (error) {
            console.log(error);
            Toast.fire({
                icon: "error",
                title: "Ocorreu um erro interno no servidor. Tente novamente mais tarde."
            })
        }
    }

    // Enviar horários indisponíveis para o servidor
    const handlePostTimeUnavailable = async () => {
        if (!unavailableTime) return
        const response = await fetch("http://localhost:3001/calendar/unavailableTime", {
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

    // Lidar com marcação de tempos como indisponíveis
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
                events={allEvents}

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
