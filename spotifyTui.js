const convert = require("color-convert");

module.exports = {
  /**
	 * Format a scheme for use with the spotify-tui template.
	 *
	 * @param {object} scheme - the scheme in normalized format
	 * @return {object} - the formatted scheme
	 */
	formatForSpotifyTui: function (scheme) {
    let formattedScheme = {
      name: scheme.name,
      isDark: scheme.isDark,
			theme: {
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
      }
    }

    formattedScheme.theme.black = convert.hex.rgb(scheme.ansi.black);
		formattedScheme.theme.red = convert.hex.rgb(scheme.ansi.red);
		formattedScheme.theme.green = convert.hex.rgb(scheme.ansi.green);
		formattedScheme.theme.yellow = convert.hex.rgb(scheme.ansi.yellow);
		formattedScheme.theme.blue = convert.hex.rgb(scheme.ansi.blue);
		formattedScheme.theme.magenta = convert.hex.rgb(scheme.ansi.magenta);
		formattedScheme.theme.cyan = convert.hex.rgb(scheme.ansi.cyan);
		formattedScheme.theme.white = convert.hex.rgb(scheme.ansi.white);

		formattedScheme.theme.brightBlack = convert.hex.rgb(scheme.ansi.brightBlack);
		formattedScheme.theme.brightRed = convert.hex.rgb(scheme.ansi.brightRed);
		formattedScheme.theme.brightGreen = convert.hex.rgb(scheme.ansi.brightGreen);
		formattedScheme.theme.brightYellow = convert.hex.rgb(scheme.ansi.brightYellow);
		formattedScheme.theme.brightBlue = convert.hex.rgb(scheme.ansi.brightBlue);
		formattedScheme.theme.brightMagenta = convert.hex.rgb(scheme.ansi.brightMagenta);
		formattedScheme.theme.brightCyan = convert.hex.rgb(scheme.ansi.brightCyan);
    formattedScheme.theme.brightWhite = convert.hex.rgb(scheme.ansi.brightWhite);
    
    return formattedScheme;
  }
}