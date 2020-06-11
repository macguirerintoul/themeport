const convert = require("color-convert");

module.exports = {
	formatForiTerm2(scheme) {
		let formattedScheme = {
			name: scheme.name
		}

		const miscColours = {
			background: scheme.base.background,
			foreground: scheme.base.normal,
			cursor: scheme.base.cursor,
			cursorText: scheme.base.cursorText,
			selection: scheme.base.selectionBackground,
			selectionText: scheme.base.selectionForeground // Not always defined
		}

		// For every colour in miscColours...
		for (let [key, value] of Object.entries(miscColours)) {
			if (!value) continue; // Bail out if the value is undefined

			console.log(key, value)
			formattedScheme[key] = {}; // Create the property so we can add sub-properties

			formattedScheme[key].red = convert.hex.rgb(value)[0] / 255; // Divide by 255 because iTerm2 values are 0 - 1
			formattedScheme[key].green = convert.hex.rgb(value)[1] / 255;
			formattedScheme[key].blue = convert.hex.rgb(value)[2] / 255;
		}

		// For every color in scheme.ansi...
		for (let [key, value] of Object.entries(scheme.ansi)) {
			if (!value) continue; // Bail out if the value is undefined

			formattedScheme[key] = {}; // Create the property so we can add sub-properties

			// Generate and add the R, G, and B channels to formattedScheme
			formattedScheme[key].red = convert.hex.rgb(value)[0] / 255;
			formattedScheme[key].green = convert.hex.rgb(value)[1] / 255;
			formattedScheme[key].blue = convert.hex.rgb(value)[2] / 255;
		};

		return formattedScheme;
	}
}
