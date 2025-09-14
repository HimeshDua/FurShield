// resources/js/Pages/HealthCreate.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Link, useForm } from '@inertiajs/react';

interface Pet {
    slug: string;
    name: string;
}

export default function HealthCreate({ pet }: { pet: Pet }) {
    const { data, setData, post, processing, errors } = useForm({
        pet_id: '',
        vet_id: '',
        visit_date: '',
        title: '',
        diagnosis: '',
        treatment: '',
        attachments: [] as File[],
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('owner.pets.health.store', pet.slug), {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    return (
        <DashboardLayout title={`Add Health Record — ${pet.name}`}>
            <div className="py-6">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <Card className="border border-[oklch(0.85_0.05_240)] shadow-sm">
                        <CardHeader className="border-b border-[oklch(0.8_0.05_240)] bg-[oklch(0.96_0.02_240)]">
                            <CardTitle className="text-xl font-semibold text-[oklch(0.3_0.1_250)]">Add Health Record for {pet.name}</CardTitle>
                        </CardHeader>

                        <CardContent className="pt-6">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Visit Date */}

                                <input type="hidden" name="pet_slug" value={pet.slug} />
                                <input type="hidden" name="pet_id" value={data.pet_id} />
                                <input type="hidden" name="vet_id" value={data.vet_id} />

                                <div className="space-y-2">
                                    <Label htmlFor="visit_date" className="text-[oklch(0.25_0.05_250)]">
                                        Visit Date
                                    </Label>
                                    <Input
                                        id="visit_date"
                                        type="date"
                                        value={data.visit_date}
                                        onChange={(e) => setData('visit_date', e.target.value)}
                                        className="border-[oklch(0.8_0.05_240)] focus:ring-[oklch(0.65_0.15_250)]"
                                    />
                                    {errors.visit_date && <p className="text-sm text-red-500">{errors.visit_date}</p>}
                                </div>

                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-[oklch(0.25_0.05_250)]">
                                        Title
                                    </Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Checkup, Vaccination, etc."
                                        className="border-[oklch(0.8_0.05_240)] focus:ring-[oklch(0.65_0.15_250)]"
                                    />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>

                                {/* Diagnosis */}
                                <div className="space-y-2">
                                    <Label htmlFor="diagnosis" className="text-[oklch(0.25_0.05_250)]">
                                        Diagnosis
                                    </Label>
                                    <Textarea
                                        id="diagnosis"
                                        rows={3}
                                        value={data.diagnosis}
                                        onChange={(e) => setData('diagnosis', e.target.value)}
                                        className="border-[oklch(0.8_0.05_240)] focus:ring-[oklch(0.65_0.15_250)]"
                                    />
                                    {errors.diagnosis && <p className="text-sm text-red-500">{errors.diagnosis}</p>}
                                </div>

                                {/* Treatment */}
                                <div className="space-y-2">
                                    <Label htmlFor="treatment" className="text-[oklch(0.25_0.05_250)]">
                                        Treatment
                                    </Label>
                                    <Textarea
                                        id="treatment"
                                        rows={3}
                                        value={data.treatment}
                                        onChange={(e) => setData('treatment', e.target.value)}
                                        className="border-[oklch(0.8_0.05_240)] focus:ring-[oklch(0.65_0.15_250)]"
                                    />
                                    {errors.treatment && <p className="text-sm text-red-500">{errors.treatment}</p>}
                                </div>

                                {/* Attachments */}
                                <div className="space-y-2">
                                    <Label htmlFor="attachments" className="text-[oklch(0.25_0.05_250)]">
                                        Attachments
                                    </Label>
                                    <Input
                                        id="attachments"
                                        type="file"
                                        multiple
                                        onChange={(e) => setData('attachments', Array.from(e.target.files || []))}
                                        className="border-[oklch(0.8_0.05_240)] focus:ring-[oklch(0.65_0.15_250)]"
                                    />
                                    {errors.attachments && <p className="text-sm text-red-500">{errors.attachments}</p>}
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end space-x-3">
                                    <Link href={route('owner.pets.health.index', pet.slug)}>
                                        <Button variant="outline" className="border-[oklch(0.7_0.05_240)] hover:bg-[oklch(0.95_0.02_240)]">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-[oklch(0.65_0.15_250)] hover:bg-[oklch(0.6_0.2_250)] disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Save Record'}
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
