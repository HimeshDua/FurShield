import AdoptionForm from '@/components/shelter/adoption-form';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Adoption } from '@/types';

export default function Edit({ adoption }: { adoption: Adoption }) {
    return (
        <DashboardLayout title="Edit Adoption">
            <div className="container mx-auto py-6">
                <h1 className="mb-4 text-2xl font-bold">Edit Adoption Pet</h1>
                <AdoptionForm adoption={adoption} submitUrl={route('shelter.adoptions.update', adoption.slug ?? adoption.id)} method="put" />
            </div>
        </DashboardLayout>
    );
}
