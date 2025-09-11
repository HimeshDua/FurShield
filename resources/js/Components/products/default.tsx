import AppLayout from '@/layouts/app-layout';
import { Product } from '@/types';
import { Link } from '@inertiajs/react';
import Pagination from '../shared/Pagination';

type Props = {
    products: {
        data: Product[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
};

export default function ProductsComponent({ products }: Props) {
    return (
        <AppLayout>
            <div className="mx-auto max-w-6xl py-8">
                <h1 className="mb-4 text-2xl font-bold">Products</h1>
                <div className="grid gap-4 md:grid-cols-3">
                    {products.data.map((p: any) => (
                        <div key={p.id} className="rounded bg-white p-4 shadow-sm">
                            <div className="font-medium">{p.name}</div>
                            <div className="text-sm text-slate-500">${p.price}</div>
                            <div className="mt-3">
                                <Link href={`/products/${p.id}`}>View</Link>
                            </div>
                        </div>
                    ))}
                </div>
                <Pagination links={products.links} />
            </div>
        </AppLayout>
    );
}
