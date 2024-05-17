import { Alert } from "@/helpers/Alert";
import Api from "@/services/Api";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ConfirmInvite()
{
    const router = useRouter();
    const { invite_id } = router.query;

    useEffect(() => {
        if(router.isReady){
            confirmInvite();
        }
    }, [router]);

    const confirmInvite = () => {
        Api.post(`/invites/${invite_id}/confirm`).then(() => {
            Alert({
                title: "Sucesso",
                text: "Convite confirmado com sucesso.",
                icon: "success"
            }).then(() => {
                router.push("/");
            });
        }).catch((err: AxiosError<any>) => {
            Alert({
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro ao confirmar o convite. Verifique a URL ou o link clicado.",
                icon: "error"
            });
        });
    };
}