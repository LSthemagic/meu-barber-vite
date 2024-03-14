import axios from "axios";
import Toast from "../../../shared/custom/Toast";
import { useAuth } from "../../context/BarberContext";
import { useEffect, useState } from "react";
import LandingPage from "../../../shared/pages/landingPage";
import styles from "./Profile.module.css"

const Profile = () => {
    const [barber, setBarber] = useState([])
    const auth = useAuth()
    if (!auth) {
        Toast.fire({
            icon: "info",
            title: "Por favor, faça o login para continuar!"
        })
        return <LandingPage />
    };

    const { dataBarber: { email }, token } = auth;



    useEffect(() => {

        handleDataBarber()
    }, [])

    const handleDataBarber = async () => {
        try {
            // console.log(email);
            const response = axios.get("http://localhost:3001/dataBarber/profileBarber",
                {
                    headers: {
                        email: email
                    }
                })

            if (response.error) {
                Toast.fire({
                    icon: "error",
                    text: "esse aq"
                });
            }

            setBarber((await response).data);
            console.log((await response).data);
        } catch (err) {
            console.log(err);
            Toast.fire({
                icon: "error",
                title: err.message
            })
        }
    }
    return (
        <div className={styles.container}>
        <div className={styles.card1}>
            <span className={styles.spanCustom}>
                <i className="fa fa-user" style={{ alignItems: 'center', display: "flex" }} ></i>
                <h1>{barber.name}</h1>
            </span>
            
            <span className={styles.spanCustom}>
                <i className="fa fa-user" style={{ alignItems: 'center', display: "flex" }} ></i>
                <h1>{barber.name}</h1>
            </span>
        </div>
        <div className={styles.card2}>
            <h1>{barber.barbershop?.name}</h1>
            <img className={styles.imgProfile} src="../../../../public/section_img1.jpg"></img>
        </div>
    </div>
    
    )
}
export default Profile;