import { IPlayer } from "@/interfaces/IPlayer";
import { IUser } from "@/interfaces/IUser";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, FormEvent, useState } from "react";
import { useForm } from "react-hook-form";

export default function PlayerForm({ player, onSubmit, onCancel, loading }: { player?: IPlayer, onSubmit: (data: any) => void, onCancel: () => void, loading?: boolean })
{
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {is_goalkeeper: false, ...player, user: { ...player?.user, password: "", password_confirmation: "" }},
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-12 col-lg-6">
                    <div className="form-floating mb-3">
                        <input {...register("user.email", { required: true })} type="email" className="form-control" placeholder="E-mail*" />
                        <label htmlFor="email" className="form-label">E-mail*</label>
                    </div>
                </div>
                <div className="col-12 col-lg-6">
                    <div className="form-floating mb-3">
                        <input {...register("user.password")} type="password" className="form-control" placeholder="Senha*" />
                        <label htmlFor="password" className="form-label">Senha*</label>
                    </div>
                </div>
                <div className="col-12 col-lg-6">
                    <div className="form-floating mb-3">
                        <input {...register("user.password_confirmation")} type="password" className="form-control" placeholder="Confirme a senha*" />
                        <label htmlFor="password_confirmation" className="form-label">Confirme a senha*</label>
                    </div>
                </div>
                <div className="col-12 col-lg-4">
                    <div className="form-floating mb-3">
                        <input {...register("name")} type="text" className="form-control" placeholder="Nome do jogador*" />
                        <label htmlFor="name" className="form-label">Nome do jogador*</label>
                    </div>
                </div>
                <div className="col-12 col-lg-4">
                    <div className="mb-3">
                        <label htmlFor="level" className="form-label">Nível de habilidade*</label>
                        <input {...register("level", {required: true})} type="range" className="form-range" min="1" max="5" style={{height:"1rem"}} />
                        <div className="d-flex flex-row justify-content-between px-1">
                            <span className="small">1</span>
                            <span className="small">2</span>
                            <span className="small">3</span>
                            <span className="small">4</span>
                            <span className="small">5</span>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4">
                    <div className="form-check form-switch mb-3">
                        <input {...register("is_goalkeeper")} type="checkbox" className="form-check-input" />
                        <label htmlFor="is_goalkeeper" className="form-check-label">É goleiro?</label>
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