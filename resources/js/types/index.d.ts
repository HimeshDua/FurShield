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
    role: 'owner' | 'vet' | 'shelter' | null;
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
    id: string;
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
    [key: string]: unknown;

    // links: {
    //     url: string | null;
    //     label: string;
    //     active: boolean;
    // }[];
    // onPageChange: (url: string | null) => void;
}

export interface ProductIndexProps {
    products: PaginatedResponse<Product[]>;
    categories: string[];
    filters: {
        search?: string;
        category?: string;
        sort?: string;
    };
}

export interface links {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Adoption {
    id?: number;
    pet_name?: string;
    species?: string;
    slug: string;
    breed?: string | null;
    age?: string | null;
    status?: 'available' | 'pending' | 'adopted';
    description?: string | null;
    images?: Array<string | { path: string; id?: string }>;
    created_at?: string;
    updated_at?: string;
}

export interface HealthRecord {
    id: number;
    pet_id: number;
    vet_id: number;
    title: string;
    description: string;
    diagnosis: string;
    attachments: string;
    visit_date: string;
    treatment: string;
    created_at: string;
    updated_at: string;
}

export interface Veterinarian {
    user_id: string;
    qualifications: string;
    consultation_fee:string;
    clinic_address:string;
    availability:{}[];
    specializations: {}[];
    
    created_at: string;
    updated_at: string;
    [key: string]: any; 
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
    pets: Pet[];
    vet: Veterinarian;
    vets: Veterinarian[];
    orders: Order;
    related: Product[];
    listing: Adoption;
    adoption: Adoption;
    adoptions: Adoption[];
    products: PaginatedResponse<Product[]>;
    categories: string[];
    filters: {
        search?: string;
        category?: string;
        sort?: string;
    };
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
