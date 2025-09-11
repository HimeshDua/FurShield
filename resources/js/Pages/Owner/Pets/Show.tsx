import DashboardLayout from '@/layouts/dashboard-layout';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';

const PetShow = () => {
    const { petwithAppointment: pet } = usePage<PageProps>().props;

    return (
        <DashboardLayout title={pet.name}>
            <div className="py-6">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-white p-6">
                            <div className="mb-6 flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">{pet.name}</h2>
                                    <p className="text-gray-600">
                                        {pet.species} {pet.breed && `• ${pet.breed}`}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <Link
                                        href={route('owner.pets.edit', pet.id)}
                                        className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={route('owner.pets.index')}
                                        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                                    >
                                        Back to Pets
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="md:col-span-1">
                                    {pet.images && pet.images.length > 0 ? (
                                        <div className="space-y-4">
                                            <img
                                                src={`/storage/${pet.images[0].path}`}
                                                alt={pet.name}
                                                className="h-64 w-full rounded-lg object-cover"
                                            />
                                            {pet.images.length > 1 && (
                                                <div className="grid grid-cols-3 gap-2">
                                                    {pet.images.slice(1).map((image, index) => (
                                                        <img
                                                            key={index}
                                                            src={`/storage/${image.path}`}
                                                            alt={pet.name}
                                                            className="h-20 w-full rounded object-cover"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-200">
                                            <span className="text-gray-500">No image available</span>
                                        </div>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <h3 className="mb-4 text-lg font-semibold">Pet Details</h3>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Species</p>
                                                <p className="font-medium">{pet.species}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Breed</p>
                                                <p className="font-medium">{pet.breed || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Gender</p>
                                                <p className="font-medium">
                                                    {pet.gender ? pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1) : 'Not specified'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Birth Date</p>
                                                <p className="font-medium">
                                                    {pet.birth_date ? new Date(pet.birth_date).toLocaleDateString() : 'Unknown'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Weight</p>
                                                <p className="font-medium">{pet.weight_kg ? `${pet.weight_kg} kg` : 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Microchip</p>
                                                <p className="font-medium">{pet.microchip || 'Not specified'}</p>
                                            </div>
                                        </div>

                                        {pet.notes && (
                                            <div className="mt-4">
                                                <p className="text-sm text-gray-500">Notes</p>
                                                <p className="font-medium">{pet.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="mb-4 text-xl font-semibold">Health Records</h3>

                                {pet.health_records && pet.health_records.length > 0 ? (
                                    <div className="overflow-hidden rounded-lg border bg-white">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                        Date
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                        Type
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                        Description
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {pet.health_records.map((record) => (
                                                    <tr key={record.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {new Date(record.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{record.treatment}</td>
                                                        <td className="px-6 py-4">{record.description}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No health records found.</p>
                                )}
                            </div>

                            <div className="mt-8">
                                <h3 className="mb-4 text-xl font-semibold">Appointments</h3>

                                {pet.appointments && pet.appointments.length > 0 ? (
                                    <div className="overflow-hidden rounded-lg border bg-white">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                        Date & Time
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                        Purpose
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {pet.appointments.map((appointment) => (
                                                    <tr key={appointment.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {new Date(appointment.appointment_date).toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4">{appointment.purpose}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                                                                    appointment.status === 'pending'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : appointment.status === 'approved'
                                                                          ? 'bg-green-100 text-green-800'
                                                                          : 'bg-red-100 text-red-800'
                                                                }`}
                                                            >
                                                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No appointments found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PetShow;
