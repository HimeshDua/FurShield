import ProductForm from '@/Components/shelter/ProductForm';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Product } from '@/types';

export default function Edit({ product }: { product: Product }) {
    return (
        <DashboardLayout title="Edit Product">
            <div className="container mx-auto py-6">
                <h1 className="mb-4 text-2xl font-bold">Edit Product</h1>
                <ProductForm product={product} submitUrl={route('shelter.products.update', product.slug)} method="put" />
            </div>
        </DashboardLayout>
    );
}
