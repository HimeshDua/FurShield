// resources/js/Pages/Owner/Appointments/Create.tsx
import DashboardLayout from '@/layouts/dashboard-layout';
import { useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function CreateAppointment({ pet, vets }) {
  const { data, setData, post, processing, errors } = useForm({
    vet_id: '',
    appointment_time: '',
    duration_minutes: 30,
    reason: '',
  });

  function submit(e) {
    e.preventDefault();
    post(route('owner.appointments.store', pet.id));
  }

  return (
    <DashboardLayout title={`Book Appointment for ${pet.name}`}>
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="mb-6 text-2xl font-bold">Book Appointment for {pet.name}</h1>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <Label htmlFor="vet_id">Select Vet</Label>
            <select
              id="vet_id"
              className="w-full rounded border p-2"
              value={data.vet_id}
              onChange={(e) => setData('vet_id', e.target.value)}
            >
              <option value="">-- Choose vet --</option>
              {vets.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.email})
                </option>
              ))}
            </select>
            {errors.vet_id && <p className="text-sm text-red-600">{errors.vet_id}</p>}
          </div>

          <div>
            <Label htmlFor="appointment_time">Appointment Time</Label>
            <Input
              id="appointment_time"
              type="datetime-local"
              value={data.appointment_time}
              onChange={(e) => setData('appointment_time', e.target.value)}
            />
            {errors.appointment_time && <p className="text-sm text-red-600">{errors.appointment_time}</p>}
          </div>

          <div>
            <Label htmlFor="duration_minutes">Duration (minutes)</Label>
            <Input
              id="duration_minutes"
              type="number"
              min="10"
              max="480"
              value={data.duration_minutes}
              onChange={(e) => setData('duration_minutes', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea
              id="reason"
              value={data.reason}
              onChange={(e) => setData('reason', e.target.value)}
            />
          </div>

          <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
            Request Appointment
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
