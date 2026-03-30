import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventAttendees, updateAttendeeAttendanceStatus } from '../../services/registration.service';
import { getEventById } from '../../services/event.service';
import deriveEventStatus from '../../utils/status.utils';

const AttendeesPage = () => {
  const { eventId } = useParams();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventStatus, setEventStatus] = useState('Upcoming');
  const [actionStudentId, setActionStudentId] = useState(null);
  const [error, setError] = useState(null);

  const handleAttendanceAction = async (studentId, nextStatus) => {
    if (eventStatus !== 'Ongoing') return;

    try {
      setActionStudentId(studentId);
      const updatedAttendee = await updateAttendeeAttendanceStatus(eventId, studentId, nextStatus);

      setAttendees((prev) =>
        prev.map((person) =>
          String(person.studentId) === String(studentId)
            ? { ...person, attendanceStatus: updatedAttendee.attendanceStatus }
            : person,
        ),
      );
    } catch (err) {
      console.error('Failed to update attendance status:', err);
    } finally {
      setActionStudentId(null);
    }
  };

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const [attendeeData, eventData] = await Promise.all([
          getEventAttendees(eventId),
          getEventById(eventId),
        ]);

        setAttendees(attendeeData);
        setEventStatus(deriveEventStatus(eventData?.startDate, eventData?.startTime, eventData?.duration));
        setError(null);
      } catch (error) {
        console.error("Failed to fetch attendees:", error);
        setError('Failed to load attendees');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendees();
  }, [eventId]);
  console.log("Fetched attendees:", attendees);

  if (loading) return <div className="p-8 text-center">Loading attendees...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Event Attendees</h1>
      
      {attendees.length === 0 ? (
        <div className="bg-gray-100 p-10 text-center rounded-lg border-2 border-dashed">
          <p className="text-gray-500">No attendees have registered for this event yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Student ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Roll Number</th>
                <th className="px-6 py-3">Reg. Date</th>
                <th className="px-6 py-3">Attendance Check</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((person) => (
                <tr key={person.registrationId} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{person.studentId}</td>
                  <td className="px-6 py-4">{person.name || 'N/A'}</td>
                  <td className="px-6 py-4">{person.email || 'N/A'}</td>
                  <td className="px-6 py-4">{person.rollNumber || person.roll || 'N/A'}</td>
                  <td className="px-6 py-4">
                    {person.registrationDate ? new Date(person.registrationDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {eventStatus === 'Ongoing' ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAttendanceAction(person.studentId, 'Present')}
                          disabled={actionStudentId === person.studentId}
                          className="rounded bg-green-600 px-2 py-1 text-xs font-semibold text-white disabled:opacity-50"
                        >
                          Tick
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAttendanceAction(person.studentId, 'Absent')}
                          disabled={actionStudentId === person.studentId}
                          className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white disabled:opacity-50"
                        >
                          Cross
                        </button>
                      </div>
                    ) : eventStatus === 'Completed' ? (
                      <span className="text-xs font-medium text-slate-500">Locked: {person.attendanceStatus}</span>
                    ) : (
                      <span className="text-xs font-medium text-amber-600">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendeesPage;
