"use client";

import { formatDistanceToNow } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { maskCNPJ } from "@/lib/masks";
import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import type { Agency } from "@prisma/client";

interface RecentActivityListProps {
  agencies: Agency[];
}

export function RecentActivityList({ agencies }: RecentActivityListProps) {
  if (agencies.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma agência encontrada.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {agencies.map((agency) => (
        <div key={agency.id} className="flex items-start space-x-4">
          <div className="rounded-full bg-primary/10 p-2">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{agency.fantasyName}</p>
              <Badge
                variant={
                  agency.status === "ACTIVE"
                    ? "success"
                    : agency.status === "PENDING"
                    ? "warning"
                    : "secondary"
                }
              >
                {agency.status === "ACTIVE"
                  ? "Ativo"
                  : agency.status === "INACTIVE"
                  ? "Inativo"
                  : agency.status === "PENDING"
                  ? "Pendente"
                  : "Suspenso"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              CNPJ: {maskCNPJ(agency.cnpj)}
            </p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                Criado {formatDistanceToNow(agency.createdAt, "pt-BR")}
              </p>
              <Link href={`/dashboard/agencies/${agency.id}`}>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  Ver detalhes
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
      <div className="pt-2 text-center">
        <Link href="/dashboard/agencies">
          <Button variant="outline" size="sm">
            Ver todas as agências
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
