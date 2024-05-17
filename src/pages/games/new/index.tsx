import AdminPanel from "@/layouts/AdminPanel";
import Head from "next/head";
import { useRouter } from "next/router";
import Api from "@/services/Api";
import { useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { IUser } from "@/interfaces/IUser";
import { Alert } from "@/helpers/Alert";
import GameForm from "../GameForm";

export default function NewGame()
{
    const [ loading, setLoading ] = useState<boolean>(false);
    const router = useRouter();

    const onSubmit = (data: any) => {
        setLoading(true);

        Api.post(`/games`, data).then((res: AxiosResponse<IUser>) => {
            Alert({
                title: "Sucesso",
                text: "Jogo cadastrado com sucesso.",
                icon: "success"
            }).then(() => {
                router.push("/games");
            });
        }).catch((err: AxiosError<any>) => {
            Alert({
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro ao cadastrar o jogo.",
                icon: "error"
            });
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <>
            <Head>
                <title>Novo Jogo - Pelada.com</title>
            </Head>

            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col-12">
                        <h1>Novo Jogo</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow border-0 rounded-4">
                            <div className="card-body">
                                <GameForm onSubmit={onSubmit} onCancel={() => { router.push("/games"); }} loading={loading} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}