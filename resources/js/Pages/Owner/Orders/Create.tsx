import OrderCreateForm from '@/components/owner/order-form';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

function CreateOrder() {
    const { orders } = usePage<PageProps>().props;
    return <OrderCreateForm products={orders} />;
}

export default CreateOrder;
