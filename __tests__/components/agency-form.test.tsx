import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AgencyForm from "@/components/agency-form";
import type { AgencyStatus } from "@prisma/client";

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
    json: () => Promise.resolve({ id: "new-agency-id" }),
  })
);

describe("AgencyForm Component", () => {
  const mockAgency = {
    id: "agency-123",
    fantasyName: "Test Agency",
    legalName: "Test Legal Name",
    cnpj: "12345678901234",
    stateRegistration: "123456789",
    foundingDate: new Date("2020-01-01"),
    status: "ACTIVE" as AgencyStatus,
    email: "test@example.com",
    phone: "1234567890",
    address: "Test Address",
    city: "Test City",
    state: "SP",
    website: "http://test.com",
    description: "Test Description",
    createdBy: "user-123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form for new agency", () => {
    render(<AgencyForm />);

    // Verificar se os campos do formulário estão presentes
    expect(screen.getByLabelText(/Nome Fantasia/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Razão Social/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CNPJ/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Inscrição Estadual/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data de Fundação/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Endereço/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Estado/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Website/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descrição/i)).toBeInTheDocument();

    // Verificar se o botão de criar está presente
    expect(screen.getByText(/Criar Agência/i)).toBeInTheDocument();
  });

  it("renders form with agency data for editing", () => {
    render(<AgencyForm agency={mockAgency} />);

    // Verificar se os campos do formulário estão preenchidos com os dados da agência
    expect(screen.getByLabelText(/Nome Fantasia/i)).toHaveValue("Test Agency");
    expect(screen.getByLabelText(/Razão Social/i)).toHaveValue(
      "Test Legal Name"
    );
    expect(screen.getByLabelText(/Email/i)).toHaveValue("test@example.com");

    // Verificar se o botão de atualizar está presente
    expect(screen.getByText(/Atualizar Agência/i)).toBeInTheDocument();
  });

  it("submits form data correctly for new agency", async () => {
    render(<AgencyForm />);

    // Preencher o formulário
    fireEvent.change(screen.getByLabelText(/Nome Fantasia/i), {
      target: { value: "New Agency" },
    });
    fireEvent.change(screen.getByLabelText(/Razão Social/i), {
      target: { value: "New Legal Name" },
    });
    fireEvent.change(screen.getByLabelText(/CNPJ/i), {
      target: { value: "12.345.678/0001-90" },
    });
    fireEvent.change(screen.getByLabelText(/Inscrição Estadual/i), {
      target: { value: "987654321" },
    });
    fireEvent.change(screen.getByLabelText(/Data de Fundação/i), {
      target: { value: "2023-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "new@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Telefone/i), {
      target: { value: "(11) 98765-4321" },
    });
    fireEvent.change(screen.getByLabelText(/Endereço/i), {
      target: { value: "New Address" },
    });
    fireEvent.change(screen.getByLabelText(/Cidade/i), {
      target: { value: "New City" },
    });

    // Enviar o formulário
    fireEvent.click(screen.getByText(/Criar Agência/i));

    // Verificar se a API foi chamada corretamente
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/agency",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
      expect(mockPush).toHaveBeenCalledWith("/dashboard/agencies");
    });
  });
});
