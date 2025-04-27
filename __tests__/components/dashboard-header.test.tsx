import { render, screen, fireEvent } from "@testing-library/react";
import DashboardHeader from "@/components/dashboard-header";

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/dashboard",
}));

// Mock useSession
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        email: "test@example.com",
        role: "ADMIN",
      },
    },
    status: "authenticated",
  }),
  signOut: jest.fn(),
}));

describe("DashboardHeader Component", () => {
  it("renders correctly", () => {
    render(<DashboardHeader />);

    // Verificar se o título está presente
    expect(screen.getByText("PAYLINK Turismo")).toBeInTheDocument();

    // Verificar se os links de navegação estão presentes
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Agências")).toBeInTheDocument();
  });

  it("shows user email in dropdown", async () => {
    render(<DashboardHeader />);

    // Abrir o dropdown do usuário
    const userButton = screen.getByRole("button", { name: /menu do usuário/i });
    fireEvent.click(userButton);

    // Verificar se o email do usuário está presente
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Administrador")).toBeInTheDocument();
  });
});
