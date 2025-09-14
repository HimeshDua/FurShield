import DashboardLayout from '@/layouts/dashboard-layout'
import { usePage } from '@inertiajs/react'
import { PageProps } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'

export default function Show() {
  const { appointment, pet, vet, recentHealthRecords } = usePage<PageProps>().props

  return (
    <DashboardLayout title="Appointment Details">
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Appointment with {vet?.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p><strong>Pet:</strong> {pet.name}</p>
            <p><strong>Date & Time:</strong> {appointment.appointment_time}</p>
            <p><strong>Status:</strong> {appointment.status}</p>
            {appointment.reason && <p><strong>Reason:</strong> {appointment.reason}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Health Records</CardTitle>
          </CardHeader>
          <CardContent>
            {recentHealthRecords.length > 0 ? (
              <ul className="list-disc space-y-2 pl-6">
                {recentHealthRecords.map((hr) => (
                  <li key={hr.id}>
                    {hr.title} – {hr.visit_date}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent health records found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
