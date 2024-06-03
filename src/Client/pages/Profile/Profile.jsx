import axios from "axios";
import { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import path_url from "../../../shared/config/path_url.json";
import Toast from "../../../shared/custom/Toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isFlipped, setIsFlipped] = useState(false);
    const { data: dataUser, logout, offDataAuth } = useAuth();
    const navigate = useNavigate()
    useEffect(() => {
        handleGetDataUser();
    }, []);

    const handleGetDataUser = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${path_url.remote}/dataUser/getUser`, {
                headers: {
                    "Content-Type": "application/json",
                    id: dataUser._id,
                    // authenticate via authorization
                    "Authorization": `Bearer ${dataUser.token}`
                },
            });

            if (response.data.error) {
                Toast.fire({
                    icon: "error",
                    title: response.data.message,
                });
            } else {
                setUser(response.data);
                setName(response.data.name);
                setEmail(response.data.email);
            }
        } catch (e) {
            console.error(e);
            if (e.response.data.error) {
                Toast.fire({
                    icon: "info",
                    title: e.response.data.message,
                });
                logout()
                offDataAuth()
                navigate("/authenticate")
            } else {
                Toast.fire({
                    icon: "error",
                    title: "Erro ao buscar dados.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await axios.put(`${path_url.remote}/updateUser/updateProfileClient`, {
                id: dataUser._id,
                name,
                email,
            });

            if (response.data.error) {
                Toast.fire({
                    icon: "error",
                    title: response.data.message,
                });
            } else {
                setUser(response.data);
                setEditing(false);
                Toast.fire({
                    icon: "success",
                    title: "Perfil atualizado com sucesso!",
                });
                handleGetDataUser()
            }
        } catch (error) {
            console.error(error);
            Toast.fire({
                icon: "error",
                title: "Erro ao atualizar perfil.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            const response = await axios.delete(`${path_url.remote}/deleteAccount/delClient`, {
                headers: {
                    "Content-Type": "application/json",
                    id: dataUser._id,
                },
            },
            );

            if (response.data.error) {
                Toast.fire({
                    icon: "error",
                    title: response.data.message,
                });
            } else {
                Toast.fire({
                    icon: "success",
                    title: "Conta deletada com sucesso!",
                });
                logout(); // Log the user out after deleting the account
            }
        } catch (error) {
            console.error(error);
            Toast.fire({
                icon: "error",
                title: "Erro ao deletar conta.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
            {loading ? (
                <div className="text-2xl">Loading...</div>
            ) : (
                <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
                    <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md" key="front">
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-bold mb-2">Meu perfil</h1>
                            {user && (
                                <>
                                    <div className="flex justify-center gap-2 flex-col mb-2">
                                        <div className="flex flex-col justify-start items-start 
                                        text-center">
                                            <p className="text-xl mb-2"><span className="font-semibold">Nome:</span> {user.name}</p>
                                            <p className="text-xl mb-2"><span className="font-semibold">Email:</span> {user.email}</p>
                                            <p className="text-xl mb-4"><span className="font-semibold">Criado em:</span> {new Date(user.createAt).toLocaleDateString()}</p>
                                        </div>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
                                            onClick={() => {
                                                setEditing(true);
                                                handleFlip();
                                            }}
                                        >
                                            Editar Perfil
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={handleDeleteAccount}
                                        >
                                            Deletar Conta
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md" key="back">
                        <div className="text-center mb-6 flex-col">
                            <h1 className="text-3xl font-bold mb-2">Editar perfil</h1>
                            {editing && (
                                <>
                                    <div className="flex flex-col items-center gap-2 justify-center">
                                        <form onSubmit={handleUpdateProfile}>
                                            <input
                                                type="text"
                                                className="bg-gray-700 p-2 rounded-lg mb-2 w-full"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                            <input
                                                type="email"
                                                className="bg-gray-700 p-2 rounded-lg mb-2 w-full"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <div className="flex flex-col gap-1 mt-2">
                                                <button
                                                    type="submit"
                                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2"
                                                    onClick={() => {
                                                        handleFlip();
                                                    }}
                                                >
                                                    Salvar
                                                </button>
                                                <button
                                                    type="button"
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                    onClick={() => {
                                                        setEditing(false);
                                                        handleFlip();
                                                    }}
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                </>
                            )}
                        </div>
                    </div>
                </ReactCardFlip>
            )}
        </div>
    );
};

export default Profile;
