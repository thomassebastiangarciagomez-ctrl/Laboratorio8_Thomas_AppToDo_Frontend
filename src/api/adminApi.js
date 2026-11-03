import { request } from "./http";

const API_URL = "http://localhost:8080/api/v1/admin";

/**
 * GET /admin/summary. Solo responde 200 con un token de ADMIN; con USER devuelve 403.
 * Devuelve { totalUsers, totalTasks, tasksByStatus: { PENDING, IN_PROGRESS, COMPLETED } }.
 */
export function getSummary() {
    return request(`${API_URL}/summary`);
}
