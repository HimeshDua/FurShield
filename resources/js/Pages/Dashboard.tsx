// // resources/js/Pages/Vet/Dashboard.jsx
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

// import DashboardLayout from '@/layouts/dashboard-layout';
// import { PageProps } from '@/types';
// import { Link, usePage } from '@inertiajs/react';
// import { Calendar, Clock, Users } from 'lucide-react';

// export default function VetDashboard() {
//     const {  upcomingAppointments = [], availability = [] } = usePage<PageProps>().props;

//     return (
//         <DashboardLayout title="Vet Dashboard">
//             <div className="bg-background py-6 text-foreground">
//                 <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
//                     <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//                         <Card className="bg-card text-card-foreground shadow-lg">
//                             <CardHeader className="flex items-center justify-between border-b border-border p-4">
//                                 <div className="flex items-center space-x-3">
//                                     <Calendar className="h-5 w-5 text-primary" />
//                                     <CardTitle className="text-lg">Availability</CardTitle>
//                                 </div>
//                                 <Link href={route('vet.schedule.index')}>
//                                     <Button size="sm" variant="outline">
//                                         Manage
//                                     </Button>
//                                 </Link>
//                             </CardHeader>
//                             <CardContent className="p-4">
//                                 {Array.isArray(availability) && availability.length ? (
//                                     <div className="space-y-3">
//                                         {availability.slice(0, 5).map((slot) => (
//                                             <div key={slot.id} className="flex items-center justify-between rounded-md border border-border p-2">
//                                                 <div>
//                                                     <div className="text-sm font-medium capitalize">{slot.day}</div>
//                                                     <div className="text-xs text-muted-foreground">
//                                                         <Clock className="-mt-1 mr-2 inline-block" /> {slot.start_time} — {slot.end_time}{' '}
//                                                         {slot.notes ? `• ${slot.notes}` : ''}
//                                                     </div>
//                                                 </div>
//                                                 <Badge variant="outline">
//                                                     {/* small visual */}
//                                                     {slot.start_time}
//                                                 </Badge>
//                                             </div>
//                                         ))}
//                                         {availability.length > 5 && (
//                                             <div className="text-sm text-muted-foreground">+{availability.length - 5} more slots</div>
//                                         )}
//                                     </div>
//                                 ) : (
//                                     <div className="text-sm text-muted-foreground">No availability configured. Click Manage to add times.</div>
//                                 )}
//                             </CardContent>
//                         </Card>

//                         <Card className="bg-card text-card-foreground shadow-lg lg:col-span-2">
//                             <CardHeader className="flex items-center justify-between border-b border-border p-4">
//                                 <div className="flex items-center space-x-3">
//                                     <Users className="h-5 w-5 text-primary" />
//                                     <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
//                                 </div>
//                                 <Link href={route('vets.index')}>
//                                     <Button size="sm">View all</Button>
//                                 </Link>
//                             </CardHeader>
//                             <CardContent className="p-4">
//                                 {upcomingAppointments.length === 0 ? (
//                                     <div className="py-6 text-sm text-muted-foreground">No upcoming appointments.</div>
//                                 ) : (
//                                     <div className="grid gap-3">
//                                         {upcomingAppointments.map((a) => (
//                                             <div key={a.id} className="flex items-center justify-between rounded-md border border-border p-3">
//                                                 <div>
//                                                     <div className="font-medium">
//                                                         <Link href={route('vet.appointments.show', a.id)} className="hover:underline">
//                                                             {a.pet?.name || 'Unknown pet'}
//                                                         </Link>
//                                                     </div>
//                                                     <div className="text-xs text-muted-foreground">
//                                                         {a.owner?.name || 'Owner'} • {new Date(a.appointment_time).toLocaleString()}
//                                                     </div>
//                                                 </div>

//                                                 <div className="flex items-center space-x-2">
//                                                     <Badge>{a.status}</Badge>
//                                                     <Link href={route('vet.appointments.show', a.id)}>
//                                                         <Button size="sm" variant="ghost">
//                                                             Open
//                                                         </Button>
//                                                     </Link>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </div>
//             </div>
//         </DashboardLayout>
//     );
// }
