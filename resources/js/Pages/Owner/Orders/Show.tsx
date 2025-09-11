import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/layouts/dashboard-layout';

type OrderItem = {
    id: number;
    product?: {
        name?: string;
    } | null;
    quantity: number;
    price_each: number;
};

type Owner = {
    name?: string;
    email?: string;
};

type Order = {
    id: number;
    items: OrderItem[];
    status: string;
    created_at: string;
    total_amount: number;
    owner?: Owner | null;
};

type BadgeVariant = 'secondary' | 'destructive' | 'outline' | 'default' | 'brand' | null | undefined;

const OrderShow = ({ order }: { order: Order }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusVariant = (status: string): BadgeVariant => {
        switch (status) {
            case 'completed':
                return 'default';
            case 'processing':
                return 'secondary';
            case 'cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    return (
        <DashboardLayout title={`Order #${order.id}`}>
            {order.items.map((item: OrderItem) => (
                <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product?.name || 'Product not available'}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price_each.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${(item.price_each * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
            ))}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.product?.name || 'Product not available'}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>${item.price_each.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">${(item.price_each * item.quantity).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span>Status</span>
                                <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                            </div>

                            <div className="flex justify-between">
                                <span>Order Date</span>
                                <span>{formatDate(order.created_at)}</span>
                            </div>

                            <Separator />

                            <div className="flex justify-between font-medium">
                                <span>Total Amount</span>
                                <span>${order.total_amount.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p>{order.owner?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p>{order.owner?.email || 'N/A'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default OrderShow;
