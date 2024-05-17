import { UserContext } from "@/contexts/UserContext";
import { faFutbol, faGauge, faPersonRunning, faSignOut, faUserCircle, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import Logo from "@/assets/images/pelada-logo.svg";

export default function AdminPanel({ children }: { children: React.ReactNode }) {
    const {user} = useContext(UserContext);

    return (
        <>
            <div className="admin-panel">
                <aside className="sidebar">
                    <div className="main-menu p-2">
                        <Image src={Logo} alt="Pelada" className="img-fluid w-50 mb-4" />
                        <nav>
                            <ul className="list-unstyled m-0">
                                <li className="mb-1">
                                    <Link className="btn btn-light btn-lg border-0 w-100 text-start" href="/dashboard">
                                        <FontAwesomeIcon icon={faGauge} fixedWidth /> Dashboard
                                    </Link>
                                </li>
                                <li className="mb-1">
                                    <Link className="btn btn-light btn-lg border-0 w-100 text-start" href="/users">
                                        <FontAwesomeIcon icon={faUsers} fixedWidth /> Usuários
                                    </Link>
                                </li>
                                <li className="mb-1">
                                    <Link className="btn btn-light btn-lg border-0 w-100 text-start" href="/players">
                                        <FontAwesomeIcon icon={faPersonRunning} fixedWidth /> Jogadores
                                    </Link>
                                </li>
                                <li className="mb-1">
                                    <Link className="btn btn-light btn-lg border-0 w-100 text-start" href="/games">
                                        <FontAwesomeIcon icon={faFutbol} fixedWidth /> Jogos
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="profile-menu p-2">
                        <nav>
                            <ul className="list-unstyled m-0">
                                <li>
                                    <div className="py-2">
                                        <div className="text-light shadow-sm user-card rounded-3 p-3 d-flex flex-row align-items-center gap-2">
                                            <FontAwesomeIcon icon={faUserCircle} fixedWidth size="xl" />
                                            <h5 className="m-0">Olá, { user?.name }</h5>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <Link className="btn btn-light btn-lg border-0 w-100 text-start" href="/logout">
                                        <FontAwesomeIcon icon={faSignOut} fixedWidth /> Sair
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </aside>
                <main className="content-wrapper">
                    { children }
                </main>
            </div>
        </>
    );
}