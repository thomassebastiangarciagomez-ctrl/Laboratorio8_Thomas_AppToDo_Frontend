import { getAuthToken, notifyUnauthorized } from "./session";

/**
 * Cliente HTTP común. Agrega Authorization: Bearer <token> a las peticiones protegidas y traduce los
 * errores de red y de seguridad a mensajes que la interfaz puede mostrar.
 *
 * @param {string} url
 * @param {{ method?: string, body?: any, auth?: boolean }} options  auth=false para login y registro
 */
export async function request(url, { method = "GET", body, auth = true } = {}) {
    const headers = {};
    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }
    const token = auth ? getAuthToken() : null;
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(url, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    } catch {
        throw new Error("No se pudo conectar con el servidor.");
    }

    // Token expirado o inválido en una ruta protegida: se limpia la sesión y se vuelve al login.
    if (response.status === 401 && auth) {
        notifyUnauthorized();
        throw new Error("Tu sesión expiró. Inicia sesión de nuevo.");
    }

    if (!response.ok) {
        let message = response.status === 403
            ? "No tienes permisos para realizar esta acción."
            : `Error ${response.status}`;
        try {
            const data = await response.json();
            message = data.message || message;
        } catch {}
        throw new Error(message);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}
