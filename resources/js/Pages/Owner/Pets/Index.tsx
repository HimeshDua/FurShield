import Pagination from '@/components/shared/Pagination';
import Layout from '@/layouts/layout';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';

// export type Props = {
//     pets: {
//         data: Pet;
//         links: links;
//     };
//     appointments: {
//         data: Appointment[];
//         links: links;
//     };
// };
export default function PetsIndex() {
    const { pet } = usePage<PageProps>().props;
    return (
        <Layout title="My Pets">
            <div className="mx-auto max-w-6xl py-8">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">My Pets</h1>
                    <Link href="/pets/create" className="rounded bg-primary px-3 py-1 text-sm text-white">
                        Add pet
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {pet.data.map((p: any) => (
                        <div key={p.id} className="rounded bg-white p-4 shadow-sm">
                            <div className="mb-3 flex h-36 items-center justify-center rounded bg-slate-100">
                                {p.images?.[0] ? (
                                    <img src={`/storage/${p.images[0].path}`} alt={p.name} className="h-full w-full rounded object-cover" />
                                ) : (
                                    <span className="text-slate-400">No image</span>
                                )}
                            </div>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-sm text-slate-500">{p.species}</div>
                            <div className="mt-3 flex items-center justify-between">
                                <Link href={`/pets/${p.id}`} className="text-sm text-blue-600">
                                    View
                                </Link>
                                <Link href={`/pets/${p.id}/edit`} className="text-sm">
                                    Edit
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <Pagination links={pet.links} />
                </div>
            </div>
        </Layout>
    );
}
