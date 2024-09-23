export function formatDisplayedDate(date: Date): string {
    return date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
    });
}

export function formatDisplayedFullDate(date: Date): string {
    return date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
