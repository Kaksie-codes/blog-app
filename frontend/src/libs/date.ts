let months = [
    'Jan', 
    "Feb", 
    'March', 
    "April", 
    "May", 
    "June", 
    "July", 
    "Aug", 
    "Sept",
    "Oct", 
    "Nov", 
    "Dec"
]

// const days = [
//     'sunday',
//     'monday',
//     'tuesday',
//     'wednesday',
//     'thursday',
//     'friday',
//     'saturday',
// ]

export const getDay = (timestamp: string) => {
    let date = new Date(timestamp);
    return `${date.getDate()} ${months[date.getMonth()]}`
}

export const getFullDay = (timestamp: string) => {
    let date = new Date(timestamp);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export const getTime = (timestamp: string) => {
    const currentDate = new Date();
    const commentDate = new Date(timestamp);
    const timeDifference = currentDate.getTime() - commentDate.getTime();
    
    // Calculate time difference in seconds, minutes, hours, days, weeks, months, and years
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30); // Approximate
    const years = Math.floor(days / 365); // Approximate
    
    if (years > 0) {
        return years === 1 ? `${years} year ago` : `${years} years ago`;
    } else if (months > 0) {
        return months === 1 ? `${months} month ago` : `${months} months ago`;
    } else if (weeks > 0) {
        return weeks === 1 ? `${weeks} week ago` : `${weeks} weeks ago`;
    } else if (days > 0) {
        return days === 1 ? `${days} day ago` : `${days} days ago`;
    } else if (hours > 0) {
        return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
    } else if (minutes > 0) {
        return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
    } else {
        return seconds === 1 ? `${seconds} second ago` : `${seconds} seconds ago`;
    }
};
