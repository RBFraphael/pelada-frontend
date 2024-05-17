import { IUser } from "@/interfaces/IUser";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, FormEvent, useState } from "react";
import { useForm } from "react-hook-form";

export default function UserForm({ user, onSubmit, onCancel, loading }: { user?: IUser, onSubmit: (data: any) => void, onCancel: () => void, loading?: boolean })
{
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {...user, password: "", password_confirmation: ""},
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-12 col-lg-6">
                    <div className="form-floating mb-3">
                        <input {...register("name", { required: true })} type="text" className="form-control" placeholder="Nome*" />
                        <label htmlFor="name" className="form-label">Nome*</label>
                    </div>
                </div>
                <div className="col-12 col-lg-6">
                    <div className="form-floating mb-3">
                        <input {...register("email", { required: true })} type="email" className="form-control" placeholder="E-mail*" />
                        <label htmlFor="email" className="form-label">E-mail*</label>
                    </div>
                </div>
                <div className="col-12 col-lg-6">
                    <div className="form-floating mb-3">
                        <input {...register("password")} type="password" className="form-control" placeholder="Senha*" />
                        <label htmlFor="password" className="form-label">Senha*</label>
                    </div>
                </div>
                <div className="col-12 col-lg-6">
                    <div className="form-floating mb-3">
                        <input {...register("password_confirmation")} type="password" className="form-control" placeholder="Confirme a senha*" />
                        <label htmlFor="password_confirmation" className="form-label">Confirme a senha*</label>
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