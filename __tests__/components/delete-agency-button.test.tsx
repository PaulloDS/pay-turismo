import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteAgencyButton from "@/components/delete-agency-button";

// Mock useRouter
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: jest.fn(),
  }),
}));

// Mock fetch para simular a resposta da API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: "Agency deleted successfully" }),
  })
);

describe("DeleteAgencyButton Component", () => {
  const mockProps = {
    agencyId: "agency-123",
    agencyName: "Test Agency",
    onDeleted: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<DeleteAgencyButton {...mockProps} />);
    expect(screen.getByText("Excluir Agência")).toBeInTheDocument();
  });

  it("shows confirmation dialog when clicked", () => {
    render(<DeleteAgencyButton {...mockProps} />);

    // Clicar no botão de excluir
    fireEvent.click(screen.getByText("Excluir Agência"));

    // Verificar se o diálogo de confirmação é exibido
    expect(screen.getByText("Tem certeza?")).toBeInTheDocument();
    expect(
      screen.getByText(/Esta ação não pode ser desfeita/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Test Agency")).toBeInTheDocument();
  });

  it("calls API and onDeleted callback when confirmed", async () => {
    render(<DeleteAgencyButton {...mockProps} />);

    // Clicar no botão de excluir
    fireEvent.click(screen.getByText("Excluir Agência"));

    // Clicar no botão de confirmar
    fireEvent.click(screen.getByText("Excluir"));

    // Verificar se a API foi chamada corretamente
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`/api/agency/agency-123`, {
        method: "DELETE",
      });
      expect(mockProps.onDeleted).toHaveBeenCalled();
    });
  });
});
