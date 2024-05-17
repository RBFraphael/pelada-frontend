import { IGame } from "./IGame";
import { IPlayer } from "./IPlayer";

export interface IInvite {
    id?: number;
    game_id: number;
    player_id: number;
    status: InviteStatus;
    game?: IGame;
    player?: IPlayer;
}

export enum InviteStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    REJECTED = 'rejected',
}

export function InviteStatusLabel(status: InviteStatus) {
    switch (status) {
        case InviteStatus.PENDING:
            return 'Pendente';
        case InviteStatus.CONFIRMED:
            return 'Confirmado';
        case InviteStatus.REJECTED:
            return 'Rejeitado';
    }
}

export function InviteStatusColorClass(status: InviteStatus){
    switch (status) {
        case InviteStatus.PENDING:
            return 'text-warning';
        case InviteStatus.CONFIRMED:
            return 'text-success';
        case InviteStatus.REJECTED:
            return 'text-danger';
    }
}