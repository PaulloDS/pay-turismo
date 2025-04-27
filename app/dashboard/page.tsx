import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardHeader from "@/components/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Users,
  Clock,
  TrendingUp,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DashboardChart } from "@/components/dashboard-chart";
import { RecentActivityList } from "@/components/recent-activity-list";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Buscar estatísticas do dashboard
  const agencyCount = await prisma.agency.count();
  const activeAgencyCount = await prisma.agency.count({
    where: {
      status: "ACTIVE",
    },
  });
  const pendingAgencyCount = await prisma.agency.count({
    where: {
      status: "PENDING",
    },
  });
  const userCount = await prisma.user.count();

  // Buscar agências recentes
  const recentAgencies = await prisma.agency.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Calcular distribuição de status para o gráfico
  const statusDistribution = [
    { name: "Ativas", value: activeAgencyCount },
    { name: "Pendentes", value: pendingAgencyCount },
    {
      name: "Inativas",
      value: agencyCount - activeAgencyCount - pendingAgencyCount,
    },
  ];

  // Dados simulados para o gráfico de crescimento mensal
  const monthlyGrowth = [
    { name: "Jan", agências: 4 },
    { name: "Fev", agências: 6 },
    { name: "Mar", agências: 8 },
    { name: "Abr", agências: 10 },
    { name: "Mai", agências: 12 },
    { name: "Jun", agências: 16 },
    { name: "Jul", agências: 18 },
    { name: "Ago", agências: 20 },
    { name: "Set", agências: 22 },
    { name: "Out", agências: 24 },
    { name: "Nov", agências: 28 },
    { name: "Dez", agências: agencyCount },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col space-y-6 max-w-7xl mx-auto">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold">Bem-vindo ao Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Olá, {session.user?.email}! Confira o resumo do seu sistema de
              gestão de agências de turismo.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Agências
                </CardTitle>
                <Building2 className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{agencyCount}</div>
                <p className="text-xs text-muted-foreground">
                  Agências de turismo registradas
                </p>
                <div className="mt-4">
                  <Link href="/dashboard/agencies">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-500 p-0 h-auto font-medium"
                    >
                      Ver todas
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Agências Ativas
                </CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{activeAgencyCount}</div>
                <p className="text-xs text-muted-foreground">
                  Agências atualmente ativas
                </p>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3">
                  <div
                    className="h-1.5 bg-green-500 rounded-full"
                    style={{
                      width: `${
                        agencyCount > 0
                          ? (activeAgencyCount / agencyCount) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-right mt-1 text-green-600">
                  {agencyCount > 0
                    ? Math.round((activeAgencyCount / agencyCount) * 100)
                    : 0}
                  % do total
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Aguardando Aprovação
                </CardTitle>
                <Clock className="h-5 w-5 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pendingAgencyCount}</div>
                <p className="text-xs text-muted-foreground">
                  Agências aguardando aprovação
                </p>
                {pendingAgencyCount > 0 && (
                  <div className="mt-4">
                    <Link href="/dashboard/agencies?status=PENDING">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-500 p-0 h-auto font-medium"
                      >
                        Revisar pendentes
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Usuários do Sistema
                </CardTitle>
                <Users className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userCount}</div>
                <p className="text-xs text-muted-foreground">
                  Administradores e analistas
                </p>
                <div className="mt-4 flex items-center text-xs">
                  <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1"></span>
                  <span className="text-muted-foreground">
                    Acesso ativo ao sistema
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="bg-white dark:bg-gray-800 border">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="analytics">Análises</TabsTrigger>
              <TabsTrigger value="recent">Atividade Recente</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-white dark:bg-gray-800 shadow-sm">
                  <CardHeader>
                    <CardTitle>Crescimento de Agências</CardTitle>
                    <CardDescription>
                      Número total de agências registradas por mês
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <DashboardChart
                      data={monthlyGrowth}
                      xKey="name"
                      yKey="agências"
                      height={300}
                      color="#4f46e5"
                    />
                  </CardContent>
                </Card>
                <Card className="col-span-3 bg-white dark:bg-gray-800 shadow-sm">
                  <CardHeader>
                    <CardTitle>Distribuição por Status</CardTitle>
                    <CardDescription>
                      Status atual das agências registradas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {statusDistribution.map((status) => (
                        <div key={status.name} className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              status.name === "Ativas"
                                ? "bg-green-500"
                                : status.name === "Pendentes"
                                ? "bg-amber-500"
                                : "bg-gray-500"
                            }`}
                          />
                          <div className="flex-1 flex justify-between items-center">
                            <p className="text-sm font-medium">{status.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {status.value}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="w-full h-2 bg-gray-100 rounded-full mt-6">
                        {agencyCount > 0 && (
                          <>
                            <div
                              className="h-2 bg-green-500 rounded-l-full"
                              style={{
                                width: `${
                                  (activeAgencyCount / agencyCount) * 100
                                }%`,
                              }}
                            ></div>
                            <div
                              className="h-2 bg-amber-500"
                              style={{
                                width: `${
                                  (pendingAgencyCount / agencyCount) * 100
                                }%`,
                                marginLeft: `${
                                  (activeAgencyCount / agencyCount) * 100
                                }%`,
                                position: "relative",
                                top: "-8px",
                              }}
                            ></div>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-white dark:bg-gray-800 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>Taxa de Aprovação</CardTitle>
                      <CardDescription>
                        Agências aprovadas vs. pendentes
                      </CardDescription>
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {agencyCount > 0
                        ? Math.round((activeAgencyCount / agencyCount) * 100)
                        : 0}
                      %
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +{activeAgencyCount} agências aprovadas
                    </p>
                    <div className="mt-4 h-[120px]">
                      <DashboardChart
                        data={[
                          { name: "Aprovadas", valor: activeAgencyCount },
                          { name: "Pendentes", valor: pendingAgencyCount },
                          {
                            name: "Outras",
                            valor:
                              agencyCount -
                              activeAgencyCount -
                              pendingAgencyCount,
                          },
                        ]}
                        xKey="name"
                        yKey="valor"
                        height={120}
                        color="#10b981"
                        type="bar"
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white dark:bg-gray-800 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>Agências por Mês</CardTitle>
                      <CardDescription>
                        Crescimento mensal de registros
                      </CardDescription>
                    </div>
                    <Calendar className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      ~{Math.round(agencyCount / 12)}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        / mês
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Média de novas agências por mês
                    </p>
                    <div className="mt-4 h-[120px]">
                      <DashboardChart
                        data={monthlyGrowth.slice(-6)}
                        xKey="name"
                        yKey="agências"
                        height={120}
                        color="#3b82f6"
                        type="area"
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white dark:bg-gray-800 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>Eficiência do Sistema</CardTitle>
                      <CardDescription>
                        Tempo médio de aprovação
                      </CardDescription>
                    </div>
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      2.4{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        dias
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tempo médio para aprovação de agências
                    </p>
                    <div className="mt-6 space-y-2">
                      <div className="flex items-center">
                        <span className="text-xs font-medium w-24">
                          Mais rápido:
                        </span>
                        <div className="flex-1">
                          <div className="h-2 w-[15%] bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-xs ml-2">4h</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs font-medium w-24">Médio:</span>
                        <div className="flex-1">
                          <div className="h-2 w-[40%] bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-xs ml-2">2.4d</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs font-medium w-24">
                          Mais lento:
                        </span>
                        <div className="flex-1">
                          <div className="h-2 w-[80%] bg-amber-500 rounded-full"></div>
                        </div>
                        <span className="text-xs ml-2">7d</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="recent" className="space-y-4">
              <Card className="bg-white dark:bg-gray-800 shadow-sm">
                <CardHeader>
                  <CardTitle>Agências Recentes</CardTitle>
                  <CardDescription>
                    Últimas agências adicionadas ao sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentActivityList agencies={recentAgencies} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>
                  Tarefas comuns que você pode realizar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/dashboard/agencies/new">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Agência
                    </Button>
                  </Link>
                  <Link href="/dashboard/agencies">
                    <Button className="w-full justify-start" variant="outline">
                      <Building2 className="mr-2 h-4 w-4" />
                      Ver Agências
                    </Button>
                  </Link>
                  <Link href="/dashboard/agencies?status=PENDING">
                    <Button className="w-full justify-start" variant="outline">
                      <Clock className="mr-2 h-4 w-4" />
                      Agências Pendentes
                    </Button>
                  </Link>
                  <Link href="/dashboard/agencies?status=ACTIVE">
                    <Button className="w-full justify-start" variant="outline">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Agências Ativas
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  Bem-vindo ao seu Dashboard
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Sistema de Gestão de Agências de Turismo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Gerencie suas agências de turismo com facilidade e eficiência.
                  Este dashboard fornece uma visão completa das suas operações.
                </p>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-white mr-2"></div>
                    <span className="text-sm">Agências: {agencyCount}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-300 mr-2"></div>
                    <span className="text-sm">Ativas: {activeAgencyCount}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-300 mr-2"></div>
                    <span className="text-sm">
                      Pendentes: {pendingAgencyCount}
                    </span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Link
                    href="/dashboard/agencies/new"
                    className="flex items-center"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Nova Agência
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
