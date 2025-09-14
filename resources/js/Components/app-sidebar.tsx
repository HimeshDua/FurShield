import { NavFooter } from '@/Components/nav-footer';
import { NavMain } from '@/Components/nav-main';
import { NavUser } from '@/Components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { PageProps, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Calendar, FileText, Folder, LayoutGrid, ShoppingCart, Users } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const {auth} = usePage<PageProps>().props;
    const user = auth.user ?? null;
    const role: string | null = user?.role ?? null;

    const baseNav: NavItem[] = [
        {
            title: 'Dashboard',
            href: typeof route === 'function' ? route('dashboard') : '/dashboard',
            icon: LayoutGrid,
        },
    ];

    // Role specific items
    let roleItems: NavItem[] = [];

    if (role === 'owner') {
        roleItems = [
            {
                title: 'My Pets',
                href: typeof route === 'function' ? route('owner.pets.index') : '/owner/pets',
                icon: Users,
            },
            {
                title: 'Veterinarian',
                href: typeof route === 'function' ? route('vets.index') : '/owner/appointments',
                icon: Calendar,
            },
            {
                title: 'Products',
                href: typeof route === 'function' ? route('products.index') : '/products',
                icon: ShoppingCart,
            },
            {
                title: 'Orders',
                href: typeof route === 'function' ? route('owner.orders') : '/owner/orders',
                icon: ShoppingCart,
            },
        ];
    } else if (role === 'vet') {
        roleItems = [
            {
                title: 'Veterinarian',
                href: typeof route === 'function' ? route('vets.index') : '/vet/appointments',
                icon: Calendar,
            },
        ];
    } else if (role === 'shelter') {
        roleItems = [
            {
                title: 'Adoptions',
                href: typeof route === 'function' ? route('adoptions.index') : '/adoptions',
                icon: Folder,
            },
            {
                title: 'Products',
                href: typeof route === 'function' ? route('shelter.products.index') : '/shelter/products',
                icon: ShoppingCart,
            },
        ];
    } else if (role === 'admin') {
        roleItems = [
            {
                title: 'Users',
                href: typeof route === 'function' ? route('admin.users.index') : '/admin/users',
                icon: Users,
            },
            {
                title: 'Site Settings',
                href: '/settings', // or your settings route
                icon: FileText,
            },
            {
                title: 'Repository',
                href: 'https://github.com/laravel/react-starter-kit',
                icon: Folder,
            },
        ];
    } else {
        // guest / fallback
        roleItems = [
            {
                title: 'Products',
                href: typeof route === 'function' ? route('products.index') : '/products',
                icon: ShoppingCart,
            },
            {
                title: 'Vets',
                href: typeof route === 'function' ? route('vets.index') : '/vets',
                icon: Folder,
            },
            {
                title: 'Adoptions',
                href: typeof route === 'function' ? route('adoptions.index') : '/adoptions',
                icon: Folder,
            },
        ];
    }

    const mainNavItems: NavItem[] = [...baseNav, ...roleItems];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={typeof route === 'function' ? route('dashboard') : '/dashboard'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
