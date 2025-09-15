import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/layouts/dashboard-layout';
import { HealthRecord, PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PawPrint, PenToolIcon } from 'lucide-react';

export default function PetShow() {
    const { petwithAppointment: pet, healthRecords } = usePage<PageProps>().props;

    return (
        <DashboardLayout title={pet.name}>
            <div className="bg-background py-6 text-foreground">
                <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
                    {/* Left column */}
                    <Card className="col-span-2 rounded-lg bg-card text-card-foreground shadow-md">
                        <CardHeader className="flex items-center gap-3">
                            <PawPrint className="h-6 w-6 text-primary" />
                            <CardTitle className="text-xl">{pet.name}&apos;s Profile</CardTitle>
                            <div className="ml-auto flex gap-2">
                                <Link href={route('owner.pets.edit', pet.slug)}>
                                    <Button variant="outline">Edit</Button>
                                </Link>
                                <Link href={route('owner.pets.index')}>
                                    <Button>Back</Button>
                                </Link>
                            </div>
                        </CardHeader>

                        <CardContent className="grid gap-6">
                            {/* Pet Images */}
                            <div className="relative h-72 w-full overflow-hidden rounded-lg">
                                {pet.images && pet.images.length > 0 ? (
                                    <img src={`/storage/${pet.images[0].path}`} alt={`${pet.name}'s photo`} className="c object-cover" />
                                ) : (
                                    <div className="flex h-72 items-center justify-center rounded-lg bg-muted">
                                        <PenToolIcon className="h-16 w-16 text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            {/* Pet Details Table */}
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">Species</TableCell>
                                        <TableCell>{pet.species}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Breed</TableCell>
                                        <TableCell>{pet.breed || 'Not specified'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Gender</TableCell>
                                        <TableCell className="capitalize">{pet.gender || 'Not specified'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Birth Date</TableCell>
                                        <TableCell>{pet.birth_date ? new Date(pet.birth_date).toLocaleDateString() : 'Unknown'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Weight</TableCell>
                                        <TableCell>{pet.weight_kg ? `${pet.weight_kg} kg` : 'Not specified'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">Microchip</TableCell>
                                        <TableCell>{pet.microchip || 'Not specified'}</TableCell>
                                    </TableRow>
                                    {pet.notes && (
                                        <TableRow>
                                            <TableCell className="font-medium">Notes</TableCell>
                                            <TableCell>{pet.notes}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Right column - Actions */}
                    <Card className="rounded-lg bg-card text-card-foreground shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <Badge className="w-fit bg-accent text-accent-foreground">Health</Badge>
                            <Button asChild className="bg-primary text-primary-foreground hover:opacity-90">
                                <Link href={route('owner.pets.health.create', pet.slug)}>Add Health Details</Link>
                            </Button>
                            <Button asChild variant="outline" className="border-border text-foreground hover:bg-muted">
                                <Link href={route('owner.appointments.index')}>Book Vet Appointment</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Health Records */}
                <Card className="mt-6 bg-card text-card-foreground">
                    <CardHeader>
                        <CardTitle>Health Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {healthRecords && healthRecords.data.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Diagnosis</TableHead>
                                        <TableHead>Treatment</TableHead>
                                        <TableHead>Attachment</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {healthRecords.data.map((record: HealthRecord) => (
                                        <TableRow key={record.id}>
                                            <TableCell>{new Date(record.visit_date).toLocaleDateString()}</TableCell>
                                            <TableCell>{record?.title}</TableCell>
                                            <TableCell>{record.diagnosis}</TableCell>
                                        <TableCell>{record.treatment}</TableCell>
                                            <TableCell><a className='underline' target='_blank' href={`/storage/${record.attachments}`}>View Attachment</a></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <CardDescription className="py-6 text-center">No health records found.</CardDescription>
              )}
            </CardContent>
                </Card>

                {/* Appointments */}
                <Card className="mt-6 bg-card text-card-foreground">
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
                                            <TableCell>{new Date(appointment.appointment_date).toLocaleString()}</TableCell>
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
        </DashboardLayout>
    );
}
