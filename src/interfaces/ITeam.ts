import { IGame } from "./IGame";
import { IPlayer } from "./IPlayer";

export interface ITeam {
    id?: number;
    game_id: number;
    name: string;
    average_level: number;
    players_count: number;
    game?: IGame;
    players?: IPlayer[];
}