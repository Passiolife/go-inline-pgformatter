// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { execSync } from 'child_process';
import * as vscode from 'vscode';
import { promises as fs } from 'fs';

const keywords = ["update", "select", "insert", "into", "delete", "from", "where"];
const sqlSplitMarker = "\n-- go-inline-pgformatter-splitmark\n";
const builtinPgFormat = "/.vscode/extensions/passioinc.go-inline-pgformatter-";

const keywordCaseOptions = [
	"leaves all pgSql keywords in the casing they are currently in",
	"changes allpgSql keywords to lowercase",
	"changes allpgSql keywords to UPPERCASE",
	"changes allpgSql keywords to Capitalized"
];

// see if path exists on disk
async function exists (path : string) {  
	try {
	  await fs.access(path);
	  return true;
	} catch {
	  return false;
	}
  }

// check if text block is SQL
function likelySql(s: string) {
	const matches = keywords.filter(element => {
		return (s.toLowerCase()).includes(element);
	});
	return matches.length >= 2;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "go-inline-pgformatter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('go-inline-pgformatter.formatAllSql', () => {

		// path settings
		const homedir = require('os').homedir();
		const config = vscode.workspace.getConfiguration("goPgFormat");
		const pgFormatPathUser = config.get("pgFormatPath");

		// get meta values like the version
		const packageMeta = require('../package.json');

		// expand our built-in pg_format path, or grab the users and make them str
		var pgFormatPath = "";
		if (`${pgFormatPathUser}` === "") {
			pgFormatPath = `${homedir}${builtinPgFormat}${packageMeta.version}/pg_format`;
		}
		else {
			pgFormatPath = `${pgFormatPathUser}`;
		}

		// async promise to check if we have pg format
		var pgExists = (async () => await exists(`${pgFormatPath}`))();

		pgExists.then(function (response) {
			// if no pg_format path, we cant work!
			if (!response) {
				vscode.window.showErrorMessage(`Path to pg_format does not exist:\n${pgFormatPath}`);	
				return new Promise(function(){return true;});
			}
			// set up
			const { activeTextEditor } = vscode.window;
	
			// only run on golang
			if (activeTextEditor && activeTextEditor.document.languageId === 'go') {
				
				// create an edit to store in
				const edit = new vscode.WorkspaceEdit();

				// grab some preference values
				const matchSpacing = config.get("matchSpacing");		
				const keywordCase = config.get("keywordCase");		
				const addTabsValue = config.get("addTabs");
				var addTabs = 0;
				if (typeof addTabsValue === 'number') {
					addTabs = addTabsValue;	
				}

				// get the active document
				const { document } = activeTextEditor;
	
				// loop vars
				var startLine = null;
				var endLine = null;	
	
				// info message counter
				var sqlStringsUpdated = 0;

				// takes way too long to run the subproc like 12 times if we have 12 strings. Combine them all into one input, stdout once
				// and well deal with remapping later
				var allSql = "";
				// also need to store its edit range and start-line ref for our options
				var editRanges = Array<vscode.Range>();
				var lineRefs = Array<vscode.TextLine>();
	
				// looping lines until we find a line with 2 backticks, or a line with one backtick and then keep searching
				// for a line with its ending backtick - get indicies of these characters
				for (let li = 0; li < document.lineCount; li++) {
					const element = document.lineAt(li);
	
					// find if this line has both backticks, or one
					let ci = element.text.indexOf("`");
					let fi = element.text.lastIndexOf("`");
					if (ci >= 0) {
						if (startLine === null) {
							startLine = element;
							if (ci !== fi) {
								endLine = element;
							}
							continue;
						}
						else {
							endLine = element;
						}
					}
	
					// if start and line are fulfilled, we have a text block
					if (startLine !== null && endLine !== null) {
						
						// prep replacement range f backticks
						let startChar = new vscode.Position(startLine.lineNumber, startLine.text.indexOf("`") + 1);
						let endChar = new vscode.Position(endLine.lineNumber, endLine.text.lastIndexOf("`"));
						
						// get range, and the text from it
						let textRange = new vscode.Range(startChar, endChar);
						let allText = document.getText(textRange);
	
						// if the text in this range seems to be SQL lets get it ready for formatting
						if (likelySql(allText)) { 	
							//incris good
							sqlStringsUpdated += 1;
	
							// need to escape parameters or they break - also need to make sure the line ends with a single semi-colon or it thinks its all one statement
							// also changing %s to a custom string - so we dont break go fmts
							let cleanedText = allText.replace(/\$/g, "\\$").replace(/\%/g, "xxpggo").replace(/;$/, "") + ";";

							// add our markers for where to split each statement
							allSql += (cleanedText + sqlSplitMarker);
							// store vscode obj refs
							editRanges.push(textRange);
							lineRefs.push(startLine);					
						}
						// reset lines so we can find the next one
						startLine = null;
						endLine = null;					
					}

				}	

				// run perl pg_format - insert our prefs
				let caseIndex = keywordCaseOptions.indexOf(`${keywordCase}`);
				var stdout = execSync(`echo "${allSql}" | perl ${pgFormatPath} --keyword-case ${caseIndex} --type-case ${caseIndex}`) ;
				
				// loop the stdout result split by our comment splitter, with some additional whitespace allowance after formatting
				var c = 0;
				stdout.toString().split(/\n\s*-- go-inline-pgformatter-splitmark\n/).forEach(sqlBlock => {

					// remove start/end whitespace, and reset our silly % sign marker, as we cant make pg_sql not format them
					let replWith = sqlBlock.replace(/^[\s\n\r]+|[\s\n\r]+$/, "").replace(/xxpggo/g, "%");
					
					// we can get some empty blocks - skip them
					if (replWith === "" ) {
						return;
					}

					// if user wants custom tabbing, do it
					if (matchSpacing) {
						let indentedTo = lineRefs[c].firstNonWhitespaceCharacterIndex;
						let insert = lineRefs[c].text.slice(0, indentedTo) + "\t".repeat(addTabs);							
						replWith = insert + replWith.replace(/\n/g, "\n" + insert);
					}
					replWith = "\n" + replWith;
					
					// insert the edit and increment counter
					edit.replace(document.uri, editRanges[c], replWith);	
					c += 1;								
				});				
				
				// sho info that this is going to work								
				vscode.window.setStatusBarMessage(`Successfully formatted ${sqlStringsUpdated} pgSQL strings in-line!`);			
				return vscode.workspace.applyEdit(edit);			
			}
		}).catch(function (error) {
			// error!
			vscode.window.showErrorMessage(`go-inline-pgformatter error: ${error}`);			
			return new Promise(function(){return false;});		
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
