import Swal, { SweetAlertOptions } from "sweetalert2";

export function Alert(options: SweetAlertOptions) {
    let alertOptions = {
        buttonsStyling: false,
        ...options
    }

    alertOptions.customClass = {
        cancelButton: "btn btn-danger px-4",
        confirmButton: "btn btn-primary px-4",
        closeButton: "btn btn-secondary px-4",
        actions: "d-flex justify-content-center gap-2",
        popup: "shadow-sm rounded-4",
        ...(
            typeof options.customClass === "object" ? options.customClass : {}
        )
    };

    return Swal.fire(alertOptions);
}