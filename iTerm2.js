const convert = require("color-convert");

module.exports = {
	formatForiTerm2(scheme) {
		let formattedScheme = {
			name: scheme.name
		}

		const miscColours = {
			"background": scheme.base.background,
			"foreground": scheme.base.normal,
			"cursor": scheme.base.cursor,
			"cursorText": scheme.base.cursorText,
			"selection": scheme.base.selectionBackground,
			"selectionText": scheme.base.selectionForeground
		}

		// For every colour in miscColours...
		Object.entries(miscColours).forEach((key, value) => {
			console.log(key, value);
			formattedScheme[key] = {}; // Create the property so we can add sub-properties

			formattedScheme[key].red = convert.hex.rgb(value)[0];
			formattedScheme[key].green = convert.hex.rgb(value)[1];
			formattedScheme[key].blue = convert.hex.rgb(value)[2];
		})

		// For every color in scheme.ansi...
		Object.entries(scheme.ansi).forEach((key, value) => {
			formattedScheme[key] = {}; // Create the property so we can add sub-properties

			// Generate and add the R, G, and B channels to formattedScheme
			formattedScheme[key].red = convert.hex.rgb(value)[0]
			formattedScheme[key].green = convert.hex.rgb(value)[1]
			formattedScheme[key].blue = convert.hex.rgb(value)[2]
		});
		console.log(formattedScheme);

		return formattedScheme;
	}
}
