module.exports = {
	/**
	 * Format a scheme for use with the Alacritty template.
	 *
	 * @param {object} scheme - the scheme in normalized format
	 * @return {object} - the formatted scheme
	 */
	formatForAlacritty: function (scheme) {
		let formattedScheme = {
			name: scheme.name,
			colors: {
				primary: {
					background: null,
					foreground: null,
				},
				cursor: {
					cursor: null, // the colour of the cursor
					text: null, // the colour of the text inside the cursor
				},
				selection: {
					background: null,
					text: null,
				},
				normal: {
					black: null,
					red: null,
					green: null,
					yellow: null,
					blue: null,
					magenta: null,
					cyan: null,
					white: null,
				},
				bright: {
					black: null,
					red: null,
					green: null,
					yellow: null,
					blue: null,
					magenta: null,
					cyan: null,
					white: null,
				},
			},
		};
		formattedScheme.colors.primary.background = scheme.base.background;
		formattedScheme.colors.primary.foreground = scheme.base.normal;
		formattedScheme.colors.cursor.cursor = scheme.base.cursor;
		formattedScheme.colors.cursor.text = scheme.base.cursorText;
		formattedScheme.colors.selection.background =
			scheme.base.selectionBackground;
		formattedScheme.colors.selection.text = scheme.base.selectionForeground;

		formattedScheme.colors.normal.black = scheme.ansi.black;
		formattedScheme.colors.normal.red = scheme.ansi.red;
		formattedScheme.colors.normal.green = scheme.ansi.green;
		formattedScheme.colors.normal.yellow = scheme.ansi.yellow;
		formattedScheme.colors.normal.blue = scheme.ansi.blue;
		formattedScheme.colors.normal.magenta = scheme.ansi.magenta;
		formattedScheme.colors.normal.cyan = scheme.ansi.cyan;
		formattedScheme.colors.normal.white = scheme.ansi.white;

		formattedScheme.colors.bright.black = scheme.ansi.brightBlack;
		formattedScheme.colors.bright.red = scheme.ansi.brightRed;
		formattedScheme.colors.bright.green = scheme.ansi.brightGreen;
		formattedScheme.colors.bright.yellow = scheme.ansi.brightYellow;
		formattedScheme.colors.bright.blue = scheme.ansi.brightBlue;
		formattedScheme.colors.bright.magenta = scheme.ansi.brightMagenta;
		formattedScheme.colors.bright.cyan = scheme.ansi.brightCyan;
		formattedScheme.colors.bright.white = scheme.ansi.brightWhite;

		// Iterate through each property in the formattedScheme object.
		Object.entries(formattedScheme).forEach(([level1Key, level1Value]) => {
			// name, colors...
			Object.entries(level1Value).forEach(([level2Key, level2Value]) => {
				// primary, cursor, selection...
				Object.entries(level2Value).forEach(([level3Key, level3Value]) => {
					// background, foreground...
					// If the value exists, chop off the alpha from the hex string
					formattedScheme[level1Key][level2Key][level3Key] = level3Value
						? level3Value.substr(0, 7)
						: null;
				});
			});
		});

		return formattedScheme;
	},
};
