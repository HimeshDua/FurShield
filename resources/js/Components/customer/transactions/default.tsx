import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Shield } from 'lucide-react';
import { useState } from 'react';

export default function TransactionDialog({
    price,
    productId,
    currency = 'USD',
}: {
    price: number;
    productId: number;
    currency?: string;
}) {
    const [open, setOpen] = useState(false);

    const { data, setData, processing, post, reset, errors, clearErrors } = useForm({
        product_id: productId,
        amount: price,
        currency: currency,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('owner.transaction.store'), {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    const closeModal = () => {
        reset();
        clearErrors();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="text-center">Buy Now</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-bold">Complete Purchase</DialogTitle>
                    <DialogDescription>
                        You’re purchasing this product for <b>{currency} {price}</b>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Button type="submit" className="w-full" disabled={processing}>
                        {processing ? 'Processing...' : `Purchase - ${currency} ${price}`}
                    </Button>
                    <Button type="button" variant="secondary" onClick={closeModal} className="w-full">
                        Cancel
                    </Button>
                </form>

                <div className="mt-4 flex items-center justify-center gap-2 border-t pt-4 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    Made By Team "Tech Gurus"
                </div>
            </DialogContent>
        </Dialog>
    );
}
