import { siteConfig } from '@/config/site';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { cn } from '@/lib/utils';
import { Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Navbar as NavbarComponent, NavbarLeft, NavbarRight } from '../ui/navbar';
import Navigation from '../ui/navigation';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

interface NavbarProps {
    logo?: React.ReactNode;
    name?: string;
    homeUrl?: string;
    auth?: {
        user?: {
            name: string;
            email?: string;
            avatar?: string | null;
            role?: 'owner' | 'vet' | 'shelter' | 'admin' | null;
        } | null;
    };
    showNavigation?: boolean;
    customNavigation?: React.ReactNode;
    className?: string;
}

export default function Navbar({
    logo = null,
    name = 'FurShield',
    homeUrl = siteConfig.url,
    auth,
    showNavigation = true,
    customNavigation,
    className,
}: NavbarProps) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const cleanup = useMobileNavigation();
    const page = usePage();
    const currentUrl = page.url ?? window.location.pathname;

    const handleLogout = () => {
        cleanup();
        router.post(route('logout'));
    };

    const user = auth?.user ?? null;

    return (
        <header className={cn('sticky top-0 z-50 w-full border-b border-border bg-background/60 backdrop-blur', className)}>
            <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
                <NavbarComponent>
                    <NavbarLeft className="gap-4">
                        <Link href={homeUrl} className="flex items-center gap-3 text-lg font-semibold">
                            {/* logo area (optional) */}
                            <div className="h-8 w-8">{logo}</div>
                            <span className="hidden text-sm sm:inline md:text-base">{name}</span>
                        </Link>

                        {/* Desktop navigation */}
                        {showNavigation && (customNavigation ?? <Navigation />)}
                    </NavbarLeft>

                    <NavbarRight className="items-center gap-3">
                        {/* Actions (desktop) */}
                        <div className="hidden items-center gap-3 md:flex">
                            {/* If user not logged in show auth links */}
                            {!user ? (
                                <>
                                    <Link href={route('login')} className="text-sm text-muted-foreground hover:text-foreground">
                                        Sign in
                                    </Link>
                                    <Button asChild variant="default">
                                        <Link href={route('register')}>Get started</Link>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {/* Small profile dropdown */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted">
                                            <Avatar>
                                                {user.avatar ? (
                                                    <AvatarImage src={user.avatar} />
                                                ) : (
                                                    <AvatarFallback>{user.name?.[0] ?? 'U'}</AvatarFallback>
                                                )}
                                            </Avatar>
                                            <span className="hidden text-sm text-muted-foreground sm:inline">{user.name}</span>
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('profile.edit') ?? '/profile'}>Profile</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('dashboard') ?? '/dashboard'}>Dashboard</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer">
                                                    <div className="flex items-center gap-2">
                                                        <LogOut className="h-4 w-4" />
                                                        <span>Logout</span>
                                                    </div>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>

                            <SheetContent side="right" className="w-80">
                                <div className="mb-4 flex items-center justify-between">
                                    <Link href={homeUrl} className="flex items-center gap-3 text-lg font-semibold">
                                        <div className="h-7 w-7">{logo}</div>
                                        <span>{name}</span>
                                    </Link>
                                    <Button variant="ghost" onClick={() => setSheetOpen(false)}>
                                        Close
                                    </Button>
                                </div>

                                <nav className="flex flex-col gap-2">
                                    {/* replicate Navigation links */}
                                    <Navigation />

                                    <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                                        {!user ? (
                                            <>
                                                <Link href={route('login')} className="block text-base text-muted-foreground" onClick={cleanup}>
                                                    Sign in
                                                </Link>
                                                <Link href={route('register')} className="block text-base text-foreground" onClick={cleanup}>
                                                    Get started
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        {user.avatar ? (
                                                            <AvatarImage src={user.avatar} />
                                                        ) : (
                                                            <AvatarFallback>{user.name?.[0] ?? 'U'}</AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <div>
                                                        <div className="text-sm font-medium text-foreground">{user.name}</div>
                                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                                    </div>
                                                </div>

                                                <Link
                                                    href={route('profile.edit') ?? '/profile'}
                                                    className="block text-base text-muted-foreground"
                                                    onClick={cleanup}
                                                >
                                                    Profile
                                                </Link>
                                                <Link
                                                    href={route('dashboard') ?? '/dashboard'}
                                                    className="block text-base text-muted-foreground"
                                                    onClick={cleanup}
                                                >
                                                    Dashboard
                                                </Link>

                                                <button
                                                    onClick={() => {
                                                        cleanup();
                                                        handleLogout();
                                                    }}
                                                    className="mt-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    Sign out
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </NavbarRight>
                </NavbarComponent>
            </div>
        </header>
    );
}
