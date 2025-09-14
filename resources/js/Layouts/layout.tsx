
import { Toaster } from '@/components/ui/sonner';
import { LayoutProps, PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import FooterWithNewsletter from '@/Components/footer/default';
import Navbar from '@/Components/navbar/default';
import { Section } from '@/components/ui/section';

function Layout({ children, title }: LayoutProps) {
    const { auth, flash, petReminders } = usePage<PageProps>().props;

    // flash messages
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    // ✅ pet reminders
    useEffect(() => {
        if (petReminders && petReminders.length > 0) {
            petReminders.forEach((reminder: any) => {
                toast.info(reminder.title, {
                    description: reminder.description,
                    duration: 6000,
                });
            });
        }
    }, [petReminders]);

    return (
        <>
            <Head title={title} />
            <Navbar auth={auth} />
            <Section className="min-h-[64vh]">
                {children}
                <Toaster position="bottom-right" />
            </Section>
            <FooterWithNewsletter/>
        </>
    );
}

export default Layout;
