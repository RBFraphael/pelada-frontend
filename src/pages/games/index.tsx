import { Alert } from "@/helpers/Alert";
import { IGame } from "@/interfaces/IGame";
import { IPaginatedData } from "@/interfaces/IPaginatedData";
import AdminPanel from "@/layouts/AdminPanel";
import Api from "@/services/Api";
import { faExternalLink, faEye, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosResponse } from "axios";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";

export default function Games()
{
    const [games, setGames] = useState<IPaginatedData<IGame>>();
    const [perPage, setPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const columns: TableColumn<IGame>[] = [
        {
            name: "ID",
            selector: (row: IGame) => row.id ?? "-",
        },
        {
            name: "Data do Jogo",
            selector: (row: IGame) => dayjs(row.date).format("DD/MM/YYYY"),
        },
        {
            name: "Jogadores por Time",
            selector: (row: IGame) => row.players_per_team,
        },
        {
            name: "Times Formados",
            cell: (row: IGame) => (
                <>
                    {row.teams?.length ?? 0} &nbsp;
                    <Link href={`/games/${row.id}/teams`} title="Ver Times">
                        <FontAwesomeIcon icon={faExternalLink} fixedWidth />
                    </Link>
                </>
            ),
        },
        {
            name: "Convites Enviados",
            cell: (row: IGame) => (
                <>
                    {row.invites?.length ?? 0} &nbsp;
                    <Link href={`/games/${row.id}/invites`} title="Ver Convites">
                        <FontAwesomeIcon icon={faExternalLink} fixedWidth />
                    </Link>
                </>
            ),
        },
        {
            name: "",
            cell: (row: IGame) => (
                <div className="w-100 d-flex flex-row justify-content-end gap-2">
                    <Link href={`/games/${row.id}`} className="btn btn-sm btn-primary justify-self-end">
                        <FontAwesomeIcon icon={faEye} fixedWidth />
                    </Link>
                    <button onClick={() => deleteGame(row)} className="btn btn-sm btn-danger justify-self-end">
                        <FontAwesomeIcon icon={faTrash} fixedWidth />
                    </button>
                </div>
            ),
        }
    ];

    useEffect(() => {
        loadGames();
    }, [page, perPage]);

    const loadGames = () => {
        setLoading(true);

        let query = new URLSearchParams({
            with: "teams,invites",
            per_page: perPage.toString(),
            page: page.toString(),
        });

        Api.get(`games?${query.toString()}`).then((res: AxiosResponse<IPaginatedData<IGame>>) => {
            setGames(res.data);
        }).catch((e) => {
            Alert({
                icon: "error",
                title: "Erro",
                text: e.response?.data.message ?? "Ocorreu um erro ao carregar os usuários. Por favor, tente novamente."
            });
        }).finally(() => {
            setLoading(false);
        });
    }

    const deleteGame = (game: IGame) => {
        Alert({
            title: "Atenção",
            text: `Deseja realmente excluir o jogo do dia ${dayjs(game.date).format("DD/MM/YYYY")} ?`,
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Não",
            confirmButtonText: "Sim",
        }).then((result) => {
            if (result.isConfirmed) {
                Api.delete(`games/${game.id}`).then(() => {
                    Alert({
                        title: "Sucesso",
                        text: "Jogo excluído com sucesso.",
                        icon: "success",
                    }).then(() => {
                        loadGames();
                    });
                }).catch((e) => {
                    Alert({
                        title: "Erro",
                        text: e.response?.data.message ?? "Ocorreu um erro ao excluir o jogo. Por favor, tente novamente.",
                        icon: "error",
                    });
                });
            }
        });
    };

    return (
        <>
            <Head>
                <title>Jogos - Pelada.com</title>
            </Head>

            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col-6">
                        <h1>Jogos</h1>
                    </div>
                    <div className="col-6 text-end">
                        <Link href="/games/new" className="btn btn-primary">
                            <FontAwesomeIcon icon={faPlus} fixedWidth /> Novo Jogo
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow border-0 rounded-4">
                            <div className="card-body">
                                <DataTable
                                    data={games?.data ?? []}
                                    columns={columns}
                                    pagination
                                    paginationServer
                                    paginationTotalRows={games?.total}
                                    onChangeRowsPerPage={(perPage) => setPerPage(perPage)}
                                    onChangePage={(page) => setPage(page)}
                                    progressPending={loading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}