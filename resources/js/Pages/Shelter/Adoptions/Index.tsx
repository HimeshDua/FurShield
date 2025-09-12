import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/layouts/dashboard-layout';
import { PageProps } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';

export default function Index() {
    const { adoptions } = usePage<PageProps>().props as any;
    // adoptions is expected to be a paginated resource (data array + meta)
    const items = adoptions?.data ?? [];

    return (
        <DashboardLayout title="My Adoption Listings">
            <div className="container mx-auto py-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">My Adoption Listings</h1>
                    <Button asChild>
                        <Link href={route('shelter.adoptions.create')}>Add Listing</Link>
                    </Button>
                </div>

                {items.length === 0 ? (
                    <div className="rounded bg-white p-6 text-center shadow-sm">
                        <p className="text-lg">No adoption listings yet.</p>
                        <p className="text-sm text-muted-foreground">Create a listing to start finding adopters.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pet Name</TableHead>
                                <TableHead>Species</TableHead>
                                <TableHead>Breed</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((adoption: any) => (
                                <TableRow key={adoption.id}>
                                    <TableCell>{adoption.pet_name}</TableCell>
                                    <TableCell>{adoption.species}</TableCell>
                                    <TableCell>{adoption.breed || '-'}</TableCell>
                                    <TableCell>{adoption.age || '-'}</TableCell>
                                    <TableCell className="capitalize">{adoption.status}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href={route('shelter.adoptions.edit', adoption.slug)}>Edit</Link>
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => {
                                                if (!confirm('Delete this listing? This action cannot be undone.')) return;
                                                router.delete(route('shelter.adoptions.destroy', adoption.slug));
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </DashboardLayout>
    );
}
