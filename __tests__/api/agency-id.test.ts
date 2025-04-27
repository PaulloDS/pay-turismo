import { NextRequest } from "next/server"
import { GET, DELETE } from "@/app/api/agency/[id]/route"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { describe, beforeEach, it, expect, jest } from "@jest/globals"

// Mock do prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    agency: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

// Mock do next-auth
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}))

describe("Agency ID API Endpoints", () => {
  const mockParams = {
    params: {
      id: "agency-123",
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/agency/[id]", () => {
    it("returns 401 if not authenticated", async () => {
      // Mock getServerSession para retornar null (não autenticado)
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest("http://localhost:3000/api/agency/agency-123")
      const response = await GET(request, mockParams)

      expect(response.status).toBe(401)
      expect(await response.json()).toEqual({ message: "Unauthorized" })
    })

    it("returns 404 if agency not found", async () => {
      // Mock getServerSession para retornar uma sessão válida
      ;(getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-123", email: "test@example.com", role: "ADMIN" },
      })

      // Mock prisma para retornar null (agência não encontrada)
      ;(prisma.agency.findUnique as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest("http://localhost:3000/api/agency/agency-123")
      const response = await GET(request, mockParams)

      expect(response.status).toBe(404)
      expect(await response.json()).toEqual({ message: "Agency not found" })
    })

    it("returns agency details when found", async () => {
      // Mock getServerSession para retornar uma sessão válida
      ;(getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-123", email: "test@example.com", role: "ADMIN" },
      })

      // Mock prisma para retornar detalhes da agência
      const mockAgency = {
        id: "agency-123",
        fantasyName: "Test Agency",
        legalName: "Test Legal Name",
      }
      ;(prisma.agency.findUnique as jest.Mock).mockResolvedValue(mockAgency)

      const request = new NextRequest("http://localhost:3000/api/agency/agency-123")
      const response = await GET(request, mockParams)

      expect(response.status).toBe(200)
      expect(await response.json()).toEqual(mockAgency)
      expect(prisma.agency.findUnique).toHaveBeenCalledWith({
        where: { id: "agency-123" },
      })
    })
  })

  describe("DELETE /api/agency/[id]", () => {
    it("returns 401 if not authenticated", async () => {
      // Mock getServerSession para retornar null (não autenticado)
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest("http://localhost:3000/api/agency/agency-123", {
        method: "DELETE",
      })
      const response = await DELETE(request, mockParams)

      expect(response.status).toBe(401)
      expect(await response.json()).toEqual({ message: "Unauthorized" })
    })

    it("returns 403 if user is not admin", async () => {
      // Mock getServerSession para retornar uma sessão de analista
      ;(getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-123", email: "test@example.com", role: "analyst" },
      })

      const request = new NextRequest("http://localhost:3000/api/agency/agency-123", {
        method: "DELETE",
      })
      const response = await DELETE(request, mockParams)

      expect(response.status).toBe(403)
      expect(await response.json()).toEqual({ message: "Forbidden: Only administrators can delete agencies" })
    })

    it("returns 404 if agency not found", async () => {
      // Mock getServerSession para retornar uma sessão de admin
      ;(getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-123", email: "test@example.com", role: "admin" },
      })

      // Mock prisma para retornar null (agência não encontrada)
      ;(prisma.agency.findUnique as jest.Mock).mockResolvedValue(null)

      const request = new NextRequest("http://localhost:3000/api/agency/agency-123", {
        method: "DELETE",
      })
      const response = await DELETE(request, mockParams)

      expect(response.status).toBe(404)
      expect(await response.json()).toEqual({ message: "Agency not found" })
    })

    it("deletes agency successfully", async () => {
      // Mock getServerSession para retornar uma sessão de admin
      ;(getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "user-123", email: "test@example.com", role: "admin" },
      })

      // Mock prisma para retornar uma agência existente
      ;(prisma.agency.findUnique as jest.Mock).mockResolvedValue({
        id: "agency-123",
        fantasyName: "Test Agency",
      })

      // Mock prisma delete
      ;(prisma.agency.delete as jest.Mock).mockResolvedValue({})

      const request = new NextRequest("http://localhost:3000/api/agency/agency-123", {
        method: "DELETE",
      })
      const response = await DELETE(request, mockParams)

      expect(response.status).toBe(200)
      expect(await response.json()).toEqual({ message: "Agency deleted successfully" })
      expect(prisma.agency.delete).toHaveBeenCalledWith({
        where: { id: "agency-123" },
      })
    })
  })
})
