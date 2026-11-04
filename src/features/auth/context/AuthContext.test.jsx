import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import * as authApi from "../../../api/authApi";
import { clearSession, getAuthToken, notifyUnauthorized } from "../../../api/session";

vi.mock("../../../api/authApi");

function Probe() {
    const { user, isAuthenticated, sessionNotice, login, logout } = useAuth();
    return (
        <div>
            <p>{isAuthenticated ? `dentro:${user.name}` : "fuera"}</p>
            <p data-testid="notice">{sessionNotice ?? ""}</p>
            <button onClick={() => login({ email: "ana@example.com", password: "x" }).catch(() => {})}>entrar</button>
            <button onClick={logout}>salir</button>
        </div>
    );
}

function renderProbe() {
    return render(<AuthProvider><Probe /></AuthProvider>);
}

describe("AuthContext", () => {
    beforeEach(() => {
        clearSession();
        vi.resetAllMocks();
    });

    it("al iniciar sesión guarda el token en memoria y el usuario", async () => {
        authApi.login.mockResolvedValue({ accessToken: "tok" });
        authApi.getProfile.mockResolvedValue({ id: 1, name: "Ana Pérez" });
        renderProbe();

        fireEvent.click(screen.getByText("entrar"));

        expect(await screen.findByText("dentro:Ana Pérez")).toBeTruthy();
        expect(getAuthToken()).toBe("tok");
    });

    it("si falla la carga del perfil no deja la sesión abierta", async () => {
        authApi.login.mockResolvedValue({ accessToken: "tok" });
        authApi.getProfile.mockRejectedValue(new Error("fallo"));
        renderProbe();

        fireEvent.click(screen.getByText("entrar"));

        await act(async () => {});
        expect(screen.getByText("fuera")).toBeTruthy();
        expect(getAuthToken()).toBeNull();
    });

    it("cerrar sesión elimina el usuario y el token (PT-16)", async () => {
        authApi.login.mockResolvedValue({ accessToken: "tok" });
        authApi.getProfile.mockResolvedValue({ id: 1, name: "Ana Pérez" });
        renderProbe();
        fireEvent.click(screen.getByText("entrar"));
        await screen.findByText("dentro:Ana Pérez");

        fireEvent.click(screen.getByText("salir"));

        expect(screen.getByText("fuera")).toBeTruthy();
        expect(getAuthToken()).toBeNull();
    });

    it("un 401 en una petición protegida cierra la sesión y avisa (PT-17)", async () => {
        authApi.login.mockResolvedValue({ accessToken: "tok" });
        authApi.getProfile.mockResolvedValue({ id: 1, name: "Ana Pérez" });
        renderProbe();
        fireEvent.click(screen.getByText("entrar"));
        await screen.findByText("dentro:Ana Pérez");

        act(() => notifyUnauthorized());

        expect(screen.getByText("fuera")).toBeTruthy();
        expect(screen.getByTestId("notice").textContent).toContain("Tu sesión expiró");
        expect(getAuthToken()).toBeNull();
    });

    it("useAuth fuera del AuthProvider lanza un error claro", () => {
        const spy = vi.spyOn(console, "error").mockImplementation(() => {});
        expect(() => render(<Probe />)).toThrow("AuthProvider");
        spy.mockRestore();
    });
});
