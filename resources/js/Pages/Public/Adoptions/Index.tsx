import { PageProps, links } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/components/ui/button';
import Pagination from '@/Components/shared/Pagination';
import Layout from '@/layouts/layout';

type Adoption = {
  id: number;
  shelter_id: number;
  pet_name: string;
  species: string;
  breed?: string;
  image?: string;
};

type Props = PageProps<{
  adoptions: {
    data: Adoption[];
    links: links; 
  };
}>;

export default function Adoption() {
  const { adoptions,auth } = usePage<Props>().props;

  return (
    <Layout title='Adoption Listings'>
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Adoption Listings</h1>
        <Link href={route('shelter.adoptions.create')}>
        {auth.user?.role === 'shelter' &&
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            + New Listing
          </Button>
        }
        </Link>
      </div>


      {adoptions.data?.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-200 p-6 text-center text-slate-600">
          No pets available for adoption right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {adoptions.data.map((listing) => (
            <Link
              key={listing.id}
              href={route('shelter.adoptions.show', listing.id)}
              className="group"
            >
              <Card className="h-full transition hover:shadow-md">
                <CardHeader className="p-0">
                  <div className="h-48 w-full overflow-hidden rounded-t bg-slate-100">
                    {listing.image ? (
                      <img
                        src={`/storage/${listing.image}`}
                        alt={listing.pet_name}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        No Image
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg font-semibold">
                    {listing.pet_name}
                  </CardTitle>
                  <p className="text-sm text-slate-500">
                    {listing.species} {listing.breed && `• ${listing.breed}`}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6">
        <Pagination links={adoptions.links} />
      </div>
    </div>
    </Layout>
    
  );
}
