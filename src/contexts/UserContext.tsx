import { IUser } from "@/interfaces/IUser";
import React, { createContext } from "react";

interface IUserContextProps {
    user: IUser|null;
    setUser: (user: IUser|null) => void;
}

const UserContext = createContext<IUserContextProps>({
    user: null,
    setUser: () => {},
});

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = React.useState<IUser|null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            { children }
        </UserContext.Provider>
    );
}

export {
    UserContext,
    UserContextProvider,
}