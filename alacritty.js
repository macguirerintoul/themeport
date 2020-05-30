module.exports = {
   /**
   * Format a scheme for use with the Alacritty template.
   * 
   * @param {object} scheme - the scheme in normalized format
   * @return {object} - the formatted scheme
   */
  formatForAlacritty: function(scheme) {
    let formattedScheme = {
      name: scheme.name,
      colors: {
        primary: {
          background: null,
          foreground: null
        },
        cursor: {
          cursor: null, // the colour of the cursor
          text: null // the colour of the text inside the cursor
        },
        selection: {
          background: null,
          text: null,
        }
      },
    };
    formattedScheme.colors.primary.background = scheme.base.background
    formattedScheme.colors.primary.foreground = scheme.base.normal
    formattedScheme.colors.cursor.cursor = scheme.base.cursor
    formattedScheme.colors.cursor.text = scheme.base.cursorText
    formattedScheme.colors.selection.background = scheme.base.selectionBackground
    formattedScheme.colors.selection.text = scheme.base.selectionForeground

    // TODO does alacritty support hex with alpha? if not, make sure to format colors as 6-character hex codes
    // according to wiki, it does not but maybe test it out
    // https://github.com/alacritty/alacritty/wiki/Color-schemes#color-schemes
    return formattedScheme
  }
}