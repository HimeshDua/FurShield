import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import React from 'react';

interface Props {
    children: React.ReactNode;
}

export default function ShelterLayout({ children }: Props) {
    const { auth } = usePage<PageProps>().props;

    return (
        <div>
            <nav className="flex gap-4 bg-gray-800 p-4 text-white">
                <Link href={route('shelter.show', auth?.user?.shelter_profile_id)}>Profile</Link>
                <Link href={route('adoptions.index')}>Adoptions</Link>
            </nav>
            <main className="p-6">{children}</main>
        </div>
    );
}
