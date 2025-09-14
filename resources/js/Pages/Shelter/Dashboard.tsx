import DashboardLayout from '@/layouts/dashboard-layout'
import { usePage, Link } from '@inertiajs/react'
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card'
import { Button } from '@/components/ui/button'
import { PageProps } from '@/types';

export default function ShelterDashboard() {
  const { adoptions, products, stats } = usePage<PageProps>().props;
  return (
    <DashboardLayout title="Shelter Dashboard">
      <div className="mx-auto max-w-7xl w-full space-y-8 p-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-4 w-full md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Adoptions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.total_adoptions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Available Adoptions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.available_adoptions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.total_products}</p>
            </CardContent>
          </Card>
        </div>

        {/* Adoptions Section */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Adoptions</h2>
            <Link href={route('shelter.adoptions.create')}>
              <Button>Add Adoption</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {adoptions.length ? (
              adoptions.map((a: any) => (
                <Card key={a.id}>
                  <CardHeader>
                    <CardTitle>{a.pet_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {a.species} {a.breed && `– ${a.breed}`}
                    </p>
                    <p className="text-xs text-muted-foreground">Status: {a.status}</p>
                    <Link
                      href={route('shelter.adoptions.edit', a.id)}
                      className="mt-2 inline-block"
                    >
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">No adoption listings yet.</p>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Products</h2>
            <Link href={route('shelter.products.create')}>
              <Button>Add Product</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {products.length ? (
              products.map((p: any) => (
                <Card key={p.id}>
                  <CardHeader>
                    <CardTitle>{p.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">${p.price}</p>
                    <Link
                      href={route('shelter.products.edit', p.id)}
                      className="mt-2 inline-block"
                    >
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">No products yet.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
