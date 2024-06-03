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
import EditProfile from "./editProfile/EditProfile";
import { DeleteAccount } from "./deleteAccount/DeleteAccount";
import { useNavigate } from "react-router-dom";
import { EditBarbers } from "./editBarbers/EditBarbers";
import { deleteDependencies } from "./deleteDependencies/DeleteDependecies";
import { Label } from "../../../../@/components/ui/label";
import { EditServices } from "./editServices/EditServices";


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
    const [barbershop, setBarbershop] = useState([]);
    const [showModal, setShowModal] = useState({})
    const [stateAddBarber, dispatchAddBarber] = useReducer(reducerAddBarber, initialStateAddBarber);
    const [stateService, dispatchService] = useReducer(reducerServices, initialStateServices);
    const openModal = (type, data) => {
        setShowModal({ show: true, type, data });
    }
    const closeModal = () => {
        setShowModal({ show: false, type: null, data: null });
    }
    const navigate = useNavigate()
    const auth = useAuth();
    if (!auth) {
        Toast.fire({
            icon: "info",
            title: "Por favor, faça o login para continuar!",
        });
        return <LandingPage />;
    }

    const { dataBarber: { _id }, token, signOut, offAuthToken } = auth;

    useEffect(() => {
        handleDataBarber();
    }, []);

    useEffect(() => {
        handleDataBarber();
    }, [showModal]);

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


    function mascaraMoeda(event) {
        const onlyDigits = event.target.value
            .split('')
            .filter((s) => /\d/.test(s))
            .join('')
            .padStart(3, '0');
        const digitsFloat = onlyDigits.slice(0, -2) + '.' + onlyDigits.slice(-2);
        event.target.value = maskCurrency(digitsFloat);
        handleDispatchService("SET_PRICE", event);
    }
    
    function maskCurrency(valor, locale = 'pt-BR', currency = 'BRL') {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
        }).format(valor).replace(/\u00A0/g, ' ');
    }
    

    //  Pegar barbeiros via API
    const handleDataBarber = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(
                `${path_url.remote}/dataBarber/profileBarber`,
                {
                    headers: {
                        id: _id,
                        // authenticate via authorization
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.error) {
                Toast.fire({
                    icon: "error",
                    title: response.data.message,
                });
            }
            setBarbershop(response.data);
        } catch (err) {
            console.log(err);
            if (err.response.data.error) {
                Toast.fire({
                    icon: "info",
                    title: err.response.data.message,
                });
                offAuthToken()
                signOut()
                navigate("/barber/authenticateBarber")
            } else {
                Toast.fire({
                    icon: "error",
                    title: "Erro ao buscar dados.",
                });
            }
        } finally {
            setIsLoading(false)
        }
    };

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

    // modal genérico
    const handleModal = () => {
        const dataEditBarber = {
            id: _id,
            item_id: showModal?.data?.id,
            name: showModal?.data?.name,
            email: showModal?.data?.email,
        }

        const dataEditServices = {
            id: _id,
            service_id: showModal?.data?.id,
            nameService: showModal?.data?.nameService,
            price: showModal?.data?.price,
            duration: showModal?.data?.duration,
        }

        const contentTypeModal = {
            "editProfile": contentEditProfile(),
            "addBarbers": contentAddBarber(),
            "addServices": contentServices(),
            "editBarbers": <EditBarbers props={dataEditBarber} />,
            "editServices": <EditServices props={dataEditServices} />
        }
        return (
            <Modal
                show={showModal.show}
                onHide={closeModal}
                backdrop="static"
                keyboard={false}
                className={styles.modal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <div className="rounded" style={{ background: "#333", color: "white", }}>
                    <Modal.Header closeButton closeVariant="white">
                        <Modal.Title className="text-white ml-auto">Seu Barber && seu estilo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {contentTypeModal[showModal.type]}
                    </Modal.Body>
                </div>
                {/* <Modal.Footer> */}
                {/* </Modal.Footer> */}
            </Modal>
        );
    }

    // conteúdo do modal para editar perfil
    const contentEditProfile = () => {
        return (
            <div className="rounded" style={{ background: "#333", color: "white", }}>
                <EditProfile props={{barbershop, token}} />
            </div>
        );
    }

    // conteúdo do modal de serviços oferecidos
    const contentServices = () => {
        return (
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
                <Label className="text-gray-400 mb-0">Duração do serviço</Label>
                <Form.Control
                    required
                    type="time"
                    defaultValue={'00:40'}
                    placeholder="Duração do serviço"
                    onChange={(e) => handleDispatchService("SET_DURATION", e)}
                />
                <Modal.Footer>
                    <Button onClick={closeModal} variant="secondary" >CANCELAR</Button>
                    <Button type="submit" variant="primary" >
                        {isLoading ? <Spinner /> : "SALVAR"}
                    </Button>
                </Modal.Footer>

            </Form>

        )
    }

    // conteúdo do modal para cadastro do barbeiro
    const contentAddBarber = () => {
        return (
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
                    <Button variant="secondary" onClick={closeModal}>
                        FECHAR
                    </Button>
                    <Button variant="primary" type="submit">
                        {isLoading ? <Spinner /> : "SALVAR"}
                    </Button>
                </div>
            </Form>


        );
    }

    const deleteAcc = () => {
        DeleteAccount(_id)
        if (DeleteAccount(_id)) {
            Toast.fire({
                icon: 'success',
                title: 'Conta deletada com sucesso!'
            })
            navigate("/")
            signOut()
            offAuthToken()
        }

    }

    const deleteDependence = (props) => {
        deleteDependencies(props)
        setTimeout(() => {
            handleDataBarber()
        }, 1000);
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
                                <button onClick={() => openModal("editProfile")} className={styles.button}>
                                    EDITAR PERFIL
                                    <SquarePen />
                                </button>
                                <button
                                    onClick={deleteAcc}
                                    className={styles.button}>
                                    EXCLUIR CONTA
                                    <Trash2 />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.card2}>
                        <div className={styles.headerCard2}>
                            <h1>PERFIL DE BARBEIROS</h1>
                            <UserRoundPlus onClick={() => openModal("addBarbers")} style={{ cursor: 'pointer' }} />
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
                                                <SquarePen onClick={() => openModal("editBarbers", {
                                                    id: item._id,
                                                    name: item.name,
                                                    email: item.email
                                                })} style={{ cursor: 'pointer', height: '20px' }} />
                                                <Trash2 onClick={() => deleteDependence({
                                                    id: _id,
                                                    type: 'deleteBarber',
                                                    item_id: item._id
                                                })} style={{ cursor: 'pointer', height: '20px' }} />
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
                            <ClipboardPlus onClick={() => openModal("addServices")} style={{ cursor: 'pointer', height: '20px' }} />
                        </h2>

                        <div className={styles.cardContent}>
                            <div className={styles.textWrapper}>
                                {barbershop?.services ? (
                                    barbershop.services?.map((item, index) => (
                                        <div
                                            style={{ textAlign: 'left' }}
                                            className={styles.button}
                                            key={index}
                                        >
                                            Serviço: {item.nameService} <br />
                                            Valor: {item.price} <br />
                                            Duração: {item.duration}


                                            <SquarePen onClick={() => openModal("editServices", {
                                                id: item._id,
                                                nameService: item.nameService,
                                                price: item.price,
                                                duration: item.duration
                                            })} style={{ cursor: 'pointer', height: '20px' }} />
                                            <Trash2 onClick={() => deleteDependence({
                                                id: _id,
                                                type: 'deleteService',
                                                item_id: item._id
                                            })} style={{ cursor: 'pointer', height: '20px' }} />
                                        </div>
                                    ))
                                ) : (
                                    'Ainda não há serviços cadastrados.'
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModal && handleModal()}
        </div>
    );

};

export default Profile;