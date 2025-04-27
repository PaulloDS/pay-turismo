import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { agencySchema } from "@/lib/validations/agency";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * @swagger
 * /api/agency/{id}:
 *   get:
 *     summary: Exibe os detalhes de uma agência específica
 *     tags: [Agências]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da agência
 *     responses:
 *       200:
 *         description: Detalhes da agência recuperados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agency'
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Agência não encontrada
 *       500:
 *         description: Erro do servidor
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const agency = await prisma.agency.findUnique({
      where: { id: params.id },
    });

    if (!agency) {
      return NextResponse.json(
        { message: "Agency not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(agency);
  } catch (error) {
    console.error("Error fetching agency:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the agency" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/agency/{id}:
 *   put:
 *     summary: Atualiza as informações de uma agência
 *     tags: [Agências]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da agência
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgencyInput'
 *     responses:
 *       200:
 *         description: Agência atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agency'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Agência não encontrada
 *       500:
 *         description: Erro do servidor
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Agency update request body:", body);

    // Validate request body
    const result = agencySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    // Check if agency exists
    const existingAgency = await prisma.agency.findUnique({
      where: { id: params.id },
    });

    if (!existingAgency) {
      return NextResponse.json(
        { message: "Agency not found" },
        { status: 404 }
      );
    }

    // Check if updating CNPJ to one that already exists
    if (result.data.cnpj !== existingAgency.cnpj) {
      const agencyWithSameCnpj = await prisma.agency.findUnique({
        where: { cnpj: result.data.cnpj },
      });

      if (agencyWithSameCnpj) {
        return NextResponse.json(
          { message: "Agency with this CNPJ already exists" },
          { status: 400 }
        );
      }
    }

    // Convert foundingDate string to Date object
    const formattedData = {
      ...result.data,
      foundingDate: new Date(result.data.foundingDate),
    };

    console.log("Formatted data for agency update:", formattedData);

    // Update agency
    const updatedAgency = await prisma.agency.update({
      where: { id: params.id },
      data: formattedData,
    });

    return NextResponse.json(updatedAgency);
  } catch (error) {
    console.error("Error updating agency:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the agency" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/agency/{id}:
 *   delete:
 *     summary: Remove uma agência do banco de dados (somente para administradores)
 *     tags: [Agências]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da agência
 *     responses:
 *       200:
 *         description: Agência excluída com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Proibido - apenas administradores podem excluir agências
 *       404:
 *         description: Agência não encontrada
 *       500:
 *         description: Erro do servidor
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Only admins can delete agencies
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden: Only administrators can delete agencies" },
        { status: 403 }
      );
    }

    // Check if agency exists
    const existingAgency = await prisma.agency.findUnique({
      where: { id: params.id },
    });

    if (!existingAgency) {
      return NextResponse.json(
        { message: "Agency not found" },
        { status: 404 }
      );
    }

    // Delete agency
    await prisma.agency.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Agency deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting agency:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the agency" },
      { status: 500 }
    );
  }
}
