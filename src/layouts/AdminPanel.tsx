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

            <footer className="panel-footer border-top p-2 d-flex d-lg-none flex-row justify-content-between bg-light shadow">
                <Link href="/dashboard" className="btn btn-light border-0">
                    <FontAwesomeIcon icon={faGauge} fixedWidth /> <span className="d-none d-md-inline">Dashboard</span>
                </Link>
                <Link href="/users" className="btn btn-light border-0">
                    <FontAwesomeIcon icon={faUsers} fixedWidth /> <span className="d-none d-md-inline">Usuários</span>
                </Link>
                <Link href="/players" className="btn btn-light border-0">
                    <FontAwesomeIcon icon={faPersonRunning} fixedWidth /> <span className="d-none d-md-inline">Jogadores</span>
                </Link>
                <Link href="/games" className="btn btn-light">
                    <FontAwesomeIcon icon={faFutbol} fixedWidth /> <span className="d-none d-md-inline">Jogos</span>
                </Link>
                <Link href="/logout" className="btn btn-dark border-0">
                    <FontAwesomeIcon icon={faSignOut} fixedWidth /> <span className="d-none d-md-inline">Sair</span>
                </Link>
            </footer>
        </>
    );
}