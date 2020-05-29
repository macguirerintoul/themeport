const fs = require("fs"); // Node.js File System module
const handlebars = require("handlebars"); // Templating library for JavaScript
const vscode = require("./vscode.js"); // Utilities for VSCode
const vim = require("./vim.js") // Utilities for Vim

// Run the program
run("udt.json", "vscode", "vim");

async function run(input, from, to) {
	console.info("Running Themeverter...");
	try {
    console.info("Reading scheme...")
    const scheme = await readScheme(input, from)
    console.info("Scheme read.");
    console.info("Formatting scheme...");
    const formattedScheme = formatScheme(scheme, to);
    console.info("Scheme formatted.");
    generate(formattedScheme, to);
    console.info("Scheme generated.");
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
    const scheme = await vscode.makeSchemeFromVSCode(file, schemeTemplate);
    console.log("got to scheme, name is ", scheme.name)
    return scheme
  }
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
		formattedScheme.colors.Normal = vim.generateVimColorSet(
			scheme.base.normal,
			scheme.base.background
		);
		formattedScheme.colors.Comment = vim.generateVimColorSet(
			scheme.base.comment,
			scheme.base.background
		);
		formattedScheme.colors.Boolean = vim.generateVimColorSet(
			scheme.base.boolean,
			scheme.base.background
		);
		formattedScheme.colors.LineNr = vim.generateVimColorSet(
			scheme.base.lineNumber,
			scheme.base.background
		);
		formattedScheme.colors.Cursor = vim.generateVimColorSet(
			scheme.base.cursor,
			scheme.base.cursorText
		);
		formattedScheme.colors.CursorLine = vim.generateVimColorSet(
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
	fs.writeFile(formattedScheme.name + ".vim", rendered, (err) => {
		if (err) {
			return console.error(err);
		}
		console.log("The file was saved.");
	});
}
