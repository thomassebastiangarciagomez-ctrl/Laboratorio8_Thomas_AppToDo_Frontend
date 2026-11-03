import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

describe("LoginForm", () => {
    it("envía el correo y la contraseña escritos", () => {
        const onSubmit = vi.fn();
        render(<LoginForm onSubmit={onSubmit} onSwitchToRegister={() => {}} />);

        fireEvent.change(screen.getByLabelText("Correo"), { target: { value: "ana@example.com" } });
        fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "ContrasenaDemo123!" } });
        fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

        expect(onSubmit).toHaveBeenCalledWith({ email: "ana@example.com", password: "ContrasenaDemo123!" });
    });

    it("muestra el error y el aviso recibidos", () => {
        render(<LoginForm onSubmit={() => {}} onSwitchToRegister={() => {}} error="Credenciales inválidas" notice="Tu sesión expiró." />);

        expect(screen.getByRole("alert").textContent).toBe("Credenciales inválidas");
        expect(screen.getByRole("status").textContent).toBe("Tu sesión expiró.");
    });

    it("deshabilita el botón mientras carga", () => {
        render(<LoginForm onSubmit={() => {}} onSwitchToRegister={() => {}} loading />);

        expect(screen.getByRole("button", { name: "Ingresando..." }).disabled).toBe(true);
    });

    it("permite mostrar y ocultar la contraseña", () => {
        render(<LoginForm onSubmit={() => {}} onSwitchToRegister={() => {}} />);
        const input = screen.getByLabelText("Contraseña");
        expect(input.type).toBe("password");

        fireEvent.click(screen.getByRole("button", { name: "Mostrar contraseña" }));
        expect(input.type).toBe("text");

        fireEvent.click(screen.getByRole("button", { name: "Ocultar contraseña" }));
        expect(input.type).toBe("password");
    });

    it("permite ir al registro", () => {
        const onSwitchToRegister = vi.fn();
        render(<LoginForm onSubmit={() => {}} onSwitchToRegister={onSwitchToRegister} />);

        fireEvent.click(screen.getByRole("button", { name: "Regístrate" }));

        expect(onSwitchToRegister).toHaveBeenCalled();
    });
});

describe("RegisterForm", () => {
    it("envía nombre, correo y contraseña", () => {
        const onSubmit = vi.fn();
        render(<RegisterForm onSubmit={onSubmit} onSwitchToLogin={() => {}} />);

        fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ana Pérez" } });
        fireEvent.change(screen.getByLabelText("Correo"), { target: { value: "ana@example.com" } });
        fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "ContrasenaDemo123!" } });
        fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));

        expect(onSubmit).toHaveBeenCalledWith({ name: "Ana Pérez", email: "ana@example.com", password: "ContrasenaDemo123!" });
    });

    it("permite mostrar y ocultar la contraseña", () => {
        render(<RegisterForm onSubmit={() => {}} onSwitchToLogin={() => {}} />);
        const input = screen.getByLabelText("Contraseña");

        fireEvent.click(screen.getByRole("button", { name: "Mostrar contraseña" }));
        expect(input.type).toBe("text");
        fireEvent.click(screen.getByRole("button", { name: "Ocultar contraseña" }));
        expect(input.type).toBe("password");
    });

    it("pide mínimo 8 caracteres en la contraseña", () => {
        render(<RegisterForm onSubmit={() => {}} onSwitchToLogin={() => {}} />);

        expect(screen.getByLabelText("Contraseña").getAttribute("minlength")).toBe("8");
    });

    it("muestra el error y permite volver al login", () => {
        const onSwitchToLogin = vi.fn();
        render(<RegisterForm onSubmit={() => {}} onSwitchToLogin={onSwitchToLogin} error="El correo ya está registrado" />);

        expect(screen.getByRole("alert").textContent).toBe("El correo ya está registrado");
        fireEvent.click(screen.getByRole("button", { name: "Inicia sesión" }));
        expect(onSwitchToLogin).toHaveBeenCalled();
    });
});
