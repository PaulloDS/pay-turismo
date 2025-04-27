import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { agencySchema } from "@/lib/validations/agency";

/**
 * @swagger
 * /api/agency:
 *   get:
 *     summary: Retorna uma lista de todas as agências
 *     tags: [Agências]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, PENDING, SUSPENDED]
 *         description: Filtrar agências por status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar agências por nome fantasia ou CNPJ
 *     responses:
 *       200:
 *         description: Lista de agências recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agency'
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro do servidor
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Build filter conditions
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { fantasyName: { contains: search, mode: "insensitive" } },
        { cnpj: { contains: search } },
      ];
    }

    const agencies = await prisma.agency.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(agencies);
  } catch (error) {
    console.error("Erro ao buscar agências:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro ao buscar as agências" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/agency:
 *   post:
 *     summary: Adiciona uma nova agência
 *     tags: [Agências]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgencyInput'
 *     responses:
 *       201:
 *         description: Agência criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agency'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro do servidor
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Dados para criação de agência:", body);

    // Validate request body
    const result = agencySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    // Check if agency with same CNPJ already exists
    const existingAgency = await prisma.agency.findUnique({
      where: { cnpj: result.data.cnpj },
    });

    if (existingAgency) {
      return NextResponse.json(
        { message: "Já existe uma agência com este CNPJ" },
        { status: 400 }
      );
    }

    // Convert foundingDate string to Date object
    const formattedData = {
      ...result.data,
      foundingDate: new Date(result.data.foundingDate),
    };

    console.log("Dados formatados para criação de agência:", formattedData);

    // Create agency
    const agency = await prisma.agency.create({
      data: {
        ...formattedData,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(agency, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar agência:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro ao criar a agência" },
      { status: 500 }
    );
  }
}
