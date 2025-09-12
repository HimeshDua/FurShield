import AdoptionForm from '@/components/adoption/adoption-form';
import DashboardLayout from '@/layouts/dashboard-layout';

export default function Create() {
    return (
        <DashboardLayout title="Create Product">
            <div className="container mx-auto py-6">
                <h1 className="mb-4 text-2xl font-bold">Create Adoption Pet</h1>
                <AdoptionForm submitUrl={route('shelter.aboptions.store')} method="post" />
            </div>
        </DashboardLayout>
    );
}
