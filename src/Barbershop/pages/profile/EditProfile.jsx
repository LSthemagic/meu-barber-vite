import { Button as ButtonBs, Card } from "react-bootstrap";
import { useRef } from "react";
import imageDefault from "../../../shared/images/imageDefault.jpg";
import path_url from "../../../shared/config/path_url.json"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../@/components/ui/tabs"
import { Button } from "../../../../@/components/ui/button"
import {
    Card as CardShadCn,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../../../@/components/ui/card"
import { Input } from "../../../../@/components/ui/input"
import { Label } from "../../../../@/components/ui/label"

import styles from "./EditProfile.module.css"
const EditProfile = ({ props }) => {
    const fileInputRef = useRef(null);
    const barbershop = (props);

    const imageResponse = `${path_url.remote}/getPicture\\${barbershop?.picture?.[0]?.src}`
    const image = imageResponse ? imageResponse : imageDefault;

    const handleCardClick = () => {
        fileInputRef.current.click();
    }

    const typeImages = {
        "image/jpeg": "image/jpeg",
        "image/png": "image/png",
        "image/jpg": "image/jpg"
    }

    const handleFileInputChange = (event) => {
        const selectedFile = event.target.files[0];
        console.log(selectedFile)
        if (!typeImages[selectedFile.type]) {
            alert("Selecione uma imagem")
        }
    }

    return (
        <div className={styles.container}>
            <div>
                <div className="profile-pic">
                    <Card className={styles.card} style={{ width: '18rem', }}>
                        <Card.Img className={styles.cardImage} onClick={handleCardClick} variant="top" src={image} />
                        <input
                            ref={fileInputRef}
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleFileInputChange}
                            accept="image/*"
                        />
                        <Card.Body>
                            <Card.Title>{barbershop?.name}</Card.Title>
                            <Card.Text>
                                <br />
                                Essa imagem aparecerá
                                para seus clientes no perfil de cliente
                                <br />
                            </Card.Text>
                            <ButtonBs className="mt-2" variant="primary">Salvar</ButtonBs>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            <Tabs defaultValue="account" className="w-[400px]  text-white p-4" >
                <TabsList className="grid w-full grid-cols-2 bg-easy-black rounded mt-1 ">
                    <TabsTrigger className="focus:bg-black rounded" value="account">Account</TabsTrigger>
                    <TabsTrigger className="focus:bg-black rounded" value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <Card className="bg-easy-black text-white p-3">
                        <CardHeader>
                            <CardTitle>Account</CardTitle>
                            <CardDescription>
                                Make changes to your account here. Click save when you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" defaultValue={barbershop?.name} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" defaultValue={barbershop?.email} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <ButtonBs className="mt-3">Save changes</ButtonBs>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="password">
                    <Card className="bg-easy-black text-white p-3">
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>
                                Change your password here. After saving, you'll be logged out.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 rounded">
                            <div className="space-y-1">
                                <Label htmlFor="current">Current password</Label>
                                <Input id="current" type="password" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="new">New password</Label>
                                <Input id="new" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <ButtonBs className="mt-3" >Save password</ButtonBs>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>


        </div>
    )
}

export default EditProfile;