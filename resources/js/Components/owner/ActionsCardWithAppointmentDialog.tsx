// replace the old Card block with this component
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PageProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function ActionsCardWithAppointmentDialog() {
    const { pet, vets = [] } = usePage<PageProps>().props; // expects pet + optional vets list
    const [open, setOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        vet_id: vets.length ? String(vets[0].id) : '',
        appointment_time: '',
        duration_minutes: 30,
        reason: '',
    });

    function openDialog() {
        // ensure default vet choice if vets exist
        if (vets.length && !data.vet_id) {
            setData('vet_id', String(vets[0].id));
        }
        setShowConfirm(false);
        setOpen(true);
    }

    function closeDialog() {
        setOpen(false);
        setShowConfirm(false);
    }

    function handleSubmit(e) {
        e.preventDefault();
        // basic client-side validation before confirmation
        if (!data.vet_id) {
            alert('Please select a vet or visit the vets page.');
            return;
        }
        if (!data.appointment_time) {
            alert('Please select appointment date & time.');
            return;
        }

        // show confirmation view inside dialog
        setShowConfirm(true);
    }

    function confirmAndSubmit() {
        // post to the route: pets.appointments.store (expects pet param)
        post(route('pets.appointments.store', pet.slug), {
            preserveScroll: true,
            onSuccess: () => {
                closeDialog();
                reset('vet_id', 'appointment_time', 'duration_minutes', 'reason');
            },
            onError: () => {
                // keep the dialog open so server-side errors can be displayed
            },
        });
    }

    return (
        <Card className="rounded-lg bg-card text-card-foreground shadow-md">
            <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4">
                <Badge className="w-fit bg-accent text-accent-foreground">Health</Badge>

                <Button className="bg-primary text-primary-foreground hover:opacity-90">
                    {/* AddHealth button unchanged */}
                    <a href={route('owner.pets.health.create', pet.slug)}>Add Health Details</a>
                </Button>

                {/* Dialog Trigger for Booking */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="border-border text-foreground hover:bg-muted" onClick={openDialog}>
                            Book Vet Appointment
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Book Appointment for {pet.name}</DialogTitle>
                            <DialogDescription>
                                Choose vet, date & time. You will be asked to confirm before the appointment is submitted.
                            </DialogDescription>
                        </DialogHeader>

                        {!showConfirm ? (
                            // FORM VIEW
                            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                <div>
                                    <Label>Vet</Label>
                                    {vets.length ? (
                                        <Select value={data.vet_id} onValueChange={(v) => setData('vet_id', v)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a vet" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {vets.map((v) => (
                                                    <SelectItem key={v.id} value={String(v.id)}>
                                                        {v.name} {v.email ? `(${v.email})` : ''}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className="flex items-center justify-between space-x-2">
                                            <div className="text-sm text-muted-foreground">No vets available here.</div>
                                            <a href={route('vets.index')} className="text-sm underline">
                                                Browse vets
                                            </a>
                                        </div>
                                    )}
                                    {errors.vet_id && <p className="text-sm text-red-500">{errors.vet_id}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="appointment_time">Date & Time</Label>
                                    <Input
                                        id="appointment_time"
                                        type="datetime-local"
                                        value={data.appointment_time}
                                        onChange={(e) => setData('appointment_time', e.target.value)}
                                    />
                                    {errors.appointment_time && <p className="text-sm text-red-500">{errors.appointment_time}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                                        <Input
                                            id="duration_minutes"
                                            type="number"
                                            min={10}
                                            max={480}
                                            value={data.duration_minutes}
                                            onChange={(e) => setData('duration_minutes', e.target.value)}
                                        />
                                        {errors.duration_minutes && <p className="text-sm text-red-500">{errors.duration_minutes}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="reason">Reason (optional)</Label>
                                        <Textarea
                                            id="reason"
                                            placeholder="Describe the reason for visit (symptoms, concerns)..."
                                            value={data.reason}
                                            onChange={(e) => setData('reason', e.target.value)}
                                        />
                                        {errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}
                                    </div>
                                </div>

                                <DialogFooter className="flex items-center justify-between space-x-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                            closeDialog();
                                        }}
                                    >
                                        Cancel
                                    </Button>

                                    <div className="flex items-center space-x-2">
                                        <Button type="submit" disabled={processing}>
                                            Review & Confirm
                                        </Button>
                                    </div>
                                </DialogFooter>
                            </form>
                        ) : (
                            // CONFIRMATION VIEW
                            <div className="mt-4 space-y-4">
                                <div className="rounded-md border border-border bg-muted/20 p-4">
                                    <div className="text-sm text-muted-foreground">Please confirm the appointment details below:</div>
                                    <div className="mt-2 space-y-2">
                                        <div>
                                            <strong>Pet:</strong> {pet.name}
                                        </div>
                                        <div>
                                            <strong>Vet:</strong> {vets.find((v) => String(v.id) === String(data.vet_id))?.name ?? '—'}
                                        </div>
                                        <div>
                                            <strong>Date & Time:</strong>{' '}
                                            {data.appointment_time ? new Date(data.appointment_time).toLocaleString() : '—'}
                                        </div>
                                        <div>
                                            <strong>Duration:</strong> {data.duration_minutes} minutes
                                        </div>
                                        {data.reason && (
                                            <div>
                                                <strong>Reason:</strong> {data.reason}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {errors && Object.keys(errors).length > 0 && (
                                    <div className="text-sm text-red-500">
                                        {Object.values(errors).map((err, idx) => (
                                            <div key={idx}>{err}</div>
                                        ))}
                                    </div>
                                )}

                                <DialogFooter className="flex items-center justify-between">
                                    <Button variant="ghost" onClick={() => setShowConfirm(false)}>
                                        Back
                                    </Button>

                                    <div className="flex items-center space-x-2">
                                        <Button onClick={confirmAndSubmit} disabled={processing}>
                                            <Check className="mr-2 h-4 w-4" /> Confirm & Submit
                                        </Button>
                                    </div>
                                </DialogFooter>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
