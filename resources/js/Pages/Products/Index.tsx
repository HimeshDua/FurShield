import Layout from '@/layouts/layout';
import { router, usePage } from '@inertiajs/react';

export default function ProductsIndex() {
    const { products } = usePage<any>().props;
    // const products = props.products ?? { data: [] };

    const handlePageChange = (url: string | null) => {
        if (url) router.get(url);
    };
    return (
        <Layout title="Products Page">
            dsds
            {/* <ProductsComponent products={products} /> */}
        </Layout>
    );
}
