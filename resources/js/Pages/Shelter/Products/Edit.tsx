import ProductForm from '@/components/shelter/product-form';
import DashboardLayout from '@/layouts/dashboard-layout';

export default function Edit({ product }: { product: any }) {
    return (
        <DashboardLayout title="Edit Product">
            <div className="container mx-auto py-6">
                <h1 className="mb-4 text-2xl font-bold">Edit Product</h1>
                <ProductForm product={product} submitUrl={route('shelter.products.update', product.id)} method="put" />
            </div>
        </DashboardLayout>
    );
}
