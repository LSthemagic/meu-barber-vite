import axios from "axios";
import Toast from "../../../shared/custom/Toast";
import { useAuth } from "../../context/BarberContext";
import { useEffect, useState } from "react";
import LandingPage from "../../../shared/pages/landingPage";
import styles from "./Profile.module.css";

const Profile = () => {
    const [barber, setBarber] = useState([]);
    const auth = useAuth();

    if (!auth) {
        Toast.fire({
            icon: "info",
            title: "Por favor, faça o login para continuar!",
        });
        return <LandingPage />;
    }

    const { dataBarber: { email }, token } = auth;

    useEffect(() => {
        handleDataBarber();
    }, []);

    const handleDataBarber = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3001/dataBarber/profileBarber",
                {
                    headers: {
                        email: email,
                    },
                }
            );

            if (response.error) {
                Toast.fire({
                    icon: "error",
                    text: "esse aq",
                });
            }
            console.log(response.data);
            setBarber(response.data);
        } catch (err) {
            console.log(err);
            Toast.fire({
                icon: "error",
                title: err.message,
            });
        }
    };

    
      
    return (
        <div className={styles.container}>
            <div className={styles.card1}>
                <h2 style={{textAlign:"center",marginBottom:"3%"}}>{"Perfil do Barbeiro".toUpperCase()}</h2>
                
                <div className={styles.cardContent}>
                    <div className={styles.textWrapper}>
                        <h1>{barber.name?.toUpperCase()}</h1>
                        <h5>{barber.email}</h5>
                    </div>
                </div>
            </div>
            <div className={styles.card2}>
                <h1 className={styles.title}>{barber.barbershop?.name}</h1>
                
            </div>
        </div>
    );
};

export default Profile;
