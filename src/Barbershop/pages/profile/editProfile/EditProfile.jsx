import { Button as ButtonBs, Card, Form, Spinner } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import imageDefault from "../../../../shared/images/imageDefault.jpg";
import path_url from "../../../../shared/config/path_url.json"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../@/components/ui/tabs"
import {
    Card as CardShadCn,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../../../../@/components/ui/card"
import { Input } from "../../../../../@/components/ui/input"
import { Label } from "../../../../../@/components/ui/label"
import styles from "./EditProfile.module.css"
import { SquarePen } from "lucide-react";
import Toast from "../../../../shared/custom/Toast";
import axios from "axios";


const EditProfile = ({ props }) => {
    const [imagemForDB, setImagemForDB] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingGet, setLoadingGet] = useState(false);
    const [source, setSource] = useState(null)
    const [nameSource, setNameSource] = useState(null)
    const fileInputRef = useRef(null);
    const barbershop = (props);

    useEffect(() => {
        handleGetImages()
    }, [imagemForDB])

    const imageResponse = `${path_url.remote}/picture\\${source}`
    console.log(imageResponse)
    const image = source != null ? imageResponse : imageDefault;

    const typeImages = {
        "image/jpeg": "image/jpeg",
        "image/png": "image/png",
        "image/jpg": "image/jpg"
    }
    const handleCardClick = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        console.log(selectedFile)
        if (!typeImages[selectedFile.type]) {
            Toast.fire({
                icon: 'error',
                title: 'Formato de imagem não suportado.'
            });
        } else {
            setImagemForDB(selectedFile);
            Toast.fire({
                icon: 'info',
                title: 'Imagem selecionada com sucesso. Para fazer alteração, basta salvar.'
            })
        }
    };

    const responseDBImage = (response) => {
        const res = {
            icon: null,
            message: null
        };

        if (response.data.error) {
            res.icon = 'error'
            res.message = response.data.message
        }
        else {
            res.icon = 'success'
            res.message = "Dados alterados com sucesso."
        }
        handleGetImages()
        Toast.fire({
            icon: res.icon,
            title: res.message
        })
    }

    const handleUpdateFile = async () => {
        // event.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", imagemForDB);
            formData.append("ID", barbershop._id);
            const response = await axios.put(`${path_url.remote}/imageController/putPictureBarbershop`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            responseDBImage(response)

        } catch (e) {
            console.log(e);
            Toast.fire({
                icon: 'error',
                title: 'Erro ao enviar imagem.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFirsFile = async () => {
        // event.preventDefault();
        try {
            const name = imagemForDB.name.split('.')
            const formData = new FormData();
            formData.append("id", barbershop._id)
            formData.append("file", imagemForDB);
            formData.append("name", name[0]);
            const response = await axios.post(`${path_url.remote}/barberAuth/uploadImage`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            responseDBImage(response)
        } catch (error) {
            console.log(error)
            Toast.fire({
                icon: 'error',
                title: 'Erro ao enviar imagem.'
            })
        }

    }

    const handleGetImages = async () => {
        setLoadingGet(true);
        try {
            const response = await axios.get(`${path_url.remote}/imageController/pictureBarbershop`, {
                headers: {
                    ID: barbershop._id,
                }
            })
            // console.log(response.data.length)
            if (response.data?.length > 0) {
                setSource(response.data[0]?.src)
                setNameSource(response.data[0].name)
            }

        } catch (error) {
            console.log("get image error", error)
            Toast.fire({
                icon: 'error',
                title: 'Erro ao buscar imagem.'
            })
        } finally {
            setLoadingGet(false);
        }
    }

    const whatHandleImage = (event) => {
        event.preventDefault()
        return barbershop.picture?.length > 0 ? handleUpdateFile() : handleFirsFile()
    }

    const cardImage = () => {
        return (
            <>
                <div onClick={handleCardClick} className={styles.cardImage}>
                    <Card.Img className={styles.image} style={{ cursor: "pointer" }} variant="top" src={image} />
                    <input
                        ref={fileInputRef}
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        accept="image/*" />
                    <div className={styles.footerImage}>
                        <Card.Title style={{ fontSize: "15px" }}>{nameSource ? nameSource : "Imagem Padrão"}</Card.Title>
                        <SquarePen style={{ width: "20px" }} />
                    </div>
                </div><Card.Body>
                    <Card.Text>
                        Essa imagem aparecerá
                        para seus clientes.
                        <br />
                    </Card.Text>
                    <ButtonBs onClick={whatHandleImage} className="mt-2 w-full bg-black border-black" variant="primary">{loading ? <Spinner /> : "Salvar"}</ButtonBs>
                </Card.Body>
            </>

        )
    }

 

    return (
        <div className={styles.container}>
            <div>
                <div className="profile-pic">
                    <Card className={styles.card} style={{ width: '18rem' }}>
                        {loadingGet ? <Spinner style={{ display: "flex", justifyContent: "center", marginLeft: "auto", marginRight: "auto" }} /> : cardImage()}
                    </Card>
                </div>
            </div>

            <div className={styles.tabsContainer}>
                <Tabs defaultValue="account" className="w-[350px] text-white" >
                    <TabsList className="grid w-full grid-cols-2 bg-easy-black rounded mt-1 ">
                        <TabsTrigger className="focus:bg-black rounded" value="account">Conta</TabsTrigger>
                        <TabsTrigger className="focus:bg-black rounded" value="password">Senha</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        <CardShadCn className="bg-easy-black text-white p-3">
                            <CardHeader>
                                <CardTitle>Conta</CardTitle>
                                <CardDescription>
                                    Faça alterações em sua conta aqui. Clique em salvar quando estiver pronto.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="name">Nome</Label>
                                    <Input id="name" defaultValue={barbershop?.name} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="username">Email</Label>
                                    <Input id="username" defaultValue={barbershop?.email} />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <ButtonBs className="mt-3 w-full bg-black border-black">Salvar Alterações</ButtonBs>
                            </CardFooter>
                        </CardShadCn>
                    </TabsContent>
                    <TabsContent value="password">
                        <CardShadCn className="bg-easy-black text-white p-3">
                            <CardHeader>
                                <CardTitle>Senha</CardTitle>
                                <CardDescription>
                                    Altere sua senha aqui. Após salvar, você será deslogado.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 rounded">
                                <div className="space-y-1">
                                    <Label htmlFor="current">Senha atual</Label>
                                    <Input id="current" type="password" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">Nova senha</Label>
                                    <Input id="new" type="password" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <ButtonBs className="mt-3 w-full bg-black border-black" >Salvar senha</ButtonBs>
                            </CardFooter>
                        </CardShadCn>
                    </TabsContent>
                </Tabs>
            </div>

        </div>
    )
}

export default EditProfile;