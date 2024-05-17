import { Alert } from "@/helpers/Alert";
import { IGame } from "@/interfaces/IGame";
import { IPaginatedData } from "@/interfaces/IPaginatedData";
import { IPlayer } from "@/interfaces/IPlayer";
import { ITeam } from "@/interfaces/ITeam";
import AdminPanel from "@/layouts/AdminPanel";
import Api from "@/services/Api";
import { faExternalLink, faEye, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosResponse } from "axios";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";

export default function ViewTeam()
{
    const [team, setTeam] = useState<ITeam|null>(null);
    const router = useRouter();
    const { game_id, team_id } = router.query;

    const columns: TableColumn<IPlayer>[] = [
        {
            name: "ID",
            selector: (row: IPlayer) => row.id ?? "-",
        },
        {
            name: "Nome",
            selector: (row: IPlayer) => row.name,
        },
        {
            name: "Goleiro",
            selector: (row: IPlayer) => row.is_goalkeeper ? "Sim" : "Não",
        }
    ];

    useEffect(() => {
        loadTeam();
    }, []);

    const loadTeam = () => {

        let query = new URLSearchParams({
            with: "players,game",
            no_paginate: 'true'
        });

        Api.get(`games/${game_id}/teams/${team_id}?${query.toString()}`).then((res: AxiosResponse<ITeam>) => {
            setTeam(res.data);
        }).catch((e) => {
            Alert({
                icon: "error",
                title: "Erro",
                text: e.response?.data.message ?? "Ocorreu um erro ao carregar o time. Por favor, tente novamente."
            }).then(() => {
                router.push(`/games/${game_id}/teams`);
            });
        });
    }

    return (
        <>
            <Head>
                <title>{ team?.name } - Pelada.com</title>
            </Head>

            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col-12">
                        <h1>{ team?.name }</h1>
                        <h4>Jogo em { dayjs(team?.game?.date).format("DD/MM/YYYY") }</h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow border-0 rounded-4">
                            <div className="card-body">
                                <DataTable
                                    data={team?.players ?? []}
                                    columns={columns}
                                    pagination
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}