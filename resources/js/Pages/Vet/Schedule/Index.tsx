import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/layouts/dashboard-layout';
import { PageProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';

/**
 * Each slot:
 * {
 *   id: uuid,
 *   day: 'monday',
 *   start_time: '09:00',
 *   end_time: '13:00',
 *   notes: ''
 * }
 */

export default function VetSchedulePage() {
    const { availability = [] } = usePage<PageProps>().props;
    const [slots, setSlots] = useState(availability);

    const saveForm = useForm({ slots });
    const addForm = useForm({
        day: '',
        start_time: '',
        end_time: '',
        notes: '',
    });

    function addSlot() {
        if (!addForm.data.day || !addForm.data.start_time || !addForm.data.end_time) {
            alert('Please select day, start time and end time.');
            return;
        }
        const newSlot = {
            id: crypto.randomUUID(),
            ...addForm.data,
        };
        setSlots([...slots, newSlot]);
        addForm.setData({
            day: '',
            start_time: '',
            end_time: '',
            notes: '',
        });
    }

    function removeSlot(id: string) {
        setSlots(slots.filter((s) => s.id !== id));
    }

    function saveSlots() {
        saveForm.setData('slots', slots);
        saveForm.post(route('vet.schedule.save'), {
            preserveScroll: true,
            onSuccess: () => alert('Schedule updated successfully!'),
        });
    }

    return (
        <DashboardLayout title="My Schedule">
            <div className="bg-background py-6 text-foreground">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <Card className="bg-card text-card-foreground shadow-xl">
                        <CardHeader className="border-b border-border">
                            <CardTitle className="text-2xl font-bold text-primary">My Availability Schedule</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6 pt-6">
                            {/* Current slots */}
                            <div>
                                <h2 className="mb-2 text-lg font-semibold text-primary">Current Availability</h2>
                                {slots.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No availability slots yet. Add one below.</p>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        {slots.map((slot) => (
                                            <div
                                                key={slot.id}
                                                className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3 hover:bg-muted/40"
                                            >
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant="outline" className="capitalize">
                                                            {slot.day}
                                                        </Badge>
                                                        <span className="text-sm font-medium text-primary">
                                                            {slot.start_time} - {slot.end_time}
                                                        </span>
                                                    </div>
                                                    {slot.notes && <p className="text-xs text-muted-foreground">{slot.notes}</p>}
                                                </div>
                                                <Button size="icon" variant="ghost" onClick={() => removeSlot(slot.id)} title="Remove slot">
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Add new slot */}
                            <div className="rounded-lg border border-border p-4">
                                <h2 className="mb-4 text-lg font-semibold text-primary">Add New Availability</h2>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                    <div>
                                        <Label htmlFor="day">Day</Label>
                                        <Select value={addForm.data.day} onValueChange={(v) => addForm.setData('day', v)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Day" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((d) => (
                                                    <SelectItem key={d} value={d} className="capitalize">
                                                        {d}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="start_time">Start Time</Label>
                                        <Input
                                            type="time"
                                            value={addForm.data.start_time}
                                            onChange={(e) => addForm.setData('start_time', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="end_time">End Time</Label>
                                        <Input
                                            type="time"
                                            value={addForm.data.end_time}
                                            onChange={(e) => addForm.setData('end_time', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="notes">Notes</Label>
                                        <Input
                                            placeholder="Optional notes"
                                            value={addForm.data.notes}
                                            onChange={(e) => addForm.setData('notes', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <Button onClick={addSlot} variant="default">
                                        <Plus className="mr-2 h-4 w-4" /> Add Slot
                                    </Button>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    onClick={saveSlots}
                                    disabled={saveForm.processing}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    <Save className="mr-2 h-4 w-4" /> Save Schedule
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
