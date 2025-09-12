import { Button } from '@/components/ui/button';
import Layout from '@/layouts/layout';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

export default function ProductShow() {
    const { product } = usePage<PageProps>().props;
    console.log(product);
    return (
        <Layout title="Products Page">
            <div className="mx-auto max-w-4xl py-8">
                <div className="rounded bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <p className="mt-2 text-lg text-slate-700">${product.price}</p>
                    <p className="mt-4 text-slate-600">{product.description}</p>
                    <div className="mt-6">
                        <Button>Add to cart</Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
