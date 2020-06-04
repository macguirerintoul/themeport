# themeverter

> Easily port colour schemes to & from various apps.

## Introduction

Themeverter is a command-line program for converting colour schemes.

## Usage
```
$ npm i -g themeverter # first, install themeverter from npm
$ themeverter # then, run themeverter in a directory with your theme file
```

### Options
When run without any arguments, `themeverter` will runs a wizard that walks you through converting a theme. It also accepts several arguments:

| Argument | Type |  Description | Values |  Default |
| --- | --- | --- | --- | --- |
| `--from` | string | The 'source' application of the scheme | `vscode`, `vim` | none
| `--to` | string | The 'destination' application of the scheme | `vscode`, `vim`, `alacritty` | none | 
| `--name` | string | The name of the colour scheme | any | none |

## Support table

This table represents which applications Themeverter can convert from/to. The y axis represents the source  app and the y axis represents the destination app.

| From \ To  | VSCode | Vim/NeoVim | Alacritty | iTerm | Terminal.app |
| --- | --- | --- | --- | --- | --- |
|**VSCode** | N/A | ✅ | ✅ | [#4](https://github.com/macguirerintoul/themeverter/issues/4) | [#5](https://github.com/macguirerintoul/themeverter/issues/5) |
| **Vim/NeoVim** | [#6](https://github.com/macguirerintoul/themeverter/issues/6) | N/A |
| **Alacritty** | [#7](https://github.com/macguirerintoul/themeverter/issues/7) | 
| **iTerm** | [#8](https://github.com/macguirerintoul/themeverter/issues/8) | 
| **Terminal.app** | [#9](https://github.com/macguirerintoul/themeverter/issues/9) | 
| **spotify-tui** | 