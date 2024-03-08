import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Home.module.css";
import Calendar from "../../../Barber/pages/Schedule/Calendar";
import { Button, Modal } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import Toast from "../../../shared/custom/Toast";

const Home = () => {
    const [barbers, setBarbers] = useState([]);
    const [showModalCalendar, setShowModalCalenadar] = useState(false);
    const [barberSelected, setBarberSelected] = useState({})
    const [barbershopFav, setBarbershopFav] = useState(false)
    const sliderRef = useRef(null);
    const { data: { email } } = useAuth();
    

    const onBarbershopFav = () => setBarbershopFav(true)
    const offBarbershopFav = () => setBarbershopFav(false)

    const handleOpenModalCalendar = () => setShowModalCalenadar(true);
    const handleOffModalCalendar = () => setShowModalCalenadar(false);



    // const [location, setLocation] = useState(null)
    // useEffect(() => {
    //     // Obtendo a localização atual usando a API de Geolocalização do navegador
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(
    //             async (position) => {
    //                 const { latitude, longitude } = position.coords;
    //                 setLocation({ latitude, longitude })
    //             },
    //             (err) => console.error(err.message)
    //         )
    //     } else {
    //         console.error("Geolocalização não suportada pelo navegador");
    //     }
    // }, [])


    useEffect(() => {
        const fetchBarbers = async () => {
            try {
                // 
                const response = await axios.get('http://localhost:3001/dataBarber/barbers', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                setBarbers(response.data); // Assuming your response structure has a 'barbers' key
            } catch (err) {
                console.error("Error getBarbers", err.response);
            }
        };

        fetchBarbers();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000
    };

    const goToNext = () => {
        sliderRef.current.slickNext();
    };

    const goToPrev = () => {
        sliderRef.current.slickPrev();
    };


    const handleDoubleObjectiveCalendar = (data) => {

        handleOpenModalCalendar()
        setBarberSelected(data)
    }


    const handleWaze = (data) => {
        const { barbershop: { location: { latitude, longitude } } } = data;

        window.open(`https://www.waze.com/location?ll=${latitude},${longitude}`);
    }

    const handleFavoriteBarbershop = async (id) => {
        try {
            const response = await fetch("http://localhost:3001/auth/userBarbershopFav", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    id: id,
                    email: email // Verifique se 'email' está definido corretamente
                })
            });
            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            const data = await response.json();
            if (data.error) {
                Toast.fire({
                    icon: "error",
                    text: data.message
                });
            } else {
                Toast.fire({
                    icon: "success",
                    text: "deu bom"
                });
                onBarbershopFav();
            }
        } catch (error) {
            console.log("error favBarber: " + error.message);
        }
    };
    
   

    const renderModal = () => {
        if (!barberSelected) return null
        // console.log(`renderModal ${barberSelected}`);
        return (
            <Modal
                show={showModalCalendar}
                onHide={handleOffModalCalendar}
                backdrop="static"
                keyboard={false}
                className={styles.modal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Agendar Horário</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Calendar props={barberSelected} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleOffModalCalendar}>
                        Close
                    </Button>
                    <Button variant="primary">Understood</Button>
                </Modal.Footer>
            </Modal>
        )
    }


    return (
        <div className={styles.container}>
            <i className="fas fa-angle-left" style={{ fontSize: "24px", marginRight: "10px", cursor: "pointer" }} onClick={goToPrev}></i>
            <div className={styles["slider-wrapper"]}>
                <Slider  {...settings} ref={sliderRef} className={styles.slider}>
                    {barbers.map(barber => (
                        <div key={barber._id}>
                            <div className={styles.card} >
                                <img src="https://img.freepik.com/fotos-gratis/homem-em-um-salao-de-barbearia-fazendo-o-corte-de-cabelo-e-barba_1303-20953.jpg?w=360&t=st=1709679884~exp=1709680484~hmac=27bd2cccd750b63adca8a10c57f64c6e68786568949fafb668bdff8c7971efdd"></img>
                                <h3>{barber.barbershop.name}</h3>
                                <div className={styles.fa5}>
                                    {!barbershopFav ? <i onClick={() => handleFavoriteBarbershop(barber._id)} className="fa-regular fa-heart"></i> : <i onClick={() => offBarbershopFav()} className="fa-solid fa-heart"></i>}
                                    <i className="far fa-calendar" onClick={() => handleDoubleObjectiveCalendar(barber)}></i>
                                    <i className="fa-solid fa-paper-plane" onClick={() => handleWaze(barber)} />

                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>

            </div>
            <i className="fas fa-angle-right" style={{ fontSize: "24px", marginLeft: "10px", cursor: "pointer" }} onClick={goToNext}></i>

            {showModalCalendar && renderModal()}
        </div>
    );
}

export default Home;
