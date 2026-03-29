function deriveEventStatus(startDate, startTime = "00:00", duration = 0) {
    if (!startDate) {
        return "Upcoming";
    }

    const normalizedStartTime = startTime || "00:00";
    const s = new Date(`${startDate}T${normalizedStartTime}:00`);
    if (Number.isNaN(s.getTime())) {
        return "Upcoming";
    }

    const e = new Date(s.getTime() + Number(duration || 0) * 3600000);
    const now = new Date();
    if (now < s) return "Upcoming";
    if (now < e) return "Ongoing";
    return "Completed";
}

export default deriveEventStatus;