export function formatDateTime(iso, locale = "en-US") {
    if (!iso) return "";
    return new Date(iso).toLocaleString(locale, {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatDate(iso, locale = "en-US") {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString(locale, {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

export function formatTime(iso, locale = "en-US") {
    if (!iso) return "";
    return new Date(iso).toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatDurationHours(hours) {
    const numericHours = Number(hours || 0);
    const unit = numericHours === 1 ? "hour" : "hours";
    return `${numericHours} ${unit}`;
}
