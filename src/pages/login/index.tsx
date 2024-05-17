import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useForm } from "react-hook-form";

import SideImage from "@/assets/images/pelada.jpg";
import { useState } from "react";
import Api from "@/services/Api";
import { AxiosError, AxiosResponse } from "axios";
import { Alert } from "@/helpers/Alert";
import { useRouter } from "next/router";
import Head from "next/head";
import Logo from "@/assets/images/pelada-logo.svg";

export default function Login()
{
    const { register, handleSubmit, reset } = useForm();
    const [ submitting, setSubmitting ] = useState<boolean>(false);
    const router = useRouter();

    const onSubmit = (data: any) => {
        setSubmitting(true);

        Api.post("/auth/login", data).then((res: AxiosResponse) => {
            reset();
            localStorage.setItem("access_token", res.data.access_token);
            router.push("/dashboard");
        }).catch((e: AxiosError<any>) => {
            if(e.response?.status === 401){
                return Alert({
                    icon: "error",
                    title: "Erro",
                    text: "E-mail ou senha inválidos. Por favor, tente novamente."
                });
            } else {
                Alert({
                    icon: "error",
                    title: "Erro",
                    text: e.response?.data.message ?? "Ocorreu um erro ao realizar o seu login. Por favor, tente novamente."
                });
            }
        }).finally(() => {
            setSubmitting(false);
        });
    };

    return (
        <>
            <Head>
                <title>Login - Pelada.com</title>
            </Head>
            
            <div className="login-container">

                <div className="form-wrapper">
                    <div className="mb-4">
                        <Image src={Logo} alt="Pelada" className="img-fluid w-50" />
                    </div>
                    <div className="card shadow border-0 rounded-4">
                        <div className="card-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <h2 className="mb-4">Login</h2>
                                <div className="form-floating mb-2">
                                    <input {...register("email", {required: true})} type="email" className="form-control" placeholder="Endereço de e-mail" />
                                    <label htmlFor="email">Endereço de e-mail</label>
                                </div>
                                <div className="form-floating mb-4">
                                    <input {...register("password", {required: true})} type="password" className="form-control" placeholder="Senha" />
                                    <label htmlFor="password">Senha</label>
                                </div>
                                <button type="submit" className="btn btn-success" disabled={submitting}>
                                    { submitting ? (
                                            <div className="spinner-border spinner-border-sm" role="status">
                                                <span className="visually-hidden">Carregando...</span>
                                            </div>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faLock} fixedWidth /> Entrar
                                        </>
                                    ) }
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="image-container">
                    <div className="image-wrapper">
                        <Image src={SideImage} alt="Pelada" />
                    </div>
                </div>

            </div>
        </>
    );
}