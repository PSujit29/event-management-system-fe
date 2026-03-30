import { useEffect, useState } from 'react';
import { getEvents } from '../../services/event.service';
import DashboardContent from '../../components/dashboard/DashboardContent';

export default function OrganizerDashboardPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initDashboard() {
      try {
        // Fetches normalized data (using mock or real API based on your toggle)
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    }
    initDashboard();
  }, []);

  if (loading) return <div className="p-8 animate-pulse text-gray-500">Loading Command Center...</div>;

  // Extract all sub-events from the event objects for the Spotlight section
  const allSubEvents = events.flatMap(e => e.subEvents || []);

  return <DashboardContent events={events} subEvents={allSubEvents} />;
}
