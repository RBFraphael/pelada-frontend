import { Alert } from "@/helpers/Alert";
import { IPaginatedData } from "@/interfaces/IPaginatedData";
import { ITeam } from "@/interfaces/ITeam";
import AdminPanel from "@/layouts/AdminPanel";
import Api from "@/services/Api";
import { faEye, faPlus, faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosResponse } from "axios";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";

export default function Teams()
{
    const [teams, setTeams] = useState<IPaginatedData<ITeam>>();
    const [perPage, setPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const { game_id } = router.query;
    const [processing, setProcessing] = useState<boolean>(false);

    const columns: TableColumn<ITeam>[] = [
        {
            name: "ID",
            selector: (row: ITeam) => row.id ?? "-",
        },
        {
            name: "Nome",
            selector: (row: ITeam) => row.name,
        },
        {
            name: "Jogadores",
            selector: (row: ITeam) => row.players?.length ?? 0,
        },
        {
            name: "Data do jogo",
            selector: (row: ITeam) => dayjs(row.game?.date).format("DD/MM/YYYY"),
        },
        {
            name: "",
            cell: (row: ITeam) => (
                <div className="w-100 d-flex flex-row justify-content-end gap-2">
                    <Link href={`/games/${game_id}/teams/${row.id}`} className="btn btn-sm btn-primary justify-self-end">
                        <FontAwesomeIcon icon={faEye} fixedWidth />
                    </Link>
                    <button onClick={() => deleteTeam(row)} className="btn btn-sm btn-danger justify-self-end">
                        <FontAwesomeIcon icon={faTrash} fixedWidth />
                    </button>
                </div>
            ),
        }
    ];

    useEffect(() => {
        if(router.isReady){
            loadTeams();
        }
    }, [page, perPage, router]);

    const loadTeams = () => {
        setLoading(true);

        let query = new URLSearchParams({
            with: "players,game",
            per_page: perPage.toString(),
            page: page.toString(),
        });

        Api.get(`games/${game_id}/teams?${query.toString()}`).then((res: AxiosResponse<IPaginatedData<ITeam>>) => {
            setTeams(res.data);
        }).catch((e) => {
            Alert({
                icon: "error",
                title: "Erro",
                text: e.response?.data.message ?? "Ocorreu um erro ao carregar os times. Por favor, tente novamente."
            });
        }).finally(() => {
            setLoading(false);
        });
    }

    const generateTeams = () => {
        setProcessing(true);

        Api.post(`games/${game_id}/teams`, {}).then((res: AxiosResponse<ITeam[]>) => {
            Alert({
                title: "Sucesso",
                text: "Times gerados com sucesso.",
                icon: "success",
            }).then(() => {
                loadTeams();
            });
        }).catch((e) => {
            Alert({
                title: "Erro",
                text: e.response?.data.message ?? "Ocorreu um erro ao gerar os times. Por favor, tente novamente.",
                icon: "error",
            });
        }).finally(() => {
            setProcessing(false);
        });
    }

    const deleteTeam = (team: ITeam) => {
        Alert({
            title: "Atenção",
            text: `Deseja realmente excluir o time ${team.name}?`,
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Não",
            confirmButtonText: "Sim",
        }).then((result) => {
            if (result.isConfirmed) {
                Api.delete(`games/${game_id}/teams/${team.id}`).then(() => {
                    Alert({
                        title: "Sucesso",
                        text: "Time excluído com sucesso.",
                        icon: "success",
                    }).then(() => {
                        loadTeams();
                    });
                }).catch((e) => {
                    Alert({
                        title: "Erro",
                        text: e.response?.data.message ?? "Ocorreu um erro ao excluir o time. Por favor, tente novamente.",
                        icon: "error",
                    });
                });
            }
        });
    };

    return (
        <>
            <Head>
                <title>Times - Pelada.com</title>
            </Head>

            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col-6">
                        <h1>Times</h1>
                    </div>
                    <div className="col-6 text-end">
                        <button className="btn btn-success" onClick={generateTeams} disabled={processing}>
                            { processing ? (
                                <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faStar} fixedWidth /> Gerar os times
                                </>
                            ) }
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow border-0 rounded-4">
                            <div className="card-body">
                                <DataTable
                                    data={teams?.data ?? []}
                                    columns={columns}
                                    pagination
                                    paginationServer
                                    paginationTotalRows={teams?.total}
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