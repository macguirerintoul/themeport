const fs = require("fs"); // Node.js File System module

module.exports = {
  parse: function(file) {
    let inputFile = fs.readFileSync(file, "utf8"); // Read the --input file
    const lines = inputFile.split(/\r?\n/);

    let colors = {

    }

    lines.forEach(line => {
      if (line.indexOf("hi")) {
        // If the line contains "hi" which means 'highlight'...
        if (line.indexOf("hi link")) {
          // If the highlight is a link...
        } else {
          // The highlight is not a link
          
        }
      }
    })
  }
}