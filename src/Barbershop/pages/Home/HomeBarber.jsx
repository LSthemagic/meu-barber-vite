import { useEffect, useState, useMemo } from "react";
import ApexChart from "react-apexcharts";
import { useAuth } from "../../context/BarberContext";
import path_url from "../../../shared/config/path_url.json";
import Toast from "../../../shared/custom/Toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

const HomeBarber = () => {

	const [loading, setLoading] = useState(false);
	const [barbershop, setBarbershop] = useState(null);
	const [servicePrices, setServicePrices] = useState({});
	const { dataBarber: { _id }, token, signOut, offAuthToken } = useAuth();
	const navigate = useNavigate();
	const LAST_RESET_TIMESTAMP_KEY = 'lastResetTimestamp'; // Chave para armazenar o timestamp do último reset
	const RESET_INTERVAL_DAYS = 7; // Intervalo de dias para resetar os lucros

	// Busca dados da barbearia ao montar o componente
	useEffect(() => {
		handleDataBarbershop();
	}, []);

	useEffect(() => {
		if (barbershop) { // Quando os dados da barbearia são carregados
			checkAndResetProfit(); // Verifica e reseta os lucros se necessário
			fetchServicePrices(); // Busca os preços dos serviços
		}
	}, [barbershop]);

	const handleDataBarbershop = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				`${path_url.remote}/dataBarber/profileBarber`,
				{
					headers: {
						id: _id,
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.data.error) {
				Toast.fire({
					icon: "error",
					title: response.data.message,
				});
			}
			setBarbershop(response.data);
		} catch (err) {
			console.log(err);
			if (err.response?.data?.error) { // Tratamento de erro específico de autenticação
				Toast.fire({
					icon: "info",
					title: err.response.data.message,
				});
				offAuthToken();
				signOut();
				navigate("/barber/authenticateBarber");
			} else { // Tratamento de erro genérico
				Toast.fire({
					icon: "error",
					title: "Erro ao buscar dados.",
				});
			}
		} finally {
			setLoading(false);
		}
	};

	const fetchServicePrices = async () => {
		setLoading(true);
		try {
			const prices = await Promise.all(
				barbershop.barbers.map(async barber => {
					const barberPrices = await Promise.all(
						barber.unavailableDate.map(async item => {
							const response = await axios.get(`${path_url.remote}/dataBarber/services`, {
								headers: {
									Authorization: `Bearer ${token}`,
									service_id: item.service_id,
									_id,
								},
							});
							if (response.data.error) {
								Toast.fire({
									icon: 'error',
									title: response.data.message,
								});
								return 0; // Retorna 0 em caso de erro
							}
							return response.data;
						})
					);
					const prices = barberPrices
						.filter(priceData => priceData !== 0) // Filtra as respostas com erro
						.map(priceData => parseFloat(priceData.map(item => item.price.split(' ')[1]?.replace(',', '.'))));

					return {
						barberId: barber._id,
						barberName: barber.name,
						totalPrice: prices.reduce((sum, price) => sum + price, 0) // Soma os preços dos serviços
					};
				})
			);
			const pricesByBarber = prices.reduce((acc, barber) => {
				acc[barber.barberName] = barber.totalPrice;
				return acc;
			}, {});

			setServicePrices(pricesByBarber); // Atualiza o estado com os preços dos serviços
		} catch (e) {
			console.log(e);
			Toast.fire({
				icon: "error",
				title: "Erro ao buscar o preço do serviço",
			});
		} finally {
			setLoading(false);
		}
	};

	const checkAndResetProfit = () => {
		const lastResetTimestamp = localStorage.getItem(LAST_RESET_TIMESTAMP_KEY);
		const now = Date.now(); // Obtém o timestamp atual

		if (!lastResetTimestamp || hasSevenDaysPassed(lastResetTimestamp, now)) {
			resetProfit(); // Reseta os lucros se passaram 7 dias ou não houver timestamp
		}
	};

	const hasSevenDaysPassed = (lastResetTimestamp, now) => {
		const lastResetDate = new Date(parseInt(lastResetTimestamp, 10)); // Converte o timestamp para data
		const diffTime = Math.abs(now - lastResetDate.getTime()); // Calcula a diferença de tempo
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Converte a diferença de tempo em dias
		return diffDays >= RESET_INTERVAL_DAYS; // Verifica se passaram 7 dias
	};

	const resetProfit = () => {
		const resetPrices = barbershop.barbers.reduce((acc, barber) => {
			acc[barber.name] = 0;
			return acc;
		}, {});
		setServicePrices(resetPrices); // Reseta os preços dos serviços
		localStorage.setItem(LAST_RESET_TIMESTAMP_KEY, Date.now().toString()); // Atualiza o timestamp do último reset
	};

	const optionsApexCharts = useMemo(() => ({
		chart: {
			id: "basic-bar"
		},
		xaxis: {
			categories: barbershop?.barbers.map((item) => item.name) || []
		},
		series: [
			{
				name: "Quantidade de clientes",
				data: barbershop?.barbers.map((barber) => barber.unavailableDate.length) || []
			}
		]
	}), [barbershop]);

	const optionsPie = useMemo(() => {
		const serviceCount = {};
		barbershop?.barbers.forEach(barber => {
			barber.unavailableDate.forEach(date => {
				const serviceId = date.service_id;
				if (serviceCount[serviceId]) {
					serviceCount[serviceId]++;

				} else {
					serviceCount[serviceId] = 1;
				}
			});
		});


		const labels = [];
		const data = [];

		barbershop?.services.forEach(service => {
			const serviceId = service._id;
			if (serviceCount[serviceId]) {
				labels.push(service.nameService);
				data.push(serviceCount[serviceId]);
			}
		});

		return {
			series: data,
			labels: labels
		};
	}, [barbershop]);

	const optionsDate = useMemo(() => {
		const categories = barbershop?.barbers.map((item) => item.name) || [];
		const data = categories.map(name => servicePrices[name] || 0);

		return {
			chart: {
				id: "basic-bar"
			},
			xaxis: {
				categories
			},
			series: [
				{
					name: "Lucro total gerado",
					data
				}
			],
		};
	}, [barbershop, servicePrices]);


	return (
		<div className="container mx-auto p-4 text-black">
			{loading ? <Spinner className="text-white" /> : (
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<div className="flex flex-col items-center">
						<h1 className="text-white mb-4">Serviços mais populares</h1>
						<ApexChart
							options={optionsPie}
							series={optionsPie.series}
							type="pie"
							className="w-full h-64"
						/>
					</div>
					
					<div className="flex flex-col items-center">
						<h1 className="text-white mb-4">Diferentes clientes</h1>
						<ApexChart
							options={optionsApexCharts}
							series={optionsApexCharts.series}
							type="line"
							className="w-full h-64"
						/>
					</div>

					<div className="flex flex-col items-center">
						<h1 className="text-white mb-4">Lucro semanal gerado pelos barbeiros</h1>
						<ApexChart
							options={optionsDate}
							series={optionsDate.series}
							type="bar"
							className="w-full h-64"
						/>
					</div>


				</div>
			)}
		</div>
	);
};

export default HomeBarber;
