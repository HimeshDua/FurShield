import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Pet } from '@/types';
import { Link, useForm } from '@inertiajs/react';

export default function HealthCreate({ pet }: { pet: Pet }) {
    const { setData, data, post, processing, errors } = useForm({
        pet_id: pet?.id,
        visit_date: '',
        title: '',
        diagnosis: '',
        treatment: '',
        attachments: [] as File[],
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        console.log(data);
        post(route('owner.pets.health.store', pet.slug), {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    return (
        <DashboardLayout title={`Add Health Record — ${pet.name}`}>
            <div className="flex justify-center">
                <div className="w-full max-w-xl">
                    <Card>
                        <CardContent>
                            <form onSubmit={submit} className="mt-6 space-y-6">
                                {/* Visit Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="visit_date">Visit Date</Label>
                                    <Input
                                        id="visit_date"
                                        type="date"
                                        onChange={(e) => setData('visit_date', e.target.value)}
                                        className={errors.visit_date ? 'border-destructive' : ''}
                                    />
                                    {errors.visit_date && <p className="text-sm text-destructive">{errors.visit_date}</p>}
                                </div>

                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        onChange={(e) => setData('title', e.target.value)}
                                        className={errors.title ? 'border-destructive' : ''}
                                    />
                                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                                </div>

                                {/* Diagnosis */}
                                <div className="space-y-2">
                                    <Label htmlFor="diagnosis">Diagnosis</Label>
                                    <Input
                                        id="diagnosis"
                                        type="text"
                                        onChange={(e) => setData('diagnosis', e.target.value)}
                                        className={errors.diagnosis ? 'border-destructive' : ''}
                                    />
                                    {errors.diagnosis && <p className="text-sm text-destructive">{errors.diagnosis}</p>}
                                </div>

                                {/* Treatment */}
                                <div className="space-y-2">
                                    <Label htmlFor="treatment">Treatment</Label>
                                    <Input
                                        id="treatment"
                                        type="text"
                                        onChange={(e) => setData('treatment', e.target.value)}
                                        className={errors.treatment ? 'border-destructive' : ''}
                                    />
                                    {errors.treatment && <p className="text-sm text-destructive">{errors.treatment}</p>}
                                </div>

                                {/* Attachments */}
                                <div className="space-y-2">
                                    <Label htmlFor="attachments">Attachments</Label>
                                    <Input
                                        id="attachments"
                                        type="file"
                                        multiple
                                        onChange={(e) => setData('attachments', Array.from(e.target.files || []))}
                                        className={errors.attachments ? 'border-destructive' : ''}
                                    />
                                    {errors.attachments && <p className="text-sm text-destructive">{errors.attachments}</p>}
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end space-x-3">
                                    <Link href={route('owner.pets.health.index', pet.slug)}>
                                        <Button variant="outline" type="button">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing} className="bg-primary text-primary-foreground hover:bg-primary/90">
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
