# go-inline-pgformatter README

Auto-formatter for postgres style SQL strings within backticks in go.
Just run `Go - Inline Format pgSQL Strings` from the command palette!

## Features

Open your command palette and call `Go - Inline Format pgSQL Strings` to format the current document.
All strings between backticks will be looked at, and if it appears to be SQL it will be formatted!

## Requirements

You must have perl installed and in your path.
This package comes with a version of pg_format by `darold`. To use an updated or custom version of pg_format, please point
the `pgFormatPath` configuration value to the `pg_format` in the directory on your disk. Make sure the `lib` folder is a sibling!

## Extension Settings

This extension contributes the following settings:

* `goPgFormat.pgFormatPath`: the absolute path to the `pg_format` perl script on your disk. If blank, the built-in is used.
* `goPgFormat.matchSpacing`: when false, the sql strings are fully left justified. If true, they match the indentation level of the start-line.
* `goPgFormat.addTabs`: when above 0, and matchSpacing is on, this adds additional tabs after matching the indentation of the first lines first character.
* `goPgFormat.keywordCase`: changes the SQL keywords to a specific case

## Known Issues

None yet... 

## Release Notes

Enjoy!

### 1.0.0

First release - recently refactored to format all sql code in one subprocess call to increase speed.

