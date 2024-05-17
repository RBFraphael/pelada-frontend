import { IGame } from "@/interfaces/IGame";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";

export default function GameForm({ game, onSubmit, onCancel, loading }: { game?: IGame, onSubmit: (data: any) => void, onCancel: () => void, loading?: boolean })
{
    const { register, handleSubmit, reset } = useForm({
        defaultValues: game,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-12 col-lg-6">
                    <div className="form-floating mb-3">
                        <input {...register("date", { required: true })} type="date" className="form-control" placeholder="Data do jogo*" />
                        <label htmlFor="date" className="form-label">Data do jogo*</label>
                    </div>
                </div>
                <div className="col-12 col-lg-6">
                    <div className="form-floating mb-3">
                        <input {...register("players_per_team", { required: true })} type="number" className="form-control" placeholder="Jogadores por time*" />
                        <label htmlFor="players_per_team" className="form-label">Jogadores por time*</label>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
                    <FontAwesomeIcon icon={faTimes} fixedWidth /> Cancelar
                </button>
                <button type="submit" className="btn btn-success" disabled={loading}>
                    { loading ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faSave} fixedWidth /> Salvar
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}