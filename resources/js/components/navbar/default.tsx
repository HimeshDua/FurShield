import { siteConfig } from '@/config/site';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { cn } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { ReactNode } from 'react';
import { Button } from '../ui/button';
import { Navbar as NavbarComponent, NavbarLeft, NavbarRight } from '../ui/navbar';
import Navigation from '../ui/navigation';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

interface NavbarLink {
    text: string;
    href: string;
}

interface NavbarActionProps {
    text: string;
    href: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    icon?: ReactNode;
    iconRight?: ReactNode;
    isForm?: boolean;
    isProfile?: boolean;
    isButton?: boolean;
}

interface NavbarProps {
    logo?: ReactNode;
    name?: string;
    homeUrl?: string;
    auth?: {
        user?: {
            name: string;
            role: 'owner' | 'vet' | 'shelter' | null;
        } | null;
    };
    showNavigation?: boolean;
    customNavigation?: ReactNode;
    className?: string;
}

export default function Navbar({
    logo = '',
    name = 'FurShield',
    homeUrl = siteConfig.url,
    auth,
    showNavigation = true,
    customNavigation,
    className,
}: NavbarProps) {
    let roleBasedLinks: NavbarLink[] = [];
    let actions: NavbarActionProps[] = [];

    if (auth?.user) {
        switch (auth.user.role) {
            case 'owner':
                roleBasedLinks = [
                    { text: 'My Pets', href: '/pets' },
                    { text: 'Health Records', href: '/pets/1/health' }, // dynamic, just show base in menu
                    { text: 'Appointments', href: '/appointments' }, // booking flow
                    { text: 'Orders', href: '/orders' },
                ];
                break;

            case 'vet':
                roleBasedLinks = [
                    { text: 'Appointments', href: '/vet/appointments' },
                    { text: 'Health Records', href: '/health-records' },
                    { text: 'My Profile', href: '/vet-profile' },
                ];
                break;

            case 'shelter':
                roleBasedLinks = [
                    { text: 'Adoptions', href: '/adoptions' },
                    { text: 'My Profile', href: '/shelter-profile' },
                ];
                break;

            default:
                roleBasedLinks = [
                    { text: 'Home', href: '/' },
                    { text: 'Products', href: '/products' },
                    { text: 'Vets', href: '/vets' },
                    { text: 'Adoptions', href: '/adoptions' },
                ];
        }
    } else {
        // Guest
        roleBasedLinks = [
            { text: 'Home', href: '/' },
            { text: 'Services', href: '/services' },
            { text: 'About', href: '/about' },
            { text: 'Contact', href: '/contact' },
        ];
        actions = [
            { text: 'Sign In', href: '/login' },
            {
                text: 'Get Started',
                href: '/register',
                isButton: true,
                variant: 'default',
            },
        ];
    }

    const cleanup = useMobileNavigation();
    const handleLogout = () => {
        cleanup();
        router.post(route('logout'));
    };

    return (
        <header className={cn('z-50 container -mb-4 px-4 pb-4', 'fade-bottom bg-background/80 backdrop-blur-lg', className)}>
            <div className="max-w-container relative mx-auto">
                <NavbarComponent>
                    <NavbarLeft>
                        <Link href={homeUrl} className="flex items-center gap-2 text-xl font-bold">
                            {logo}
                            {name}
                        </Link>
                        {showNavigation && (customNavigation || <Navigation />)}
                    </NavbarLeft>
                    <NavbarRight>
                        {roleBasedLinks.map((link, index) => (
                            <Link key={index} href={link.href} className="text-muted-foreground hover:text-foreground">
                                {link.text}
                            </Link>
                        ))}
                        {actions.map((action, index) =>
                            action.isProfile && action.isButton ? (
                                <Button key={index} variant={action.variant || 'default'} asChild>
                                    <Link href={action.href}>{action.text}</Link>
                                </Button>
                            ) : action.isForm && action.isButton ? (
                                <Button key={index} variant={action.variant || 'destructive'} onClick={handleLogout}>
                                    {action.text}
                                </Button>
                            ) : action.isButton ? (
                                <Button key={index} variant={action.variant || 'default'} asChild>
                                    <Link href={action.href}>
                                        {action.icon}
                                        {action.text}
                                        {action.iconRight}
                                    </Link>
                                </Button>
                            ) : (
                                <Link key={index} href={action.href} className="hidden text-sm md:block">
                                    {action.text}
                                </Link>
                            ),
                        )}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
                                    <Menu className="size-5" />
                                    <span className="sr-only">Toggle navigation menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <nav className="grid gap-6 p-8 text-lg font-medium">
                                    <Link href={homeUrl} className="flex items-center gap-2 text-xl font-bold">
                                        {name}
                                    </Link>
                                    {roleBasedLinks.map((link, index) => (
                                        <Link key={index} href={link.href} className="text-muted-foreground hover:text-foreground">
                                            {link.text}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </NavbarRight>
                </NavbarComponent>
            </div>
        </header>
    );
}
