import { IPlayer } from "./IPlayer";

export interface IUser {
    id?: number;
    name: string;
    email: string;
    password?: string;
    player?: IPlayer;
}