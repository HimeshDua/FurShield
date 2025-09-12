import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Adoption } from '@/types';
import { router, useForm } from '@inertiajs/react';
import clsx from 'clsx';
import { Upload, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

type AdoptionFormProps = {
    adoption?: Adoption;
    submitUrl: string;
    method: 'post' | 'put';
};

export default function AdoptionForm({ adoption, submitUrl, method }: AdoptionFormProps) {
    // Normalize existing images to paths
    const existingImages: string[] = (adoption?.images || []).map((i) => (typeof i === 'string' ? i : (i as any).path));

    const [imagePreviews, setImagePreviews] = useState<string[]>(existingImages.map((p) => `/storage/${p}`));
    const [isDragging, setIsDragging] = useState(false);
    const [existingCount] = useState(existingImages.length);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        pet_name: adoption?.pet_name || '',
        species: adoption?.species || '',
        breed: adoption?.breed || '',
        age: adoption?.age || '',
        status: adoption?.status || 'available',
        description: adoption?.description || '',
        images: [] as File[],
        deleted_images: [] as string[],
        // For edit mode, include the adoption ID if it exists
        ...(adoption?.id && { id: adoption.id }),
    });

    // When the adoption prop changes (in edit mode), update the form data
    useEffect(() => {
        if (adoption) {
            setData({
                pet_name: adoption.pet_name || '',
                species: adoption.species || '',
                breed: adoption.breed || '',
                age: adoption.age || '',
                status: adoption.status || 'available',
                description: adoption.description || '',
                images: [],
                deleted_images: [],
                // Preserve the adoption ID for updates
                ...(adoption.id && { id: adoption.id }),
            });

            // Reset image previews with existing images
            setImagePreviews(existingImages.map((p) => `/storage/${p}`));
        }
        console.log(adoption);
    }, [adoption]);

    const triggerFileInput = () => fileInputRef.current?.click();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files).filter((f) => f.type.startsWith('image/'));
        if (!files.length) return;

        setData('images', [...data.images, ...files]);

        const newPreviews = files.map((f) => URL.createObjectURL(f));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith('image/'));
        if (!files.length) return;

        setData('images', [...data.images, ...files]);
        const newPreviews = files.map((f) => URL.createObjectURL(f));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        if (index < existingCount) {
            const path = existingImages[index];
            setData('deleted_images', [...data.deleted_images, path]);
        } else {
            const newFiles = [...data.images];
            const newIndex = index - existingCount;
            if (newIndex >= 0 && newIndex < newFiles.length) {
                URL.revokeObjectURL(imagePreviews[index]);
                newFiles.splice(newIndex, 1);
                setData('images', newFiles);
            }
        }

        setImagePreviews((prev) => {
            const copy = [...prev];
            const removed = copy.splice(index, 1);
            if (index >= existingCount) {
                URL.revokeObjectURL(removed[0]);
            }
            return copy;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (method === 'put') {
            put(submitUrl, {
                data,
                forceFormData: true,
                onSuccess: () => {
                    router.visit(route('shelter.adoptions.index'), { preserveScroll: true });
                },
                onError: (errors) => {
                    console.error('Form errors:', errors);
                },
            });
        } else {
            // For create operations
            post(submitUrl, {
                data,
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    router.visit(route('shelter.adoptions.index'), { preserveScroll: true });
                },
                onError: (errors) => {
                    console.error('Form errors:', errors);
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="pet_name">Pet Name *</Label>
                    <Input id="pet_name" value={data.pet_name} onChange={(e) => setData('pet_name', e.target.value)} required />
                    {errors.pet_name && <p className="mt-1 text-sm text-red-500">{errors.pet_name}</p>}
                </div>

                <div>
                    <Label htmlFor="species">Species *</Label>
                    <Input id="species" value={data.species} onChange={(e) => setData('species', e.target.value)} required />
                    {errors.species && <p className="mt-1 text-sm text-red-500">{errors.species}</p>}
                </div>

                <div>
                    <Label htmlFor="breed">Breed</Label>
                    <Input id="breed" value={data.breed} onChange={(e) => setData('breed', e.target.value)} />
                    {errors.breed && <p className="mt-1 text-sm text-red-500">{errors.breed}</p>}
                </div>

                <div>
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" value={data.age} onChange={(e) => setData('age', e.target.value)} placeholder="e.g. 2 years" />
                    {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
                </div>
            </div>

            <div className="md:w-1/3">
                <Label htmlFor="status">Status</Label>
                <Select value={data.status} onValueChange={(val) => setData('status', val as any)}>
                    <SelectTrigger id="status" className="w-full">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="adopted">Adopted</SelectItem>
                    </SelectContent>
                </Select>
                {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={5} />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            <div>
                <Label>Images</Label>

                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                    className={clsx(
                        'cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors',
                        isDragging ? 'border-primary bg-primary/10' : 'border-gray-300',
                    )}
                >
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">Drag & drop images here, or click to select</p>
                    <p className="text-sm text-muted-foreground">JPG, PNG, WEBP — up to 4MB each</p>

                    <input ref={fileInputRef} id="images" type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>

                {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}

                {imagePreviews.length > 0 && (
                    <div className="mt-4">
                        <h3 className="mb-2 text-sm font-medium">Image Previews</h3>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {imagePreviews.map((src, idx) => {
                                const isExisting = idx < existingCount;
                                const badgeLabel = isExisting ? 'Existing' : 'New';

                                return (
                                    <Card key={idx} className="group relative">
                                        <CardContent className="p-0">
                                            <img src={src} alt={`preview-${idx}`} className="h-36 w-full object-cover" />
                                            <button
                                                type="button"
                                                aria-label="Remove image"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeImage(idx);
                                                }}
                                                className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                            <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                                                {badgeLabel}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={processing}>
                {processing ? 'Saving...' : method === 'post' ? 'Create Listing' : 'Update Listing'}
            </Button>
        </form>
    );
}
