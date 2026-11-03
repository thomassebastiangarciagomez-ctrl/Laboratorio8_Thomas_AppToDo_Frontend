import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PasswordInput } from "./PasswordInput";

function renderInput(props = {}) {
    return render(
        <div>
            <label htmlFor="pw">Contraseña</label>
            <PasswordInput id="pw" value="secreto123" onChange={() => {}} {...props} />
        </div>
    );
}

describe("PasswordInput", () => {
    it("por defecto oculta la contraseña con puntos", () => {
        renderInput();

        expect(screen.getByLabelText("Contraseña").type).toBe("password");
        expect(screen.getByRole("button", { name: "Mostrar contraseña" })).toBeTruthy();
    });

    it("permite mostrar la contraseña y volver a ocultarla", () => {
        renderInput();
        const input = screen.getByLabelText("Contraseña");

        fireEvent.click(screen.getByRole("button", { name: "Mostrar contraseña" }));
        expect(input.type).toBe("text");
        expect(input.value).toBe("secreto123");
        expect(screen.getByRole("button", { name: "Ocultar contraseña" }).getAttribute("aria-pressed")).toBe("true");

        fireEvent.click(screen.getByRole("button", { name: "Ocultar contraseña" }));
        expect(input.type).toBe("password");
    });

    it("el botón no envía el formulario", () => {
        const onSubmit = vi.fn((e) => e.preventDefault());
        render(
            <form onSubmit={onSubmit}>
                <PasswordInput id="pw" value="x" onChange={() => {}} />
            </form>
        );

        fireEvent.click(screen.getByRole("button", { name: "Mostrar contraseña" }));

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("propaga los cambios que escribe el usuario", () => {
        const onChange = vi.fn();
        renderInput({ onChange });

        fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "nueva-clave" } });

        expect(onChange).toHaveBeenCalled();
    });
});
