import Layout from '@/layouts/layout';
import { Link, usePage } from '@inertiajs/react';

export default function VetsIndex() {
    const props = usePage().props as any;
    const vets = props.vets ?? { data: [] };

    return (
        <Layout title="">
            <div className="mx-auto max-w-6xl py-8">
                <h1 className="mb-4 text-2xl font-bold">Veterinarians</h1>
                <div className="grid gap-4 md:grid-cols-3">
                    {vets.data.map((v: any) => (
                        <div key={v.id} className="rounded bg-white p-4 shadow-sm">
                            <div className="font-medium">{v.name}</div>
                            <div className="text-sm text-slate-500">{v.vet_profile?.specializations?.join(', ')}</div>
                            <div className="mt-3">
                                <Link href={`/vets/${v.id}`}>View profile</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
