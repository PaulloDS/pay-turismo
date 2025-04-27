import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard-header"
import AgencyForm from "@/components/agency-form"

export default async function NewAgencyPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6">
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold">Add New Agency</h1>
          <p className="text-gray-500">Fill in the details below to register a new tourism agency in the system.</p>
          <AgencyForm />
        </div>
      </main>
    </div>
  )
}
