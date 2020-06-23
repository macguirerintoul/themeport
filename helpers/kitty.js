const utilities = require("./utilities");

module.exports = {
	formatForKitty: function(scheme) {
		let formattedScheme = {
			name: scheme.name,
			colours: {}
		};

		formattedScheme.colours.foreground = scheme.base.normal;
		formattedScheme.colours.background = scheme.base.background;
		formattedScheme.colours.selection_foreground = scheme.base.selectionForeground;
		formattedScheme.colours.selection_background = scheme.base.selectionBackground;

		utilities.ansiMapArray.forEach((element, index) => {
			formattedScheme.colours["color" + index] = scheme.ansi[element];
		});

		return formattedScheme;
	}
}
