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
