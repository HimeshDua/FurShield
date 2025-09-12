// resources/js/Pages/Shelter/Dashboard.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/layouts/dashboard-layout';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';

type Props = PageProps<{
    stats: { adoptions: number; products: number; pendingAdoptions: number };
    latestAdoptions: any[];
    latestProducts: any[];
}>;

export default function ShelterDashboard() {
    const { shelterData } = usePage<PageProps>().props;
    const { stats, latestAdoptions, latestProducts } = shelterData;
    return (
        <DashboardLayout title="Shelter Dashboard">
            <div className="mx-auto max-w-7xl space-y-8 py-8">
                {/* KPI Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Adoptions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.adoptions}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Total Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.products}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-yellow-600">{stats.pendingAdoptions}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick actions */}
                <div className="flex gap-3">
                    <Button asChild>
                        <Link href={route('shelter.adoptions.create')}>+ New Adoption</Link>
                    </Button>
                    <Button variant="secondary" asChild>
                        <Link href={route('shelter.products.create')}>+ Add Product</Link>
                    </Button>
                </div>

                {/* Latest Adoptions */}
                <section>
                    <h2 className="mb-3 text-lg font-semibold">Latest Adoptions</h2>
                    {latestAdoptions.length === 0 ? (
                        <p className="text-sm text-slate-500">No adoption listings yet.</p>
                    ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                            {latestAdoptions.map((a) => (
                                <div key={a.id} className="flex justify-between rounded border p-3">
                                    <div>
                                        <div className="font-medium">{a.pet_name}</div>
                                        <div className="text-sm text-slate-500">
                                            {a.species} • {a.status}
                                        </div>
                                    </div>
                                    <Link href={route('shelter.adoptions.edit', a.id)}>
                                        <Button size="sm" variant="outline">
                                            Edit
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Latest Products */}
                <section>
                    <h2 className="mb-3 text-lg font-semibold">Latest Products</h2>
                    {latestProducts.length === 0 ? (
                        <p className="text-sm text-slate-500">No products yet.</p>
                    ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                            {latestProducts.map((p) => (
                                <div key={p.id} className="flex justify-between rounded border p-3">
                                    <div>
                                        <div className="font-medium">{p.name}</div>
                                        <div className="text-sm text-slate-500">${p.price}</div>
                                    </div>
                                    <Link href={route('shelter.products.edit', p.id)}>
                                        <Button size="sm" variant="outline">
                                            Edit
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
}
