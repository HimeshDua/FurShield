import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/Components/ui/label';
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
        post(route('owner.pets.health.update', record.id), {
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
                    <Card className="border border-[oklch(0.85_0.05_240)] shadow-sm">
                        <CardHeader className="bg-[oklch(0.96_0.02_240)]">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-semibold text-[oklch(0.3_0.1_250)]">Edit Health Record</CardTitle>
                                <Link href={route('pets.health.index', pet.slug)}>
                                    <Button variant="outline" size="sm" className="border-[oklch(0.7_0.05_240)] hover:bg-[oklch(0.95_0.02_240)]">
                                        Back
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Visit Date */}
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
                                        type="text"
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

                                {/* Existing Attachments */}
                                <div className="space-y-2">
                                    <Label className="text-[oklch(0.25_0.05_250)]">Existing Attachments</Label>
                                    {record.attachments && record.attachments.length > 0 ? (
                                        <div className="space-y-2">
                                            {record.attachments.map((path: string) => (
                                                <div
                                                    key={path}
                                                    className="flex items-center justify-between rounded border border-[oklch(0.8_0.05_240)] p-2"
                                                >
                                                    <a
                                                        href={`/storage/${path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-[oklch(0.4_0.1_250)] hover:underline"
                                                    >
                                                        {path.split('/').pop()}
                                                    </a>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant={data.remove_attachments.includes(path) ? 'destructive' : 'outline'}
                                                        onClick={() => toggleRemoveAttachment(path)}
                                                        className={`${
                                                            data.remove_attachments.includes(path)
                                                                ? 'bg-red-500 text-white hover:bg-red-600'
                                                                : 'border-[oklch(0.7_0.05_240)] hover:bg-[oklch(0.95_0.02_240)]'
                                                        }`}
                                                    >
                                                        {data.remove_attachments.includes(path) ? 'Undo Remove' : 'Remove'}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-[oklch(0.45_0.02_250)]">No attachments uploaded.</p>
                                    )}
                                </div>

                                {/* Upload New Attachments */}
                                <div className="space-y-2">
                                    <Label htmlFor="attachments" className="text-[oklch(0.25_0.05_250)]">
                                        Upload New Attachments
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

                                {/* Submit */}
                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-[oklch(0.65_0.15_250)] hover:bg-[oklch(0.6_0.2_250)] disabled:opacity-50"
                                    >
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
