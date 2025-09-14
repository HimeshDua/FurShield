import AppearanceToggleTab from '@/Components/appearance-tabs';
import HeadingSmall from '@/Components/heading-small';
import ConditionalLayout from '@/Components/layout/conditionalLayout';
import SettingsLayout from '@/Layouts/settings/layout';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    return (
        <ConditionalLayout breadcrumbs={breadcrumbs} title="Appearance settings">
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
                    <AppearanceToggleTab />
                </div>
            </SettingsLayout>
        </ConditionalLayout>
    );
}
