import { IInvite } from "./IInvite";
import { ITeam } from "./ITeam";

export interface IGame {
    id?: number;
    date: string;
    players_per_team: number;
    invites?: IInvite[];
    teams?: ITeam[];
}