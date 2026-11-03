import { request } from "./http";

const API_URL = "http://localhost:8080/api/v1/tasks";

/**
 * Todas las operaciones son protegidas: el cliente HTTP agrega el token de la sesión en memoria.
 */
export function getTasks() {
    return request(API_URL);
}

export function getTask(id) {
    return request(`${API_URL}/${id}`);
}

/**
 * @param {*} task
 */
export function createTask(task) {
    return request(API_URL, { method: "POST", body: task });
}

/**
 * @param {*} id
 * @param {*} task
 */
export function updateTask(id, task) {
    return request(`${API_URL}/${id}`, { method: "PUT", body: task });
}

/**
 * @param {*} id
 */
export function deleteTask(id) {
    return request(`${API_URL}/${id}`, { method: "DELETE" });
}
