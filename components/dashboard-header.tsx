"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building2, Menu, User, LogOut, FileText } from "lucide-react";

export default function DashboardHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Alternar menu</span>
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => handleNavigation("/dashboard")}
          >
            <Building2 className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">PAYLINK Turismo</span>
          </Button>
        </div>
        <nav
          className={`mx-6 hidden md:flex md:items-center md:gap-4 lg:gap-6 ${
            isMenuOpen ? "flex" : "hidden"
          }`}
        >
          <Button
            variant="ghost"
            className={`text-sm font-medium ${
              isActive("/dashboard") && !isActive("/dashboard/agencies")
                ? "text-primary"
                : "text-muted-foreground"
            } transition-colors hover:text-primary`}
            onClick={() => handleNavigation("/dashboard")}
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className={`text-sm font-medium ${
              isActive("/dashboard/agencies")
                ? "text-primary"
                : "text-muted-foreground"
            } transition-colors hover:text-primary`}
            onClick={() => handleNavigation("/dashboard/agencies")}
          >
            Agências
          </Button>
          <Button
            variant="ghost"
            className={`text-sm font-medium ${
              isActive("/api-docs") ? "text-primary" : "text-muted-foreground"
            } transition-colors hover:text-primary`}
            onClick={() => handleNavigation("/api-docs")}
          >
            <FileText className="mr-1 h-4 w-4" />
            API Docs
          </Button>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Menu do usuário</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {session?.user?.email}
                <p className="text-xs text-muted-foreground">
                  {session?.user?.role === "ADMIN"
                    ? "Administrador"
                    : "Analista"}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNavigation("/dashboard")}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleNavigation("/dashboard/agencies")}
              >
                Agências
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation("/api-docs")}>
                Documentação da API
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isMenuOpen && (
        <div className="border-t md:hidden">
          <nav className="grid grid-flow-row auto-rows-max text-sm p-4 space-y-2">
            <Button
              variant="ghost"
              className={`flex items-center justify-start gap-2 p-2 rounded-md ${
                isActive("/dashboard") && !isActive("/dashboard/agencies")
                  ? "bg-muted font-medium"
                  : ""
              }`}
              onClick={() => handleNavigation("/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className={`flex items-center justify-start gap-2 p-2 rounded-md ${
                isActive("/dashboard/agencies") ? "bg-muted font-medium" : ""
              }`}
              onClick={() => handleNavigation("/dashboard/agencies")}
            >
              Agências
            </Button>
            <Button
              variant="ghost"
              className={`flex items-center justify-start gap-2 p-2 rounded-md ${
                isActive("/api-docs") ? "bg-muted font-medium" : ""
              }`}
              onClick={() => handleNavigation("/api-docs")}
            >
              <FileText className="mr-1 h-4 w-4" />
              API Docs
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
