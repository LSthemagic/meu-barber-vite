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
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import path_url from "../../../shared/config/path_url.json"
import EditProfile from "./EditProfile";


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

const initialStateServices = {
    nameService: null,
    price: null,
    duration: null,
}

const reducerServices = (state, action) => {
    switch (action.type) {
        case "SET_SERVICE":
            return { ...state, nameService: action.data };
        case "SET_PRICE":
            return { ...state, price: action.data };
        case "SET_DURATION":
            return { ...state, duration: action.data };
        default:
            throw new Error('Invalid Action Type!')
    }
}


const Profile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isEditProfile, setIsEditProfile] = useState(false);
    const [barbershop, setBarbershop] = useState([]);
    const auth = useAuth();

    // states para add barber
    const [showModalAddBarber, setShowModalAddBarber] = useState(false)

    const [stateAddBarber, dispatchAddBarber] = useReducer(reducerAddBarber, initialStateAddBarber);

    const [stateService, dispatchService] = useReducer(reducerServices, initialStateServices);

    // states para adicionar services oferecidos
    const [showModalServices, setShowModalServices] = useState(false)

    // funções para abrir e fechar modal de add barber 
    const handleOpenModalAddBarber = () => setShowModalAddBarber(true)
    const handleCloseModalAddBarber = () => setShowModalAddBarber(false)


    // funções para abrir e fechar modal de adicionar serviços
    const handleOpenModalServices = () => setShowModalServices(true)
    const handleCloseModalServices = () => setShowModalServices(false)

    // funções para abrir e fechar modal de adicionar serviços
    const handleOpenModalEditProfile = () => setIsEditProfile(true)
    const handleCloseModalEditProfile = () => setIsEditProfile(false)


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
        setIsLoading(true)
        try {
            const response = await axios.get(
                `${path_url.remote}/dataBarber/profileBarber`,
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
            // console.log(response.data)
        } catch (err) {
            console.log(err);
            Toast.fire({
                icon: "error",
                title: err.message,
            });
        } finally {
            setIsLoading(false)
        }
    };

    //  Adiciona um novo barbeiro no state via reducer
    const handleDispatchAddBarber = (type, event) => {
        dispatchAddBarber({
            type: type,
            data: event.target.value
        })
    }

    //  Adiciona um novo serviço no state via reducer
    const handleDispatchService = (type, event) => {
        dispatchService({
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
                                FECHAR
                            </Button>
                            <Button variant="primary" type="submit">
                                {isLoading ? <Spinner /> : "SALVAR"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>

                {/* <Modal.Footer> */}
                {/* </Modal.Footer> */}
            </Modal>
        );
    }
    const handleModalEditProfile = () => {
        return (
            <Modal
                show={isEditProfile}
                onHide={handleCloseModalEditProfile}
                backdrop="static"
                keyboard={false}
                className={styles.modal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <div className="rounded" style={{background:"#333", color:"white",}}>
                    <Modal.Header closeButton closeVariant="white">
                        <Modal.Title className="text-white">Editar Perfil</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <EditProfile props={barbershop} />
                    </Modal.Body>
                </div>
                {/* <Modal.Footer> */}
                {/* </Modal.Footer> */}
            </Modal>
        );
    }

    // adicionar o barbeiro via API no banco de dados
    const handleAddBarber = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await fetch(
                `${path_url.remote}/barberAuth/addBarber`,
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
        } finally {
            setIsLoading(false)
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
        // console.log(`target value: ${event.target.value}`)
        // console.log(`only: ${onlyDigits}`)
        handleDispatchService("SET_PRICE", event)
    }

    function maskCurrency(valor, locale = 'pt-BR', currency = 'BRL') {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
        }).format(valor);
    }
    // salvar serviço via API
    const handleSaveService = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const response = await fetch(`${path_url.remote}/barberAuth/saveService`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: barbershop?._id,
                        nameService: stateService?.nameService,
                        price: stateService?.price,
                        duration: stateService?.duration
                    })
                }
            )
            const data = await response.json()
            const icon = data.error ? "error" : "success"
            handleDataBarber()
            Toast.fire({
                icon: `${icon}`,
                title: `${data.message}`
            })

        } catch (e) {
            console.log(`Error from saveService ${e}`)
            Toast.fire({
                icon: "error",
                title: "Erro ao carregar requisição."
            })
        } finally {
            setIsLoading(false)
        }
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
                    <Form className={styles.input} onSubmit={handleSaveService}>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Serviço oferecido"
                            onChange={(e) => handleDispatchService("SET_SERVICE", e)}
                        />
                        <br />
                        <Form.Control
                            required
                            type="text"
                            placeholder="Valor (apenas números)"
                            onChange={(e) => mascaraMoeda(e)} maxLength={15}
                        />
                        <br />
                        <Form.Control
                            required
                            type="time"
                            placeholder="Duração do serviço"
                            onChange={(e) => handleDispatchService("SET_DURATION", e)}
                        />
                        <Modal.Footer>
                            <Button onClick={handleCloseModalServices} variant="secondary" >CANCELAR</Button>
                            <Button type="submit" variant="primary" >
                                {isLoading ? <Spinner /> : "SALVAR"}
                            </Button>
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
            {isLoading ? (
                <Spinner
                    color="black"
                    style={{ margin: 'auto', display: 'flex', justifyContent: 'center', marginTop: '20%', marginBottom: '5%' }}
                />
            ) : (
                <div>
                    <div className={styles.card1}>
                        <h2 style={{ textAlign: 'center', marginBottom: '3%', display: 'inline' }}>
                            {`PERFIL DA BARBEARIA - ${barbershop.name?.toUpperCase()}`}
                        </h2>

                        <div className={styles.cardContent}>
                            <div className={styles.textWrapper}>
                                <button onClick={handleOpenModalEditProfile} className={styles.button}>
                                    EDITAR PERFIL
                                    <SquarePen />
                                </button>
                                <button className={styles.button}>
                                    EXCLUIR CONTA
                                    <Trash2 />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card2}>
                        <div className={styles.headerCard2}>
                            <h1>PERFIL DE BARBEIROS</h1>
                            <UserRoundPlus onClick={handleOpenModalAddBarber} style={{ cursor: 'pointer' }} />
                        </div>
                        <div className={styles.cardContent}>
                            {barbershop.barbers?.length === 0 ? (
                                <div>
                                    <h1>Nenhum Barbeiro Cadastrado</h1>
                                </div>
                            ) : (
                                <div className={styles.textWrapper}>
                                    {barbershop.barbers?.map((item, index) => (
                                        <div className={styles.listBarbers} key={index}>
                                            <button className={styles.button2}>
                                                {item.name?.toUpperCase()}
                                                <SquarePen style={{ cursor: 'pointer', height: '20px' }} />
                                                <Trash2 style={{ cursor: 'pointer', height: '20px' }} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={`${styles.card1} mt-3`}>
                        <h2
                            style={{
                                textAlign: 'center',
                                marginBottom: '3%',
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '1rem',
                                justifyContent: 'center',
                            }}
                        >
                            SERVIÇOS OFERECIDOS
                            <ClipboardPlus onClick={handleOpenModalServices} style={{ cursor: 'pointer', height: '20px' }} />
                        </h2>

                        <div className={styles.cardContent}>
                            <div className={styles.textWrapper}>
                                {barbershop?.services ? (
                                    barbershop.services?.map((item, index) => (
                                        <button
                                            style={{ textAlign: 'left' }}
                                            className={styles.button}
                                            disabled
                                            key={index}
                                        >
                                            Serviço: {item.nameService} <br />
                                            Valor: {item.price} <br />
                                            Duração: {item.duration}
                                        </button>
                                    ))
                                ) : (
                                    'Ainda não há serviços cadastrados.'
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModalAddBarber && handleModalAddBarber()}
            {showModalServices && handleModalServices()}
            {isEditProfile && handleModalEditProfile()}
        </div>
    );

};

export default Profile;
