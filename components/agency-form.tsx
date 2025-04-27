"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Agency, AgencyStatus } from "@prisma/client";
import { formatDateForInput } from "@/lib/utils";
import { maskCNPJ, maskPhone, unmaskCNPJ, unmaskPhone } from "@/lib/masks";
import { brazilianStates } from "@/lib/constants";

interface AgencyFormProps {
  agency?: Agency;
}

interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export default function AgencyForm({ agency }: AgencyFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [formData, setFormData] = useState({
    fantasyName: agency?.fantasyName || "",
    legalName: agency?.legalName || "",
    cnpj: agency?.cnpj ? maskCNPJ(agency.cnpj) : "",
    stateRegistration: agency?.stateRegistration || "",
    foundingDate: agency ? formatDateForInput(agency.foundingDate) : "",
    status: agency?.status || "PENDING",
    email: agency?.email || "",
    phone: agency?.phone ? maskPhone(agency.phone) : "",
    address: agency?.address || "",
    cep: "",
    city: agency?.city || "",
    state: agency?.state || "",
    website: agency?.website || "",
    description: agency?.description || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "cnpj") {
      setFormData((prev) => ({ ...prev, [name]: maskCNPJ(value) }));
    } else if (name === "phone") {
      setFormData((prev) => ({ ...prev, [name]: maskPhone(value) }));
    } else if (name === "cep") {
      const cepValue = value.replace(/\D/g, "");
      if (cepValue.length <= 8) {
        setFormData((prev) => ({ ...prev, [name]: cepValue }));
        if (cepValue.length === 8) {
          searchCep(cepValue);
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const searchCep = async (cep: string) => {
    if (cep.length !== 8) return;

    setIsCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data: CepResponse = await response.json();

      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          address: data.logradouro,
          city: data.localidade,
          state: data.uf,
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setIsCepLoading(false);
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as AgencyStatus }));
  };

  const handleStateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, state: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Prepare data for submission
      const submissionData = {
        ...formData,
        cnpj: unmaskCNPJ(formData.cnpj),
        phone: unmaskPhone(formData.phone),
      };

      // Remove cep field as it's not in the schema
      const { cep, ...dataToSubmit } = submissionData;

      console.log("Enviando dados da agência:", dataToSubmit);

      const url = agency ? `/api/agency/${agency.id}` : "/api/agency";
      const method = agency ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Falha ao salvar agência");
      }

      router.push("/dashboard/agencies");
      router.refresh();
    } catch (err: any) {
      console.error("Erro ao salvar agência:", err);
      setError(err.message || "Ocorreu um erro ao salvar a agência");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fantasyName">Nome Fantasia *</Label>
              <Input
                id="fantasyName"
                name="fantasyName"
                value={formData.fantasyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legalName">Razão Social *</Label>
              <Input
                id="legalName"
                name="legalName"
                value={formData.legalName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                placeholder="00.000.000/0000-00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stateRegistration">Inscrição Estadual *</Label>
              <Input
                id="stateRegistration"
                name="stateRegistration"
                value={formData.stateRegistration}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="foundingDate">Data de Fundação *</Label>
              <Input
                id="foundingDate"
                name="foundingDate"
                type="date"
                value={formData.foundingDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Ativo</SelectItem>
                  <SelectItem value="INACTIVE">Inativo</SelectItem>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                  <SelectItem value="SUSPENDED">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                placeholder="00000-000"
                className={isCepLoading ? "bg-gray-100" : ""}
              />
              {isCepLoading && (
                <p className="text-xs text-muted-foreground">Buscando CEP...</p>
              )}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Endereço *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado *</Label>
              <Select value={formData.state} onValueChange={handleStateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {brazilianStates.map((state) => (
                    <SelectItem key={state.uf} value={state.uf}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/agencies")}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Salvando..."
            : agency
            ? "Atualizar Agência"
            : "Criar Agência"}
        </Button>
      </div>
    </form>
  );
}
