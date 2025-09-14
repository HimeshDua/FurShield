import { PageProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function EditListing() {
  const { props } = usePage<PageProps>();
  const listing = props.listing;

  const { data, setData, put, processing, errors } = useForm({
    pet_name: listing.pet_name,
    species: listing.species,
    breed: listing.breed || '',
    age: listing.age || '',
    description: listing.description || '',
    status: listing.status,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('shelter.adoptions.update', listing.id));
  };

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-4">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route('dashboard')}>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={route('adoptions.index')}>Adoptions</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Adoption Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* fields as before */}
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
              <Textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="w-full rounded border p-2"
                value={data.status}
                onChange={e => setData('status', e.target.value)}
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="adopted">Adopted</option>
              </select>
            </div>
            <Button type="submit" disabled={processing}>
              {processing ? 'Saving…' : 'Update Listing'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
