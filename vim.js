const convert = require("color-convert"); // Convert colours between formats

module.exports = {
	/**
	 * Generates an object with a property for each Vim highlight parameter. For each lexical item, Vim requires a foreground colour and a background colour. In addition, there should be a colour specified for GUI versions of Vim as well as terminal versions.
	 *
	 * @param {string} foreground - the colour of text (to be used in *fg)
	 * @param {string} background - the colour of the background (to be used in *bg)
	 * @return {object} Object with properties for each Vim higlight parameter
	 */
	generateVimColorSet: function (foreground, background) {
		return {
			guifg: foreground,
			guibg: background,
			ctermfg: convert.hex.ansi256(foreground),
			ctermbg: convert.hex.ansi256(background),
		};
	},
	/**
	 * Format a scheme for use with the Vim template.
	 *
	 * @param {object} scheme - the scheme in normalized format
	 * @return {object} - the formatted scheme
	 */
	formatForVim: function (scheme) {
		let formattedScheme = {
			name: scheme.name,
			colors: {},
		};
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
		return formattedScheme;
	},
};
