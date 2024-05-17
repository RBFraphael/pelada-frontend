import AdminPanel from "@/layouts/AdminPanel";
import Head from "next/head";
import { useRouter } from "next/router";
import Api from "@/services/Api";
import { useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { Alert } from "@/helpers/Alert";
import { IGame } from "@/interfaces/IGame";
import GameForm from "../GameForm";

export default function EditGame()
{
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ submitting, setSubmitting ] = useState<boolean>(false);
    const [ game, setGame ] = useState<IGame|null>(null);
    const router = useRouter();
    const { game_id } = router.query;

    useEffect(() => {
        if(router.isReady){
            loadGame();
        }
    }, [router]);

    const loadGame = () => {
        setLoading(true);

        Api.get(`/games/${game_id}`).then((res: AxiosResponse<IGame>) => {
            setGame(res.data);
        }).catch((err: AxiosError<any>) => {
            Alert({
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro ao carregar o jogo.",
                icon: "error"
            }).then(() => {
                router.push(`/games`);
            });
        }).finally(() => {
            setLoading(false);
        });
    };

    const onSubmit = (data: any) => {
        setSubmitting(true);

        Api.put(`/games/${game_id}`, data).then((res: AxiosResponse<IGame>) => {
            Alert({
                title: "Sucesso",
                text: "Jogo atualizado com sucesso.",
                icon: "success"
            }).then(() => {
                router.push("/games");
            });
        }).catch((err: AxiosError<any>) => {
            Alert({
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro ao atualizar o jogo.",
                icon: "error"
            });
        }).finally(() => {
            setSubmitting(false);
        });
    };

    return (
        <>
            <Head>
                <title>Editar Jogo - Pelada.com</title>
            </Head>

            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col-12">
                        <h1>Editar Jogo</h1>
                    </div>
                </div>
                <div className="row">
                    { game !== null && (
                    <div className="col-12">
                        <div className="card shadow border-0 rounded-4">
                            <div className="card-body">
                                <GameForm onSubmit={onSubmit} onCancel={() => { router.push("/games"); }} loading={submitting} game={game} />
                            </div>
                        </div>
                    </div>
                    ) }
                </div>
            </div>
        </>
    );
}