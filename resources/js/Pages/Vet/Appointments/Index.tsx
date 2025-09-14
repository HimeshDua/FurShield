// resources/js/Pages/Vet/Appointments/Index.jsx
import Pagination from '@/Components/shared/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Check, Edit3, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function VetAppointmentsIndex() {
    const { appointments } = usePage().props; // expects paginated object
    const [filter, setFilter] = useState('');

    // Separate forms for each action to keep 'processing' flags separate.
    const approveForm = useForm({});
    const rescheduleForm = useForm({ appointment_time: '' });
    const cancelForm = useForm({ reason: '' });
    const completeForm = useForm({}); // you can extend with health record fields later

    // Approve
    function approve(appointmentId: string) {
        if (!confirm('Approve this appointment?')) return;
        approveForm.patch(route('appointments.approve', appointmentId), {
            preserveScroll: true,
            onSuccess: () => {
                // optional: show toast or let server flash handle it
            },
        });
    }

    // Reschedule (simple prompt-based flow)
    function reschedule(appointmentId: string, currentTime) {
        const newTime = prompt(
            'Enter new date/time (YYYY-MM-DD HH:MM):',
            // fallback formatted
            currentTime ? currentTime.replace('T', ' ').slice(0, 16) : '',
        );
        if (!newTime) return;

        rescheduleForm.patch(route('appointments.reschedule', appointmentId), {
            preserveScroll: true,
            data: { appointment_time: newTime },
            onSuccess: () => {},
            onError: () => {
                // server validation errors will be in rescheduleForm.errors
                // You can surface them with a toast or UI if desired
            },
        });
    }

    // Cancel
    function cancel(appointmentId) {
        const reason = prompt('Reason for cancellation (optional):', '');
        if (!confirm('Cancel this appointment?')) return;

        cancelForm.patch(route('appointments.cancel', appointmentId), {
            preserveScroll: true,
            data: { reason },
            onSuccess: () => {},
        });
    }

    // Complete -> create health record (quick)
    function complete(appointmentId) {
        if (!confirm('Mark appointment as completed and create a health record?')) return;

        completeForm.patch(route('appointments.complete', appointmentId), {
            preserveScroll: true,
            // If you want to send fields like diagnosis/treatment, add them to completeForm.data
            onSuccess: () => {},
        });
    }

    return (
        <DashboardLayout title="Appointments">
            <div className="bg-background py-6 text-foreground">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="bg-card text-card-foreground shadow-xl">
                        <CardHeader className="flex items-center justify-between border-b border-border p-4">
                            <CardTitle className="text-2xl">Appointments</CardTitle>
                            <div className="flex items-center space-x-2">
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="rounded-md border border-border bg-transparent px-3 py-1 text-sm"
                                >
                                    <option value="">All statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rescheduled">Rescheduled</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <Link href={route('vet.dashboard')}>
                                    <Button size="sm" variant="ghost">
                                        Back
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>

                        <CardContent className="p-4">
                            {!appointments || appointments.data.length === 0 ? (
                                <div className="py-12 text-center text-muted-foreground">No appointments yet.</div>
                            ) : (
                                <div className="space-y-3">
                                    {appointments.data
                                        .filter((a) => (filter ? a.status === filter : true))
                                        .map((a) => (
                                            <div key={a.id} className="flex items-center justify-between rounded-md border border-border p-3">
                                                <div>
                                                    <div className="text-sm font-medium">
                                                        <Link href={route('appointments.show', a.id)} className="hover:underline">
                                                            {a.pet?.name ?? 'Unknown pet'}
                                                        </Link>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {a.owner?.name ?? 'Owner'} • {new Date(a.appointment_time).toLocaleString()}
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Badge>{a.status}</Badge>

                                                    {a.status === 'pending' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => approve(a.id)}
                                                            disabled={approveForm.processing}
                                                            title="Approve"
                                                        >
                                                            <Check className="mr-2 h-4 w-4" /> Approve
                                                        </Button>
                                                    )}

                                                    {a.status !== 'cancelled' && a.status !== 'completed' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => reschedule(a.id, a.appointment_time)}
                                                                disabled={rescheduleForm.processing}
                                                            >
                                                                <Edit3 className="mr-2 h-4 w-4" /> Reschedule
                                                            </Button>

                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => cancel(a.id)}
                                                                disabled={cancelForm.processing}
                                                            >
                                                                <XCircle className="mr-2 h-4 w-4" /> Cancel
                                                            </Button>
                                                        </>
                                                    )}

                                                    {a.status !== 'completed' && (
                                                        <Button size="sm" onClick={() => complete(a.id)} disabled={completeForm.processing}>
                                                            Complete
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}

                            <div className="mt-6">{appointments && appointments.links && <Pagination links={appointments.links} />}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
