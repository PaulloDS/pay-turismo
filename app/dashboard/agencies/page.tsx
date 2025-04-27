"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardHeader from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { AgencyStatus } from "@prisma/client";
import { Plus } from "lucide-react";
import { maskCNPJ } from "@/lib/masks";
import DeleteAgencyButton from "@/components/delete-agency-button";

interface Agency {
  id: string;
  fantasyName: string;
  legalName: string;
  cnpj: string;
  stateRegistration: string;
  foundingDate: string;
  status: AgencyStatus;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  website?: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function AgenciesPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    // Só verificamos a sessão depois que ela terminar de carregar
    if (sessionStatus === "loading") return;

    // Se a sessão não existir após o carregamento, redirecionamos
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
      return;
    }

    // Se chegou aqui, o usuário está autenticado
    fetchAgencies();
  }, [sessionStatus, router]);

  const fetchAgencies = async () => {
    if (sessionStatus !== "authenticated") return;

    setIsLoading(true);
    try {
      // Construir a URL com os parâmetros de consulta
      let url = "/api/agency";
      const params = new URLSearchParams();

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      if (statusFilter && statusFilter !== "ALL") {
        params.append("status", statusFilter);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Falha ao buscar agências");
      }

      const data = await response.json();
      setAgencies(data);
    } catch (err: any) {
      console.error("Erro ao buscar agências:", err);
      setError(err.message || "Ocorreu um erro ao buscar as agências");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Não fazemos a busca imediatamente para evitar muitas requisições
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    // Não fazemos a busca imediatamente para evitar muitas requisições
  };

  const applyFilters = () => {
    fetchAgencies();
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    fetchAgencies();
  };

  const handleAgencyDeleted = () => {
    // Recarregar a lista após exclusão
    fetchAgencies();
  };

  // Mostra um indicador de carregamento enquanto a sessão está sendo verificada
  if (sessionStatus === "loading") {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Carregando...</p>
          </div>
        </main>
      </div>
    );
  }

  // Se não estiver autenticado, não renderiza nada (será redirecionado no useEffect)
  if (sessionStatus === "unauthenticated") {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Agências de Turismo</h1>
            <Link href="/dashboard/agencies/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Agência
              </Button>
            </Link>
          </div>

          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-1 items-center space-x-2">
              <Input
                placeholder="Buscar por nome ou CNPJ..."
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os Status</SelectItem>
                  <SelectItem value="ACTIVE">Ativo</SelectItem>
                  <SelectItem value="INACTIVE">Inativo</SelectItem>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                  <SelectItem value="SUSPENDED">Suspenso</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={applyFilters}>Aplicar</Button>
              <Button variant="outline" onClick={resetFilters}>
                Limpar Filtros
              </Button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 p-2 bg-red-50 rounded-md">{error}</div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome Fantasia</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Inscrição Estadual</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fundação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Carregando agências...
                    </TableCell>
                  </TableRow>
                ) : agencies.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Nenhuma agência encontrada. Tente ajustar seus filtros ou
                      adicione uma nova agência.
                    </TableCell>
                  </TableRow>
                ) : (
                  agencies.map((agency) => (
                    <TableRow key={agency.id}>
                      <TableCell className="font-medium">
                        {agency.fantasyName}
                      </TableCell>
                      <TableCell>{maskCNPJ(agency.cnpj)}</TableCell>
                      <TableCell>{agency.stateRegistration}</TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        {formatDate(agency.foundingDate, "pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/agencies/${agency.id}`}>
                          <Button variant="ghost" size="sm">
                            Ver
                          </Button>
                        </Link>
                        <Link href={`/dashboard/agencies/${agency.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            Editar
                          </Button>
                        </Link>
                        {session?.user?.role === "ADMIN" && (
                          <DeleteAgencyButton
                            agencyId={agency.id}
                            agencyName={agency.fantasyName}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onDeleted={handleAgencyDeleted}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
