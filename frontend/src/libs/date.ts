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

const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
]

export const getDay = (timestamp: string) => {
    let date = new Date(timestamp);
    return `${date.getDate()} ${months[date.getMonth()]}`
}

export const getFullDay = (timestamp: string) => {
    let date = new Date(timestamp);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}