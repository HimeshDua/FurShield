import CustomerRequest from '@/components/admin/CustomerRequest';
import Pagination from '@/components/shared/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/layouts/dashboard-layout';
import { PageProps } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Check, DollarSign, Package, UserCheck, Users, X } from 'lucide-react';
import React, { useState } from 'react';

import type { AdminDashboardProps } from '@/types/admin';

export default function AdminDashboard() {
    const { props } = usePage<PageProps & { admin: AdminDashboardProps }>();
    const admin = props.admin;

    // site settings form
    const { data, setData, post, processing, reset, errors } = useForm({
        site_name: admin.settings.site_name ?? '',
        support_email: admin.settings.support_email ?? '',
        homepage_featured_vendors_count: admin.settings.homepage_featured_vendors_count ?? 4,
    });

    function submitSettings(e: React.FormEvent) {
        e.preventDefault();
        post(route('admin.settings.update'));
    }

    // user edit state
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editingRole, setEditingRole] = useState<'admin' | 'vendor' | 'owner' | 'shelter'>('owner');

    function openEditUser(user: any) {
        setEditingUserId(user.id);
        setEditingRole(user.role);
    }

    function updateUserRole(userId: number) {
        router.patch(
            route('admin.users.update', userId),
            { role: editingRole },
            {
                onSuccess: () => {
                    setEditingUserId(null);
                },
            },
        );
    }

    function deleteUser(userId: number) {
        if (!confirm('Delete this user? This action is destructive.')) return;
        router.delete(route('admin.users.destroy', userId));
    }

    function approveVendor(userId: number) {
        router.post(route('admin.users.approveVendor', userId));
    }

    function toggleProductFeature(productId: number, isFeatured: boolean) {
        router.post(route('admin.products.toggleFeatured', productId), { featured: !isFeatured });
    }

    function moderateProductDelete(productId: number) {
        if (!confirm('Move product to trash?')) return;
        router.delete(route('admin.products.destroy', productId));
    }

    return (
        <DashboardLayout title="Admin Dashboard">
            <Head title="Admin Dashboard" />
            <main className="space-y-6 p-6">
                <header>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Manage users, products, vendors and platform settings.</p>
                </header>

                {/* top stats */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {' '}
                                <DollarSign className="h-4 w-4" /> Revenue
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{admin.stats.totalRevenueFormatted}</div>
                            <div className="mt-1 text-sm text-muted-foreground">{admin.stats.revenueChangeLabel}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {' '}
                                <UserCheck className="h-4 w-4" /> Vendors
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{admin.stats.totalVendors}</div>
                            <div className="mt-1 text-sm text-muted-foreground">{admin.stats.vendorsChangeLabel}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {' '}
                                <Users className="h-4 w-4" /> Customers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{admin.stats.totalCustomers}</div>
                            <div className="mt-1 text-sm text-muted-foreground">{admin.stats.customersChangeLabel}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {' '}
                                <Package className="h-4 w-4" /> Products
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{admin.stats.totalProducts}</div>
                            <div className="mt-1 text-sm text-muted-foreground">{admin.stats.productsChangeLabel}</div>
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                    {/* left column: vendor approvals + user management */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Vendor approvals</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {admin.pendingVendors.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">No pending vendor approvals.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {admin.pendingVendors.map((v) => (
                                            <div key={v.id} className="flex items-center justify-between gap-4 rounded border p-3">
                                                <div>
                                                    <div className="font-medium">{v.name}</div>
                                                    <div className="text-sm text-muted-foreground">{v.email}</div>
                                                    <div className="mt-1 text-xs text-muted-foreground">
                                                        {v.vendor_profile?.specializations?.join(', ')}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button size="sm" onClick={() => approveVendor(v.id)}>
                                                        <Check className="mr-2" />
                                                        Approve
                                                    </Button>
                                                    <Button size="sm" variant="destructive" onClick={() => deleteUser(v.id)}>
                                                        <X className="mr-2" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {admin.users.data.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">No users.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {admin.users.data.map((u) => (
                                            <div key={u.id} className="flex items-center justify-between gap-4 rounded border p-3">
                                                <div>
                                                    <div className="font-medium">
                                                        {u.name} <span className="ml-2 text-xs text-muted-foreground">({u.email})</span>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Role: <Badge>{u.role}</Badge>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button size="sm" onClick={() => openEditUser(u)}>
                                                        Edit
                                                    </Button>
                                                    <Button size="sm" variant="destructive" onClick={() => deleteUser(u.id)}>
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="mt-4">
                                            <Pagination links={admin.users.links} onPageChange={(url) => url && router.get(url)} />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* edit user inline panel */}
                        {editingUserId && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Edit user {editingUserId}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div>
                                            <Label>Role</Label>
                                            <Select onValueChange={(v: any) => setEditingRole(v)} defaultValue={editingRole}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                    <SelectItem value="vendor">Vendor</SelectItem>
                                                    <SelectItem value="owner">Owner</SelectItem>
                                                    <SelectItem value="shelter">Shelter</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-end gap-2">
                                            <Button onClick={() => updateUserRole(editingUserId)}>Save</Button>
                                            <Button variant="ghost" onClick={() => setEditingUserId(null)}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* right column: products moderation + settings + customer requests */}
                    <aside className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Products moderation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {admin.products.data.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">No products to moderate.</div>
                                ) : (
                                    <div className="space-y-2">
                                        {admin.products.data.map((p) => (
                                            <div key={p.id} className="flex items-center justify-between gap-3 rounded border p-3">
                                                <div>
                                                    <div className="font-medium">{p.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {p.vendor?.name} • {p.category}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button size="sm" onClick={() => toggleProductFeature(p.id, p.is_featured)}>
                                                        {p.is_featured ? 'Unfeature' : 'Feature'}
                                                    </Button>
                                                    <Button size="sm" variant="destructive" onClick={() => moderateProductDelete(p.id)}>
                                                        Trash
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="mt-4">
                                            <Pagination links={admin.products.links} onPageChange={(url) => url && router.get(url)} />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Site settings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submitSettings} className="grid gap-3">
                                    <div>
                                        <Label htmlFor="site_name">Site name</Label>
                                        <Input id="site_name" value={data.site_name} onChange={(e) => setData('site_name', e.target.value)} />
                                        {errors.site_name && <div className="text-sm text-red-500">{errors.site_name}</div>}
                                    </div>

                                    <div>
                                        <Label htmlFor="support_email">Support email</Label>
                                        <Input
                                            id="support_email"
                                            value={data.support_email}
                                            onChange={(e) => setData('support_email', e.target.value)}
                                        />
                                        {errors.support_email && <div className="text-sm text-red-500">{errors.support_email}</div>}
                                    </div>

                                    <div>
                                        <Label htmlFor="homepage_featured_vendors_count">Homepage featured vendors</Label>
                                        <Input
                                            id="homepage_featured_vendors_count"
                                            type="number"
                                            value={String(data.homepage_featured_vendors_count)}
                                            onChange={(e) => setData('homepage_featured_vendors_count', Number(e.target.value))}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button type="submit" disabled={processing}>
                                            Save settings
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                setData('site_name', admin.settings.site_name ?? '');
                                                setData('support_email', admin.settings.support_email ?? '');
                                                setData('homepage_featured_vendors_count', admin.settings.homepage_featured_vendors_count ?? 4);
                                            }}
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Customer requests</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CustomerRequest customerRequest={admin.customerRequests} onPageChange={(url) => url && router.get(url)} />
                            </CardContent>
                        </Card>
                    </aside>
                </section>
            </main>
        </DashboardLayout>
    );
}
