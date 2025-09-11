import DashboardLayout from '@/layouts/dashboard-layout';
import { Link, useForm } from '@inertiajs/react';

const PetCreate = () => {
    const { data, setData, errors, post, processing } = useForm({
        name: '',
        species: '',
        breed: '',
        birth_date: '',
        gender: '',
        weight_kg: '',
        microchip: '',
        notes: '',
        images: [],
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        post(route('owner.pets.store'));
    };

    const handleFileChange = (e: any) => {
        setData('images', Array.from(e.target.files));
    };

    return (
        <DashboardLayout title="Add New Pet">
            <div className="py-6">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-white p-6">
                            <h2 className="mb-6 text-2xl font-bold">Add New Pet</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Pet Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                                errors.name ? 'border-red-500' : ''
                                            }`}
                                        />
                                        {errors.name && <div className="mt-1 text-sm text-red-500">{errors.name}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="species" className="block text-sm font-medium text-gray-700">
                                            Species *
                                        </label>
                                        <select
                                            id="species"
                                            value={data.species}
                                            onChange={(e) => setData('species', e.target.value)}
                                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                                errors.species ? 'border-red-500' : ''
                                            }`}
                                        >
                                            <option value="">Select Species</option>
                                            <option value="dog">Dog</option>
                                            <option value="cat">Cat</option>
                                            <option value="bird">Bird</option>
                                            <option value="rabbit">Rabbit</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {errors.species && <div className="mt-1 text-sm text-red-500">{errors.species}</div>}
                                    </div>

                                    <div>
                                        <label htmlFor="breed" className="block text-sm font-medium text-gray-700">
                                            Breed
                                        </label>
                                        <input
                                            type="text"
                                            id="breed"
                                            value={data.breed}
                                            onChange={(e) => setData('breed', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
                                            Birth Date
                                        </label>
                                        <input
                                            type="date"
                                            id="birth_date"
                                            value={data.birth_date}
                                            onChange={(e) => setData('birth_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                            Gender
                                        </label>
                                        <select
                                            id="gender"
                                            value={data.gender}
                                            onChange={(e) => setData('gender', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="unknown">Unknown</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="weight_kg" className="block text-sm font-medium text-gray-700">
                                            Weight (kg)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            id="weight_kg"
                                            value={data.weight_kg}
                                            onChange={(e) => setData('weight_kg', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="microchip" className="block text-sm font-medium text-gray-700">
                                            Microchip Number
                                        </label>
                                        <input
                                            type="text"
                                            id="microchip"
                                            value={data.microchip}
                                            onChange={(e) => setData('microchip', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                            Notes
                                        </label>
                                        <textarea
                                            id="notes"
                                            rows={3}
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                                            Pet Images
                                        </label>
                                        <input
                                            type="file"
                                            id="images"
                                            multiple
                                            onChange={handleFileChange}
                                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        <p className="mt-1 text-sm text-gray-500">You can upload multiple images (max 4MB each)</p>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-4">
                                    <Link
                                        href={route('owner.pets.index')}
                                        className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                                    >
                                        {processing ? 'Adding...' : 'Add Pet'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PetCreate;
