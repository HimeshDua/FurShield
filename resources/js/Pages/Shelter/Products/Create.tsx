import ProductForm from '@/components/shelter/product-form';
import DashboardLayout from '@/layouts/dashboard-layout';

export default function Create() {
    return (
        <DashboardLayout title="Create Product">
            <div className="container mx-auto py-6">
                <h1 className="mb-4 text-2xl font-bold">Create Product</h1>
                <ProductForm submitUrl={route('owner.products.store')} method="post" />
            </div>
        </DashboardLayout>
    );
}
