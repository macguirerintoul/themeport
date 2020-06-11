const convert = require("color-convert");

module.exports = {
	formatForiTerm2(scheme) {
		let formattedScheme = {
			name: scheme.name
		}

		formattedScheme.background = scheme.base.background;
		formattedScheme.foreground = scheme.base.normal;
		formattedScheme.cursor = scheme.base.cursor;
		formattedScheme.cursorText = scheme.base.cursorText;
		formattedScheme.selection = scheme.base.selectionBackground;
		formattedScheme.selectionText = scheme.base.selectionForeground;

		// For every color in scheme.ansi...
		Object.entries(formattedScheme.ansi).forEach((key, value) => {
			// Generate and add the R, G, and B channels to formattedScheme
			formattedScheme[key].red = convert.hex.rgb(value)[0]
			formattedScheme[key].green = convert.hex.rgb(value)[1]
			formattedScheme[key].blue = convert.hex.rgb(value)[2]
		});

		return formattedScheme;
	}
}
