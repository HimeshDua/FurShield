import Layout from '@/layouts/layout';
import { Link, usePage } from '@inertiajs/react';

export default function PetShow() {
    const props = usePage().props as any;
    const pet = props.pet;

    return (
        <Layout title={pet.name}>
            <div className="mx-auto max-w-4xl py-8">
                <div className="rounded bg-white p-6 shadow-sm">
                    <div className="flex items-start gap-6">
                        <div className="h-40 w-40 overflow-hidden rounded bg-slate-100">
                            {pet.images?.[0] ? (
                                <img src={`/storage/${pet.images[0].path}`} alt={pet.name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full items-center justify-center text-slate-400">No image</div>
                            )}
                        </div>

                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">{pet.name}</h1>
                            <div className="text-sm text-slate-600">
                                {pet.species} • {pet.breed || '—'}
                            </div>
                            <p className="mt-4 text-slate-700">{pet.notes}</p>

                            <div className="mt-6 flex gap-3">
                                <Link href={`/pets/${pet.id}/health`} className="text-sm text-blue-600">
                                    Health records
                                </Link>
                                <form method="post" action={`/appointments/${pet.id}`}>
                                    <button type="submit" className="rounded bg-primary px-3 py-1 text-white">
                                        Book appointment
                                    </button>
                                </form>
                                <Link href={`/pets/${pet.id}/edit`} className="text-sm">
                                    Edit
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h2 className="font-semibold">Timeline</h2>
                        <div className="mt-3 space-y-3">
                            {pet.healthRecords?.map((r: any) => (
                                <div key={r.id} className="rounded border p-3">
                                    <div className="font-medium">{r.title || r.diagnosis}</div>
                                    <div className="text-xs text-slate-500">
                                        {new Date(r.visit_date).toLocaleDateString()} — by {r.vet?.name || 'Owner'}
                                    </div>
                                    <div className="mt-2 text-sm">{r.treatment}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
