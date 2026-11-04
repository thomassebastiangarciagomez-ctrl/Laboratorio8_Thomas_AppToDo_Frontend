import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AdminSummaryPage } from "./AdminSummaryPage";
import * as adminApi from "../../../api/adminApi";

vi.mock("../../../api/adminApi");

const SUMMARY = {
    totalUsers: 3,
    totalTasks: 12,
    tasksByStatus: { PENDING: 7, IN_PROGRESS: 3, COMPLETED: 2 },
};

describe("AdminSummaryPage", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("muestra un estado de carga y luego las métricas agregadas", async () => {
        adminApi.getSummary.mockResolvedValue(SUMMARY);
        render(<AdminSummaryPage />);

        expect(screen.getByText("Cargando resumen...")).toBeTruthy();

        expect((await screen.findByTestId("stat-users")).textContent).toBe("3");
        expect(screen.getByTestId("stat-tasks").textContent).toBe("12");
        expect(screen.getByTestId("stat-PENDING").textContent).toBe("7");
        expect(screen.getByTestId("stat-IN_PROGRESS").textContent).toBe("3");
        expect(screen.getByTestId("stat-COMPLETED").textContent).toBe("2");
        expect(screen.getByText("Pendientes")).toBeTruthy();
        expect(screen.getByText("58% del total")).toBeTruthy();
    });

    it("con 0 tareas muestra 0% sin dividir por cero", async () => {
        adminApi.getSummary.mockResolvedValue({ totalUsers: 1, totalTasks: 0, tasksByStatus: { PENDING: 0, IN_PROGRESS: 0, COMPLETED: 0 } });
        render(<AdminSummaryPage />);

        await screen.findByTestId("stat-users");

        expect(screen.getAllByText("0% del total").length).toBe(3);
    });

    it("muestra el mensaje cuando el backend rechaza la consulta (403)", async () => {
        adminApi.getSummary.mockRejectedValue(new Error("No tienes permisos para realizar esta acción."));
        render(<AdminSummaryPage />);

        expect((await screen.findByRole("alert")).textContent).toContain("No tienes permisos");
        expect(screen.queryByTestId("stat-users")).toBeNull();
    });

    it("el botón Actualizar vuelve a consultar el resumen", async () => {
        adminApi.getSummary.mockResolvedValue(SUMMARY);
        render(<AdminSummaryPage />);
        await screen.findByTestId("stat-users");

        fireEvent.click(screen.getByRole("button", { name: "Actualizar" }));

        await screen.findByTestId("stat-users");
        expect(adminApi.getSummary).toHaveBeenCalledTimes(2);
    });
});
