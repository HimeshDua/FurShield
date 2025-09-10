import { PageProps as InertiaPageProps } from '@inertiajs/inertia';
import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface PageProps extends InertiaPageProps {
    ziggy: Config & { location: string };
    auth: {
        user?: User | null;
    };
    vendor: VendorService;
    seo: Seo[];
    customerServices: VendorService[];
    subsByService: CustomerSubscription[];
    flash: { success?: string; error?: string };
    CmsProp: Cms[] | undefined;
    cms: CmsYes;
    marquee: [
        {
            marquee_text: string;
            marquee_link: string;
        },
    ];
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
