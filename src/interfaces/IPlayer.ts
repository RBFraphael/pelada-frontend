import { IInvite } from "./IInvite";
import { ITeam } from "./ITeam";
import { IUser } from "./IUser";

export interface IPlayer {
    id?: number;
    user_id: number;
    name: string;
    level: number;
    is_goalkeeper: boolean;
    invites?: IInvite[];
    teams?: ITeam[];
    user?: IUser;
}