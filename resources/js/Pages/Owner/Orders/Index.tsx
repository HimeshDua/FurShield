import Pagination from '@/Components/shared/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/layouts/dashboard-layout';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export default function OrderHistory() {
    const { orders } = usePage<PageProps>().props;
    const formatDate = (dateString: string | Date) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'processing':
                return 'secondary';
            case 'cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    return (
        <DashboardLayout title="My Orders">
            <div className="container mx-auto py-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">My Orders</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Order History</CardTitle>
                        <CardDescription>View all your past and current orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {orders.data.length === 0 ? (
                            <div className="py-8 text-center">
                                <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order ID</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Items</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Status</TableHead>
                                            {/* <TableHead className="text-right">Actions</TableHead> */}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.data.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">#{order.id}</TableCell>
                                                <TableCell>{formatDate(order.created_at)}</TableCell>
                                                <TableCell>{order.items_count} items</TableCell>
                                                <TableCell>${order.total_amount}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                                </TableCell>
                                                {/* <TableCell className="text-right">
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href={route('owner.orders.index', order.id)}>View Details</Link>
                                                    </Button>
                                                </TableCell> */}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <Pagination links={orders.links} />
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
