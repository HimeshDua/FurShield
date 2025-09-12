// Health Record Edit Page
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/layouts/dashboard-layout';
import { PageProps } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function HealthRecordEdit() {
    const { record, pet } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        visit_date: record.visit_date || '',
        title: record.title || '',
        diagnosis: record.diagnosis || '',
        treatment: record.treatment || '',
        attachments: [] as File[],
        remove_attachments: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('health-records.update', record.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const toggleRemoveAttachment = (path: string) => {
        if (data.remove_attachments.includes(path)) {
            setData(
                'remove_attachments',
                data.remove_attachments.filter((p) => p !== path),
            );
        } else {
            setData('remove_attachments', [...data.remove_attachments, path]);
        }
    };

    return (
        <DashboardLayout title={`Edit Health Record - ${pet.name}`}>
            <div className="py-6">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Edit Health Record</CardTitle>
                                <Link href={route('pets.health.index', pet.id)}>
                                    <Button variant="outline" size="sm">
                                        Back
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="visit_date">Visit Date</Label>
                                    <Input
                                        id="visit_date"
                                        type="date"
                                        value={data.visit_date}
                                        onChange={(e) => setData('visit_date', e.target.value)}
                                    />
                                    {errors.visit_date && <p className="text-sm text-red-500">{errors.visit_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Checkup, Vaccination, etc."
                                    />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="diagnosis">Diagnosis</Label>
                                    <Textarea id="diagnosis" rows={3} value={data.diagnosis} onChange={(e) => setData('diagnosis', e.target.value)} />
                                    {errors.diagnosis && <p className="text-sm text-red-500">{errors.diagnosis}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="treatment">Treatment</Label>
                                    <Textarea id="treatment" rows={3} value={data.treatment} onChange={(e) => setData('treatment', e.target.value)} />
                                    {errors.treatment && <p className="text-sm text-red-500">{errors.treatment}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Existing Attachments</Label>
                                    {record.attachments && record.attachments.length > 0 ? (
                                        <div className="space-y-2">
                                            {record.attachments.map((path: string) => (
                                                <div key={path} className="flex items-center justify-between rounded border p-2">
                                                    <a
                                                        href={`/storage/${path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 hover:underline"
                                                    >
                                                        {path.split('/').pop()}
                                                    </a>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant={data.remove_attachments.includes(path) ? 'destructive' : 'outline'}
                                                        onClick={() => toggleRemoveAttachment(path)}
                                                    >
                                                        {data.remove_attachments.includes(path) ? 'Undo Remove' : 'Remove'}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No attachments uploaded.</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="attachments">Upload New Attachments</Label>
                                    <Input
                                        id="attachments"
                                        type="file"
                                        multiple
                                        onChange={(e) => setData('attachments', Array.from(e.target.files || []))}
                                    />
                                    {errors.attachments && <p className="text-sm text-red-500">{errors.attachments}</p>}
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving...' : 'Save Changes'}
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
