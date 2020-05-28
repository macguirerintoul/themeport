const fs = require("fs"); // Node.js File System module
const handlebars = require("handlebars"); // Templating library for JavaScript
const convert = require("color-convert"); // Convert colours between formats
const vscode = require("./vscode.js"); // Prompts module for user input

// Run the program
run("udt.json", "vscode", "vim");

async function run(input, from, to) {
	console.log("Running Themeverter...");
	try {
    const scheme = await readScheme(input, from)
    console.log("Scheme read.");
    console.log("Formatting scheme...");
    const formattedScheme = formatScheme(scheme, to);
    console.log("Scheme formatted.");
    generate(formattedScheme, to);
    console.log("Scheme generated.");
	} catch (error) {
		console.error(error);
		return;
	}

}

/**
 * Reads a colour scheme from a file.
 * @param {string} file - path to the scheme file to read
 * @param {string} from - the application the scheme comes from
 */
async function readScheme(file, from) {
	// The data to be used in the Handlebars templates.
	const schemeTemplate = {
		base: {
			// Colours that are generally used across several applications
			background: null, // The prevalent background colour in the application
			normal: null, // The colour of text that does not match another lexical item (i.e. Comment, String)
			comment: null, // The colour of comments in code
			string: null, // The colour of strings in code
		},
		vim: {
			background: null, // vim 'set background=' (either light or dark)
		},
	};

  if (from === "vscode") {
    return vscode.makeSchemeFromVSCode(file, schemeTemplate);
  }
}

/**
 * Generates an object with a property for each Vim highlight parameter. For each lexical item, Vim requires a foreground colour and a background colour. In addition, there should be a colour specified for GUI versions of Vim as well as terminal versions.
 *
 * @param {string} foreground - the colour of text (to be used in *fg)
 * @param {string} background - the colour of the background (to be used in *bg)
 * @return {object} Object with properties for each Vim higlight parameter
 */
function generateVimColorSet(foreground, background) {
	return {
		guifg: foreground,
		guibg: background,
		ctermfg: convert.hex.ansi256(foreground),
		ctermbg: convert.hex.ansi256(background),
	};
}
/**
 * Formats the scheme argument to be suitable for the 'to' application.
 * @param {object} scheme - the Themeverter scheme object to be formatted
 * @param {string} to - the application to format for
 * @return {object} the formatted colour scheme to be used in the {@link generate} function
 */
function formatScheme(scheme, to) {
	let formattedScheme = {
		name: scheme.name,
		colors: {},
	};
	if (to === "vim") {
		formattedScheme.colors.Normal = generateVimColorSet(
			scheme.base.normal,
			scheme.base.background
		);
		formattedScheme.colors.Comment = generateVimColorSet(
			scheme.base.comment,
			scheme.base.background
		);
		formattedScheme.colors.Boolean = generateVimColorSet(
			scheme.base.boolean,
			scheme.base.background
		);
		formattedScheme.colors.LineNr = generateVimColorSet(
			scheme.base.lineNumber,
			scheme.base.background
		);
		formattedScheme.colors.Cursor = generateVimColorSet(
			scheme.base.cursor,
			scheme.base.cursorText
		);
		formattedScheme.colors.CursorLine = generateVimColorSet(
			null,
			scheme.base.cursorLine
		);
	}
	return formattedScheme;
}

/**
 * Writes a colour scheme to a file.
 * @param {object} formattedScheme - a formatted Themeverter scheme suitable for the 'to' application
 * @param {string} to - the application to port the colour scheme to
 */
function generate(formattedScheme, to) {
	const template = handlebars.compile(
		fs.readFileSync("./templates/" + to + ".hbs", "utf8")
	);
	let rendered = template(formattedScheme);
	fs.writeFile(scheme.name + ".vim", rendered, (err) => {
		if (err) {
			return console.error(err);
		}
		console.log("The file was saved.");
	});
}
