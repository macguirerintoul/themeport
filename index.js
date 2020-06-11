#!/usr/bin/env node

const fs = require("fs"); // Node.js File System module
const handlebars = require("handlebars"); // Templating library for JavaScript
const prompts = require("prompts"); // CLI input library

const vscode = require("./vscode.js"); // Utilities for VSCode
const vim = require("./vim.js"); // Utilities for Vim
const alacritty = require("./alacritty.js"); // Utilities for Alacritty
const spotifyTui = require("./spotifyTui.js"); // Utilities for spotify-tui

// Run the program
run();

async function run(inputArg, fromArg, toArg) {
	console.info("Running Themeverter...");
	let input, from, to;

	if (!fromArg) {
		// If no "from" argument is given...
		const userFrom = await prompts({
			type: 'select',
			name: 'from',
			message: 'Which app is the scheme from?',
			choices: [
				{ title: 'VSCode', value: 'vscode' },
				{ title: 'test', value: 'test' }
			],
			initial: 0
		})
		from = userFrom.from
	} else {
		from = fromArg;
	}

	if (!toArg) {
		const userTo = await prompts({
			type: 'select',
			name: 'to',
			message: 'Which app would you like to convert to?',
			choices: [
				{ title: 'Vim', value: 'vim' },
				{ title: 'Alacritty', value: 'alacritty' }
			]
		});
		to = userTo.to;
	} else {
		to = toArg;
	}

	if (!inputArg) {
		const userInput = await prompts({
			type: "text",
			name: "input",
			message: "Enter the path to the theme file:"
		});
		input = userInput.input;
	} else {
		input = inputArg;
	}

	try {
		const scheme = await readScheme(input, from);
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
 * Reads a colour scheme from a file and normalizes it.
 *
 * @param {string} file - path to the scheme file to read
 * @param {string} from - the application the scheme comes from
 */
async function readScheme(file, from) {
	// The data to be used in the Handlebars templates.
	const schemeTemplate = {
    isDark: null, // boolean - whether the theme is considered a "dark" theme
		base: {
			// Colours that are generally used across several applications
			background: null, // The prevalent background colour in the application
			normal: null, // The colour of text that does not match another lexical item (i.e. Comment, String)
			comment: null, // The colour of comments in code
			string: null, // The colour of strings in code,
			cursor: null, // Colour of the cursor line or block
			cursorText: null, // Colour of the text inside the cursor
			selectionBackground: null, // Background colour of selected text.
			selectionForeground: null, // Colour of selected text. Note about Alacritty: if a background is specified without a foreground, the colour of the text will not change which could cause readability issues.
		},
		ansi: {
			black: null,
			red: null,
			green: null,
			yellow: null,
			blue: null,
			magenta: null,
			cyan: null,
			white: null,
			brightBlack: null,
			brightRed: null,
			brightGreen: null,
			brightYellow: null,
			brightBlue: null,
			brightMagenta: null,
			brightCyan: null,
			brightWhite: null,
		},
		vim: {
			background: null, // vim 'set background=' (either light or dark)
		},
	};

	if (from === "vscode") {
		const scheme = await vscode.makeSchemeFromVSCode(file, schemeTemplate);
		return scheme;
	}
}

/**
 * Formats the scheme argument to be suitable for the 'to' application.
 * @param {object} scheme - the Themeverter scheme object to be formatted
 * @param {string} to - the application to format for
 * @return {object} the formatted colour scheme to be used in the {@link generate} function
 */
function formatScheme(scheme, to) {
	switch (to) {
		case "vim":
			return vim.formatForVim(scheme);
		case "alacritty":
      return alacritty.formatForAlacritty(scheme);
    case "spotify-tui":
      return spotifyTui.formatForSpotifyTui(scheme);
	}
}

/**
 * Writes a colour scheme to a file.
 * @param {object} formattedScheme - a formatted Themeverter scheme suitable for the 'to' application
 * @param {string} to - the application to port the colour scheme to
 */
function generate(formattedScheme, to) {
	// Read the corresponding template for the 'to' application
	const template = handlebars.compile(
		fs.readFileSync("./templates/" + to + ".hbs", "utf8")
	);
	// Render the template using Handlebars
	let rendered = template(formattedScheme);
	// Check if the 'schemes' directory exists and create it
	let outputDirectory = "./schemes";
	if (!fs.existsSync(outputDirectory)) {
		fs.mkdirSync(outputDirectory);
	}
	const fullFileName = formattedScheme.name + getFileExtension(to);
	fs.writeFile(outputDirectory + "/" + fullFileName, rendered, (error) => {
		if (error) {
			return console.error(error);
		}
		console.log(fullFileName + " was saved to the schemes directory.");
	});
}

/**
 * Return the file extension that the 'to' application uses for colour schemes.
 *
 * @param {string} to - the application the scheme is being ported to
 * @return the proper file extension
 */
function getFileExtension(to) {
	switch (to) {
		case "vim":
			return ".vim";
		case "vscode":
			return ".vscode.json";
		case "alacritty":
      return ".alacritty.yml";
    case "spotify-tui":
      return ".spotify-tui.yml";
	}
}
