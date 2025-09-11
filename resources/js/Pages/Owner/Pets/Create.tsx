import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/layouts/layout';
import { useForm } from '@inertiajs/react';
import React from 'react';

export default function PetsCreate() {
    const { data, setData, post, processing, errors } = useForm({ name: '', species: '', breed: '', birth_date: '', gender: 'unknown', notes: '' });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/pets');
    }

    return (
        <Layout title="Add Pet">
            <div className="mx-auto max-w-2xl py-8">
                <form onSubmit={submit} className="space-y-4 rounded bg-white p-6 shadow-sm">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="species">Species</Label>
                        <Input id="species" value={data.species} onChange={(e) => setData('species', e.target.value)} required />
                        {errors.species && <p className="text-sm text-red-500">{errors.species}</p>}
                    </div>

                    <div>
                        <Label htmlFor="breed">Breed</Label>
                        <Input id="breed" value={data.breed} onChange={(e) => setData('breed', e.target.value)} />
                    </div>

                    <div>
                        <Label htmlFor="birth_date">Birth date</Label>
                        <Input id="birth_date" type="date" value={data.birth_date} onChange={(e) => setData('birth_date', e.target.value)} />
                    </div>

                    <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Input id="notes" value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            Create pet
                        </Button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
