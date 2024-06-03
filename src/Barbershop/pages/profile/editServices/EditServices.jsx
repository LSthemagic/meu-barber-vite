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


export const EditServices = ({ props }) => {
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState(null);

    const handleUpdateServices = async (event) => {
        event.preventDefault();
        setLoading(true);
        console.log(event.target[0].value)
        console.log(price? price : event.target[1].value)
        console.log(event.target[2].value)

        try {
            const response = await axios.put(`${path_url.remote}/updateDependenciesBarbershop/updateServices`,
                {
                    id: props.id,
                    service_id: props.service_id,
                    nameService: event.target[0].value,
                    price: price ? price : event.target[1].value,
                    duration: event.target[2].value
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

    function mascaraMoeda(event) {
        const onlyDigits = event.target.value
            .split('')
            .filter((s) => /\d/.test(s))
            .join('')
            .padStart(3, '0');
        const digitsFloat = onlyDigits.slice(0, -2) + '.' + onlyDigits.slice(-2);
        event.target.value = maskCurrency(digitsFloat);
        handleDispatchService("SET_PRICE", event);
    }
    
    function maskCurrency(valor, locale = 'pt-BR', currency = 'BRL') {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
        }).format(valor).replace(/\u00A0/g, ' ');
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
                            <Form onSubmit={handleUpdateServices}>
                                <CardContent className="space-y-2">
                                    <Input
                                        required
                                        type="text"
                                        placeholder="Serviço oferecido"
                                        defaultValue={props?.nameService}
                                    />
                                    <br />
                                    <Input
                                        required
                                        type="text"
                                        placeholder="Valor (apenas números)"
                                        defaultValue={props?.price}
                                        onChange={(e) => mascaraMoeda(e)} maxLength={15}
                                    />
                                    < br />
                                    <Label className="text-gray-400 mb-0">Duração do serviço</Label>
                                    <Input
                                        required
                                        type="time"
                                        defaultValue={props?.duration}
                                        placeholder="Duração do serviço"
                                    />
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