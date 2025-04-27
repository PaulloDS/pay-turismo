"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteAgencyButtonProps extends ButtonProps {
  agencyId: string;
  agencyName: string;
  onDeleted?: () => void;
}

export default function DeleteAgencyButton({
  agencyId,
  agencyName,
  onDeleted,
  variant = "destructive",
  size,
  className,
  ...props
}: DeleteAgencyButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/agency/${agencyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Falha ao excluir agência");
      }

      // Fechar o modal
      setIsOpen(false);

      // Notificar o componente pai que a exclusão foi concluída
      if (onDeleted) {
        onDeleted();
      } else {
        // Se não houver callback, redirecionar para a lista
        router.push("/dashboard/agencies");
        router.refresh();
      }
    } catch (error) {
      console.error("Erro ao excluir agência:", error);
      toast("Falha ao excluir agência. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={variant} size={size} className={className} {...props}>
          {variant === "destructive" && <Trash2 className="mr-2 h-4 w-4" />}
          {variant === "destructive" ? "Excluir Agência" : "Excluir"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente a
            agência <strong>{agencyName}</strong> e todos os dados associados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
