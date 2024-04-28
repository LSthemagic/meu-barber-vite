import { Route, Routes } from "react-router-dom";
import HomeBarber from "../pages/Home/HomeBarber";
import RegisterBarber from "../pages/registerBarber/RegisterBarber";
import AuthenticateBarber from "../pages/authenticateBarber/AuthenticateBarber";
import PageNotFound from "../../shared/pages/PageNotFound";
import Profile from "../pages/profile/Profile";
import CalendarBarber from "../pages/calendar/CalendarBarber"
import { PrivateRoutes } from "./privateRoutes";


const BarberRoutes = () => {
	return (
		<>
			<Routes>
				<Route path="/registerBarber" element={<RegisterBarber />} />
				<Route path="/authenticateBarber" element={<AuthenticateBarber />} />
				<Route path="/homeBarber" element={<HomeBarber />} />
				<Route path="/profileBarber" element={<PrivateRoutes><Profile /></PrivateRoutes>} />
				<Route path="/calendarBarber" element={<PrivateRoutes><CalendarBarber /></PrivateRoutes>} />
				<Route path="*" element={<PageNotFound />} />
			</Routes>
		</>
	);
};

export default BarberRoutes;
