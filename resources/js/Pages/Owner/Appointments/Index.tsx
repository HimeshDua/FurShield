import Pagination from '@/Components/shared/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Appointment, PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Calendar } from 'lucide-react';

export default function OwnerAppointmentsIndex() {
    const { appointments } = usePage<PageProps>().props;

    return (
        <DashboardLayout title="My Appointments">
            <div className="bg-background py-6 text-foreground">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="bg-card shadow-xl">
                        <CardHeader className="flex justify-between border-b border-border">
                            <CardTitle className="text-2xl text-primary">My Appointments</CardTitle>
                            <Link href={route('vets.index')}>
                                <Button>
                                    <Calendar className="mr-2 h-4 w-4" /> Book Appointment
                                </Button>
                            </Link>
                        </CardHeader>

                        <CardContent className="p-6">
                            {appointments.data.length === 0 ? (
                                <p className="text-muted-foreground">No appointments booked yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {appointments.data.map((a: Appointment) => (
                                        <div
                                            key={a.id}
                                            className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/40"
                                        >
                                            <div>
                                                <p className="font-semibold">
                                                    {a.pet?.name ?? 'Pet'} with {a.vet?.name ?? 'Vet'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(a.appointment_time).toLocaleString()} — {a.reason || 'No reason given'}
                                                </p>
                                            </div>
                                            <Badge variant="outline">{a.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-6">{appointments.links && <Pagination links={appointments.links} />}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
