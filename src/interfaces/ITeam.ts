import { IGame } from "./IGame";
import { IPlayer } from "./IPlayer";

export interface ITeam {
    id?: number;
    game_id: number;
    name: string;
    game?: IGame;
    players?: IPlayer[];
}