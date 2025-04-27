"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Building2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "analyst", // Default role
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    console.log("Função alterada para:", value);
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Enviando dados de registro:", formData);

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Resposta do registro:", data);

      if (!response.ok) {
        throw new Error(data.message || "Falha no registro");
      }

      router.push("/login?registered=true");
    } catch (err: any) {
      console.error("Erro de registro:", err);
      setError(err.message || "Ocorreu um erro durante o registro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Link href="/" className="flex items-center justify-center mb-8">
        <Building2 className="h-6 w-6 text-primary" />
        <span className="ml-2 text-xl font-bold">PAYLINK Turismo</span>
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Criar uma conta
          </CardTitle>
          <CardDescription className="text-center">
            Digite seus dados para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nome@exemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Função</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analyst">Analista</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Criando conta..." : "Registrar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-500">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
