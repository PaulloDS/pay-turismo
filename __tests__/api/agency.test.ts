import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/agency/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { describe, beforeEach, it, expect, jest } from "@jest/globals";

// Mock do prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    agency: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock do next-auth
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

describe("Agency API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/agency", () => {
    it("returns 401 if not authenticated", async () => {
      // Mock getServerSession para retornar null (não autenticado)
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/agency");
      const response = await GET(request);

      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ message: "Não autorizado" });
    });

    it("returns agencies list when authenticated", async () => {
      // Mock getServerSession para retornar uma sessão válida
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-123", email: "test@example.com", role: "ADMIN" },
      });

      // Mock prisma para retornar uma lista de agências
      const mockAgencies = [
        { id: "agency-1", fantasyName: "Agency 1" },
        { id: "agency-2", fantasyName: "Agency 2" },
      ];
      (prisma.agency.findMany as jest.Mock).mockResolvedValue(mockAgencies);

      const request = new NextRequest("http://localhost:3000/api/agency");
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(mockAgencies);
      expect(prisma.agency.findMany).toHaveBeenCalled();
    });

    it("handles search and status filters", async () => {
      // Mock getServerSession para retornar uma sessão válida
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-123", email: "test@example.com", role: "ADMIN" },
      });

      // Mock prisma para retornar uma lista filtrada de agências
      const mockAgencies = [
        { id: "agency-1", fantasyName: "Agency 1", status: "ACTIVE" },
      ];
      (prisma.agency.findMany as jest.Mock).mockResolvedValue(mockAgencies);

      const request = new NextRequest(
        "http://localhost:3000/api/agency?status=ACTIVE&search=Agency"
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(mockAgencies);
      expect(prisma.agency.findMany).toHaveBeenCalledWith({
        where: {
          status: "ACTIVE",
          OR: [
            { fantasyName: { contains: "Agency", mode: "insensitive" } },
            { cnpj: { contains: "Agency" } },
          ],
        },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("POST /api/agency", () => {
    it("returns 401 if not authenticated", async () => {
      // Mock getServerSession para retornar null (não autenticado)
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/agency", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const response = await POST(request);

      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ message: "Não autorizado" });
    });

    it("validates request body and creates agency", async () => {
      // Mock getServerSession para retornar uma sessão válida
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-123", email: "test@example.com", role: "ADMIN" },
      });

      // Mock prisma para verificar CNPJ único e criar agência
      (prisma.agency.findUnique as jest.Mock).mockResolvedValue(null);

      const mockAgency = {
        id: "new-agency-id",
        fantasyName: "New Agency",
        legalName: "New Legal Name",
        cnpj: "12345678901234",
        stateRegistration: "123456789",
        foundingDate: new Date("2023-01-01"),
        status: "ACTIVE",
        email: "agency@example.com",
        phone: "1234567890",
        address: "Test Address",
        city: "Test City",
        state: "SP",
        createdBy: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.agency.create as jest.Mock).mockResolvedValue(mockAgency);

      const requestBody = {
        fantasyName: "New Agency",
        legalName: "New Legal Name",
        cnpj: "12345678901234",
        stateRegistration: "123456789",
        foundingDate: "2023-01-01",
        status: "ACTIVE",
        email: "agency@example.com",
        phone: "1234567890",
        address: "Test Address",
        city: "Test City",
        state: "SP",
      };

      const request = new NextRequest("http://localhost:3000/api/agency", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
      expect(await response.json()).toEqual(mockAgency);
      expect(prisma.agency.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...requestBody,
          foundingDate: expect.any(Date),
          createdBy: "user-123",
        }),
      });
    });

    it("returns 400 if agency with same CNPJ already exists", async () => {
      // Mock getServerSession para retornar uma sessão válida
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-123", email: "test@example.com", role: "ADMIN" },
      });

      // Mock prisma para retornar uma agência existente com o mesmo CNPJ
      (prisma.agency.findUnique as jest.Mock).mockResolvedValue({
        id: "existing-agency",
        cnpj: "12345678901234",
      });

      const requestBody = {
        fantasyName: "New Agency",
        legalName: "New Legal Name",
        cnpj: "12345678901234",
        stateRegistration: "123456789",
        foundingDate: "2023-01-01",
        status: "ACTIVE",
        email: "agency@example.com",
        phone: "1234567890",
        address: "Test Address",
        city: "Test City",
        state: "SP",
      };

      const request = new NextRequest("http://localhost:3000/api/agency", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        message: "Já existe uma agência com este CNPJ",
      });
    });
  });
});
