import axios from "axios";
import Toast from "../../../shared/custom/Toast";
import { useAuth } from "../../context/BarberContext";
import { useEffect, useReducer, useState } from "react";
import LandingPage from "../../../shared/pages/landingPage";
import styles from "./Profile.module.css";
import {
    SquarePen,
    UserRoundPlus
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
    const [showModalAddBarber, setShowModalAddBarber] = useState(false)
    const [stateAddBarber, dispatchAddBarber] = useReducer(reducerAddBarber, initialStateAddBarber);
    const handleOpenModalAddBarber = () => setShowModalAddBarber(true)
    const handleCloseModalAddBarber = () => setShowModalAddBarber(false)
    


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
            // console.log(response.data);
            setBarbershop(response.data);
        } catch (err) {
            console.log(err);
            Toast.fire({
                icon: "error",
                title: err.message,
            });
        }
    };

    const handleDispatchAddBarber = (type, event) => {
        dispatchAddBarber({
            type: type,
            data: event.target.value
        })
    }

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

                        <div className="modal-footer"> {/* Envolve os botões em uma div para estilização */}
                            <Button variant="secondary" onClick={handleCloseModalAddBarber}>
                                Fechar
                            </Button>
                            <Button variant="primary" type="submit">Salvar</Button> {/* Adiciona type="submit" para o botão de salvar */}
                        </div>
                    </Form>
                </Modal.Body>
                {/* Remova o comentário da seção Modal.Footer se desejar adicionar algum conteúdo ao rodapé */}
                {/* <Modal.Footer> */}
                {/* </Modal.Footer> */}
            </Modal>
        );
    }

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

    return (
        <div className={styles.container}>
            <div className={styles.card1}>
                <h2 style={{ textAlign: "center", marginBottom: "3%", display: "inline" }}>{"Perfil da Barbearia - ".toUpperCase() + barbershop.name?.toUpperCase()}</h2>

                <div className={styles.cardContent}>
                    <div className={styles.textWrapper}>
                        <h5>{barbershop.email}</h5>
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
                                        <SquarePen style={{cursor:"pointer", height:"20px"}} />
                                    </div>
                                ))
                            }
                        </div>

                    )}
                </div>

            </div>
            {showModalAddBarber && handleModalAddBarber()}
        </div>
    );
};

export default Profile;
