// when themeverter is run without any arguments, invoke the wizard which will ask for the input file, the source and the destination application.
// themeverter accepts a --file argument that specifies the input file
// themeverter will attempt to determine the source program automatically (e.g. .json file = vscode (but better)). if the 'from' app can't be determined automatically, bail out (?) and ask for a --from argument
// themeverter accepts a --from  argument that specifies which application the colour scheme is coming from (e.g. "vscode")
// it also accepts a --to argument that specifies which application the colour scheme should be ported to (e.g. "vim")
// themeverter will also create an intermediate YAML file that specifies the colour scheme in a format that can be converted to any other format (i.e. a blueprint for all apps)
const fs = require("fs"); // Node.js File System module
const jsoncParser = require("jsonc-parser"); // Parser for JSONC (JSON with Comments) used by VSCode themes
const handlebars = require("handlebars"); // Templating library for JavaScript
const convert = require("color-convert"); // Convert colours between formats

let from = "vscode"; // The application the colour scheme is being ported from
let to = "vim"; // The application the colour scheme is being ported to

// The data to be used in the Handlebars templates.
let scheme = {
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
	let inputFile = fs.readFileSync("nol.json", "utf8"); // Read the --input file
	let inputJson = jsoncParser.parse(inputFile); // Parse the --input file as a JS object

	/* Turn VSCode token colours into a format that's easier to work with. */
	let tokenColors = inputJson.tokenColors.reduce((result, item) => {
		let scope = ""; // The scopes of the token (String if one scope, Array if several scopes)
		if (typeof item.scope === "string") {
			// If the scope is just a string, use that
			scope = item.scope;
		} else if (item.scope instanceof Array) {
			// If the scope is an Array of scopes, turn that into a string to be dealt with later
			scope = item.scope.join(", ");
		}
		result[scope] = item; // Create a property on the tokenColors object where the key is the scope and the value is the entire token object.
		return result;
	}, {});

	/* 
    In VSCode, several scopes can be added to a Token. Here, the scopes were assigned to the keys in this object as a string. Now, we're splitting the string into an array and adding each individual scope to the object so they can be referenced directly.
  */
	// For each key in the tokenColors object...
	for (let key in tokenColors) {
		// If the key contains a ", " (i.e. it's a joined array)...
		if (key.indexOf(", ") > -1) {
			// Split the key at ", " and for each element...
			key.split(", ").forEach((item) => {
				// Set the element property on the tokenColors object to the value of the current key in tokenColors.
				tokenColors[item] = tokenColors[key];
			});
		}
	}

	scheme.name = inputJson.name; // Set the name of the color scheme
	scheme.vim.background = inputJson.type; // type in VSCode themes is either "light" or "dark"
	scheme.base.normal = inputJson.colors.foreground; // base colour for text
	scheme.base.background = inputJson.colors["editor.background"]; // Background colour of the editor
	scheme.base.lineNumber = inputJson.colors["editorLineNumber.foreground"]; // Colour of line numbers
	scheme.base.comment = tokenColors.comment.settings.foreground; // Colour of comments
	scheme.base.string = tokenColors.string.settings.foreground; // Colour of string
	scheme.base.number = tokenColors["constant.numeric"].settings.foreground; // Colour of numbers
	scheme.base.boolean =
		tokenColors["constant.language.boolean"].settings.foreground; // Colour of true/false
	scheme.base.cursor = inputJson.colors["editorCursor.foreground"]; // Colour of the cursor line or block
	scheme.base.cursorLine = inputJson.colors["editor.lineHighlightBackground"]; // Background colour of the line on which the cursor is in the editor

	/* 
    VSCode optionally allows an "editorCursor.background" colour, which sets the colour of text inside a block cursor. If that property is set, use it here - otherwise, fall back to the editor background colour.
  */
	if (inputJson.colors["editorCursor.background"]) {
		scheme.base.cursorText = inputJson.colors["editorCursor.background"];
	} else {
		scheme.base.cursorText = inputJson.colors["editor.background"];
	}
}

/* Before generating the new color scheme(s), we need to format the scheme object in a way that makes sense for the template. */
const formattedScheme = formatScheme(scheme, to);

/* Once the scheme object is formatted, we can generate the ported color scheme. */
generate(formattedScheme, to);

/**
 * For each lexical item, Vim requires a foreground colour and a background colour. In addition, there should be a colour specified for GUI versions of Vim as well as terminal versions.
 *
 * @param {string} foreground
 * @param {string} background
 */
function generateVimColorSet(foreground, background) {
	return {
		guifg: foreground,
		guibg: background,
		ctermfg: convert.hex.ansi256(foreground),
		ctermbg: convert.hex.ansi256(background),
	};
}

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
