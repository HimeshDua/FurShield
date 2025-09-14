import TransactionDialog from '@/Components/customer/transactions/default';
import ConditionalLayout from '@/Components/layout/conditionalLayout';
import Pagination from '@/Components/shared/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/layouts/layout';

import { Product } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { SearchIcon, ShoppingCartIcon } from 'lucide-react';

export default function Products() {
    const { products, categories = [], filters = {} } = usePage().props;

    const { data, setData, get } = useForm({
        search: filters.search ?? '',
        category: filters.category ?? 'all',
        sort: filters.sort ?? 'newest',
    });

    const { post: addToCartPost, processing: isAddingToCart } = useForm();

    const handleAddToCart = (productId: string) => {
        addToCartPost(
            route('owner.transaction.store'),
            {
                product_id: productId,
                quantity: 1,
                forceFormData:true
            },
            {
                preserveScroll: true,
            },
        );
    };

    const clearFilters = () => {
        setData({
            search: '',
            category: 'all',
            sort: 'newest',
        });

        get(route('products.index', {}), {
            preserveState: true,
            replace: true,
            only: ['products', 'filters'],
        });
    };

    const handleFilter = (e: any) => {
        e.preventDefault();
        const query = {
            search: data.search || undefined,
            category: data.category !== 'all' ? data.category : undefined,
            sort: data.sort !== 'newest' ? data.sort : undefined,
        };

        get(route('products.index', query), {
            preserveState: true,
            replace: true,
            only: ['products', 'filters'],
        });
    };

    return (
        <Layout title="Our Products">
            <div className="max-w-6xl mx-auto py-10">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Our Products</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Find the perfect products for your beloved pets.</p>
                </header>
                <div className="flex flex-col md:flex-row md:space-x-8">
                    <aside className="mb-6 md:mb-0 md:w-72">
                        <Card className="p-4">
                            <CardTitle className="mb-3 text-sm">Filters</CardTitle>
                            <div className="space-y-3">
                                <div>
                                    <form onSubmit={handleFilter}>
                                        {' '}
                                        {/* Use a form to trigger the filter */}
                                        <label htmlFor="search" className="block text-xs font-medium text-muted-foreground">
                                            Search
                                        </label>
                                        <div className="relative mt-1">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <SearchIcon className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <Input
                                                id="search"
                                                value={data.search}
                                                onChange={(e) => setData('search', e.target.value)}
                                                placeholder="Search products..."
                                                className="h-9 pl-9"
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div>
                                    <label htmlFor="sort" className="block text-xs font-medium text-muted-foreground">
                                        Sort By
                                    </label>
                                    <Select value={data.sort} onValueChange={(v) => setData('sort', v)}>
                                        <SelectTrigger id="sort" className="mt-1 h-9 w-full">
                                            <SelectValue placeholder="Select an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                            <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                            <SelectItem value="name-asc">Name: A-Z</SelectItem>
                                            <SelectItem value="name-desc">Name: Z-A</SelectItem>
                                            <SelectItem value="newest">Newest</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label htmlFor="category" className="block text-xs font-medium text-muted-foreground">
                                        Category
                                    </label>
                                    <Select value={data.category} onValueChange={(v) => setData('category', v)}>
                                        <SelectTrigger id="category" className="mt-1 h-9 w-full">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            {Array.isArray(categories) &&
                                                categories.map((c) => (
                                                    <SelectItem key={c} value={c}>
                                                        {c}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleFilter} className="w-full">
                                    Apply Filters
                                </Button>
                                <Button onClick={clearFilters} className="w-full">
                                    Clear Filters
                                </Button>
                            </div>
                        </Card>
                    </aside>
                    <main className="md:flex-1">
                        {products?.data && products.data.length > 0 ? (
                       <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 auto-rows-fr">
                 {products.data.map((product: Product) => (
        <Card
            key={product.id}
            className="group flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg min-h-[380px]"
        >
            {/* Image Section */}
            <div className="relative h-48 w-full bg-muted">
                {product.images && product.images.length > 0 ? (
                    <img
                        src={`/storage/${product.images[0].path}`}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <p className="text-sm text-muted-foreground">No Image</p>
                    </div>
                )}
                <div className="absolute top-2 left-2">
                    {typeof product.stock_quantity === 'number' && product.stock_quantity > 0 ? (
                        <Badge variant="secondary">In Stock</Badge>
                    ) : (
                        <Badge variant="destructive">Out of Stock</Badge>
                    )}
                </div>
            </div>

            {/* Card Content */}
            <div className="flex flex-1 flex-col">
                <CardHeader className="p-3">
                    <CardTitle className="truncate text-sm font-medium">{product.name}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {product.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0 mt-auto">
                    <p className="text-lg font-semibold text-primary">${product.price}</p>
                </CardContent>
                <CardFooter className="flex gap-2 p-3 pt-0">
                    <Link href={route('products.show', product.slug)} className="flex-1">
                        <Button variant="outline" className="h-9 w-full text-sm">
                            View Details
                        </Button>
                    </Link>
                    <TransactionDialog price={product.price} productId={product.id} currency="USD" />

                    {/* <Button
                        onClick={() => handleAddToCart(product.id)}
                        className="h-9 flex-1 text-sm"
                        disabled={
                            isAddingToCart || (typeof product.stock_quantity === 'number' && product.stock_quantity <= 0)
                        }
                    >
                        <ShoppingCartIcon className="mr-2 h-4 w-4" /> Add to Cart
                    </Button> */}
                </CardFooter>
            </div>
        </Card>
    ))}
</div>

                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                                <h2 className="text-xl font-semibold">No products found.</h2>
                                <p className="mt-2">Try adjusting your filters or search terms.</p>
                            </div>
                        )}
                        {products?.last_page > 1 && <Pagination links={products.links} />}
                    </main>
                </div>
            </div>
        </Layout>
    );
}
