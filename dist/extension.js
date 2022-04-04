(()=>{"use strict";var e={496:e=>{e.exports=require("vscode")},81:e=>{e.exports=require("child_process")},147:e=>{e.exports=require("fs")},37:e=>{e.exports=require("os")}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var i=t[n]={exports:{}};return e[n](i,i.exports,r),i.exports}var n={};(()=>{var e=n;Object.defineProperty(e,"__esModule",{value:!0}),e.deactivate=e.activate=void 0;const t=r(81),o=r(496),i=r(147),s=["update","select","insert","into","delete","from","where"];function a(e){return s.filter((t=>e.toLowerCase().includes(t))).length>=2}e.activate=function(e){console.log('Congratulations, your extension "go-inline-pgformatter" is now active!');let n=o.commands.registerCommand("go-inline-pgformatter.formatAllSql",(()=>{r(37).homedir();const e=o.workspace.getConfiguration("goPgFormat"),n=e.get("pgFormatPath");var s;s=""==`${n}`?"/.vscode/extensions/undefined.go-inline-pgformatter-1.0.0/pg_format":`${n}`,(async()=>await async function(e){try{return await i.promises.access(e),!0}catch{return!1}}(`${s}`))().then((function(r){if(!r)return o.window.showErrorMessage(`Path to pg_format does not exist:\n${s}`),new Promise((function(){return!0}));const{activeTextEditor:n}=o.window;if(n&&"go"===n.document.languageId){const r=new o.WorkspaceEdit,w=e.get("matchSpacing"),x=e.get("keywordCase"),v=e.get("addTabs");var i=0;"number"==typeof v&&(i=v);const{document:h}=n;var c=null,l=null,u=0,p="",f=Array(),g=Array();for(let e=0;e<h.lineCount;e++){const t=h.lineAt(e);let r=t.text.indexOf("`"),n=t.text.lastIndexOf("`");if(r>=0){if(null===c){c=t,r!==n&&(l=t);continue}l=t}if(null!==c&&null!==l){let e=new o.Position(c.lineNumber,c.text.indexOf("`")+1),t=new o.Position(l.lineNumber,l.text.lastIndexOf("`")),r=new o.Range(e,t),n=h.getText(r);a(n)&&(u+=1,p+=n.replace(/\$/g,"\\$").replace(/;$/,"")+";\n-- go-inline-pgformatter-splitmark\n",f.push(r),g.push(c)),c=null,l=null}}var d=(0,t.execSync)(`echo "${p}" | perl ${s} --keyword-case ${x} --type-case ${x}`),m=0;return d.toString().split(/\n\s*-- go-inline-pgformatter-splitmark\n/).forEach((e=>{let t=e.replace(/^[\s\n\r]+|[\s\n\r]+$/,"");if(""!==t){if(w){let e=g[m].firstNonWhitespaceCharacterIndex,r=g[m].text.slice(0,e)+"\t".repeat(i);t=r+t.replace(/\n/g,"\n"+r)}t="\n"+t,r.replace(h.uri,f[m],t),m+=1}})),o.window.setStatusBarMessage(`Successfully formatted ${u} pgSQL strings in-line!`),o.workspace.applyEdit(r)}})).catch((function(e){return o.window.showErrorMessage(`go-inline-pgformatter error: ${e}`),new Promise((function(){return!1}))}))}));e.subscriptions.push(n)},e.deactivate=function(){}})(),module.exports=n})();