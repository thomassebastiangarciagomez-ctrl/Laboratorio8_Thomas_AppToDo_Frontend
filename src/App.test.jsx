import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { App } from "./App";
import { clearSession, getAuthToken } from "./api/session";

const ANA = { id: 1, name: "Ana Pérez", email: "ana@example.com", role: "USER" };
const LUIS = { id: 2, name: "Luis Gómez", email: "luis@example.com", role: "USER" };
const ADMIN = { id: 9, name: "Admin Local", email: "admin@todo.local", role: "ADMIN" };
const TASK_ANA = { id: 10, title: "Entregar laboratorio", status: "PENDING", priority: "HIGH" };
const TASK_LUIS = { id: 20, title: "Organizar apuntes", status: "COMPLETED", priority: "LOW" };
const SUMMARY = { totalUsers: 3, totalTasks: 12, tasksByStatus: { PENDING: 7, IN_PROGRESS: 3, COMPLETED: 2 } };

const PROFILES = { "token-ana": ANA, "token-luis": LUIS, "token-admin": ADMIN };
const TASKS = { "token-ana": [TASK_ANA], "token-luis": [TASK_LUIS], "token-admin": [] };

function json(status, body) {
    return { ok: status >= 200 && status < 300, status, json: async () => body };
}

function tokenFor(email) {
    if (email.startsWith("ana")) return "token-ana";
    if (email.startsWith("admin")) return "token-admin";
    return "token-luis";
}

/** Backend simulado: cada token devuelve únicamente los datos de su dueño y el resumen solo al ADMIN. */
function fakeBackend({ expireTasks = false, failLogin = false } = {}) {
    return vi.fn(async (url, options = {}) => {
        const token = options.headers?.Authorization?.replace("Bearer ", "");
        if (url.endsWith("/auth/login")) {
            if (failLogin) return json(401, { status: 401, message: "Credenciales inválidas" });
            const { email } = JSON.parse(options.body);
            return json(200, { tokenType: "Bearer", accessToken: tokenFor(email), expiresIn: 1800 });
        }
        if (url.endsWith("/users/me")) {
            return json(200, PROFILES[token]);
        }
        if (url.endsWith("/tasks")) {
            if (expireTasks) return json(401, {});
            return json(200, TASKS[token]);
        }
        if (url.endsWith("/admin/summary")) {
            return PROFILES[token]?.role === "ADMIN" ? json(200, SUMMARY) : json(403, {});
        }
        return json(404, {});
    });
}

async function loginAs(email) {
    fireEvent.change(screen.getByLabelText("Correo"), { target: { value: email } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "ContrasenaDemo123!" } });
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
}

