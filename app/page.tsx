import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building2, Users, BarChart3, Shield } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 lg:px-8 h-20 flex items-center border-b backdrop-blur-sm bg-white/60 fixed w-full z-50">
        <Link href="/" className="flex items-center justify-center">
          <Building2 className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            PAYLINK Turismo
          </span>
        </Link>
        <nav className="ml-auto flex gap-6">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Button variant="outline" className="font-medium bg-blue-600 text-white hover:bg-blue-800 hover:text-white">
              Entrar
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="font-medium">
              Começar Agora
            </Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1 pt-20">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-6">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-white">
                    Sistema de Gestão de Agências de Turismo
                  </h1>
                  <p className="max-w-[600px] text-lg text-blue-50 md:text-xl">
                    Simplifique as operações da sua agência de turismo com nossa
                    plataforma completa de gestão. Gerencie agências, acompanhe
                    o desempenho e faça seu negócio crescer.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="w-full bg-white text-blue-600 hover:bg-blue-50"
                    >
                      Começar Agora
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full bg-blue-800 border-white text-white hover:bg-white/50"
                    >
                      Criar Conta
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Recursos Principais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-center">
                    Gestão de Agências
                  </h3>
                  <p className="text-center text-gray-500">
                    Gerencie facilmente todas as suas agências de turismo em um
                    só lugar
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-center">
                    Acesso de Usuários
                  </h3>
                  <p className="text-center text-gray-500">
                    Acesso baseado em funções para administradores e analistas
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-center">Análises</h3>
                  <p className="text-center text-gray-500">
                    Acompanhe métricas de desempenho e crescimento
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-center">Seguro</h3>
                  <p className="text-center text-gray-500">
                    Autenticação JWT e autorização baseada em funções
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 px-6 md:px-8 border-t bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-semibold">PAYLINK Turismo</span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} PAYLINK Turismo. Todos os direitos
              reservados.
            </p>
            <nav className="flex gap-6">
              <Link
                href="#"
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                Termos de Serviço
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                Privacidade
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
