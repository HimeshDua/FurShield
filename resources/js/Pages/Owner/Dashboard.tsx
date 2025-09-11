// resources/js/Pages/Owner/Dashboard.tsx
import Pagination from '@/components/shared/Pagination';
import { Badge } from '@/components/ui/badge'; // optional — if not present, replace with simple span
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Appointment, PageProps, Pet } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';

type Props = PageProps<{
    pets: { data: Pet[]; meta?: any; links?: any };
    appointments: { data: Appointment[]; meta?: any; links?: any };
}>;

/** small helper to format datetime consistently */
function formatDateTime(iso?: string) {
    if (!iso) return '—';
    try {
        return format(new Date(iso), 'PPp');
    } catch {
        return new Date(iso).toLocaleString();
    }
}

export default function OwnerDashboard() {
    const { props } = usePage<Props>();
    const pets = props.pets ?? { data: [] };
    const appointments = props.appointments ?? { data: [] };

    return (
        <DashboardLayout title="Owner dashboard">
            <div className="mx-auto max-w-6xl py-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main column */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Upcoming Appointments */}
                        <section className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">Upcoming appointments</h2>
                                    <p className="mt-1 text-sm text-slate-500">Requests and confirmed visits for your pets.</p>
                                </div>
                                <div>
                                    <Link href="/appointments">
                                        <Button variant="ghost" size="sm">
                                            View all
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-4 space-y-3">
                                {appointments.data.length === 0 ? (
                                    <div className="rounded-md border border-dashed border-slate-200 p-6 text-sm text-slate-600">
                                        No upcoming appointments.{' '}
                                        <Link href="/vets" className="text-primary underline">
                                            Find a vet
                                        </Link>{' '}
                                        to book one.
                                    </div>
                                ) : (
                                    appointments.data.map((a: any) => (
                                        <article key={a.id} className="flex items-center justify-between gap-4 rounded border p-3">
                                            <div className="flex items-center gap-4">
                                                {/* pet avatar / image */}
                                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-slate-100">
                                                    {a.pet?.images?.[0]?.path ? (
                                                        // storage path assumed to be /storage/...
                                                        // if your stored path differs, adapt this src
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={`/storage/${a.pet.images[0].path}`}
                                                            alt={a.pet.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                                                            {a.pet?.name?.[0] ?? 'P'}
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-medium">{a.pet?.name ?? 'Pet'}</h3>
                                                        <span className="text-sm text-slate-500">—</span>
                                                        <div className="text-sm text-slate-600">{a.vet?.name ?? 'Vet'}</div>
                                                    </div>
                                                    <div className="mt-1 text-sm text-slate-500">{formatDateTime(a.appointment_time)}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {/* status badge */}
                                                <div>
                                                    {/* If you don't have a Badge component, use a <span> with classes */}
                                                    <Badge
                                                        variant={
                                                            a.status === 'approved'
                                                                ? 'secondary'
                                                                : a.status === 'pending'
                                                                  ? 'secondary'
                                                                  : 'destructive'
                                                        }
                                                    >
                                                        {a.status?.charAt(0).toUpperCase() + (a.status?.slice(1) ?? '')}
                                                    </Badge>
                                                </div>

                                                {/* actions */}
                                                <div className="flex items-center gap-2">
                                                    <Link href={route('appointments.show', a.id)} className="text-sm">
                                                        <Button variant="outline" size="sm">
                                                            Details
                                                        </Button>
                                                    </Link>

                                                    {/* Cancel action: uses a simple form to respect CSRF & HTTP method semantics.
                              If you have a dedicated cancel endpoint for owners, update the action path & method. */}
                                                    <form method="post" action={`/appointments/${a.id}/cancel`}>
                                                        {/* For method spoofing in Inertia forms keep a hidden _method field if needed */}
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

                        {/* Pets list */}
                        <section className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">Your pets</h2>
                                    <p className="mt-1 text-sm text-slate-500">Manage pet profiles, medical history and appointments.</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link href="/pets/create">
                                        <Button size="sm">Add pet</Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                {pets.data.length === 0 ? (
                                    <div className="rounded-md border border-dashed border-slate-200 p-6 text-sm text-slate-600">
                                        You haven't added any pets yet. Add a profile to keep health records and book appointments.
                                        <div className="mt-3">
                                            <Link href="/pets/create">
                                                <Button size="sm">Create Pet Profile</Button>
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    pets.data.map((pet: any) => (
                                        <div key={pet.id} className="flex items-center justify-between gap-4 rounded border p-3">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-slate-100">
                                                    {pet.images?.[0]?.path ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={`/storage/${pet.images[0].path}`}
                                                            alt={pet.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                                                            {pet.name?.[0] ?? 'P'}
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <div className="font-medium">{pet.name}</div>
                                                    <div className="text-sm text-slate-500">
                                                        {pet.species} • {pet.breed ?? '—'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Link href={`/pets/${pet.id}`} className="text-sm">
                                                    <Button variant="ghost" size="sm">
                                                        View
                                                    </Button>
                                                </Link>
                                                <Link href={`/pets/${pet.id}/edit`} className="text-sm">
                                                    <Button variant="outline" size="sm">
                                                        Edit
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* pagination: use the same prop you pass from controller */}
                            <div className="mt-6">
                                {/* prefer meta pagination if your Pagination component expects `meta` */}
                                {/* If your Pagination expects `links`, change to links={pets.links} */}
                                <Pagination links={pets.links} />
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="font-semibold">Quick actions</h3>
                            <div className="mt-3 flex flex-col gap-2">
                                <Link href="/pets/create" className="text-sm text-blue-600">
                                    Add pet
                                </Link>
                                <Link href="/vets" className="text-sm text-blue-600">
                                    Find a vet
                                </Link>
                                <Link href="/products" className="text-sm text-blue-600">
                                    Shop products
                                </Link>
                                <Link href="/adoptions" className="text-sm text-blue-600">
                                    Browse adoptions
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="font-semibold">Reminders</h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Vaccination and medication reminders will appear here. Enable notifications in your profile to receive email
                                reminders.
                            </p>
                            <div className="mt-3">
                                <Link href="/profile">
                                    <Button size="sm">Manage reminders</Button>
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </DashboardLayout>
    );
}
