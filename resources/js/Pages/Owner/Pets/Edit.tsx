'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Loader2 as Loader2Icon } from 'lucide-react';

export default function PetEdit() {
    const { pet } = usePage().props as { pet: any };

    type PetFormData = {
        name: string;
        species: string;
        breed: string;
        birth_date: string;
        gender: string;
        weight_kg: string;
        microchip: string;
        notes: string;
    };

    const { data, setData, errors, put, processing } = useForm<PetFormData>({
        name: pet.name || '',
        species: pet.species || '',
        breed: pet.breed || '',
        birth_date: pet.birth_date || '',
        gender: pet.gender || '',
        weight_kg: pet.weight_kg || '',
        microchip: pet.microchip || '',
        notes: pet.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('owner.pets.update', pet.slug));
    };

    return (
        <DashboardLayout title={`Edit ${pet.name}`}>
            <div className="bg-background py-8 text-foreground">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <Card className="border border-border bg-card text-card-foreground shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-semibold text-primary">Edit {pet.name}</CardTitle>
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
                                        />
                                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                    </div>

                                    {/* Species */}
                                    <div className="space-y-2">
                                        <Label htmlFor="species" className={errors.species ? 'text-destructive' : ''}>
                                            Species *
                                        </Label>
                                        <Select value={data.species} onValueChange={(value) => setData('species', value)}>
                                            <SelectTrigger className={errors.species ? 'border-destructive' : ''}>
                                                <SelectValue placeholder="Select Species" />
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
                                        <Input id="breed" value={data.breed} onChange={(e) => setData('breed', e.target.value)} />
                                    </div>

                                    {/* Birth Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="birth_date">Birth Date</Label>
                                        <Input
                                            type="date"
                                            id="birth_date"
                                            value={data.birth_date}
                                            onChange={(e) => setData('birth_date', e.target.value)}
                                        />
                                    </div>

                                    {/* Gender */}
                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Gender" />
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
                                            type="number"
                                            step="0.1"
                                            id="weight_kg"
                                            value={data.weight_kg}
                                            onChange={(e) => setData('weight_kg', e.target.value)}
                                        />
                                    </div>

                                    {/* Microchip */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="microchip">Microchip Number</Label>
                                        <Input id="microchip" value={data.microchip} onChange={(e) => setData('microchip', e.target.value)} />
                                    </div>

                                    {/* Notes */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="notes">Notes</Label>
                                        <Textarea id="notes" rows={3} value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end space-x-4">
                                    <Link href={route('owner.pets.show', pet.slug)}>
                                        <Button type="button" variant="outline" className="bg-secondary text-secondary-foreground">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing} className="bg-primary text-primary-foreground">
                                        {processing ? (
                                            <>
                                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            'Update Pet'
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
