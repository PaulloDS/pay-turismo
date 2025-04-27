import { getServerSession } from "next-auth/next"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard-header"
import AgencyForm from "@/components/agency-form"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface EditAgencyPageProps {
  params: {
    id: string
  }
}

export default async function EditAgencyPage({ params }: EditAgencyPageProps) {
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
          <div className="flex items-center space-x-2">
            <Link href={`/dashboard/agencies/${agency.id}`}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Edit Agency</h1>
          </div>
          <p className="text-gray-500">Update the details for {agency.fantasyName}.</p>
          <AgencyForm agency={agency} />
        </div>
      </main>
    </div>
  )
}
