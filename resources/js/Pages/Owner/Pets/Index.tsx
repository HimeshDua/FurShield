import Pagination from '@/Components/shared/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Pet } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';

export default function PetIndex() {
    const { pet: pets } = usePage().props;

    return (
        <DashboardLayout title="My Pets">
            <div className="bg-background py-6 text-foreground">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="bg-card text-card-foreground shadow-xl">
                        <CardHeader className="border-b border-border">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl font-bold text-primary">My Pets</CardTitle>
                                <Link href={route('owner.pets.create')}>
                                    <Button>
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Add New Pet
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-6">
                            {pets.data.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="mx-auto max-w-md space-y-4">
                                        <div className="mx-auto w-fit rounded-full bg-muted p-4">
                                            <PlusIcon className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-medium text-primary">No pets yet</h3>
                                        <p className="text-sm text-muted-foreground">You haven&apos;t added any pets to your profile yet.</p>
                                        <Link href={route('owner.pets.create')}>
                                            <Button className="mt-4">Add Your First Pet</Button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {pets.data.map((pet: Pet) => (
                                            <Card
                                                key={pet.id}
                                                className="overflow-hidden rounded-lg border border-border bg-card text-card-foreground transition-all hover:shadow-md"
                                            >
                                                {pet.images && pet.images.length > 0 ? (
                                                    <div className="aspect-video overflow-hidden">
                                                        <img
                                                            src={`/storage/${pet.images[0].path}`}
                                                            alt={pet.name}
                                                            className="h-full w-full object-cover transition-transform hover:scale-105"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex aspect-video items-center justify-center bg-muted">
                                                        <PlusIcon className="h-10 w-10 text-muted-foreground" />
                                                    </div>
                                                )}

                                                <CardHeader className="p-4 pb-2">
                                                    <div className="flex items-start justify-between">
                                                        <CardTitle className="text-xl text-primary">{pet.name}</CardTitle>
                                                        <Badge variant="outline">{pet.species}</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {pet.breed || 'Mixed breed'} • {pet.gender || 'Unknown gender'}
                                                    </p>
                                                </CardHeader>

                                                <CardContent className="p-4 pt-0">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex space-x-2">
                                                            <Link href={route('owner.pets.show', pet.slug)}>
                                                                <Button variant="ghost" size="sm">
                                                                    View
                                                                </Button>
                                                            </Link>
                                                            <Link href={route('owner.pets.edit', pet.slug)}>
                                                                <Button variant="outline" size="sm">
                                                                    Edit
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    {pets.data.length > 0 && <div className="mt-6">{pets.links && <Pagination links={pets.links} />}</div>}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
