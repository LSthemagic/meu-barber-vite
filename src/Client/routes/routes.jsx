import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Navbar from "../../shared/layout/navbar/Navbar";
import UserList from "../pages/UserList";
import Register from "../pages/register/Register";
import Authenticate from "../pages/Authenticate/Authenticate";
import Footer from "../../shared/layout/footer/Footer";
import BarberRoutes from "../../Barbershop/routes/routes";
import PageNotFound from "../../shared/pages/PageNotFound";
import { PrivateRoutes } from "../../shared/routes/PrivateRoutes";
import LandingPage from "../../shared/pages/landingPage";
import Profile from "../pages/Profile/Profile";


const AppRoutes = () => {

	return (
		<BrowserRouter>
			<Navbar />
			<Routes>
				
				<Route path="/" element={<LandingPage />} />
				<Route path="/register" element={<Register />} />
				<Route path="/authenticate" element={<Authenticate />} />
				<Route path="/profile" element={
					<PrivateRoutes><Profile/></PrivateRoutes>
				}></Route>

				<Route path="/home" element={
					<PrivateRoutes>
						<Home />
					</PrivateRoutes>}
				/>


				<Route path="/UserList" element={
					<UserList /> }
				/>


				<Route path="/barber/*" element={<BarberRoutes />} />

				<Route path="*" element={<PageNotFound />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	);
};

export default AppRoutes;
