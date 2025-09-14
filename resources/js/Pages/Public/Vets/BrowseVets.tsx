import DashboardLayout from '@/layouts/dashboard-layout'
import { PageProps } from '@/types'
import { Link, usePage } from '@inertiajs/react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/components/ui/button'

export default function BrowseVets() {
  const { vets } = usePage<PageProps>().props

  return (
    <DashboardLayout title="Available Veterinarians">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={route('dashboard')}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={route('vets.index')}>Veterinarians</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl font-bold">Available Veterinarians</h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vets.map((vet) => (
            <Card
              key={vet.id}
              className="transition hover:shadow-md"
            >
              <CardHeader>
                <CardTitle className="text-xl">{vet.user.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {vet.specializations?.length > 0 && (
                  <p className="line-clamp-2 text-sm">
                    <span className="font-medium">Specializations:</span>{' '}
                    {vet.specializations.join(', ')}
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-medium">Consultation Fee:</span>{' '}
                  {vet.consultation_fee} PKR
                </p>
                <p className="line-clamp-1 text-sm">
                  <span className="font-medium">Clinic:</span>{' '}
                  {vet.clinic_address}
                </p>
                <Button asChild className="mt-4 w-full">
                  <Link href={route('vets.show', vet.id)}>View Profile</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
