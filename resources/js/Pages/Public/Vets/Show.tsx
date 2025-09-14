import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/layouts/dashboard-layout';
import { PageProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';

export default function Show() {
    const { vet, pets, auth } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        pet_slug: '',
        vet_id: vet.user.id,
        appointment_time: '',
        duration_minutes: 30,
        reason: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!data.pet_slug) return console.log('Please select a pet');
        post(route('owner.appointments.store', data.pet_slug), {
            onSuccess: () => reset(),
        });
    }

    return (
        <DashboardLayout title={`${vet.user.name} – Veterinarian`}>
            <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={route('dashboard')}>Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={route('vets.index')}>Veterinarians</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={route('vets.show', vet.id)}>{vet.user.name}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">{vet.user.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{vet.qualifications}</p>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">About</h3>
                            {vet.specializations?.length > 0 && (
                                <p>
                                    <span className="font-medium">Specializations:</span> {vet.specializations.join(', ')}
                                </p>
                            )}
                            <p>
                                <span className="font-medium">Consultation Fee:</span> {vet.consultation_fee} PKR
                            </p>
                            <p>
                                <span className="font-medium">Clinic Address:</span> {vet.clinic_address}
                            </p>
                            <p>
                                <span className="font-medium">Availability:</span> {vet.availability?.join(', ')}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Book an Appointment</h3>
                            <p className="text-sm text-muted-foreground">Ready to book a session with {vet.user.name}? Click below to start.</p>

                            {Number(vet.user_id) == auth.user?.id ? (
                                <Button disabled className="w-full md:w-auto">
                                    You can't book yourself
                                </Button>
                            ) : auth.user?.role == 'vet' ? (
                                <Button disabled className="w-full md:w-auto">
                                    Veterinarians can't book
                                </Button>
                            ) : (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="w-full md:w-auto">Book Appointment</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-lg">
                                        <DialogHeader>
                                            <DialogTitle>Book Appointment</DialogTitle>
                                            <DialogDescription>Select your pet and time to confirm booking.</DialogDescription>
                                        </DialogHeader>

                                        <form onSubmit={submit} className="space-y-4">
                                            {/* Choose Pet */}
                                            <div>
                                                <input type="hidden" value={vet.user.id} />

                                                <Label htmlFor="pet_slug">Choose Pet</Label>
                                                {pets && (
                                                    <Select onValueChange={(value: string) => setData('pet_slug', value)} value={data.pet_slug}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a pet" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {pets.map((p) => (
                                                                <SelectItem key={p.id} value={p.slug.toString()}>
                                                                    {p.name} ({p.species})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                                {errors.pet_slug && <p className="text-sm text-red-500">{errors.pet_slug}</p>}
                                            </div>

                                            {/* Date/Time */}
                                            <div>
                                                <Label htmlFor="appointment_time">Appointment Time</Label>
                                                <Input
                                                    id="appointment_time"
                                                    type="datetime-local"
                                                    value={data.appointment_time}
                                                    onChange={(e) => setData('appointment_time', e.target.value)}
                                                />
                                                {errors.appointment_time && <p className="text-sm text-red-500">{errors.appointment_time}</p>}
                                            </div>

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
                                            </div>

                                            {/* Reason */}
                                            <div>
                                                <Label htmlFor="reason">Reason (optional)</Label>
                                                <Input
                                                    id="reason"
                                                    type="text"
                                                    placeholder="Reason for appointment"
                                                    value={data.reason}
                                                    onChange={(e) => setData('reason', e.target.value)}
                                                />
                                            </div>

                                            <DialogFooter>
                                                <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                                    Confirm Booking
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
