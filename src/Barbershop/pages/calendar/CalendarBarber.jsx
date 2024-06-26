import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { useAuth as useAuthBarber } from "../../context/BarberContext";
import LandingPage from "../../../shared/pages/landingPage";
import Toast from "../../../shared/custom/Toast";
import moment from "moment";
import * as bootstrap from "bootstrap";
import Swal from "sweetalert2";
import { Form, Spinner } from "react-bootstrap";
import styles from "./Calendar.module.css";
import path_url from "../../../shared/config/path_url.json"


const Calendar = () => {

    // Estados para armazenar dados de agendamento e horários indisponíveis
    const [unavailableTime, setUnavailableTime] = useState(null);
    const [unavailableBarberDB, setUnavailableBarberDB] = useState([])
    const [allEvents, setAllEvents] = useState([])
    const [unavailableEvent, setUnavailableEvent] = useState([]);
    const [barbers, setBarbers] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [emailSelected, setEmailSelected] = useState(null);
    // Obter informações de autenticação do barbeiro do contexto
    const { token, dataBarber, offAuthToken, signOut } = useAuthBarber();

    // Redirecionar para a página inicial se não houver token ou dados do barbeiro
    if (!token || !dataBarber) return <LandingPage />;

    // Carregar dados de agendamento e horários indisponíveis ao montar o componente

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
        const events = unavailableBarberDB?.map((appointment, index) => ({
            title: appointment.name,
            start: moment(appointment.startDate).toDate(),
            end: moment(appointment.endDate).toDate(),
            color: (appointment.type === "client") ? "#59b7ff" : "red",
            id: index.toString(),
        }));

        setAllEvents(events);
    }, [unavailableEvent]);


    useEffect(() => {
        handleGetBarbers()
    }, [])


    // Buscar horários indisponíveis do servidor
    const handleGetInvalidHoursDB = async (emailBarber) => {
        setIsLoading(true)
        setIsLoading(true)
        try {
            const response = await axios.get(`${path_url.remote}/dataBarber/unavailableTimeBarber`, {
                headers: {
                    authorization: `Bearer ${token}`,
                    email: emailBarber,
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

            console.log(response.data.unavailableDates)
            setUnavailableBarberDB(response.data.unavailableDates);
        } catch (error) {
            console.log(error);
            Toast.fire({
                icon: "error",
                title: "Ocorreu um erro interno no servidor. Tente novamente mais tarde."
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Enviar horários indisponíveis para o servidor
    const handlePostTimeUnavailable = async () => {
        if (!unavailableTime) return
        setIsLoading(true)
        try {
            const response = await fetch(`${path_url.remote}/calendar/unavailableTime`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    email: await emailSelected,
                    start: new Date(unavailableTime?.start).toISOString(),
                    end: new Date(unavailableTime?.end).toISOString(),
                    type: "barber",
                    name: unavailableTime.title
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
                handleGetInvalidHoursDB(await emailSelected)
            }
        } catch (e) {
            console.log("handlePostTimeUnavailable " + e)
            Toast.fire({
                icon: "error",
                title: "Ocorreu um erro interno no servidor. Tente novamente mais tarde."
            })
        } finally {
            setIsLoading(false)
        }
    };

    // Get barbers per barbershop from the database and set it to state
    const handleGetBarbers = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${path_url.remote}/dataBarber/barbersPerBarbershop`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        id: dataBarber._id
                    }
                })

            setBarbers(response.data.barbers);
        } catch (e) {
            console.log(e);
            if (e.response.data.error) {
                Toast.fire({
                    icon: "error",
                    title: e.response.data.message
                })
                signOut()
                offAuthToken()
                Navigate("/barber/authenticateBarber")
            } else {
                Toast.fire({
                    icon: "error",
                    title: "Ocorreu um erro ao processar os dados.\nTente novamente mais tarde."
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Lidar com marcação de tempos como indisponíveis
    const handleUnavailableTime = async (info) => {
        const formattedDate = moment(info.date).format("YYYY-MM-DD");
        const { value: formValues } = await Swal.fire({
            title: "Marcar tempo como indisponível",
            html:
                `<div class="mb-3">` +
                `<label for="time">Marcar:</label>` +
                `<select id="time" class="form-control">` +
                `<option value="horário">Apenas o horário selecionado</option>` +
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

    // opções de todos os barbeiros cadastrados no sistema
    const handleOptionsSelectBarbers = () => {
        if (!barbers?.length > 0) {
            Toast.fire({
                icon: 'info',
                title: 'Nenhum barbeiro disponível'
            });
            return null; // Retorna null se não houver barbeiros disponíveis
        }

        return barbers.map((item) => (
            <option key={item._id} value={item.email}>{item.name}</option>
        ));
    };

    const handleBarberSelected = (event) => {
        event.preventDefault()
        try {
            if (!event.target.value) {
                return Toast.fire({
                    icon: "error",
                    title: "Selecione um barbeiro!"
                })
            }
            setEmailSelected(event.target.value);
            handleGetInvalidHoursDB(event.target.value)
                .then(() => Toast.fire({
                    icon: "success",
                    title: "Agenda atualizada."
                }))

        } catch (e) {
            console.log(e);
            Toast.fire({
                icon: "error",
                title: "Erro ao selecionar barbeiro!"
            })
        }
    }


    const renderCalendar = () => {
        return (
            <div className="bg-marrom-claro m-">
                <div className={`${styles.select}`}>
                    <Form.Select
                        onChange={handleBarberSelected}
                        placeholder="Selecionar barbeiro"
                    >
                        <option aria-pressed="false" value="">Selecione um barbeiro</option>
                        {barbers && handleOptionsSelectBarbers()}
                    </Form.Select>
                </div>
                <div className={styles.fullCalendar}>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        headerToolbar={{
                            start: "today prev,next",
                            center: "",
                            end: "dayGridMonth,timeGridWeek,timeGridDay",
                        }}
                        dayCellClassNames="text-center"
                        weekNumberCalculation="ISO"
                        height="90vh"
                        locale="pt-br"
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
                        allDaySlot={false}
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
                        eventColor="#ff6b45"
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
            </div>
        );
    };

    return (
        <div>
            {isLoading ? <Spinner color="black" style={{ margin: 'auto', display: 'flex', justifyContent: 'center', marginTop: "20%", marginBottom: "5%" }} /> : renderCalendar()}
        </div>
    );
};

export default Calendar;
