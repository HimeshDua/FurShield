import Pagination from '@/components/shared/Pagination';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Link, usePage } from '@inertiajs/react';

const PetIndex = () => {
    const { pet: pets } = usePage().props;

    return (
        <DashboardLayout title="My Pets">
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-white p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold">My Pets</h2>
                                <Link
                                    href={route('owner.pets.create')}
                                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                                >
                                    Add New Pet
                                </Link>
                            </div>

                            {pets.data.length === 0 ? (
                                <div className="py-8 text-center">
                                    <p className="text-gray-500">You haven't added any pets yet.</p>
                                    <Link
                                        href={route('owner.pets.create')}
                                        className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                                    >
                                        Add Your First Pet
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {pets.data.map((pet: any) => (
                                        <div key={pet.id} className="overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md">
                                            {pet.images && pet.images.length > 0 ? (
                                                <img src={`/storage/${pet.images[0].path}`} alt={pet.name} className="h-48 w-full object-cover" />
                                            ) : (
                                                <div className="flex h-48 w-full items-center justify-center bg-gray-200">
                                                    <span className="text-gray-500">No image</span>
                                                </div>
                                            )}

                                            <div className="p-4">
                                                <h3 className="mb-2 text-xl font-semibold">{pet.name}</h3>
                                                <p className="mb-1 text-gray-600">
                                                    {pet.species} {pet.breed && `- ${pet.breed}`}
                                                </p>
                                                <p className="mb-1 text-gray-600">
                                                    {pet.gender} • {pet.birth_date ? new Date(pet.birth_date).toLocaleDateString() : 'Age unknown'}
                                                </p>
                                                {pet.weight_kg && <p className="mb-3 text-gray-600">{pet.weight_kg} kg</p>}

                                                <div className="mt-4 flex justify-between">
                                                    <Link href={route('owner.pets.show', pet.id)} className="text-blue-500 hover:text-blue-700">
                                                        View Details
                                                    </Link>
                                                    <Link href={route('owner.pets.edit', pet.id)} className="text-gray-500 hover:text-gray-700">
                                                        Edit
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {pets.data.length > 0 && <div className="mt-6">{pets.links && <Pagination links={pets.links} />}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PetIndex;
