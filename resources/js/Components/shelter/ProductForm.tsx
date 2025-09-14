import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

type ProductFormProps = {
    product?: {
        id: number;
        name: string;
        slug: string;
        description: string;
        category: string;
        price: number;
        images: {
            id: string;
            alt: null | string;
            is_primary: 0 | 1;
            path: string;
            product_id: string;
            updated_at: string;
            created_at: string;
        }[];
        stock_quantity?: number;
        created_at: string;
        updated_at: string;
    };
    submitUrl: string;
    method: 'post' | 'put';
};

export default function ProductForm({ product, submitUrl, method }: ProductFormProps) {
    const [imagePreviews, setImagePreviews] = useState<string[]>(product?.images?.map((img) => `/storage/${img.path}`) || []);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: product?.name || '',
        category: product?.category || '',
        price: product?.price || 0,
        description: product?.description || '',
        stock_quantity: product?.stock_quantity || 0,
        images: [] as File[],
        deleted_images: [] as string[], // For tracking images to delete
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Convert form data to FormData to handle file uploads
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (key === 'images') {
                data.images.forEach((file: File) => {
                    formData.append('images[]', file);
                });
            } else if (key === 'deleted_images') {
                data.deleted_images.forEach((id: string) => {
                    formData.append('deleted_images[]', id);
                });
            } else {
                formData.append(key, data[key as keyof typeof data] as string);
            }
        });

        if (method === 'post') {
            post(submitUrl, {
                data: formData,
                forceFormData: true,
                onSuccess: () => reset(),
            });
        } else {
            put(submitUrl, {
                data: formData,
                forceFormData: true,
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setData('images', [...data.images, ...files]);

            // Create previews
            const newPreviews = files.map((file) => URL.createObjectURL(file));
            setImagePreviews([...imagePreviews, ...newPreviews]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files) {
            const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith('image/'));

            if (files.length > 0) {
                setData('images', [...data.images, ...files]);

                // Create previews
                const newPreviews = files.map((file) => URL.createObjectURL(file));
                setImagePreviews([...imagePreviews, ...newPreviews]);
            }
        }
    };

    const removeImage = (index: number, isExisting: boolean = false, imageId?: string) => {
        if (isExisting && imageId) {
            // Mark existing image for deletion
            setData('deleted_images', [...data.deleted_images, imageId]);
        } else {
            // Remove new image
            const newImages = [...data.images];
            newImages.splice(index, 1);
            setData('images', newImages);
        }

        // Remove preview
        const newPreviews = [...imagePreviews];
        URL.revokeObjectURL(newPreviews[index]); // Clean up memory
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="gap-3">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="gap-3">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={data.category} onChange={(e) => setData('category', e.target.value)} />
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
            </div>

            <div className="gap-3">
                <Label htmlFor="price">Price *</Label>
                <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={data.price}
                    onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
                    required
                />
                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>

            <div className="gap-3">
                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                <Input
                    id="stock_quantity"
                    type="number"
                    min="0"
                    value={data.stock_quantity}
                    onChange={(e) => setData('stock_quantity', parseInt(e.target.value) || 0)}
                />
                {errors.stock_quantity && <p className="mt-1 text-sm text-red-500">{errors.stock_quantity}</p>}
            </div>

            <div className="gap-3">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4} />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="gap-3">
                <Label htmlFor="images">Product Images</Label>

                {/* Image upload area */}
                <div
                    className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                        isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                >
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">Drag and drop images here, or click to select</p>
                    <p className="text-sm text-gray-500">Supports JPG, PNG, WEBP up to 4MB each</p>

                    <input ref={fileInputRef} id="images" type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>

                {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}

                {/* Image previews */}
                {imagePreviews.length > 0 && (
                    <div className="mt-4">
                        <h3 className="mb-2 text-sm font-medium">Image Previews</h3>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {imagePreviews.map((preview, index) => {
                                const isExisting = index < (product?.images?.length || 0);
                                const imageId = isExisting ? product?.images[index]?.id : undefined;

                                return (
                                    <Card key={index} className="group relative">
                                        <CardContent className="p-2">
                                            <img src={preview} alt={`Preview ${index + 1}`} className="h-32 w-full rounded-md object-cover" />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeImage(index, isExisting, imageId);
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                            {isExisting && (
                                                <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                                                    Existing
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <Button type="submit" disabled={processing} className="w-full">
                {processing ? 'Processing...' : method === 'post' ? 'Create Product' : 'Update Product'}
            </Button>
        </form>
    );
}
