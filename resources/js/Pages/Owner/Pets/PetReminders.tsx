import { useForm, usePage } from '@inertiajs/react';

export default function EditReminders() {
  const { pet } = usePage().props as { pet: any };

  const { data, setData, patch, processing, errors } = useForm({
    next_vaccination_at: pet.next_vaccination_at ?? '',
    next_food_at: pet.next_food_at ?? '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    patch(route('owner.pets.updateReminders', pet.slug));
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-xl font-bold mb-4">Pet Reminders</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block mb-1">Next Vaccination</label>
          <input
            type="datetime-local"
            value={data.next_vaccination_at}
            onChange={e => setData('next_vaccination_at', e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
          {errors.next_vaccination_at && (
            <div className="text-red-500">{errors.next_vaccination_at}</div>
          )}
        </div>
        <div>
          <label className="block mb-1">Next Feeding</label>
          <input
            type="datetime-local"
            value={data.next_food_at}
            onChange={e => setData('next_food_at', e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
          {errors.next_food_at && (
            <div className="text-red-500">{errors.next_food_at}</div>
          )}
        </div>
        <button
          type="submit"
          disabled={processing}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
}
