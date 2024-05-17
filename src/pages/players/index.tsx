import { Alert } from "@/helpers/Alert";
import { IPaginatedData } from "@/interfaces/IPaginatedData";
import { IPlayer } from "@/interfaces/IPlayer";
import { IUser } from "@/interfaces/IUser";
import AdminPanel from "@/layouts/AdminPanel";
import Api from "@/services/Api";
import { faEye, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosResponse } from "axios";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";

export default function Players()
{
    const [players, setPlayers] = useState<IPaginatedData<IPlayer>>();
    const [perPage, setPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

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
            name: "Nível",
            selector: (row: IPlayer) => row.level,
        },
        {
            name: "Goleiro",
            selector: (row: IPlayer) => row.is_goalkeeper ? "Sim" : "Não",
        },
        {
            name: "",
            cell: (row: IPlayer) => (
                <div className="w-100 d-flex flex-row justify-content-end gap-2">
                    <Link href={`/players/${row.id}`} className="btn btn-sm btn-primary justify-self-end">
                        <FontAwesomeIcon icon={faEye} fixedWidth />
                    </Link>
                    <button onClick={() => deletePlayer(row)} className="btn btn-sm btn-danger justify-self-end">
                        <FontAwesomeIcon icon={faTrash} fixedWidth />
                    </button>
                </div>
            ),
        }
    ];

    useEffect(() => {
        loadPlayers();
    }, [page, perPage]);

    const loadPlayers = () => {
        setLoading(true);

        let query = new URLSearchParams({
            per_page: perPage.toString(),
            page: page.toString(),
        });

        Api.get(`/players?${query.toString()}`).then((res: AxiosResponse<IPaginatedData<IPlayer>>) => {
            setPlayers(res.data);
        }).catch((e) => {
            Alert({
                icon: "error",
                title: "Erro",
                text: e.response?.data.message ?? "Ocorreu um erro ao carregar os jogadores. Por favor, tente novamente."
            });
        }).finally(() => {
            setLoading(false);
        });
    }

    const deletePlayer = (player: IPlayer) => {
        Alert({
            title: "Atenção",
            text: `Deseja realmente excluir o jogador ${player.name}?`,
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Não",
            confirmButtonText: "Sim",
        }).then((result) => {
            if (result.isConfirmed) {
                Api.delete(`players/${player.id}`).then(() => {
                    Alert({
                        title: "Sucesso",
                        text: "Jogador excluído com sucesso.",
                        icon: "success",
                    }).then(() => {
                        loadPlayers();
                    });
                }).catch((e) => {
                    Alert({
                        title: "Erro",
                        text: e.response?.data.message ?? "Ocorreu um erro ao excluir o jogador. Por favor, tente novamente.",
                        icon: "error",
                    });
                });
            }
        });
    };

    return (
        <>
            <Head>
                <title>Jogadores - Pelada.com</title>
            </Head>

            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col-6">
                        <h1>Jogadores</h1>
                    </div>
                    <div className="col-6 text-end">
                        <Link href="/players/new" className="btn btn-primary">
                            <FontAwesomeIcon icon={faPlus} fixedWidth /> Novo Jogador
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow border-0 rounded-4">
                            <div className="card-body">
                                <DataTable
                                    data={players?.data ?? []}
                                    columns={columns}
                                    pagination
                                    paginationServer
                                    paginationTotalRows={players?.total}
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