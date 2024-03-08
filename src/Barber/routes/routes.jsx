import { Route, Routes } from "react-router-dom";
import HomeBarber from "../pages/Home/HomeBarber";
import RegisterBarber from "../pages/registerBarber/RegisterBarber";
import AuthenticateBarber from "../pages/authenticateBarber/AuthenticateBarber";
import PageNotFound from "../../shared/pages/PageNotFound";

const BarberRoutes = () => {
	return (
		<>
			<Routes>
				<Route path="/barber-home" element={<HomeBarber />} />
				<Route path="/registerBarber" element={<RegisterBarber />} />
				<Route path="/authenticateBarber" element={<AuthenticateBarber />} />

				<Route path="*" element={<PageNotFound />} />
			</Routes>
		</>
	);
};

export default BarberRoutes;
