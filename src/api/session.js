/**
 * Sesión en memoria. El JWT vive solo en esta variable de módulo: no se guarda en localStorage ni
 * sessionStorage, por lo que se pierde al recargar la página (decisión del laboratorio).
 */
let authToken = null;
let unauthorizedHandler = null;

export function setAuthToken(token) {
    authToken = token;
}

export function getAuthToken() {
    return authToken;
}

export function clearSession() {
    authToken = null;
}

/**
 * Registra la función que se ejecuta cuando el backend responde 401 a una petición autenticada
 * (token expirado, alterado o inválido). La registra el AuthProvider.
 */
export function setUnauthorizedHandler(handler) {
    unauthorizedHandler = handler;
}

/**
 * Solo avisa si había una sesión activa, para no mostrar "sesión expirada" a quien ya cerró sesión.
 */
export function notifyUnauthorized() {
    if (authToken && unauthorizedHandler) {
        unauthorizedHandler();
    }
}
