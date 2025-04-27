import { getServerSession } from "next-auth/next"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Edit } from "lucide-react"
import DeleteAgencyButton from "@/components/delete-agency-button"
import { maskCNPJ, maskPhone } from "@/lib/masks"

interface AgencyDetailPageProps {
  params: {
    id: string
  }
}

export default async function AgencyDetailPage({ params }: AgencyDetailPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const agency = await prisma.agency.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!agency) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/dashboard/agencies">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">{agency.fantasyName}</h1>
              <div
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  agency.status === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : agency.status === "INACTIVE"
                      ? "bg-gray-100 text-gray-800"
                      : agency.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                }`}
              >
                {agency.status === "ACTIVE"
                  ? "Ativo"
                  : agency.status === "INACTIVE"
                    ? "Inativo"
                    : agency.status === "PENDING"
                      ? "Pendente"
                      : "Suspenso"}
              </div>
            </div>
            <div className="flex space-x-2">
              <Link href={`/dashboard/agencies/${agency.id}/edit`}>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Agência
                </Button>
              </Link>
              {session.user.role === "ADMIN" && (
                <DeleteAgencyButton agencyId={agency.id} agencyName={agency.fantasyName} />
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Agência</CardTitle>
                <CardDescription>Informações básicas sobre a agência de turismo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nome Fantasia</p>
                    <p className="text-lg font-medium">{agency.fantasyName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Razão Social</p>
                    <p className="text-lg font-medium">{agency.legalName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">CNPJ</p>
                    <p className="text-lg font-medium">{maskCNPJ(agency.cnpj)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Inscrição Estadual</p>
                    <p className="text-lg font-medium">{agency.stateRegistration}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Data de Fundação</p>
                    <p className="text-lg font-medium">{formatDate(agency.foundingDate, "pt-BR")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="text-lg font-medium">
                      {agency.status === "ACTIVE"
                        ? "Ativo"
                        : agency.status === "INACTIVE"
                          ? "Inativo"
                          : agency.status === "PENDING"
                            ? "Pendente"
                            : "Suspenso"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
                <CardDescription>Como entrar em contato com esta agência</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg font-medium">{agency.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Telefone</p>
                    <p className="text-lg font-medium">{maskPhone(agency.phone)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Endereço</p>
                    <p className="text-lg font-medium">{agency.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Cidade</p>
                    <p className="text-lg font-medium">{agency.city}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Estado</p>
                    <p className="text-lg font-medium">{agency.state}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
              <CardDescription>Outros detalhes sobre esta agência</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Descrição</p>
                  <p className="text-lg">{agency.description || "Nenhuma descrição fornecida."}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Website</p>
                  <p className="text-lg">
                    {agency.website ? (
                      <a
                        href={agency.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {agency.website}
                      </a>
                    ) : (
                      "Nenhum website fornecido."
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Criado em</p>
                  <p className="text-lg">{formatDate(agency.createdAt, "pt-BR")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Última Atualização</p>
                  <p className="text-lg">{formatDate(agency.updatedAt, "pt-BR")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
