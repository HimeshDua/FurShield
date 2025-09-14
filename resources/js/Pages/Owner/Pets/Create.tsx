import { Link, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Loader2 as Loader2Icon } from 'lucide-react';

type FormDataShape = {
    name: string;
    species: string;
    breed: string;
    birth_date: string;
    gender: string;
    weight_kg: string;
    microchip: string;
    notes: string;
    images: File[] | [];
};

export default function PetCreate() {
    const { data, setData, errors, post, processing, reset } = useForm<FormDataShape>({
        name: '',
        species: '',
        breed: '',
        birth_date: '',
        gender: '',
        weight_kg: '',
        microchip: '',
        notes: '',
        images: [],
    });

    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        if (!data.images || data.images.length === 0) {
            setPreviews([]);
            return;
        }

        const urls = (data.images as File[]).map((f) => URL.createObjectURL(f));
        setPreviews(urls);

        return () => urls.forEach((u) => URL.revokeObjectURL(u));
    }, [data.images]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setData('images', files);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('owner.pets.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <DashboardLayout title="Add New Pet · Fur Shield">
            <div className="py-6">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <Card className="border-border bg-card text-card-foreground shadow-lg">
                        <CardHeader className="border-b border-border">
                            <CardTitle className="text-2xl font-semibold text-primary">Add New Pet</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className={errors.name ? 'text-destructive' : ''}>
                                            Pet Name *
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={errors.name ? 'border-destructive' : ''}
                                            placeholder="e.g. Bella"
                                        />
                                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                    </div>

                                    {/* Species */}
                                    <div className="space-y-2">
                                        <Label htmlFor="species" className={errors.species ? 'text-destructive' : ''}>
                                            Species *
                                        </Label>
                                        <Select value={data.species} onValueChange={(val) => setData('species', val)}>
                                            <SelectTrigger className={errors.species ? 'border-destructive' : ''}>
                                                <SelectValue placeholder="Select species" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="dog">Dog</SelectItem>
                                                <SelectItem value="cat">Cat</SelectItem>
                                                <SelectItem value="bird">Bird</SelectItem>
                                                <SelectItem value="rabbit">Rabbit</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.species && <p className="text-sm text-destructive">{errors.species}</p>}
                                    </div>

                                    {/* Breed */}
                                    <div className="space-y-2">
                                        <Label htmlFor="breed">Breed</Label>
                                        <Input
                                            id="breed"
                                            value={data.breed}
                                            onChange={(e) => setData('breed', e.target.value)}
                                            placeholder="e.g. Golden Retriever"
                                        />
                                    </div>

                                    {/* Birth date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="birth_date">Birth Date</Label>
                                        <Input
                                            id="birth_date"
                                            type="date"
                                            value={data.birth_date}
                                            onChange={(e) => setData('birth_date', e.target.value)}
                                        />
                                    </div>

                                    {/* Gender */}
                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select value={data.gender} onValueChange={(val) => setData('gender', val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="unknown">Unknown</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Weight */}
                                    <div className="space-y-2">
                                        <Label htmlFor="weight_kg">Weight (kg)</Label>
                                        <Input
                                            id="weight_kg"
                                            type="number"
                                            step="0.1"
                                            value={data.weight_kg}
                                            onChange={(e) => setData('weight_kg', e.target.value)}
                                            placeholder="e.g. 4.5"
                                        />
                                    </div>

                                    {/* Microchip */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="microchip">Microchip Number</Label>
                                        <Input
                                            id="microchip"
                                            value={data.microchip}
                                            onChange={(e) => setData('microchip', e.target.value)}
                                            placeholder="Optional"
                                        />
                                    </div>

                                    {/* Notes */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="notes">Notes</Label>
                                        <Textarea
                                            id="notes"
                                            rows={4}
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Any special needs, personality notes, diet, etc."
                                        />
                                    </div>

                                    {/* Images */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="images">Pet Images</Label>
                                        <Input
                                            id="images"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="file:mr-4 file:rounded-full file:border-0 file:bg-muted/30 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-muted-foreground hover:file:opacity-90"
                                            aria-describedby="images-help"
                                        />
                                        <p id="images-help" className="text-sm text-muted-foreground">
                                            You can upload multiple images (recommended 1–6). Max ~4MB per file.
                                        </p>

                                        {/* Previews */}
                                        {previews.length > 0 && (
                                            <div className="mt-3 grid grid-cols-3 gap-2">
                                                {previews.map((src, i) => (
                                                    <div
                                                        key={i}
                                                        className="relative h-24 w-full overflow-hidden rounded-md border border-border bg-muted"
                                                    >
                                                        <img src={src} alt={`preview-${i}`} className="h-full w-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {errors.images && <p className="mt-1 text-sm text-destructive">{(errors as any).images}</p>}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end space-x-4">
                                    <Link href={route('owner.pets.index')}>
                                        <Button variant="outline" className="bg-secondary text-secondary-foreground">
                                            Cancel
                                        </Button>
                                    </Link>

                                    <Button type="submit" disabled={processing} className="bg-primary text-primary-foreground">
                                        {processing ? (
                                            <>
                                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                                Adding...
                                            </>
                                        ) : (
                                            'Add Pet'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
