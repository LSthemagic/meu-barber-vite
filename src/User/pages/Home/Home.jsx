import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button, Modal } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import Toast from "../../../shared/custom/Toast";
import axios from "axios";
import Calendar from "../../pages/Schedule/Calendar";
import styles from "./Home.module.css";
import LandingPage from "../../../shared/pages/landingPage";
import ImagemFormatada from "../../../shared/layout/imgPatterns/ImagemFormatted";

const Home = () => {
	const [barbers, setBarbers] = useState([]);
	const [showModalCalendar, setShowModalCalenadar] = useState(false);
	const [barberSelected, setBarberSelected] = useState({});
	const [barbershopFav, setBarbershopFav] = useState(false);
	const [dbBarberFav, setDbBarberFav] = useState([]);
	const sliderRef = useRef(null);
	const auth = useAuth();
	if (!auth || !auth.data || !auth.data.email) return <LandingPage />;

	const { data: { email } } = auth;

	const onBarbershopFav = () => setBarbershopFav(true);

	const handleOpenModalCalendar = () => setShowModalCalenadar(true);
	const handleOffModalCalendar = () => setShowModalCalenadar(false);

	useEffect(() => {
		const fetchBarbers = async () => {
			try {
				const response = await axios.get(
					"http://localhost:3001/dataBarber/barbers",
					{
						headers: {
							"Content-Type": "application/json"
						}
					}
				);
				setBarbers(response.data);
			} catch (err) {
				console.error("Error getBarbers", err.response);
			}
		};

		fetchBarbers();
	}, []);

	useEffect(() => {
		handleGetFavBarbershop()
	}, [barbershopFav])


	const settings = {
		dots: true,
		infinite: true,
		speed: 2000,
		slidesToShow: 3,
		slidesToScroll: 3,
		autoplay: true,
		autoplaySpeed: 5000,
		color: "#333",
		responsive: [
		  {
			breakpoint: 768,
			settings: {
			  slidesToShow: 1, // Exibe dois slides por vez em telas menores que 768px
			  slidesToScroll: 1,
			  speed: 1500,
			},
		  },
		],
	  };

	const handleDoubleObjectiveCalendar = (data) => {
		handleOpenModalCalendar();
		setBarberSelected(data);
	};

	const handleWaze = (data) => {
		const {
			barbershop: {
				location: { latitude, longitude }
			}
		} = data;

		window.open(`https://www.waze.com/location?ll=${latitude},${longitude}`);
	};

	const handleFavoriteBarbershop = async (id) => {
		try {
			const response = await fetch(
				"http://localhost:3001/auth/userBarbershopFav",
				{
					method: "POST",
					headers: {
						"Content-type": "application/json"
					},
					body: JSON.stringify({
						id: id,
						email: email ? email : null
					})
				}
			);
			if (!response.ok) {
				throw new Error("Failed to fetch");
			}
			const data = await response.json();
			if (data.error) {
				Toast.fire({
					icon: "error",
					text: data.message
				});
			} else {
				onBarbershopFav();
				handleGetFavBarbershop()
			}
		} catch (error) {
			console.log("error favBarber: " + error.message);
		}
	};

	const handleGetFavBarbershop = async () => {
		try {
			const response = await axios.get("http://localhost:3001/dataUser/getFav",
				{
					headers: {
						email: email ? email : null
					}
				}
			)
			setDbBarberFav(response.data);
		} catch (error) {
			console.error("Erro ao obter favoritos da barbearia", error);
		}
	};



	const renderModal = () => {
		if (!barberSelected) return null;
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
		);
	};


	return (
		<div className={styles.container}>
		  <div className={styles["slider-wrapper"]}>
			<Slider {...settings} className={styles.slider}>
			  {barbers.map((barber) => (
				<div key={barber._id}>
				  <div className={styles.card}>
					<ImagemFormatada src={"../../../../public/section_img5.jpg"} />
					<h3 className={styles.barberNome}>{barber.barbershop.name}</h3>
					<div className={styles.fa5}>
					  {dbBarberFav && dbBarberFav.IDs && dbBarberFav.IDs.includes(barber._id) ? (
						<i
						  key={barber._id}
						  onClick={() => handleFavoriteBarbershop(barber._id)}
						  className="fa-solid fa-heart"
						></i>
					  ) : (
						<i
						  key={barber._id}
						  onClick={() => handleFavoriteBarbershop(barber._id)}
						  className="fa-regular fa-heart"
						></i>
					  )}
	
					  <i
						className="far fa-calendar"
						onClick={() => handleDoubleObjectiveCalendar(barber)}
					  ></i>
					   <i className="fa fa-user" aria-hidden="true"
						onClick={() => handleWaze(barber)}
					  />
					  <i
						className="fa-solid fa-paper-plane"
						onClick={() => handleWaze(barber)}
					  />
					  
					</div>
					<p className={styles.descricao}>
					  Lorem ipsum, dolor sit amet consectetur sasadv
					  fsdfffffffffffffff
					  dsf
					  dsfdfsffsfd
					  dsfds
					</p>
				  </div>
				</div>
			  ))}
			</Slider>
		  </div>
		  {showModalCalendar && renderModal()}
		  {!email && <LandingPage></LandingPage>}
		</div>
	  );
};

export default Home;
