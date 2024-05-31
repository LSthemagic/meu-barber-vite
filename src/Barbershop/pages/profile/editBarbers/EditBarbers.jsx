import { Button as ButtonBs, Form, Spinner } from "react-bootstrap";
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
import styles from "../editProfile/EditProfile.module.css"
import Toast from "../../../../shared/custom/Toast";
import axios from "axios";
import { useState } from "react";


export const EditBarbers = ({ props }) => {
    const [loading, setLoading] = useState(false);

    const handleUpdateBarbers = async (event) => {
        event.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.put(`${path_url.remote}/updateDependenciesBarbershop/updateBarbers`,
                {
                    id: props.id,
                    barber_id: props.item_id,
                    name: event.target[0].value,
                    email: event.target[1].value
                },
            );

            console.log(response)

            Toast.fire({
                icon: response.data.error ? 'error' : 'success',
                title: response.data.message
            })
        } catch (e) {
            console.log(e);
            Toast.fire({
                icon: 'error',
                title: 'Erro ao editar dados.'
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container">
            <div className={styles.tabsContainer}>
                <Tabs defaultValue="account" className="w-[350px] text-white" >
                    <TabsList className="grid w-full grid-col bg-easy-black rounded mt-1 ">
                        <TabsTrigger className="focus:bg-black rounded" value="account">Conta</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        <CardShadCn className="bg-easy-black text-white p-3">
                            <CardHeader>
                                <CardTitle>Conta</CardTitle>
                                <CardDescription>
                                    Faça alterações em sua conta aqui. Clique em salvar quando estiver pronto.
                                </CardDescription>
                            </CardHeader>
                            <Form onSubmit={handleUpdateBarbers}>
                                <CardContent className="space-y-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="name">Nome</Label>
                                        <Input id="name" defaultValue={props?.name}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="username">Email</Label>
                                        <Input id="username" defaultValue={props?.email}

                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <ButtonBs
                                        type="submit"
                                        className="mt-3 w-full bg-black border-black">{loading ? <Spinner /> : "Salvar Alterações"}</ButtonBs>
                                </CardFooter>
                            </Form>
                        </CardShadCn>
                    </TabsContent>
                </Tabs>
            </div>

        </div>
    )

}