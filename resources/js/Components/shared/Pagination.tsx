import { router } from '@inertiajs/react';

type Props = {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
};

export default function Pagination({ links }: Props) {
    const handlePageChange = (url: string | null) => {
        if (url) router.get(url);
    };

    return (
        <div className="mt-6 flex flex-wrap justify-center gap-2 px-4">
            {links.map((link, index) => (
                <button
                    key={index}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    disabled={!link.url}
                    onClick={() => handlePageChange(link.url)}
                    className={`rounded border px-3 py-1 text-sm transition ${
                        link.active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                    }`}
                />
            ))}
        </div>
    );
}
