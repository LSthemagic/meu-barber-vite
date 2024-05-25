import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button, Modal, Spinner } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import Toast from "../../../shared/custom/Toast";
import axios from "axios";
import Calendar from "../../pages/Schedule/Calendar";
import styles from "./Home.module.css";
import LandingPage from "../../../shared/pages/landingPage";
import ImagemFormatted from "../../../shared/layout/imgPatterns/ImagemFormatted";
import Swal from "sweetalert2";
import path_url from "../../../shared/config/path_url.json"
import { BeatLoader, PuffLoader } from "react-spinners";
import imagemDefault from "../../../shared/images/imageDefault.jpg"
const Home = () => {
	const [barbers, setBarbers] = useState([]);
	const [showModalCalendar, setShowModalCalendar] = useState(false);
	const [barbershopSelected, setBarbershopSelected] = useState({});
	const [serviceSelected, setServiceSelected] = useState(null);
	const [barbershopFav, setBarbershopFav] = useState(false);
	const [dbBarberFav, setDbBarberFav] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

	const auth = useAuth();

	if (!auth.isLogged) {
		return <LandingPage />;
	}

	const { data: { email }, showBarbershopFavorites } = auth;

	const onBarbershopFav = () => setBarbershopFav(true);

	const handleOpenModalCalendar = () => setShowModalCalendar(true);
	const handleOffModalCalendar = () => setShowModalCalendar(false);

	useEffect(() => {
		const fetchBarbers = async () => {
			setIsLoading(true)
			try {
				const response = await axios.get(
					`${path_url.remote}/dataBarber/barbers`,
					{
						headers: {
							"Content-Type": "application/json"
						}
					}
				);
				setBarbers(response.data);
			} catch (err) {
				console.error("Error getBarbers", err.response);
			} finally {
				setIsLoading(false)
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
		// handleOpenModalCalendar();
		handleOptionsBarbers(data);

		setBarbershopSelected(data);
	};

	const handleWaze = (data) => {
		const { location: { latitude, longitude } } = data;

		window.open(`https://www.waze.com/location?ll=${latitude},${longitude}`);
	};

	const handleFavoriteBarbershop = async (id) => {
		setIsLoadingFavorite(true)
		try {
			console.log(id)
			const response = await fetch(
				`${path_url.remote}/auth/userBarbershopFav`,
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
		} finally {
			setIsLoadingFavorite(false)
		}
	};

	const handleGetFavBarbershop = async () => {
		setIsLoading(true)
		try {
			const response = await axios.get(`${path_url.remote}/dataUser/getFav`,
				{
					headers: {
						email: email ? email : null
					}
				}
			)
			setDbBarberFav(response.data);
		} catch (error) {
			console.error("Erro ao obter favoritos da barbearia", error);
		} finally {
			setIsLoading(false)
		}
	};

	const renderModal = () => {
		if (!barbershopSelected) return null;
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
					<Modal.Title className="text-black">Agendar Horário</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Calendar props={barbershopSelected} children={serviceSelected} />
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleOffModalCalendar}>
						Fechar
					</Button>
					{/* <Button variant="primary">Understood</Button> */}
				</Modal.Footer>
			</Modal>
		);
	};

	const handleOptionsBarbers = async (data) => {
		// Verifica se há barbeiros disponíveis
		const barbers = data?.barbers?.map((item) => ({
			email: item.email,
			name: `${item.name}`
		}));

		if (!barbers || barbers.length === 0) {
			// Exibir mensagem ou lidar com o caso em que não há barbeiros disponíveis
			Toast.fire({
				icon: 'info',
				title: `${data?.name} não tem barbeiros disponíveis no momento.`
			});
			return;
		}

		try {
			const { value: barber } = await Swal.fire({
				title: "Agendar com Meu Barber",
				input: "select",
				inputOptions: barbers?.reduce((obj, item) => {
					obj[item.email] = item.name;
					return obj;
				}, {}),
				inputPlaceholder: "Selecionar barbeiro",
				showCancelButton: true,
				inputValidator: (value) => {
					return new Promise((resolve) => {
						if (value) {
							resolve();
						} else {
							resolve("Selecione um barbeiro");
						}
					});
				}
			});

			if (barber) {
				const selectedBarber = barbers?.find(barberItem => barberItem.email === barber);
				// console.log(selectedBarber);
				// Swal.fire(`You selected: ${selectedBarber.label}`);


				setBarbershopSelected(selectedBarber)
				Swal.close();
				handleServices(data);
			}
		} catch (e) {
			console.log(`Error from handleOptionsBarbers: ${e}`);
			Toast.fire({
				icon: 'error',
				title: "Erro ao selecionar barbeiro. Tente novamente mais tarde!"
			})
		}
	}

	const handleServices = async (data) => {
		const services = data.services?.map((item) => ({
			name: item.nameService,
			label: `${item.nameService} - ${item.price}`,
			price: item.price,
			duration: item.duration,
			service_id: item._id,
		}));

		if (!services || services.length === 0) {
			// Exibir mensagem ou lidar com o caso em que não há serviços disponíveis
			Toast.fire({
				icon: 'info',
				title: `${data?.name} não tem serviços disponíveis no momento.`
			});
			return;
		}

		try {
			const { value: service } = await Swal.fire({
				title: "Agendar com Meu Barber",
				input: "select",
				inputOptions: services?.reduce((obj, item) => {

					obj[item.name] = item.label; // Alterei aqui para usar o nome como chave e o rótulo como valor
					return obj;
				}, {}),
				inputPlaceholder: "Selecionar o serviço",
				showCancelButton: true,
				inputValidator: (value) => {
					return new Promise((resolve) => {
						if (value) {
							resolve();
						} else {
							resolve("Selecione um serviço");
						}
					});
				}
			});

			if (service) {
				// Agora você pode encontrar o serviço selecionado usando o nome do serviço
				const selectedService = services.find(item => item.name === service);

				setServiceSelected(selectedService)
				Swal.close();
				handleOpenModalCalendar()
			}
		} catch (e) {
			console.log("Erro ao lidar com os serviços", e);
			Toast.fire({
				icon: 'error',
				title: "Erro ao buscar serviços oferecidos."
			});
		}
	}

	const renderHearthFavorites = (barber) => {
		return (
			<div>
				{isLoadingFavorite ? <BeatLoader size={3} /> : (
					<div>
						{dbBarberFav && dbBarberFav.IDs && dbBarberFav?.IDs?.includes(barber._id) ? (
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
						)
						}
					</div>
				)}
			</div>
		)
	}

	const filteredBarbers = showBarbershopFavorites ? barbers.filter((barber) => dbBarberFav?.IDs?.includes(barber._id)) : barbers;


	return (
		<div className={styles.container}>
			<div className={styles["slider-wrapper"]}>
				{isLoading && <PuffLoader className={styles.spinner} />}
				<Slider {...settings} className={styles.slider}>

					{!isLoading && filteredBarbers?.map((barber) => (
						<div key={barber._id}>
							<div className={styles.card}>
							<ImagemFormatted src={barber.picture[0]?.src ? `${path_url.remote}/picture/${barber.picture[0]?.src}` : imagemDefault} />
								<h3 className={styles.barberNome}>{barber?.name}</h3>
								<div className={styles.fa5}>

									{renderHearthFavorites(barber)}

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
