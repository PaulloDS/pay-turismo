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
      return NextResponse.json({ message: "Não autorizado!" }, { status: 401 });
    }

    const agency = await prisma.agency.findUnique({
      where: { id: params.id },
    });

    if (!agency) {
      return NextResponse.json(
        { message: "Agência não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(agency);
  } catch (error) {
    console.error("Erro ao buscar agência:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro ao buscar a agência" },
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
      return NextResponse.json({ message: "Não autorizado!" }, { status: 401 });
    }

    const body = await request.json();

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
        { message: "Agência não encontrada" },
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
          { message: "Já existe uma agência com este CNPJ" },
          { status: 400 }
        );
      }
    }

    // Convert foundingDate string to Date object
    const formattedData = {
      ...result.data,
      foundingDate: new Date(result.data.foundingDate),
    };

    // Update agency
    const updatedAgency = await prisma.agency.update({
      where: { id: params.id },
      data: formattedData,
    });

    return NextResponse.json(updatedAgency);
  } catch (error) {
    console.error("Erro ao atulizar agência:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro durante a atualização da agência" },
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
      return NextResponse.json({ message: "Não autorizado!" }, { status: 401 });
    }

    // Only admins can delete agencies
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Somente administradores podem excluir agências!" },
        { status: 403 }
      );
    }

    // Check if agency exists
    const existingAgency = await prisma.agency.findUnique({
      where: { id: params.id },
    });

    if (!existingAgency) {
      return NextResponse.json(
        { message: "Agência não encontrada" },
        { status: 404 }
      );
    }

    // Delete agency
    await prisma.agency.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Agência excluida com sucesso!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir agência: ", error);
    return NextResponse.json(
      { message: "Ocorreu um erro durante a exclusão da agência" },
      { status: 500 }
    );
  }
}
