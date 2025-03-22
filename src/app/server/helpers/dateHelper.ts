/**
 * Checks if `fromDate` is before or equal to `toDate`, including both date and time.
 *
 * @param {Date} fromDate - The starting date and time.
 * @param {Date} toDate - The ending date and time.
 * @returns {boolean} - Returns `true` if `fromDate` occurs before or at the same time as `toDate`, otherwise `false`.
 * @throws {Error} - Throws an error if either `fromDate` or `toDate` is not a valid Date object.
 *
 * @example
 * verifyDates(new Date('2024-02-01T12:00:00'), new Date('2024-02-01T15:00:00')); // true
 *
 * @example
 * verifyDates(new Date('2024-02-01T18:30:00'), new Date('2024-02-01T18:30:00')); // true
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
	return fromDate.getTime() <= toDate.getTime();
}

/**
 * Calculates the duration between two dates in hours and minutes.
 *
 * @param {Date} fromDate - The starting date and time.
 * @param {Date} toDate - The ending date and time.
 * @returns {Object|null} - Returns an object containing hours and minutes if fromDate is before or equal to toDate, otherwise null.
 *                         The object has the format: { hours: number, minutes: number }
 * @throws {Error} - Throws an error if either fromDate or toDate is not a valid Date object (inherited from verifyDates).
 *
 * @example
 * getDurationInHrsMins(new Date('2024-02-01T12:00:00'), new Date('2024-02-01T15:30:00'));
 * // Returns { hours: 3, minutes: 30 }
 *
 * @example
 * getDurationInHrsMins(new Date('2024-02-01T15:00:00'), new Date('2024-02-01T12:00:00'));
 * // Returns null (because fromDate is after toDate)
 */

export function getDurationInHrsMins(
	fromDate: Date,
	toDate: Date
): { hours: number; minutes: number } | null {
	if (!verifyDates(fromDate, toDate)) return null;

	const msDiff = toDate.getTime() - fromDate.getTime();
	const hours = Math.floor(msDiff / (1000 * 60 * 60));
	const minutes = Math.floor((msDiff % (1000 * 60 * 60)) / (1000 * 60));

	return { hours, minutes };
}
