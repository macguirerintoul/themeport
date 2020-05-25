
// when themeverter is run without any arguments, invoke the wizard which will ask for the input file, the source and the destination application.
// themeverter accepts a --file argument that specifies the input file
// themeverter will attempt to determine the source program automatically (e.g. .json file = vscode (but better)). if the 'from' app can't be determined automatically, bail out (?) and ask for a --from argument
// themeverter accepts a --from  argument that specifies which application the colour scheme is coming from (e.g. "vscode")
// it also accepts a --to argument that specifies which application the colour scheme should be ported to (e.g. "vim")
// themeverter will also create an intermediate YAML file that specifies the colour scheme in a format that can be converted to any other format (i.e. a blueprint for all apps)
const fs = require('fs');
const jsoncParser = require("jsonc-parser")
const handlebars = require("handlebars")
const convert = require("color-convert")

let from = "vscode"
let to = "vim"

// Define an object that will store the data to be used in the handlebars templates.
let scheme = {
  base: {
    background: null,
    normal: null,
    comment: null,
    string: null
  },
  vim: {
    background: null // vim set background (either light or dark)
  }
}

if (from === "vscode") {
  let inputFile = fs.readFileSync('nol.json', 'utf8') // Read the --input file 
  let inputJson = jsoncParser.parse(inputFile) // Parse the --input file as a JS object


  // Turn VSCode token colours into a format that's easier to work with
  let tokenColors = inputJson.tokenColors.reduce((result, item, index, array) => {
    let scope = ''
    if (typeof item.scope === 'string') {
      scope = item.scope
    } else if (item.scope instanceof Array) {
      scope = item.scope.join(", ")
    }
    result[scope] = item;
    return result;
  }, {})
  
  /* 
    In VSCode, several scopes can be added to a Token. Here, the scopes were assigned to the keys in this object as a string. Now, we're splitting the string into an array and adding each individual scope to the object so they can be referenced directly.
  */
  // For each key in the tokenColors object...
  for (let key in tokenColors) {
    // If the key contains a ", " (i.e. it's a joined array)...
    if (key.indexOf(", ") > -1) {
      // Split the key at ", " and for each element...
      key.split(", ").forEach(item => {
        // Set the element property on the tokenColors object to the value of the current key in tokenColors.
        tokenColors[item] = tokenColors[key]
      })
    }
  }

  scheme.name = inputJson.name
  scheme.vim.background = inputJson.type // type in VSCode themes is either "light" or "dark"
  scheme.base.normal = inputJson.colors.foreground
  scheme.base.background = inputJson.colors["editor.background"]
  scheme.base.lineNumber = inputJson.colors["editorLineNumber.foreground"]
  scheme.base.comment = tokenColors.comment.settings.foreground
  scheme.base.string = tokenColors.string.settings.foreground
  scheme.base.number = tokenColors["constant.numeric"].settings.foreground
  scheme.base.boolean = tokenColors["constant.language.boolean"].settings.foreground
  scheme.base.cursor = inputJson.colors["editorCursor.foreground"]

  /* 
    VSCode optionally allows an "editorCursor.background" colour, which sets the colour of text inside a block cursor. If that property is set, use it here - otherwise, fall back to the editor background colour.
  */
  if (inputJson.colors["editorCursor.background"]) {
    scheme.base.cursorText = inputJson.colors["editorCursor.background"]
  } else {
    scheme.base.cursorText = inputJson.colors["editor.background"]
  }
}

if (to === "vim") {
  // render the handlebars template using the scheme object
  // first, convert the scheme to a vim-formatted object (e.g. guifg, guibg, etc.)
  let formattedScheme = formatScheme(scheme, to)
  render(formattedScheme, to)
}

function generateVimColorSet(foreground, background) {
  return {
    guifg: foreground,
    guibg: background,
    ctermfg: convert.hex.ansi256(foreground),
    ctermbg: convert.hex.ansi256(background),
  }
}

function formatScheme(scheme, to) {
  let formattedScheme = {
    name: scheme.name,
    colors: {
    }
  }
  if (to === "vim") {
    formattedScheme.colors.Normal = generateVimColorSet(scheme.base.normal, scheme.base.background)
    formattedScheme.colors.Comment = generateVimColorSet(scheme.base.comment, scheme.base.background)
    formattedScheme.colors.Boolean = generateVimColorSet(scheme.base.boolean, scheme.base.background)
    formattedScheme.colors.LineNr = generateVimColorSet(scheme.base.lineNumber, scheme.base.background)
    formattedScheme.colors.Cursor = generateVimColorSet(scheme.base.cursor, scheme.base.cursorText)
  }
  return formattedScheme
}

function render(formattedScheme, to) {
  const template = handlebars.compile(fs.readFileSync('./templates/' + to + '.hbs', 'utf8'));
  let rendered = template(formattedScheme)
  fs.writeFile(scheme.name + ".vim", rendered, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log("The file was saved.");
  })
}