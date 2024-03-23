import { Route, Routes } from "react-router-dom";
import HomeBarber from "../pages/Home/HomeBarber";
import RegisterBarber from "../pages/registerBarber/RegisterBarber";
import AuthenticateBarber from "../pages/authenticateBarber/AuthenticateBarber";
import PageNotFound from "../../shared/pages/PageNotFound";
import Profile from "../pages/profile/Profile";
import CalendarBarber from "../pages/calendar/CalendarBarber"

const BarberRoutes = () => {
	return (
		<>
			<Routes>
				<Route path="/barber-home" element={<HomeBarber />} />
				<Route path="/registerBarber" element={<RegisterBarber />} />
				<Route path="/authenticateBarber" element={<AuthenticateBarber />} />
				<Route path="/profileBarber" element={<Profile />} />
				<Route path="/calendarBarber" element={<CalendarBarber />} />
				<Route path="*" element={<PageNotFound />} />
			</Routes>
		</>
	);
};

export default BarberRoutes;
