import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Pet } from '@/types';
import { Link, useForm } from '@inertiajs/react';

export default function HealthCreate({ pet }: Pet) {
    const { data, setData, post, processing, errors } = useForm({
        visit_date: '',
        title: '',
        diagnosis: '',
        treatment: '',
        attachments: [] as File[],
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('owner.pets.health.store', pet.slug), {
            forceFormData: true, // needed for files
            preserveScroll: true,
        });
    }

    return (
        <DashboardLayout title={`Add Health Record — ${pet.name}`}>
            <div className="py-6">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add Health Record for {pet.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <Label htmlFor="visit_date">Visit date</Label>
                                    <Input
                                        id="visit_date"
                                        type="date"
                                        value={data.visit_date}
                                        onChange={(e) => setData('visit_date', e.target.value)}
                                    />
                                    {errors.visit_date && <p className="text-sm text-red-500">{errors.visit_date}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                </div>

                                <div>
                                    <Label htmlFor="diagnosis">Diagnosis</Label>
                                    <Textarea id="diagnosis" value={data.diagnosis} onChange={(e) => setData('diagnosis', e.target.value)} />
                                </div>

                                <div>
                                    <Label htmlFor="attachments">Attachments</Label>
                                    <Input
                                        id="attachments"
                                        type="file"
                                        multiple
                                        onChange={(e) => setData('attachments', Array.from(e.target.files || []))}
                                    />
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Link href={route('owner.pets.health.index', pet.slug)}>
                                        <Button variant="outline">Skip</Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving...' : 'Save'}
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
