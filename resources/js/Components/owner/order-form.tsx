import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Order } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function OrderCreateForm({ orders }: { orders: Order[] }) {
    const [items, setItems] = useState([{ product_id: '', quantity: 1 }]);

    const { data, setData, post, processing } = useForm({
        items: [],
    });

    const addItem = () => {
        setItems([...items, { product_id: '', quantity: 1 }]);
    };

    const removeItem = (index) => {
        if (items.length > 1) {
            const newItems = [...items];
            newItems.splice(index, 1);
            setItems(newItems);
        }
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setData(
            'items',
            items.filter((item) => item.product_id && item.quantity > 0),
        );
        post(route('owner.orders.store'));
    };

    return (
        <DashboardLayout title={'Create Order'}>
            <div className="container mx-auto py-6">
                <div className="mb-6 flex items-center gap-4">
                    <Button asChild variant="outline">
                        <Link href={route('owner.orders.index')}>&larr; Back to Orders</Link>
                    </Button>
                    <h1 className="text-3xl font-bold">Create New Order</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Order Details</CardTitle>
                        <CardDescription>Add products to create a new order</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                {items.map((item, index) => (
                                    <div key={index} className="flex items-end gap-4">
                                        <div className="flex-1">
                                            <Label htmlFor={`product-${index}`}>Product</Label>
                                            <Select value={item.product_id} onValueChange={(value) => updateItem(index, 'product_id', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a product" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {orders.map((product) => (
                                                        <SelectItem key={product.id} value={product.id.toString()}>
                                                            {product.name} - ${product.price.toFixed(2)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="w-24">
                                            <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                                            />
                                        </div>

                                        <Button type="button" variant="outline" onClick={() => removeItem(index)} disabled={items.length <= 1}>
                                            Remove
                                        </Button>
                                    </div>
                                ))}

                                <Button type="button" variant="secondary" onClick={addItem}>
                                    Add Another Item
                                </Button>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating Order...' : 'Create Order'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
