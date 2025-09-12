import ProductsComponent from '@/components/products/default';
import Layout from '@/layouts/layout';
import { usePage } from '@inertiajs/react';

export default function ProductsIndex() {
        const { products } = usePage<any>().props;

    console.log(products);
    return (
        <Layout title="Products Page">
            <ProductsComponent products={products} />
        </Layout>
    );
}
