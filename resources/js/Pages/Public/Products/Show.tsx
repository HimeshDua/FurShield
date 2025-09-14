import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import Layout from '@/layouts/layout';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingCartIcon, StarIcon } from 'lucide-react';

export default function ProductShow() {
    const { product, related } = usePage<PageProps>().props;

    console.log(`Adding product ${product} to cart ${related}`);
    const handleAddToCart = (productId: string) => {
        console.log(`Adding product ${productId} to cart`);
    };

    return (
        <Layout title={product.name}>
            <main className="container mx-auto max-w-5xl py-10">
                <nav className="mb-8 text-sm text-muted-foreground">
                    <ol className="flex items-center space-x-1">
                        <li>
                            <Link href={route('products.index')} className="hover:text-foreground">
                                Products
                            </Link>
                        </li>
                        <li className="text-gray-500">/</li>
                        <li className="font-medium text-foreground">{product.name}</li>
                    </ol>
                </nav>

                <main className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                            {product.images.length > 0 ? (
                                <img src={`/storage/${product.images[0].path}`} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <p className="text-sm text-muted-foreground">No Image</p>
                                </div>
                            )}
                        </div>
                        {/* Thumbnails (if multiple images exist) */}
                        {product.images.length > 1 && (
                            <div className="flex space-x-2 overflow-x-auto">
                                {product.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className="aspect-square h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border-2 border-transparent hover:border-primary"
                                    >
                                        <img
                                            src={`/storage/${image.path}`}
                                            alt={`${product.name} thumbnail ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{product.name}</h1>
                            <p className="text-xl font-semibold text-primary">${product.price}</p>
                            {product.category && (
                                <div className="flex items-center space-x-2">
                                    <Badge variant="outline">{product.category}</Badge>
                                </div>
                            )}
                            <p className="text-sm text-muted-foreground">{product.shelter?.name ? `Sold by ${product.shelter.name}` : ''}</p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold">Description</h2>
                            <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                className="w-full text-lg font-bold"
                                onClick={() => handleAddToCart(product.id)}
                                disabled={typeof product.stock_quantity === 'number' && product.stock_quantity <= 0}
                            >
                                <ShoppingCartIcon className="mr-2 h-5 w-5" /> Add to Cart
                            </Button>
                        </div>

                        {/* Stock & Reviews */}
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                                <span className="font-medium">Availability:</span>
                                {typeof product.stock_quantity === 'number' && product.stock_quantity > 0 ? (
                                    <span className="text-green-600">In Stock ({product.stock_quantity})</span>
                                ) : (
                                    <span className="text-red-600">Out of Stock</span>
                                )}
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="font-medium">Reviews:</span>
                                {product?.reviews.length > 0 ? (
                                    <div className="flex items-center">
                                        <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="ml-1 text-muted-foreground">({product.reviews.length} reviews)</span>
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground">No reviews yet.</span>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Related Products Section */}
                {related.length > 0 && (
                    <section className="mt-16">
                        <h2 className="mb-6 text-2xl font-bold tracking-tight">You might also like...</h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                            {related.map((item) => (
                                <Link key={item.id} href={route('products.show', item.slug)}>
                                    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg">
                                        <div className="relative h-32 w-full bg-muted">
                                            {item.images.length > 0 ? (
                                                <img
                                                    src={`/storage/${item.images[0].path}`}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <p className="text-xs text-muted-foreground">No Image</p>
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-3">
                                            <p className="truncate text-sm font-medium">{item.name}</p>
                                            <p className="text-sm font-semibold text-primary">${item.price}</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </Layout>
    );
}
