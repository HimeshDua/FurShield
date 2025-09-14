import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import DashboardLayout from '@/layouts/dashboard-layout';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export default function HealthRecordShow() {
    const { record, pet } = usePage<PageProps>().props;

    return (
        <DashboardLayout title={`View Health Record - ${pet.name}`}>
            <div className="py-6">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <Card className="border border-border shadow-sm">
                        <CardHeader className="rounded-t-xl bg-muted/50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-semibold text-foreground">View Health Record</CardTitle>
                                {/* <Link href={`/pets/${pet.slug}`}> */}
                                <Link href={route('owner.')}>
                                    <Button variant="outline" size="sm" className="border-border hover:bg-background">
                                        Back
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 p-6">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">Visit Date</p>
                                <p className="text-base text-foreground">{record.visit_date}</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">Title</p>
                                <p className="text-base text-foreground">{record.title}</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">Diagnosis</p>
                                <p className="text-base text-foreground">{record.diagnosis}</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">Treatment</p>
                                <p className="text-base text-foreground">{record.treatment}</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">Attachments</p>
                                {record.attachments && record.attachments.length > 0 ? (
                                    <div className="space-y-2">
                                        {record.attachments.map((path: string) => (
                                            <div key={path} className="flex items-center rounded border border-border p-2">
                                                <a
                                                    href={`/storage/${path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-primary hover:underline"
                                                >
                                                    {path.split('/').pop()}
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No attachments uploaded.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
