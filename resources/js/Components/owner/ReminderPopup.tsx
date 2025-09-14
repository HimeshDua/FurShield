import { useEffect, useState } from 'react'
import { usePage } from '@inertiajs/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/Components/ui/dialog'
import { Button } from '@/components/ui/button'

export function ReminderPopup() {
  const { petReminders = [] } = usePage().props as { petReminders?: any[] }
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (petReminders.length > 0) {
      setOpen(true)
    }
  }, [petReminders])

  if (!petReminders || petReminders.length === 0) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upcoming Pet Reminders</DialogTitle>
          <DialogDescription>
            {petReminders.length} reminder{petReminders.length > 1 && 's'} due soon.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          {petReminders.map((r) => (
            <div key={r.id} className="rounded border p-2 text-sm">
              <div className="font-semibold">{r.title}</div>
              <div className="text-slate-500">{r.description}</div>
              <div className="text-xs text-slate-400">Due: {new Date(r.due_at).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
        <Button onClick={() => setOpen(false)} className="mt-4 w-full">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  )
}
