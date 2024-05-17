import { Alert } from "@/helpers/Alert";
import Api from "@/services/Api";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function RejectInvite()
{
    const router = useRouter();
    const { invite_id } = router.query;

    useEffect(() => {
        if(router.isReady){
            rejectInvite();
        }
    }, [router]);

    const rejectInvite = () => {
        Api.post(`/invites/${invite_id}/reject`).then(() => {
            Alert({
                title: "Sucesso",
                text: "Convite recusado com sucesso.",
                icon: "success"
            }).then(() => {
                router.push("/");
            });
        }).catch((err: AxiosError<any>) => {
            Alert({
                title: "Erro",
                text: err.response?.data.message ?? "Ocorreu um erro ao recusar o convite. Verifique a URL ou o link clicado.",
                icon: "error"
            });
        });
    };
}