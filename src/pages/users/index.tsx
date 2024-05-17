import { Alert } from "@/helpers/Alert";
import { IPaginatedData } from "@/interfaces/IPaginatedData";
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

export default function Users()
{
    const [users, setUsers] = useState<IPaginatedData<IUser>>();
    const [perPage, setPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const columns: TableColumn<IUser>[] = [
        {
            name: "ID",
            selector: (row: IUser) => row.id ?? "-",
        },
        {
            name: "Nome",
            selector: (row: IUser) => row.name,
        },
        {
            name: "E-mail",
            selector: (row: IUser) => row.email,
        },
        {
            name: "Jogador",
            selector: (row: IUser) => row.player?.name ?? "-",
        },
        {
            name: "",
            cell: (row: IUser) => (
                <div className="w-100 d-flex flex-row justify-content-end gap-2">
                    <Link href={`/users/${row.id}`} className="btn btn-sm btn-primary justify-self-end">
                        <FontAwesomeIcon icon={faEye} fixedWidth />
                    </Link>
                    <button onClick={() => deleteUser(row)} className="btn btn-sm btn-danger justify-self-end">
                        <FontAwesomeIcon icon={faTrash} fixedWidth />
                    </button>
                </div>
            ),
        }
    ];

    useEffect(() => {
        loadUsers();
    }, [page, perPage]);

    const loadUsers = () => {
        setLoading(true);

        let query = new URLSearchParams({
            with: "player",
            per_page: perPage.toString(),
            page: page.toString(),
        });

        Api.get(`users?${query.toString()}`).then((res: AxiosResponse<IPaginatedData<IUser>>) => {
            setUsers(res.data);
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

    const deleteUser = (user: IUser) => {
        Alert({
            title: "Atenção",
            text: `Deseja realmente excluir o usuário ${user.name}?`,
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Não",
            confirmButtonText: "Sim",
        }).then((result) => {
            if (result.isConfirmed) {
                Api.delete(`users/${user.id}`).then(() => {
                    Alert({
                        title: "Sucesso",
                        text: "Usuário excluído com sucesso.",
                        icon: "success",
                    }).then(() => {
                        loadUsers();
                    });
                }).catch((e) => {
                    Alert({
                        title: "Erro",
                        text: e.response?.data.message ?? "Ocorreu um erro ao excluir o usuário. Por favor, tente novamente.",
                        icon: "error",
                    });
                });
            }
        });
    };

    return (
        <>
            <Head>
                <title>Usuários - Pelada.com</title>
            </Head>

            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col-6">
                        <h1>Usuários</h1>
                    </div>
                    <div className="col-6 text-end">
                        <Link href="/users/new" className="btn btn-primary">
                            <FontAwesomeIcon icon={faPlus} fixedWidth /> Novo Usuário
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow border-0 rounded-4">
                            <div className="card-body">
                                <DataTable
                                    data={users?.data ?? []}
                                    columns={columns}
                                    pagination
                                    paginationServer
                                    paginationTotalRows={users?.total}
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