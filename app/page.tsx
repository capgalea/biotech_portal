import { Suspense } from "react"
import BiotechPortal from "@/components/biotech-portal"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="p-8">
            <Skeleton className="h-[800px] w-full" />
          </div>
        }
      >
        <BiotechPortal />
      </Suspense>
    </main>
  )
}

