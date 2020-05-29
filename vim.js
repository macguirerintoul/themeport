const convert = require("color-convert"); // Convert colours between formats

module.exports = {
/**
 * Generates an object with a property for each Vim highlight parameter. For each lexical item, Vim requires a foreground colour and a background colour. In addition, there should be a colour specified for GUI versions of Vim as well as terminal versions.
 *
 * @param {string} foreground - the colour of text (to be used in *fg)
 * @param {string} background - the colour of the background (to be used in *bg)
 * @return {object} Object with properties for each Vim higlight parameter
 */
generateVimColorSet: function(foreground, background) {
	return {
		guifg: foreground,
		guibg: background,
		ctermfg: convert.hex.ansi256(foreground),
		ctermbg: convert.hex.ansi256(background),
	};
}
}