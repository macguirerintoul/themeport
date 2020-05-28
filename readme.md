// when themeverter is run without any arguments, invoke the wizard which will ask for the input file, the source and the destination application.
// themeverter accepts a --file argument that specifies the input file
// themeverter will attempt to determine the source program automatically (e.g. .json file = vscode (but better)). if the 'from' app can't be determined automatically, bail out (?) and ask for a --from argument
// themeverter accepts a --from  argument that specifies which application the colour scheme is coming from (e.g. "vscode")
// it also accepts a --to argument that specifies which application the colour scheme should be ported to (e.g. "vim")
// themeverter will also create an intermediate YAML file that specifies the colour scheme in a format that can be converted to any other format (i.e. a blueprint for all apps)