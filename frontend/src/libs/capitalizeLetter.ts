export function capitalizeFirstLetter(name:string) {
    // Check if the string is not empty
    if (name && name.length > 0) {
        // Extract the first character, capitalize it, and concatenate with the rest of the string
        return name.charAt(0).toUpperCase()
    } else {
        // Return an empty string or handle the case when the input is empty
        return '';
    }
}