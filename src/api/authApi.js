import { request } from "./http";

const API_URL = "http://localhost:8080/api/v1";

/**
 * POST /auth/login. Devuelve { tokenType, accessToken, expiresIn }.
 */
export function login({ email, password }) {
    return request(`${API_URL}/auth/login`, { method: "POST", body: { email, password }, auth: false });
}

/**
 * POST /auth/register. Devuelve el usuario creado (sin contraseña).
 */
export function register({ name, email, password }) {
    return request(`${API_URL}/auth/register`, { method: "POST", body: { name, email, password }, auth: false });
}

/**
 * GET /users/me. Perfil del usuario dueño del token actual.
 */
export function getProfile() {
    return request(`${API_URL}/users/me`);
}
