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

We do not format `%` symbols, so as not to break any go formatters like `%s, %v, %V %.2f` etc. Anything with a % should be left as is.
It is hard to know when something is a formatter or not, for instance `WHERE text LIKE '%s'` could mean that at some point you are going to
`fmt.Sprintf()` this line, or it could mean wildcard matching, so that `%s` matches `is`. 

## Release Notes

Enjoy!

### 1.0.0

First release - recently refactored to format all sql code in one subprocess call to increase speed.

### 1.0.1

Configuration values fixed
### 1.0.2

Added more configuration, prevent formatting of % signs
