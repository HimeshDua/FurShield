import { PageProps } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Button } from '@/components/ui/button';
import ConditionalLayout from '@/Components/layout/conditionalLayout';

export default function Show() {
  const {listing } = usePage<PageProps>().props;

  const { delete: destroy, processing } = useForm();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this listing?')) {
      destroy(route('shelter.adoptions.destroy', listing.id));
    }
  };

  return (
    <ConditionalLayout title={`${listing.pet_name} Adoption Details`}>
    <div className="mx-auto max-w-5xl w-full p-6 space-y-4">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route('dashboard')}>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={route('adoptions.index')}>Adoptions</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{listing.pet_name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{listing.pet_name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-gray-700">
            {listing.species} {listing.breed && `- ${listing.breed}`}
          </p>
          {listing.age && <p className="text-gray-600">Age: {listing.age}</p>}
          {listing.description && <p className="mt-4">{listing.description}</p>}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={route('shelter.adoptions.edit', listing.id)}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Button variant="destructive" onClick={handleDelete} disabled={processing}>
              {processing ? 'Deleting…' : 'Delete'}
            </Button>
            <Link href={route('adoptions.index')}>
              <Button variant="outline">Back to Listings</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
    </ConditionalLayout>

  );
}
