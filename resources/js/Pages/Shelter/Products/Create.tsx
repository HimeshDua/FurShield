import ProductForm from '@/Components/shelter/ProductForm';
import DashboardLayout from '@/layouts/dashboard-layout';

export default function Create() {
    return (
        <DashboardLayout title="Create Product">
            <div className="container mx-auto py-6">
                <h1 className="mb-4 text-2xl font-bold">Create Product</h1>
                <ProductForm submitUrl={route('shelter.products.store')} method="post" />
            </div>
        </DashboardLayout>
    );
}
