import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getTasks, createTask, deleteTask, getTask } from "./taskApi";
import { clearSession, setAuthToken, setUnauthorizedHandler } from "./session";

function response(status, body) {
    return { ok: status >= 200 && status < 300, status, json: async () => body };
}

describe("taskApi con sesión JWT", () => {
    beforeEach(() => {
        clearSession();
        setUnauthorizedHandler(null);
        vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("envía Authorization: Bearer con el token en memoria", async () => {
        setAuthToken("abc.def.ghi");
        fetch.mockResolvedValue(response(200, []));

        await getTasks();

        const [, options] = fetch.mock.calls[0];
        expect(options.headers.Authorization).toBe("Bearer abc.def.ghi");
    });

    it("envía el cuerpo JSON y el token al crear una tarea", async () => {
        setAuthToken("tok");
        fetch.mockResolvedValue(response(201, { id: 1 }));

        await createTask({ title: "Nueva" });

        const [url, options] = fetch.mock.calls[0];
        expect(url).toBe("http://localhost:8080/api/v1/tasks");
        expect(options.method).toBe("POST");
        expect(options.headers["Content-Type"]).toBe("application/json");
        expect(options.headers.Authorization).toBe("Bearer tok");
        expect(JSON.parse(options.body)).toEqual({ title: "Nueva" });
    });

    it("no envía Authorization si no hay sesión", async () => {
        fetch.mockResolvedValue(response(200, []));

        await getTasks();

        const [, options] = fetch.mock.calls[0];
        expect(options.headers.Authorization).toBeUndefined();
    });

    it("ante un 401 con sesión activa avisa para cerrar la sesión (PT-17)", async () => {
        const handler = vi.fn();
        setUnauthorizedHandler(handler);
        setAuthToken("expirado");
        fetch.mockResolvedValue(response(401, {}));

        await expect(getTasks()).rejects.toThrow("sesión expiró");
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it("un 401 sin sesión no dispara el aviso", async () => {
        const handler = vi.fn();
        setUnauthorizedHandler(handler);
        fetch.mockResolvedValue(response(401, {}));

        await expect(getTasks()).rejects.toThrow();
        expect(handler).not.toHaveBeenCalled();
    });

    it("traduce un 403 a un mensaje de permisos", async () => {
        setAuthToken("tok");
        fetch.mockResolvedValue({ ok: false, status: 403, json: async () => { throw new Error("sin cuerpo"); } });

        await expect(getTasks()).rejects.toThrow("No tienes permisos");
    });

    it("usa el mensaje del backend en un 404", async () => {
        setAuthToken("tok");
        fetch.mockResolvedValue(response(404, { status: 404, message: "Tarea no encontrada" }));

        await expect(getTask(25)).rejects.toThrow("Tarea no encontrada");
    });

    it("devuelve null en un 204 (eliminar)", async () => {
        setAuthToken("tok");
        fetch.mockResolvedValue({ ok: true, status: 204, json: async () => { throw new Error("sin cuerpo"); } });

        await expect(deleteTask(1)).resolves.toBeNull();
    });

    it("informa cuando no hay conexión con el servidor", async () => {
        setAuthToken("tok");
        fetch.mockRejectedValue(new TypeError("Failed to fetch"));

        await expect(getTasks()).rejects.toThrow("No se pudo conectar");
    });
});
