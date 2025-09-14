import { Toaster } from '@/components/ui/sonner';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { AppLayoutProps } from '@/types';
import { Head } from '@inertiajs/react';

export default ({ children, title, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppSidebarLayout>
        <Head title={title} />
        {children}
        <Toaster position="bottom-right" />
    </AppSidebarLayout>
);
