import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/layouts/layout';
import { useForm, usePage } from '@inertiajs/react';
import React from 'react';

export default function PetEdit() {
    const props = usePage().props as any;
    const pet = props.pet;
    const { data, setData, put, processing, errors } = useForm({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        birth_date: pet.birth_date,
        gender: pet.gender,
        notes: pet.notes,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/pets/${pet.id}`);
    }

    return (
        <Layout title={`Edit ${pet.name}`}>
            <div className="mx-auto max-w-2xl py-8">
                <form onSubmit={submit} className="space-y-4 rounded bg-white p-6 shadow-sm">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            Update
                        </Button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
