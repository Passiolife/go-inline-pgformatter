# go-inline-pgformatter README

Auto-formatter for postgres style SQL strings within backticks in go.

## Features

Open your command palette and call "Go - Inline Format pgSQL Strings" to format the current document.

## Requirements

You must have perl installed and in your path.
This package comes with a version of pg_format by `darold`. To use an updated version of this script,
please download, extract, and then point the `pgFormatPath` configuration value : https://github.com/darold/pgFormatter/archive/refs/heads/master.zip

Extract this somewhere on your machine and provide the path to `pg_format` in the directory (including the `/lib` folder) in the extension settings

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `goPgFormat.path`: the absolute path to the `pg_format` perl script on your disk (see requirements)

## Known Issues

None yet... 

## Release Notes

You better like it, Dave.

### 1.0.0

First release

