import { useEffect, useState } from 'react';
import { getMyEvents } from '../../services/registration.service';
import { getEvents } from '../../services/event.service';
import StudentDashboardContent from '../../components/dashboard/StudentDashboardContent';
import { toast } from 'sonner';

export default function StudentDashboardPage() {
  const [data, setData] = useState({ registrations: [], allEvents: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    async function loadStudentData() {
      setLoading(true);
      setError(null);
      try {
        const [myRegs, events] = await Promise.all([getMyEvents(), getEvents()]);
        setData({ registrations: myRegs, allEvents: events });
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || 'Failed to load student dashboard';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
    loadStudentData();
  }, [reloadKey]);

  if (loading) return <div className="p-10 animate-pulse text-gray-400">Loading your schedule...</div>;

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-medium">Failed to load student dashboard</p>
          <p className="mt-1 text-sm">{error}</p>
          <button
            type="button"
            onClick={() => setReloadKey((prev) => prev + 1)}
            className="mt-3 rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <StudentDashboardContent registrations={data.registrations} allEvents={data.allEvents} />;
}
