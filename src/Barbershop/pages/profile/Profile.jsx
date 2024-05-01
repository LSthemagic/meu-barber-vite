import axios from "axios";
import Toast from "../../../shared/custom/Toast";
import { useAuth } from "../../context/BarberContext";
import { useEffect, useReducer, useState } from "react";
import LandingPage from "../../../shared/pages/landingPage";
import styles from "./Profile.module.css";
import {
    ClipboardPlus,
    SquarePen,
    Trash2,
    UserRoundPlus,
} from "lucide-react"
import { Button, Form, Modal } from "react-bootstrap";

const initialStateAddBarber = {
    name: null,
    email: null
}

const reducerAddBarber = (state, action) => {
    switch (action.type) {
        case "SET_NAME":
            return { ...state, name: action.data };
        case "SET_EMAIL":
            return { ...state, email: action.data };
        default:
            throw new Error("Invalid Dispatched Action!");
    }
}

const Profile = () => {
    const [barbershop, setBarbershop] = useState([]);
    const auth = useAuth();
    // states para add barber
    const [showModalAddBarber, setShowModalAddBarber] = useState(false)
    const [stateAddBarber, dispatchAddBarber] = useReducer(reducerAddBarber, initialStateAddBarber);
    // states para adicionar services oferecidos
    const [showModalServices, setShowModalServices] = useState(false)
    // funções para abrir e fechar modal de add barber 
    const handleOpenModalAddBarber = () => setShowModalAddBarber(true)
    const handleCloseModalAddBarber = () => setShowModalAddBarber(false)
    // funções para abrir e fechar modal de adicionar serviços
    const handleOpenModalServices = () => setShowModalServices(true)
    const handleCloseModalServices = () => setShowModalServices(false)



    if (!auth) {
        Toast.fire({
            icon: "info",
            title: "Por favor, faça o login para continuar!",
        });
        return <LandingPage />;
    }

    const { dataBarber: { email }, token } = auth;

    useEffect(() => {
        handleDataBarber();
    }, []);

    //  Pegar barbeiros via API

    const handleDataBarber = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3001/dataBarber/profileBarber",
                {
                    headers: {
                        email: email,
                    },
                }
            );

            if (response.error) {
                Toast.fire({
                    icon: "error",
                    text: "esse aq",
                });
            }
            setBarbershop(response.data);
        } catch (err) {
            console.log(err);
            Toast.fire({
                icon: "error",
                title: err.message,
            });
        }
    };

    //  Adiciona um novo barbeiro no state via reducer
    const handleDispatchAddBarber = (type, event) => {
        dispatchAddBarber({
            type: type,
            data: event.target.value
        })
    }

    // modal para cadastro do barbeiro
    const handleModalAddBarber = () => {
        return (

            <Modal
                show={showModalAddBarber}
                onHide={handleCloseModalAddBarber}
                backdrop="static"
                keyboard={false}
                className={styles.modal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title className="text-black">Adicionar Barbeiro</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form className={styles.input} onSubmit={handleAddBarber}>
                        <Form.Control
                            required
                            type="email"
                            placeholder="Email do Barbeiro"
                            onChange={(e) => handleDispatchAddBarber("SET_EMAIL", e)}
                        />
                        <Form.Control
                            required
                            type="text"
                            placeholder="Nome do Barbeiro"
                            onChange={(e) => handleDispatchAddBarber("SET_NAME", e)}
                        />

                        <div className="modal-footer">
                            <Button variant="secondary" onClick={handleCloseModalAddBarber}>
                                Fechar
                            </Button>
                            <Button variant="primary" type="submit">Salvar</Button>
                        </div>
                    </Form>
                </Modal.Body>

                {/* <Modal.Footer> */}
                {/* </Modal.Footer> */}
            </Modal>
        );
    }

    // adicionar o barbeiro via API no banco de dados
    const handleAddBarber = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(
                "http://localhost:3001/barberAuth/addBarber",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({

                        name: stateAddBarber?.name,
                        email: stateAddBarber?.email,
                        id: barbershop?._id,

                    })
                }
            )
            const data = await response.json();
            if (data.error) {
                Toast.fire({
                    icon: "error",
                    title: `${data.message}`
                })
            } else {
                handleDataBarber()
                Toast.fire({
                    icon: "success",
                    title: `${data.message}`
                })
            }

        } catch (e) {
            console.log(`Error from handleAddBarber ${e}`);
            Toast.fire({
                icon: "error",
                title: "Erro ao adicionar barbeiro. Se atente nas informações e tente novamente!",
            })
        }
    }

    function mascaraMoeda(event) {
        const onlyDigits = event.target.value
            .split('')
            .filter((s) => /\d/.test(s))
            .join('')
            .padStart(3, '0');
        const digitsFloat = onlyDigits.slice(0, -2) + '.' + onlyDigits.slice(-2);
        event.target.value = maskCurrency(digitsFloat);
        console.log(`target value: ${event.target.value}`)
        console.log(`only: ${onlyDigits}`)
    }

    function maskCurrency(valor, locale = 'pt-BR', currency = 'BRL') {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
        }).format(valor);
    }

    // modal de serviços oferecidos
    const handleModalServices = () => {
        return (
            <Modal
                show={showModalServices}
                onHide={handleCloseModalServices}
                backdrop="static"
                keyboard={false}
                className={styles.modal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title className="text-black">Adicionar Barbeiro</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Serviço oferecido"
                        // onChange={}
                        />
                        <br />
                        <Form.Control
                            required
                            type="text"
                            placeholder="Valor (apenas números)"
                            onChange={(e) => mascaraMoeda(e)} maxLength={15}
                        />
                        <Modal.Footer>
                            <Button onClick={handleCloseModalServices} variant="secondary" >Cancelar</Button>
                            <Button variant="primary" >Clica ai</Button>
                        </Modal.Footer>



                    </Form>

                </Modal.Body>

                {/* <Modal.Footer> */}
                {/* </Modal.Footer> */}
            </Modal>
        )
    }


    return (
        <div className={styles.container}>
            <div className={styles.card1}>
                <h2 style={{ textAlign: "center", marginBottom: "3%", display: "inline" }}>{"Perfil da Barbearia - ".toUpperCase() + barbershop.name?.toUpperCase()}</h2>

                <div className={styles.cardContent}>
                    <div className={styles.textWrapper}>
                        <h5 style={{ justifyContent: "center", display: "flex", flexDirection: "row", gap: "1rem", alignItems: "center" }}>
                            EDITAR PERFIL
                            <SquarePen />
                        </h5>
                        <h5 style={{ justifyContent: "center", display: "flex", flexDirection: "row", gap: "1rem", alignItems: "center" }}>
                            EXCLUIR CONTA
                            <Trash2 />
                        </h5>
                    </div>
                </div>
            </div>
            <div className={styles.card2}>
                <div className={styles.headerCard2}>
                    <h1>{"PERFIL DE BARBEIROS"} </h1>
                    <UserRoundPlus onClick={handleOpenModalAddBarber} style={{ cursor: "pointer" }} />
                </div>

                <div>
                    {barbershop.barbers?.length === 0 ? (
                        <div>
                            <h1>Nenhum Barbeiro Cadastrado</h1>
                        </div>

                    ) : (
                        <div className={styles.tableContent}>
                            {
                                barbershop.barbers?.map((item, index) => (
                                    <div className={styles.listBarbers} key={index}>
                                        <h4>{item.name?.toUpperCase()}</h4>
                                        <SquarePen style={{ cursor: "pointer", height: "20px" }} />
                                    </div>
                                ))
                            }
                        </div>

                    )}
                </div>
            </div>
            <div className={`${styles.card1} mt-3`}>
                <h2 style={{ textAlign: "center", marginBottom: "3%", display: "flex", flexDirection: "row", gap: "1rem", justifyContent: "center" }}>
                    {"SERVIÇOS OFERECIDOS"}
                    <ClipboardPlus onClick={handleOpenModalServices} style={{ cursor: "pointer" }} />
                </h2>

                <div className={styles.cardContent}>
                    <div className={styles.tableContent}>
                        <h5>{"nenhum hahahaha"}</h5>
                    </div>
                </div>
            </div>
            {showModalAddBarber && handleModalAddBarber()}
            {showModalServices && handleModalServices()}
        </div>
    );
};

export default Profile;
