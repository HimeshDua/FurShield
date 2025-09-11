import Pagination from '@/components/shared/Pagination';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layouts/dashboard-layout';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export default function PetsIndex() {
    const { props } = usePage<PageProps>();
    const pets = props.pets ?? { data: [] };

    return (
        <DashboardLayout title="My pets">
            <div className="mx-auto max-w-6xl py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">My pets</h1>
                    <Link href="/pets/create">
                        <Button>Add pet</Button>
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {pets.data.map((pet: any) => (
                        <div key={pet.id} className="rounded-lg border bg-white p-4 shadow-sm">
                            <div className="h-40 overflow-hidden rounded bg-slate-100">
                                {pet.images?.[0]?.path ? (
                                    <img src={`/storage/${pet.images[0].path}`} alt={pet.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-400">No image</div>
                                )}
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                                <div>
                                    <div className="font-medium">{pet.name}</div>
                                    <div className="text-sm text-slate-500">
                                        {pet.species} • {pet.breed ?? '—'}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <Link href={`/pets/${pet.id}`} className="text-sm text-primary">
                                        View
                                    </Link>
                                    <Link href={`/pets/${pet.id}/edit`} className="text-sm">
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <Pagination links={pets.links} />
                </div>
            </div>
        </DashboardLayout>
    );
}
