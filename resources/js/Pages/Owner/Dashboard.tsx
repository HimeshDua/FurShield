// resources/js/Pages/Owner/Dashboard.tsx
import { ReminderPopup } from '@/Components/owner/ReminderPopup'
import Pagination from '@/Components/shared/Pagination'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/layouts/dashboard-layout'
import { Appointment, links, PageProps, Pet } from '@/types'
import { Link, usePage } from '@inertiajs/react'
import { format } from 'date-fns'

type Props = PageProps<{
  pets: { data: Pet[]; links: links }
  appointments: { data: Appointment[]; links: links }
}>

function formatDateTime(iso?: string) {
  if (!iso) return '—'
  try {
    return format(new Date(iso), 'PPp')
  } catch {
    return new Date(iso).toLocaleString()
  }
}

export default function OwnerDashboard() {
  const {
    pets = { data: [], links: [] },
    appointments = { data: [], links: [] },
  } = usePage<Props>().props

  return (
    <DashboardLayout title="Owner Dashboard">
      <div className="mx-auto max-w-6xl py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <ReminderPopup />

          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Requests and confirmed visits for your pets.
                  </p>
                </div>

                <Link href={route('owner.appointments.index')}>
                  <Button variant="ghost" size="sm">
                    View all
                  </Button>
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {(appointments?.data?.length ?? 0) === 0 ? (
                  <div className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
                    No upcoming appointments.{' '}
                    <Link href="/vets" className="underline text-primary">
                      Find a vet
                    </Link>{' '}
                    to book one.
                  </div>
                ) : (
                  appointments.data.map((a: Appointment) => (
                    <article
                      key={a.id}
                      className="flex items-center justify-between gap-4 rounded border p-3"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-muted">
                          {a.pet?.images?.[0]?.path ? (
                            <img
                              src={`/storage/${a.pet.images[0].path}`}
                              alt={a.pet.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                              {a.pet?.name?.[0] ?? 'P'}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{a.pet?.name ?? 'Pet'}</h3>
                            <span className="text-sm text-muted-foreground">—</span>
                            <div className="text-sm text-muted-foreground">{a.vet?.name ?? 'Vet'}</div>
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {formatDateTime(a.appointment_time)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            a.status === 'approved' ? 'secondary' : a.status === 'pending' ? 'secondary' : 'destructive'
                          }
                        >
                          {a.status?.charAt(0).toUpperCase() + (a.status?.slice(1) ?? '')}
                        </Badge>

                        <div className="flex items-center gap-2">
                          <Link href={route('owner.appointments.show', a.id)} className="text-sm">
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          </Link>

                          <form method="post" action={`/appointments/${a.id}/cancel`}>
                            <input type="hidden" name="_method" value="patch" />
                            <Button type="submit" variant="ghost" size="sm">
                              Cancel
                            </Button>
                          </form>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-lg bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Your Pets</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage pet profiles, medical history and appointments.
                  </p>
                </div>

                <Link href={route('owner.pets.create')}>
                  <Button size="sm">Add pet</Button>
                </Link>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {(pets?.data?.length ?? 0) === 0 ? (
                  <div className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
                    You haven't added any pets yet. Add a profile to keep health records and book
                    appointments.
                    <div className="mt-3">
                      <Link href="/pets/create">
                        <Button size="sm">Create Pet Profile</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  pets.data.map((pet) => (
                    <div
                      key={pet.id}
                      className="flex items-center justify-between gap-4 rounded border p-3"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-muted">
                          {pet.images?.[0]?.path ? (
                            <img
                              src={`/storage/${pet.images[0].path}`}
                              alt={pet.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                              {pet.name?.[0] ?? 'P'}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="font-medium">{pet.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {pet.species} • {pet.breed ?? '—'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link href={route('owner.pets.show', pet.slug)} className="text-sm">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link href={route('owner.pets.edit', pet.slug)} className="text-sm">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6">
                <Pagination links={pets.links} />
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold">Quick actions</h3>
              <div className="mt-3 flex flex-col gap-2">
                <Link href={route('owner.pets.create')} className="text-sm text-primary">
                  Add pet
                </Link>
                <Link href={route('vets.index')} className="text-sm text-primary">
                  Find a vet
                </Link>
                <Link href={route('products.index')} className="text-sm text-primary">
                  Shop products
                </Link>
                <Link href={route('adoptions.index')} className="text-sm text-primary">
                  Browse adoptions
                </Link>
              </div>
            </div>

            <div className="rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold">Reminders</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Vaccination and medication reminders will appear here. Enable notifications in your
                profile to receive email reminders.
              </p>
              <div className="mt-3">
                {/* Manage reminders CTA */}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  )
}
