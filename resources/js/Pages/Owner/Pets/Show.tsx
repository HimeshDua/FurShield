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
        <DashboardLayout title={`Fur Shield – ${pet.name}`}>
            <div className="py-6">
                <div className="mx-auto max-w-5xl space-y-8 sm:px-6 lg:px-8">
                    {/* Top Card */}
                    <Card className="bg-card text-card-foreground shadow-xl">
                        <CardHeader className="border-b border-border">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-bold text-primary">{pet.name}</CardTitle>
                                    <p className="mt-1 text-muted-foreground">
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

                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {/* Images */}
                                <div className="md:col-span-1">
                                    {pet.images && pet.images.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="aspect-square overflow-hidden rounded-lg border border-border">
                                                <img src={`/storage/${pet.images[0].path}`} alt={pet.name} className="h-full w-full object-cover" />
                                            </div>
                                            {pet.images.length > 1 && (
                                                <div className="grid grid-cols-3 gap-2">
                                                    {pet.images.slice(1).map((image, index) => (
                                                        <div key={index} className="aspect-square overflow-hidden rounded-md border border-border">
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

                                {/* Pet Details */}
                                <div className="md:col-span-2">
                                    <Card className="bg-muted/30">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Pet Details</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <Detail label="Species" value={pet.species} />
                                                <Detail label="Breed" value={pet.breed || 'Not specified'} />
                                                <Detail label="Gender" value={pet.gender || 'Not specified'} />
                                                <Detail
                                                    label="Birth Date"
                                                    value={pet.birth_date ? new Date(pet.birth_date).toLocaleDateString() : 'Unknown'}
                                                />
                                                <Detail label="Weight" value={pet?.weight_kg ? `${pet.weight_kg} kg` : 'Not specified'} />
                                                <Detail label="Microchip" value={pet.microchip || 'Not specified'} />
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

                    {/* Health Records */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Health Records</CardTitle>
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
                                <Card className="bg-muted/30">
                                    <CardContent className="flex flex-col items-center justify-center py-6">
                                        <CardTitle className="text-muted-foreground">No health records found.</CardTitle>
                                        <CardDescription className="mt-3">
                                            <Link href={route('owner.pets.health.create', pet.slug)}>
                                                <Button>Add Health Details</Button>
                                            </Link>
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            )}
                        </CardContent>
                    </Card>

                    {/* Appointments */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Appointments</CardTitle>
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

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-muted-foreground">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    );
}
