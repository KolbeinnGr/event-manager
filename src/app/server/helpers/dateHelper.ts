/**
 * Checks if `fromDate` is strictly before `toDate`, including both date and time.
 *
 * @param {Date} fromDate - The starting date and time.
 * @param {Date} toDate - The ending date and time.
 * @returns {boolean} - Returns `true` if `fromDate` occurs before `toDate`, otherwise `false`.
 * @throws {Error} - Throws an error if either `fromDate` or `toDate` is not a valid Date object.
 *
 * @example
 * verifyDates(new Date('2024-02-01T12:00:00'), new Date('2024-02-01T15:00:00')); // true
 *
 * @example
 * verifyDates(new Date('2024-02-01T18:30:00'), new Date('2024-02-01T18:30:00')); // false
 *
 * @example
 * verifyDates(new Date('2024-02-02T00:00:00'), new Date('2024-02-01T23:59:59')); // false
 */
export function verifyDates(fromDate: Date, toDate: Date): boolean {
	if (!(fromDate instanceof Date) || isNaN(fromDate.getTime())) {
		throw new Error("Invalid fromDate provided");
	}
	if (!(toDate instanceof Date) || isNaN(toDate.getTime())) {
		throw new Error("Invalid toDate provided");
	}
	return fromDate.getTime() < toDate.getTime();
}
