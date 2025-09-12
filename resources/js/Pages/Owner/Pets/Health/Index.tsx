import Pagination from '@/components/shared/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/layouts/dashboard-layout';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';

export default function PetHealthIndex() {
    const { pet, records: healthRecords } = usePage<PageProps>().props;

    return (
        <DashboardLayout title={`${pet.name} Health Records`}>
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>{pet.name} Health Records</CardTitle>
                                {/* <Link href={route('owner.pets.health.edit', pet.slug)}>
                                    <Button>
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Add Record
                                    </Button>
                                </Link> */}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {healthRecords.data.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="mx-auto max-w-md space-y-4">
                                        <div className="mx-auto w-fit rounded-full bg-muted p-4">
                                            <PlusIcon className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-medium">No health records yet</h3>
                                        <p className="text-sm text-muted-foreground">You haven't added any health records for {pet.name} yet.</p>
                                        <Link href={route('owner.pets.health.create', pet.slug)}>
                                            <Button className="mt-4">Add First Record</Button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {healthRecords.data.map((record: any) => (
                                            <Card key={record.id} className="overflow-hidden transition-all hover:shadow-md">
                                                <CardHeader className="p-4 pb-2">
                                                    <div className="flex items-start justify-between">
                                                        <CardTitle className="text-xl">{record.type}</CardTitle>
                                                        <Badge variant="outline">{record.date}</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{record.notes || 'No notes provided'}</p>
                                                </CardHeader>
                                                <CardContent className="p-4 pt-0">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Link href={route('owner.pets.health.show', [pet.slug, record.id])}>
                                                            <Button variant="ghost" size="sm">
                                                                View
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('owner.pets.health.edit', [pet.slug, record.id])}>
                                                            <Button variant="outline" size="sm">
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                    {healthRecords.links && (
                                        <div className="mt-6">
                                            <Pagination links={healthRecords.links} />
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
