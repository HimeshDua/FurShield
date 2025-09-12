import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';

type ProductFormProps = {
    product?: {
        id: number;
        name: string;
        category?: string;
        price: number;
        description?: string;
        stock_quantity: number;
    };
    submitUrl: string;
    method: 'post' | 'put';
};

export default function ProductForm({ product, submitUrl, method }: ProductFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: product?.name || '',
        category: product?.category || '',
        price: product?.price || 0,
        description: product?.description || '',
        stock_quantity: product?.stock_quantity || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        method === 'post' ? post(submitUrl) : put(submitUrl);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>

            <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={data.category} onChange={(e) => setData('category', e.target.value)} />
            </div>

            <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" value={data.price} onChange={(e) => setData('price', parseFloat(e.target.value))} />
                {errors.price && <p className="text-red-500">{errors.price}</p>}
            </div>

            <div>
                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                <Input
                    id="stock_quantity"
                    type="number"
                    value={data.stock_quantity}
                    onChange={(e) => setData('stock_quantity', parseInt(e.target.value))}
                />
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
            </div>

            <Button type="submit" disabled={processing}>
                {method === 'post' ? 'Create Product' : 'Update Product'}
            </Button>
        </form>
    );
}
