import { Alert } from "@/helpers/Alert";
import { IInvite, InviteStatus, InviteStatusColorClass, InviteStatusLabel } from "@/interfaces/IInvite";
import { IPaginatedData } from "@/interfaces/IPaginatedData";
import { IPlayer } from "@/interfaces/IPlayer";
import AdminPanel from "@/layouts/AdminPanel";
import Api from "@/services/Api";
import { faPaperPlane, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError, AxiosResponse } from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { ppid } from "process";
import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { useForm } from "react-hook-form";

export default function Invites()
{
    const [invites, setInvites] = useState<IPaginatedData<IInvite>>();
    const [players, setPlayers] = useState<IPlayer[]>([]);
    const [perPage, setPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const { game_id } = router.query;
    const { register, handleSubmit, reset } = useForm();
    const [submitting, setSubmitting] = useState<boolean>(false);

    const columns: TableColumn<IInvite>[] = [
        {
            name: "ID",
            selector: (row: IInvite) => row.id ?? "-",
        },
        {
            name: "Jogador",
            selector: (row: IInvite) => row.player?.name ?? "-",
        },
        {
            name: "Goleiro",
            selector: (row: IInvite) => row.player?.is_goalkeeper ? "Sim" : "Não",
        },
        {
            name: "Confirmação",
            cell: (row: IInvite) => (
                <div className="d-flex flex-column">
                    <p className={`text-center fw-bold mb-1 ${InviteStatusColorClass(row.status)}`}>{ InviteStatusLabel(row.status) }</p>
                    <div className="d-flex flex-row gap-1">
                        <button onClick={() => confirmInvite(row)} className="btn btn-sm px-1 py-0 btn-primary">Confirmar</button>
                        <button onClick={() => rejectInvite(row)} className="btn btn-sm px-1 py-0 btn-danger">Recusar</button>
                    </div>
                </div>
            ),
        },
        {
            name: "",
            cell: (row: IInvite) => (
                <div className="w-100 d-flex flex-row justify-content-end gap-2">
                    <button onClick={() => deleteInvite(row)} className="btn btn-sm btn-danger justify-self-end">
                        <FontAwesomeIcon icon={faTrash} fixedWidth />
                    </button>
                </div>
            ),
        }
    ];

    useEffect(() => {
        if(router.isReady){
            loadInvites();
        }
    }, [page, perPage, router]);

    useEffect(() => {
        loadPlayers();
    }, []);

    const loadPlayers = () => {
        Api.get("players?no_paginate=true").then((res: AxiosResponse<IPlayer[]>) => {
            setPlayers(res.data);
        }).catch((e) => {
            Alert({
                icon: "error",
                title: "Erro",
                text: e.response?.data.message ?? "Ocorreu um erro ao carregar os jogadores. Por favor, tente novamente."
            });
        });
    };

    const loadInvites = () => {
        setLoading(true);

        let query = new URLSearchParams({
            with: "player",
            per_page: perPage.toString(),
            page: page.toString(),
        });

        Api.get(`games/${game_id}/invites?${query.toString()}`).then((res: AxiosResponse<IPaginatedData<IInvite>>) => {
            setInvites(res.data);
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

    const deleteInvite = (invite: IInvite) => {
        Alert({
            title: "Atenção",
            text: `Deseja realmente excluir o convite do jogador ${invite.player?.name}?`,
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Não",
            confirmButtonText: "Sim",
        }).then((result) => {
            if (result.isConfirmed) {
                Api.delete(`games/${game_id}/invites/${invite.id}`).then(() => {
                    Alert({
                        title: "Sucesso",
                        text: "Convite excluído com sucesso.",
                        icon: "success",
                    }).then(() => {
                        loadInvites();
                    });
                }).catch((e) => {
                    Alert({
                        title: "Erro",
                        text: e.response?.data.message ?? "Ocorreu um erro ao excluir o convite. Por favor, tente novamente.",
                        icon: "error",
                    });
                });
            }
        });
    };

    const onSubmit = (data: any) => {
        setSubmitting(true);
        Api.post(`games/${game_id}/invites`, data).then(() => {
            Alert({
                title: "Sucesso",
                text: "Convite enviado com sucesso.",
                icon: "success"
            }).then(() => {
                reset();
                loadInvites();
            });
        }).catch((e) => {
            Alert({
                icon: "error",
                title: "Erro",
                text: e.response?.data.message ?? "Ocorreu um erro ao enviar o convite. Por favor, tente novamente."
            });
        }).finally(() => {
            setSubmitting(false);
        });
    };

    const confirmInvite = (invite: IInvite) => {
        Api.put(`games/${game_id}/invites/${invite.id}`, { status: InviteStatus.CONFIRMED }).then((res: AxiosResponse<IInvite>) => {
            Alert({
                title: "Sucesso",
                text: "Convite confirmado com sucesso.",
                icon: "success",
            }).then(() => {
                loadInvites();
            });
        }).catch((e: AxiosError<any>) => {
            Alert({
                title: "Erro",
                text: e.response?.data.message ?? "Ocorreu um erro ao confirmar o convite. Por favor, tente novamente.",
                icon: "error",
            });
        });
    };

    const rejectInvite = (invite: IInvite) => {
        Api.put(`games/${game_id}/invites/${invite.id}`, { status: InviteStatus.REJECTED }).then((res: AxiosResponse<IInvite>) => {
            Alert({
                title: "Sucesso",
                text: "Convite rejeitado com sucesso.",
                icon: "success",
            }).then(() => {
                loadInvites();
            });
        }).catch((e: AxiosError<any>) => {
            Alert({
                title: "Erro",
                text: e.response?.data.message ?? "Ocorreu um erro ao rejeitar o convite. Por favor, tente novamente.",
                icon: "error",
            });
        });
    };

    return (
        <>
            <Head>
                <title>Convites - Pelada.com</title>
            </Head>

            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col-12">
                        <h1>Convites</h1>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card shadow border-0 rounded-4">
                            <div className="card-body">
                                <DataTable
                                    data={invites?.data ?? []}
                                    columns={columns}
                                    pagination
                                    paginationServer
                                    paginationTotalRows={invites?.total}
                                    onChangeRowsPerPage={(perPage) => setPerPage(perPage)}
                                    onChangePage={(page) => setPage(page)}
                                    progressPending={loading}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="card shadow border-0 rounded-4">
                            <div className="card-body">
                                <h4>Enviar convite de participação</h4>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="form-floating mb-3">
                                        <select {...register("player_id", { required: true })} className="form-select">
                                            <option value="">Selecione um jogador...</option>
                                            { players.map((player: IPlayer, i: number) => (
                                                <option key={i} value={player.id}>{ player.name } - Nível { player.level }{ player.is_goalkeeper ? " - Goleiro" : "" }</option>
                                            )) }
                                        </select>
                                        <label htmlFor="player" className="form-label">Jogador</label>
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                                        { submitting ? (
                                            <div className="spinner-border spinner-border-sm" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faPaperPlane} fixedWidth /> Enviar convite
                                            </>
                                        ) }
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}