describe("App autenticada", () => {
    beforeEach(() => {
        clearSession();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("sin sesión muestra el inicio de sesión y no consulta tareas", () => {
        vi.stubGlobal("fetch", fakeBackend());
        render(<App />);

        expect(screen.getByText("INICIAR SESIÓN")).toBeTruthy();
        expect(fetch).not.toHaveBeenCalled();
    });

    it("permite cambiar entre inicio de sesión y registro", () => {
        vi.stubGlobal("fetch", fakeBackend());
        render(<App />);

        fireEvent.click(screen.getByRole("button", { name: "Regístrate" }));
        expect(screen.getByText("CREAR CUENTA")).toBeTruthy();

        fireEvent.click(screen.getByRole("button", { name: "Inicia sesión" }));
        expect(screen.getByText("INICIAR SESIÓN")).toBeTruthy();
    });

    it("muestra el error cuando las credenciales son inválidas", async () => {
        vi.stubGlobal("fetch", fakeBackend({ failLogin: true }));
        render(<App />);

        await loginAs("ana@example.com");

        expect((await screen.findByRole("alert")).textContent).toBe("Credenciales inválidas");
        expect(getAuthToken()).toBeNull();
    });

    it("tras iniciar sesión muestra el nombre y solo las tareas de la usuaria", async () => {
        vi.stubGlobal("fetch", fakeBackend());
        render(<App />);

        await loginAs("ana@example.com");

        expect(await screen.findByText("Ana Pérez")).toBeTruthy();
        expect(await screen.findByText("Entregar laboratorio")).toBeTruthy();
        expect(screen.queryByText("Organizar apuntes")).toBeNull();
    });

    it("PT-16: cerrar sesión elimina el token y oculta las tareas", async () => {
        vi.stubGlobal("fetch", fakeBackend());
        render(<App />);
        await loginAs("ana@example.com");
        await screen.findByText("Entregar laboratorio");

        fireEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));

        expect(screen.getByText("INICIAR SESIÓN")).toBeTruthy();
        expect(screen.queryByText("Entregar laboratorio")).toBeNull();
        expect(getAuthToken()).toBeNull();
    });

    it("PT-18: otro usuario que inicia sesión solo ve sus propias tareas", async () => {
        vi.stubGlobal("fetch", fakeBackend());
        render(<App />);
        await loginAs("ana@example.com");
        await screen.findByText("Entregar laboratorio");
        fireEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));

        await loginAs("luis@example.com");

        expect(await screen.findByText("Luis Gómez")).toBeTruthy();
        expect(await screen.findByText("Organizar apuntes")).toBeTruthy();
        expect(screen.queryByText("Entregar laboratorio")).toBeNull();
    });

    it("PT-17: un 401 del backend devuelve al inicio de sesión con un aviso", async () => {
        vi.stubGlobal("fetch", fakeBackend({ expireTasks: true }));
        render(<App />);

        await loginAs("ana@example.com");

        expect(await screen.findByText("INICIAR SESIÓN")).toBeTruthy();
        expect((await screen.findByRole("status")).textContent).toContain("Tu sesión expiró");
        expect(getAuthToken()).toBeNull();
    });

    it("la contraseña del login se puede mostrar y ocultar", () => {
        vi.stubGlobal("fetch", fakeBackend());
        render(<App />);
        const input = screen.getByLabelText("Contraseña");

        fireEvent.click(screen.getByRole("button", { name: "Mostrar contraseña" }));

        expect(input.type).toBe("text");
    });

    describe("rol de administrador", () => {
        it("un USER no ve la pestaña Resumen ni la insignia ADMIN", async () => {
            vi.stubGlobal("fetch", fakeBackend());
            render(<App />);

            await loginAs("ana@example.com");
            await screen.findByText("Entregar laboratorio");

            expect(screen.queryByRole("button", { name: "Resumen" })).toBeNull();
            expect(screen.queryByText("ADMIN")).toBeNull();
        });

        it("un ADMIN puede abrir el resumen y volver a sus tareas", async () => {
            vi.stubGlobal("fetch", fakeBackend());
            render(<App />);

            await loginAs("admin@todo.local");
            expect(await screen.findByText("ADMIN")).toBeTruthy();

            fireEvent.click(screen.getByRole("button", { name: "Resumen" }));

            expect((await screen.findByTestId("stat-users")).textContent).toBe("3");
            expect(screen.getByTestId("stat-tasks").textContent).toBe("12");
            expect(screen.getByTestId("stat-PENDING").textContent).toBe("7");

            fireEvent.click(screen.getByRole("button", { name: "Mis tareas" }));

            expect(await screen.findByText("No hay tareas registradas.")).toBeTruthy();
            expect(screen.queryByTestId("stat-users")).toBeNull();
        });

        it("al cambiar de ADMIN a USER no queda abierta la vista del resumen", async () => {
            vi.stubGlobal("fetch", fakeBackend());
            render(<App />);
            await loginAs("admin@todo.local");
            fireEvent.click(await screen.findByRole("button", { name: "Resumen" }));
            await screen.findByTestId("stat-users");
            fireEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));

            await loginAs("ana@example.com");

            expect(await screen.findByText("Entregar laboratorio")).toBeTruthy();
            expect(screen.queryByTestId("stat-users")).toBeNull();
        });
    });
});
