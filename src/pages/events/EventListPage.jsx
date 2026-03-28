import { useState, useEffect } from "react";
import EventsSection from "../../components/events/EventSection";
import { getEvents } from "../../services/event.service";

export default function EventListPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getEvents();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-10 px-10 bg-gray-50 rounded-2xl">
      <EventsSection events={events} />
    </div>
  );
}
