import { UserContextProvider } from "@/contexts/UserContext";
import RouteGuard from "@/guards/RouteGuard";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <UserContextProvider>
            <RouteGuard>
                <Component {...pageProps} />
            </RouteGuard>
        </UserContextProvider>
    );
}
