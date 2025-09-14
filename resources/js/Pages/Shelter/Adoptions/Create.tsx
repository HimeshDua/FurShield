import { useForm } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import React from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';

export default function CreateAdoption() {
  const { data, setData, post, processing, errors } = useForm({
    pet_name: '',
    species: '',
    breed: '',
    age: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('shelter.adoptions.store'));
  };

  return (
    <DashboardLayout title='Create Dashboard Layout'>
    <div className="mx-auto w-full max-w-6xl p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Adoption Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="pet_name">Pet Name</Label>
              <Input id="pet_name" value={data.pet_name} onChange={e => setData('pet_name', e.target.value)} />
              {errors.pet_name && <p className="text-sm text-red-500">{errors.pet_name}</p>}
            </div>

            <div>
              <Label htmlFor="species">Species</Label>
              <Input id="species" value={data.species} onChange={e => setData('species', e.target.value)} />
              {errors.species && <p className="text-sm text-red-500">{errors.species}</p>}
            </div>

            <div>
              <Label htmlFor="breed">Breed</Label>
              <Input id="breed" value={data.breed} onChange={e => setData('breed', e.target.value)} />
            </div>

            <div>
              <Label htmlFor="age">Age</Label>
              <Input id="age" value={data.age} onChange={e => setData('age', e.target.value)} />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={e => setData('description', e.target.value)}
              />
            </div>

            <Button type="submit" disabled={processing}>
              {processing ? 'Saving…' : 'Create Listing'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  );
}
