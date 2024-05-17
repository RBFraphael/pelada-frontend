import AdminPanel from "@/layouts/AdminPanel";
import Head from "next/head";
import UserForm from "../UserForm";
import { useRouter } from "next/router";
import Api from "@/services/Api";
import { useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { IUser } from "@/interfaces/IUser";
import { Alert } from "@/helpers/Alert";

export default function EditUser()
{
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ submitting, setSubmitting ] = useState<boolean>(false);
    const [ user, setUser ] = useState<IUser|null>(null);
    const router = useRouter();
    const { user_id } = router.query;

    useEffect(() => {
        if(router.isReady){
            loadUser();
        }
    }, [router]);

    const loadUser = () => {
        setLoading(true);

        Api.get(`/users/${user_id}`).then((res: AxiosResponse<IUser>) => {
            setUser(res.data);
        }).catch((err: AxiosError<any>) => {
            Alert({
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro ao carregar o usuário.",
                icon: "error"
            }).then(() => {
                router.push(`/users`);
            });
        }).finally(() => {
            setLoading(false);
        });
    };

    const onSubmit = (data: any) => {
        setSubmitting(true);

        if(data.password === "") {
            delete data.password;
        }

        Api.put(`/users/${user_id}`, data).then((res: AxiosResponse<IUser>) => {
            Alert({
                title: "Sucesso",
                text: "Usuário atualizado com sucesso.",
                icon: "success"
            }).then(() => {
                router.push("/users");
            });
        }).catch((err: AxiosError<any>) => {
            Alert({
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro ao atualizar o usuário.",
                icon: "error"
            });
        }).finally(() => {
            setSubmitting(false);
        });
    };

    return (
        <>
            <Head>
                <title>Editar Usuário - Pelada.com</title>
            </Head>

            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col-12">
                        <h1>Editar Usuário</h1>
                    </div>
                </div>
                <div className="row">
                    { user !== null && (
                    <div className="col-12">
                        <div className="card shadow border-0 rounded-4">
                            <div className="card-body">
                                <UserForm onSubmit={onSubmit} onCancel={() => { router.push("/users"); }} loading={submitting} user={user} />
                            </div>
                        </div>
                    </div>
                    ) }
                </div>
            </div>
        </>
    );
}