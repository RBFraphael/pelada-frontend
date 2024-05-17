import { useRouter } from "next/router";

export default function Home() {

    const router = useRouter();

    if(typeof window !== "undefined"){
        if(localStorage.getItem("access_token")){
            router.push("/dashboard");
        } else {
            router.push("/login");
        }
    }

    return (
        <>
        </>
    );
}
