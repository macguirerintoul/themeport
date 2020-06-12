const fs = require("fs"); // Node.js File System module
const jsoncParser = require("jsonc-parser"); // Parser for JSONC (JSON with Comments) used by VSCode themes
const prompts = require("prompts"); // Prompts module for user input

module.exports = {
	makeSchemeFromVSCode: async (file, schemeTemplate) => {
		let scheme = schemeTemplate;
		let inputFile = fs.readFileSync(file, "utf8"); // Read the --input file
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

		// Set the name of the color scheme. The 'name' property is optional in VSCode themes, so check for it and if it isn't present, ask the user for it.
		if (inputJson.name) {
			scheme.name = inputJson.name;
		} else {
			// Do not try to access .name on the end of this await function, it doesn't work
			let userInput = await prompts({
				type: "text",
				name: "name",
				message: "Couldn't find scheme name. Please enter one:",
			});
			scheme.name = userInput.name;
		}
		scheme.isDark = inputJson.type === "dark" ? true : false;

		// Populate the scheme template. See index.js for a description of each of these.
		scheme.vim.background = inputJson.type; // type in VSCode themes is either "light" or "dark"
		scheme.base.normal = inputJson.colors.foreground; // base colour for text
		scheme.base.background = inputJson.colors["editor.background"]; // Background colour of the editor
		scheme.base.lineNumber = inputJson.colors["editorLineNumber.foreground"]; // Colour of line numbers
		scheme.base.comment = tokenColors.comment.settings.foreground; // Colour of comments
		scheme.base.string = tokenColors.string.settings.foreground; // Colour of string
		scheme.base.number = tokenColors["constant.numeric"].settings.foreground; // Colour of numbers
		scheme.base.boolean =
			tokenColors["constant.language.boolean"].settings.foreground;
		scheme.base.cursor = inputJson.colors["editorCursor.foreground"];
		scheme.base.cursorLine = inputJson.colors["editor.lineHighlightBackground"];
		scheme.base.selectionBackground =
			inputJson.colors["editor.selectionBackground"];
		scheme.base.selectionForeground =
			inputJson.colors["editor.selectionForeground"];

		/* 
      VSCode optionally allows an "editorCursor.background" colour, which sets the colour of text inside a block cursor. If that property is set, use it here - otherwise, fall back to the editor background colour.
    */
		if (inputJson.colors["editorCursor.background"]) {
			scheme.base.cursorText = inputJson.colors["editorCursor.background"];
		} else {
			scheme.base.cursorText = inputJson.colors["editor.background"];
		}

		scheme.ansi.black = inputJson.colors["terminal.ansiBlack"];
		scheme.ansi.red = inputJson.colors["terminal.ansiRed"];
		scheme.ansi.green = inputJson.colors["terminal.ansiGreen"];
		scheme.ansi.yellow = inputJson.colors["terminal.ansiYellow"];
		scheme.ansi.blue = inputJson.colors["terminal.ansiBlue"];
		scheme.ansi.magenta = inputJson.colors["terminal.ansiMagenta"];
		scheme.ansi.cyan = inputJson.colors["terminal.ansiCyan"];
		scheme.ansi.white = inputJson.colors["terminal.ansiWhite"];
		scheme.ansi.brightBlack = inputJson.colors["terminal.ansiBrightBlack"];
		scheme.ansi.brightRed = inputJson.colors["terminal.ansiBrightRed"];
		scheme.ansi.brightGreen = inputJson.colors["terminal.ansiBrightGreen"];
		scheme.ansi.brightYellow = inputJson.colors["terminal.ansiBrightYellow"];
		scheme.ansi.brightBlue = inputJson.colors["terminal.ansiBrightBlue"];
		scheme.ansi.brightMagenta = inputJson.colors["terminal.ansiBrightMagenta"];
		scheme.ansi.brightCyan = inputJson.colors["terminal.ansiBrightCyan"];
		scheme.ansi.brightWhite = inputJson.colors["terminal.ansiBrightWhite"];

		return scheme;
	},
};
