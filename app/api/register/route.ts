import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { UserRole } from "@prisma/client";

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Cria um novo analista ou administrador
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário (mínimo 6 caracteres)
 *               role:
 *                 type: string
 *                 enum: [admin, analyst]
 *                 description: Função do usuário (admin ou analyst)
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [ADMIN, ANALYST]
 *       400:
 *         description: Dados inválidos ou usuário já existe
 *       500:
 *         description: Erro do servidor
 */

// Define validation schema
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "analyst"], {
    errorMap: () => ({ message: "Role must be either 'admin' or 'analyst'" }),
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Registration request body:", body);

    // Validate request body
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password, role } = result.data;
    console.log("Validated role:", role);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Map the role string to the UserRole enum
    let userRole: UserRole;
    if (role === "admin") {
      userRole = UserRole.ADMIN;
    } else {
      userRole = UserRole.ANALYST;
    }

    console.log("Mapped role to enum:", userRole);

    // Create user with proper role enum value
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: userRole,
      },
    });

    console.log("Created user with role:", user.role);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "User registered successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
