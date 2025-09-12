import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/layouts/dashboard-layout';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PenToolIcon } from 'lucide-react';

// Pet Show Page
export default function PetShow() {
    const { petwithAppointment: pet } = usePage<PageProps>().props;

    return (
        <DashboardLayout title={pet.name}>
            <div className="py-6">
                <div className="mx-auto max-w-4xl space-y-6 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle>{pet.name}</CardTitle>
                                    <p className="text-muted-foreground">
                                        {pet.species} {pet.breed && `• ${pet.breed}`}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <Link href={route('owner.pets.edit', pet.slug)}>
                                        <Button variant="outline">Edit</Button>
                                    </Link>
                                    <Link href={route('owner.pets.index')}>
                                        <Button>Back to Pets</Button>
                                    </Link>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="md:col-span-1">
                                    {pet.images && pet.images.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="aspect-square overflow-hidden rounded-lg">
                                                <img src={`/storage/${pet.images[0].path}`} alt={pet.name} className="h-full w-full object-cover" />
                                            </div>
                                            {pet.images.length > 1 && (
                                                <div className="grid grid-cols-3 gap-2">
                                                    {pet.images.slice(1).map((image, index) => (
                                                        <div key={index} className="aspect-square overflow-hidden rounded-md">
                                                            <img
                                                                src={`/storage/${image.path}`}
                                                                alt={pet.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
                                            <PenToolIcon className="h-16 w-16 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Pet Details</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Species</p>
                                                    <p className="font-medium">{pet.species}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Breed</p>
                                                    <p className="font-medium">{pet.breed || 'Not specified'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Gender</p>
                                                    <p className="font-medium capitalize">{pet.gender || 'Not specified'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Birth Date</p>
                                                    <p className="font-medium">
                                                        {pet.birth_date ? new Date(pet.birth_date).toLocaleDateString() : 'Unknown'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Weight</p>
                                                    <p className="font-medium">{pet.weight_kg ? `${pet.weight_kg} kg` : 'Not specified'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Microchip</p>
                                                    <p className="font-medium">{pet.microchip || 'Not specified'}</p>
                                                </div>
                                            </div>

                                            {pet.notes && (
                                                <div className="mt-6">
                                                    <p className="text-sm text-muted-foreground">Notes</p>
                                                    <p className="font-medium">{pet.notes}</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Health Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pet.health_records && pet.health_records.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Description</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pet.health_records.map((record) => (
                                            <TableRow key={record.id}>
                                                <TableCell className="whitespace-nowrap">
                                                    {new Date(record.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">{record.treatment}</TableCell>
                                                <TableCell>{record.description}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <Card>
                                    <CardContent className="grid-row grid items-center justify-center">
                                        <CardTitle>
                                            <div className="py-6 text-center text-muted-foreground">No health records found.</div>
                                        </CardTitle>
                                        <CardDescription>
                                            <Button>
                                                <Link href={route('owner.pets.health.create', pet.slug)}>Add Health Details</Link>
                                            </Button>
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Appointments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pet.appointments && pet.appointments.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date & Time</TableHead>
                                            <TableHead>Purpose</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pet.appointments.map((appointment) => (
                                            <TableRow key={appointment.id}>
                                                <TableCell className="whitespace-nowrap">
                                                    {new Date(appointment.appointment_date).toLocaleString()}
                                                </TableCell>
                                                <TableCell>{appointment.purpose}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            appointment.status === 'pending'
                                                                ? 'secondary'
                                                                : appointment.status === 'approved'
                                                                  ? 'default'
                                                                  : 'destructive'
                                                        }
                                                        className="capitalize"
                                                    >
                                                        {appointment.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="py-6 text-center text-muted-foreground">No appointments found.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
