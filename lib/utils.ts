// Format time in 24 hour format (e.g. 12:00, 23:00, 00:00)
export function formatTime(time: Date): string {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day < 10 ? "0" + day : day} ${month} ${year}`;
}