import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/Components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/layouts/dashboard-layout';
import { PageProps, Product } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';

export default function Index() {
    const { products } = usePage<PageProps>().props;
    return (
        <DashboardLayout title="My Products">
            <div className="container mx-auto py-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">My Products</h1>
                    <Button asChild>
                        <Link href={route('shelter.products.create')}>Add Product</Link>
                    </Button>
                </div>

                <div className="rounded-lg border shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.data.map((product: Product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        {product.images.length > 0 && (
                                            <img
                                                src={`/storage/${product.images[0].path}`}
                                                alt={product.name}
                                                className="h-16 w-16 rounded-md object-cover"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell className="text-gray-500">{product.category || '-'}</TableCell>
                                    <TableCell className="font-medium">${product.price}</TableCell>
                                    <TableCell>
                                        <span className={product.stock_quantity === 0 ? 'text-red-500' : 'text-green-500'}>
                                            {product.stock_quantity}
                                        </span>
                                    </TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href={route('shelter.products.edit', product.slug)}>Edit</Link>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="destructive">
                                                    Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the product.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => router.delete(route('shelter.products.destroy', product.slug))}>
                                                        Continue
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </DashboardLayout>
    );
}
