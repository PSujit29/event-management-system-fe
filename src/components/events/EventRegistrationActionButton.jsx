import { useState } from "react";
import { useEffect } from "react";
import { registerForEvent, cancelRegistration } from "../../services/registration.service";
import { toast } from "sonner";

export default function EventRegistrationActionButton({ eventId, initialIsRegistered }) {
  const [isRegistered, setIsRegistered] = useState(initialIsRegistered);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsRegistered(Boolean(initialIsRegistered));
  }, [initialIsRegistered]);
  const handleClick = async () => {
    if (isPending) return; 
    setIsPending(true);
    try {
      if (isRegistered) {
        await cancelRegistration(eventId);
        setIsRegistered(false);
        toast.success("Registration cancelled successfully!");
      } else {
        await registerForEvent(eventId);
        setIsRegistered(true);
        toast.success("Registered successfully");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again." + (err?.message ? ` (${err.message})` : ""));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`px-4 py-2 rounded-lg text-white transition ${
        isRegistered ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
      } ${isPending ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {isPending ? "Processing..." : isRegistered ? "Cancel Registration" : "Register"}
    </button>
  );
}
