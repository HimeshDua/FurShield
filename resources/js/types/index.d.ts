import { PageProps as InertiaPageProps } from '@inertiajs/inertia';
import type { Config } from 'ziggy-js';

//Layouts
export interface LayoutProps {
    children: ReactNode;
    title: string;
    // role?: 'customer' | 'vendor' | 'admin' | null;
    breadcrumbs?: BreadcrumbItem[];
    [type: string]: value;
}

export interface AppLayoutProps {
    children: ReactNode;
    title?: string;
    breadcrumbs?: BreadcrumbItem[];
}

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    isRequestSend?: { id: string }[];
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'vendor' | 'customer' | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

//Layouts
export interface LayoutProps {
    children: ReactNode;
    title: string;
    // role?: 'customer' | 'vendor' | 'admin' | null;
    breadcrumbs?: BreadcrumbItem[];
    [type: string]: value;
}

export interface AppLayoutProps {
    children: ReactNode;
    title?: string;
    breadcrumbs?: BreadcrumbItem[];
}

export interface Auth {
    user: User | null;
}

// ---------- Domain Entities ----------

// Pets
export interface PetwithAppointment {
    id: number;
    slug: string;
    name: string;
    species: string;
    breed?: string;
    age?: number;
    images: {
        image: string;
        path: string;
    }[];
    appointments: Appointment[];
    health_records: HealthRecord[];
    owner_id: number;
    created_at: string;
    updated_at: string;
    [key: string]: any;
}

export interface Pet {
    id: number;
    slug: string;
    name: string;
    species: string;
    breed?: string;
    age?: number;
    images: {
        image: string;
        path: string;
    }[];
    health_records: HealthRecord[];
    owner_id: number;
    created_at: string;
    updated_at: string;
    [key: string]: any;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock?: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;

    // links: {
    //     url: string | null;
    //     label: string;
    //     active: boolean;
    // }[];
    // onPageChange: (url: string | null) => void;
}

export interface HealthRecord {
    id: number;
    pet_id: number;
    vet_id: number;
    description: string;
    diagnosis: string;
    treatment: string;
    created_at: string;
    updated_at: string;
}

// Appointments
export interface Appointment {
    id: number;
    pet_id: number;
    vet_id: number;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
    [key: string]: any;
}

export interface SharedData {
    name: string;
    isRequestSend?: { id: string }[];
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface ShelterProfile {
    id: number;
    user_id: number;
    name: string;
    description: string;
    location: string;
    created_at: string;
    updated_at: string;
}

export interface Order {
    owner_id: string;
    total_amount: string;
    status: string;
    order_date: date;
    metadata: string;
}

export interface PageProps extends InertiaPageProps {
    auth: {
        user?: User | null;
    };
    flash: { success?: string; error?: string };
    auth: Auth;
    product: Product;
    appointment: Appointment;
    pet: Pet;
    orders: Order;
    petwithAppointment: PetwithAppointment;
    [key: string]: any;
}

// ---------- Inertia Page Props ----------

// Every Inertia page gets this base
export interface PageProps<T = Record<string, unknown>> extends InertiaPageProps {
    auth: Auth;
    flash?: {
        success?: string;
        error?: string;
    };
    // page-specific props
    data?: T;
}
