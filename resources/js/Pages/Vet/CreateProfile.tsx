import DashboardLayout from '@/layouts/dashboard-layout';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/Components/ui/card';

export default function CreateProfile() {
  const { data, setData, post, processing, errors } = useForm({
    specializations: [],
    qualifications: '',
    availability: [],
    consultation_fee: '',
    clinic_address: '',
  });

  function submit(e) {
    e.preventDefault();
    post(route('vet.profile.store'),{
        forceFormData:true,
        preserveScroll:true
    });
  }

  return (
    <DashboardLayout title="Create Vet Profile">
      <div className="mx-auto max-w-5xl w-full py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Your Veterinarian Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium">Specializations (comma separated)</label>
                <Input
                  value={data.specializations.join(', ')}
                  onChange={(e) => setData('specializations', e.target.value.split(',').map((s) => s.trim()))}
                  placeholder="Dogs, Cats, Exotic Pets"
                />
                {errors.specializations && <p className="text-red-500 text-sm">{errors.specializations}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Qualifications</label>
                <Textarea
                  value={data.qualifications}
                  onChange={(e) => setData('qualifications', e.target.value)}
                  placeholder="Your degrees, certifications etc."
                />
                {errors.qualifications && <p className="text-red-500 text-sm">{errors.qualifications}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Availability (comma separated)</label>
                <Input
                  value={data.availability.join(', ')}
                  onChange={(e) => setData('availability', e.target.value.split(',').map((s) => s.trim()))}
                  placeholder="Mon-Fri 9AM-5PM"
                />
                {errors.availability && <p className="text-red-500 text-sm">{errors.availability}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Consultation Fee</label>
                <Input
                  type="number"
                  value={data.consultation_fee}
                  onChange={(e) => setData('consultation_fee', e.target.value)}
                  placeholder="Fee in PKR"
                />
                {errors.consultation_fee && <p className="text-red-500 text-sm">{errors.consultation_fee}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Clinic Address</label>
                <Textarea
                  value={data.clinic_address}
                  onChange={(e) => setData('clinic_address', e.target.value)}
                  placeholder="Clinic Address"
                />
                {errors.clinic_address && <p className="text-red-500 text-sm">{errors.clinic_address}</p>}
              </div>

              <Button disabled={processing} type="submit" className="w-full">
                {processing ? 'Saving...' : 'Save Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
