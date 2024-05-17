import AdminPanel from "@/layouts/AdminPanel";
import Head from "next/head";
import { useRouter } from "next/router";
import Api from "@/services/Api";
import { useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { Alert } from "@/helpers/Alert";
import PlayerForm from "../PlayerForm";
import { IPlayer } from "@/interfaces/IPlayer";

export default function EditPlayer()
{
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ submitting, setSubmitting ] = useState<boolean>(false);
    const [ player, setPlayer ] = useState<IPlayer|null>(null);
    const router = useRouter();
    const { player_id } = router.query;

    useEffect(() => {
        if(router.isReady){
            loadPlayer();
        }
    }, [router]);

    const loadPlayer = () => {
        setLoading(true);

        Api.get(`/players/${player_id}?with=user`).then((res: AxiosResponse<IPlayer>) => {
            setPlayer(res.data);
        }).catch((err: AxiosError<any>) => {
            Alert({
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro ao carregar o jogador.",
                icon: "error"
            }).then(() => {
                router.push(`/players`);
            });
        }).finally(() => {
            setLoading(false);
        });
    };

    const onSubmit = (data: any) => {
        setSubmitting(true);

        if(data.user.password === "") {
            delete data.user.password;
        }

        Api.put(`/players/${player_id}`, data).then((res: AxiosResponse<IPlayer>) => {
            Alert({
                title: "Sucesso",
                text: "Jogador atualizado com sucesso.",
                icon: "success"
            }).then(() => {
                router.push("/players");
            });
        }).catch((err: AxiosError<any>) => {
            Alert({
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro ao atualizar o jogador.",
                icon: "error"
            });
        }).finally(() => {
            setSubmitting(false);
        });
    };

    return (
        <>
            <Head>
                <title>Editar Jogador - Pelada.com</title>
            </Head>

            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col-12">
                        <h1>Editar Jogador</h1>
                    </div>
                </div>
                <div className="row">
                    { player !== null && (
                    <div className="col-12">
                        <div className="card shadow border-0 rounded-4">
                            <div className="card-body">
                                <PlayerForm onSubmit={onSubmit} onCancel={() => { router.push("/players"); }} loading={submitting} player={player} />
                            </div>
                        </div>
                    </div>
                    ) }
                </div>
            </div>
        </>
    );
}