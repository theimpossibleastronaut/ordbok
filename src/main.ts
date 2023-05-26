import { parse, type Args } from "https://deno.land/std@0.184.0/flags/mod.ts";

const version = "0.2";
const eol: string = Deno.build.os === "windows" ? "\r\n" : "\n";
const flags: Args = parse(Deno.args, {
	string: ["input"],
	boolean: ["lowercase", "uppercase", "leetspeak", "appendcommon"],
	default: {
		lowercase: true,
		uppercase: true,
		leetspeak: true,
		appendcommon: true
	},
});

const common: string[] = [
	"!", "!!", "!!!",
	"$", "$$", "$$$",
	"1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
	"123", "1234", "12345", "123456", "1234567", "12345678", "123456789",
	"0123", "01234", "012345", "0123456", "01234567", "012345678", "0123456789",
	"@", "@@", "@@@",
	"@!", "@!!", "@!!!",
	"!@", "!!@", "!!!@",
	"#", "##", "###",
	"!#", "!!#", "!!!#",
	"#!", "#!!", "#!!!"
];

if (Deno.args.length === 0 || !flags.input) {
	printHelp();
}

if (flags.input.length === 0 || flags.input === "") {
	printHelp("Invalid input file specified");
}

let input :string = "";
try {
	input = await Deno.readTextFile(flags.input);
} catch (error) {
	if (error instanceof Deno.errors.NotFound) {
		printHelp("Input file not found");
	} else if (error instanceof Deno.errors.PermissionDenied) {
		printHelp("Permission denied");
	} else {
		printHelp(error.message);
	}
}

let lines: string[] = input.split("\n");
lines.forEach((line: string, index: number) => {
	if (line.trim() === "") {
		return;
	}

	let fixed = line.trim();
	let results: string[] = [];
	results.push(fixed);

	if (flags.lowercase) {
		results.push(fixed.toLowerCase());
	}

	if (flags.uppercase) {
		results.push(fixed.toUpperCase());
	}

	if (flags.appendcommon) {
		results.forEach((result: string, resultindex: number): void => {
			common.forEach((common: string, commonindex: number): void => {
				results.push(result + common);
			});
		});
	}

	if (flags.leetspeak) {
		results.forEach((result: string, resultindex: number): void => {
			let leet: string = result
				.replace(/a/gi, "4")
				.replace(/b/gi, "8")
				.replace(/e/gi, "3")
				.replace(/g/gi, "6")
				.replace(/i/gi, "1")
				.replace(/o/gi, "0")
				.replace(/s/gi, "5")
				.replace(/t/gi, "7")
				.replace(/z/gi, "2");

			results.push(leet);

			leet = result
				.replace(/a/gi, "@")
				.replace(/s/gi, "$")
				.replace(/i/gi, "!")
				.replace(/l/gi, "!");

			results.push(leet);

			leet = result
				.replace(/a/gi, "@")
				.replace(/s/gi, "$")
				.replace(/i/gi, "1")
				.replace(/l/gi, "1");

			results.push(leet);

			leet = result
				.replace(/b/gi, "8")
				.replace(/e/gi, "3")
				.replace(/g/gi, "6")
				.replace(/o/gi, "0")
				.replace(/t/gi, "7")
				.replace(/z/gi, "2")
				.replace(/a/gi, "@")
				.replace(/s/gi, "$")
				.replace(/i/gi, "1")
				.replace(/l/gi, "1");

			results.push(leet);

			leet = result
				.replace(/b/gi, "8")
				.replace(/e/gi, "3")
				.replace(/g/gi, "6")
				.replace(/o/gi, "0")
				.replace(/t/gi, "7")
				.replace(/z/gi, "2")
				.replace(/a/gi, "@")
				.replace(/s/gi, "$")
				.replace(/i/gi, "!")
				.replace(/l/gi, "!");

			results.push(leet);
		});
	}

	console.log(results.filter((x: string, i: number, a: string[]): boolean => a.indexOf(x) == i).join(eol));
});

function printHelp(sMessage?: string) {
	console.log("%cordbok v" + version + " %c- Nemo saltat sobrius\n", "font-weight: bold; color: blue;", "color: gray");

	if (sMessage) {
		console.log("%c" + sMessage + eol, "color: red; font-weight: bold;");
	}

	console.log("%cUsage", "color: gray");
	console.log("%c--input %c<file>\t\t%cPath to input file", "font-weight: bold; color: white;", "text-decoration: underline; color: white", "color: gray");
	console.log(eol + "%cOptional arguments", "color: gray");
	console.log("%c--lowercase=%cfalse\t%cDisable lowercasing, enabled by default", "font-weight: bold; color: white;", "text-decoration: underline; color: white", "color: gray");
	console.log("%c--uppercase=%cfalse\t%cDisable uppercasing, enabled by default", "font-weight: bold; color: white;", "text-decoration: underline; color: white", "color: gray");
	console.log("%c--leetspeak=%cfalse\t%cDisable leetspeak, enabled by default", "font-weight: bold; color: white;", "text-decoration: underline; color: white", "color: gray");
	console.log("%c--appendcommon=%cfalse\t%cDisable appending of common values, enabled by default", "font-weight: bold; color: white;", "text-decoration: underline; color: white", "color: gray");
	console.log("");

	Deno.exit(1);
}
