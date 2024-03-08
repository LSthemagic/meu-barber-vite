import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Navbar from "../../shared/layout/navbar/Navbar";
import UserList from "../pages/UserList";
import Register from "../pages/register/Register";
import Authenticate from "../pages/Authenticate/Authenticate";
import Footer from "../../shared/layout/footer/Footer";
import Calendar from "../../Barber/pages/Schedule/Calendar";
import BarberRoutes from "../../Barber/routes/routes";
import PageNotFound from "../../shared/pages/PageNotFound";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/UserList" element={<UserList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path="/barber/*" element={<BarberRoutes />} />
        <Route path="*"  element={<PageNotFound/>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default AppRoutes;
