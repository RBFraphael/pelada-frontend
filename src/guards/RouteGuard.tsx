import { UserContext } from "@/contexts/UserContext";
import { IUser } from "@/interfaces/IUser";
import AdminPanel from "@/layouts/AdminPanel";
import Api from "@/services/Api";
import { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

export default function RouteGuard({ children }: { children: React.ReactNode })
{
    const router = useRouter();
    const {user, setUser} = useContext(UserContext);

    const [render, setRender] = useState<boolean>(false);
    const [adminPanel, setAdminPanel] = useState<boolean>(false);

    const publicRoutes: RegExp[] = [
        /login/,
    ];

    useEffect(() => {
        let isPublic: boolean = publicRoutes.filter((route: RegExp) => route.test(router.asPath)).length > 0;
        let isHome: boolean = router.asPath == "/";
        let isInviteConfirm = router.asPath.includes("/i/");
        let savedToken: string|null = localStorage.getItem("access_token");

        if(isHome){
            router.push( savedToken ? "/dashboard" : "/login" );
        } else if(isInviteConfirm){
            setAdminPanel(false);
            setRender(true);
        } else {
            if(savedToken){
                setAdminPanel(true);
                if(isPublic){
                    router.push("/dashboard");
                } else {
                    if(user == null){
                        Api.get("/auth/me").then((res: AxiosResponse<IUser>) => {
                            setUser(res.data);
                            setRender(true);
                        });
                    } else {
                        setRender(true);
                    }
                }
            } else {
                if(!isPublic){
                    router.push("/login");
                } else {
                    setAdminPanel(false);
                    setRender(true);
                }
            }
        }

    }, [router.pathname]);

    return (
        <>
            {render && (
                <>
                    { adminPanel ? (
                        <AdminPanel>
                            { children }
                        </AdminPanel>
                    ) : children }
                </>
            )}
        </>
    );
}