import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Link } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';

// Mock the route function
const route = (name, params) => {
    switch (name) {
        case 'owner.pets.health.create':
            return `/pets/${params}/health/create`;
        case 'owner.pets.health.show':
            return `/pets/${params[0]}/health/${params[1]}`;
        case 'owner.pets.health.edit':
            return `/pets/${params[0]}/health/${params[1]}/edit`;
        default:
            return '#';
    }
};

export default function PetHealthIndex() {
    const { pet, records: healthRecords } = usePage().props;

    return (
        <DashboardLayout title={`${pet.name} Health Records`}>
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="rounded-xl border border-border shadow-sm">
                        <CardHeader className="rounded-t-xl bg-muted/30 p-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl font-bold">{pet.name} Health Records</CardTitle>
                                <Link href={route('owner.pets.health.create', pet.slug)}>
                                    <Button variant={'default'} size="sm" className="bg-primary text-primary-foreground hover:opacity-90">
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Add New Record
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {healthRecords.data.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="mx-auto flex flex-col items-center justify-center space-y-4">
                                        <div className="mx-auto w-fit rounded-full bg-muted p-4">
                                            <PlusIcon className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-medium">No health records yet</h3>
                                        <p className="text-sm text-muted-foreground">You haven't added any health records for {pet.name} yet.</p>
                                        <Link href={route('owner.pets.health.create', pet.slug)}>
                                            <Button className="mt-4 bg-primary text-primary-foreground hover:opacity-90">Add First Record</Button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {healthRecords.data.map((record) => (
                                            <Card
                                                key={record.id}
                                                className="overflow-hidden rounded-lg border border-border transition-all hover:border-primary-foreground/20 hover:shadow-lg"
                                            >
                                                <CardHeader className="p-4 pb-2">
                                                    <div className="flex items-start justify-between">
                                                        <CardTitle className="text-lg font-semibold">{record.title}</CardTitle>
                                                        <Badge variant="outline" className="border-border text-foreground">
                                                            {record.visit_date}
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="p-4 pt-0">
                                                    <p className="text-sm text-muted-foreground">{record.notes || 'No notes provided.'}</p>
                                                    <div className="mt-4 flex items-center justify-end space-x-2">
                                                        <Link href={route('owner.pets.health.show', [pet.slug, record.id])}>
                                                            <Button variant="ghost" size="sm" className="text-primary hover:bg-muted">
                                                                View
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('owner.pets.health.edit', [pet.slug, record.id])}>
                                                            <Button variant="outline" size="sm" className="border-border hover:bg-muted">
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                    {healthRecords.links && (
                                        <div className="mt-6 flex justify-center">{/* Pagination Component would go here */}</div>
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
