const readline = require("readline");

const getCallerInfo = () => {
	const originalPrepareStackTrace = Error.prepareStackTrace;

	Error.prepareStackTrace = (_, stack) => stack;
	const stack = new Error().stack;

	Error.prepareStackTrace = originalPrepareStackTrace;

	const caller = stack[2];

	const lineNumber = caller.getLineNumber() || "Unknown line";
	const functionName = caller.getFunctionName() || "Unknown function";

	return `Function: ${functionName},  Line: ${lineNumber}`;
};

const Colors = {
	Text: {
		Black: 30,
		Red: 31,
		Green: 32,
		Yellow: 33,
		Blue: 34,
		Magenta: 35,
		Cyan: 36,
		White: 37,
		Default: 39,
	},
	Background: {
		Black: 40,
		Red: 41,
		Green: 42,
		Yellow: 43,
		Blue: 44,
		Magenta: 45,
		Cyan: 46,
		White: 47,
		Default: 49,
	},
};

const colorPrint = (
	message,
	fontColor = Colors.Text.Cyan,
	backgroundColor = Colors.Background.Default
) => {
	const isDebugging = process.env.DEBUGGING == "1"; // if we are not debugging we don't output anything.
	if (!isDebugging) {
		return;
	}

	const fontColorCode = fontColor ? `\x1b[${fontColor}m` : "";
	const backgroundColorCode = backgroundColor
		? `\x1b[${backgroundColor}m`
		: "";
	const resetCode = "\x1b[0m"; // Reset to default colors

	console.log(`${fontColorCode}${backgroundColorCode}${message}${resetCode}`);
};

// const pauseUntilKeyPress = async (message = "") => {
// 	const isDebugging = process.env.DEBUGGING == "1"; // if we are not debugging we don't output anything.
// 	if (!isDebugging) {
// 		return;
// 	}
// 	const callerInfo = getCallerInfo();
// 	const rl = readline.createInterface({
// 		input: process.stdin,
// 		output: process.stdout,
// 	});

// 	if (message) {
// 		colorPrint(
// 			`${message} - Paused at (${callerInfo})`,
// 			Colors.Text.Magenta
// 		);
// 	} else {
// 		colorPrint(`Paused at (${callerInfo})`, Colors.Text.Magenta);
// 	}

// 	colorPrint("Press any key to continue...", Colors.Text.Cyan);

// 	return new Promise((resolve) => {
// 		if (process.stdin.isTTY) {
// 			process.stdin.setRawMode(true);
// 			process.stdin.resume();
// 			process.stdin.once("data", () => {
// 				process.stdin.setRawMode(false);
// 				rl.close();
// 				resolve();
// 			});
// 		} else {
// 			// Fallback for non-TTY environments
// 			rl.close();
// 			resolve();
// 		}
// 	});
// };

// (async () => {
// 	await pauseUntilKeyPress();
// 	colorPrint("Continuing execution...", Colors.Text.Cyan);
// })();

module.exports = {
	// pauseUntilKeyPress,
	colorPrint,
	Colors,
};
