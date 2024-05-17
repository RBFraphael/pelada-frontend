import AdminPanel from "@/layouts/AdminPanel";
import Head from "next/head";
import { useRouter } from "next/router";
import Api from "@/services/Api";
import { useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { IUser } from "@/interfaces/IUser";
import { Alert } from "@/helpers/Alert";
import PlayerForm from "../PlayerForm";
import { IPlayer } from "@/interfaces/IPlayer";

export default function NewPlayer()
{
    const [ loading, setLoading ] = useState<boolean>(false);
    const router = useRouter();

    const onSubmit = (data: any) => {
        setLoading(true);

        Api.post(`/players`, data).then((res: AxiosResponse<IPlayer>) => {
            Alert({
                title: "Sucesso",
                text: "Jogador cadastrado com sucesso.",
                icon: "success"
            }).then(() => {
                router.push("/players");
            });
        }).catch((err: AxiosError<any>) => {
            Alert({
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro ao cadastrar o jogador.",
                icon: "error"
            });
            setLoading(false);
        });
    };

    return (
        <>
            <Head>
                <title>Novo Jogador - Pelada.com</title>
            </Head>

            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col-12">
                        <h1>Novo Jogador</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow border-0 rounded-4">
                            <div className="card-body">
                                <PlayerForm onSubmit={onSubmit} onCancel={() => { router.push("/players"); }} loading={loading} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}