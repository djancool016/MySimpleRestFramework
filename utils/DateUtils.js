/**
 * Convert date from dd-mm-yyyy or d-m-yyyy format to yyyy-mm-dd format.
 * If the date is already in yyyy-mm-dd format, it will not be changed.
 * @param {string} dateStr - The date string to standardize.
 * @returns {string} - The standardized date string in yyyy-mm-dd format.
 */
function convertDateFormat(dateStr) {
    // Check if the date is already in yyyy-mm-dd format
    const isoDateFormat = /^\d{4}-\d{2}-\d{2}$/
    if (isoDateFormat.test(dateStr)) {
        return dateStr; // Already in correct format
    }

    // Convert from dd-mm-yyyy or d-m-yyyy to yyyy-mm-dd
    const [day, month, year] = dateStr.split('-')
    const standardizedDay = day.padStart(2, '0')
    const standardizedMonth = month.padStart(2, '0')
    return `${year}-${standardizedMonth}-${standardizedDay}`
}

module.exports = {
    convertDateFormat
}