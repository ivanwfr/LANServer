//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_boxing.js                                           _TAG (261008:21h:52)
/* Convert text content and  Markdown table into HTML {{{
Handles:
- Header row and separator row (|---|---|)
- Multiple data rows
- Inline pipes in cells (escaped as \|||)
- Leading/trailing whitespace
}}}*/
//└────────────────────────────────────────────────────────────────────────────┘
let js_boxing = (function() {
"use strict";
/*● box_in {{{*/
const DATA_ATTR_JS_BOXING = "data-js_boxing";

let box_in = function(e) /* eslint-disable-line no-unused-vars */
{
console.log("js_boxing.box_in:");

    // ALREADY  FORMATTED {{{
    let value = document.body.getAttribute( DATA_ATTR_JS_BOXING );
    if( value )
    {
        console.log("ALREADY FORMATTED:  "+DATA_ATTR_JS_BOXING+"=["+value+"]");
        return;
    }
    //}}}

    document.body.innerHTML = format_data( document.body.textContent );

    document.body.setAttribute(DATA_ATTR_JS_BOXING, "client-side");
};
/*}}}*/
/*_ box_out {{{*/
let box_out = function(e) /* eslint-disable-line no-unused-vars */
{
console.log("js_boxing.box_out:");

    document.body.innerHTML = ""
      //+ "<button onclick='js_boxing.box_in()'>js_boxing.box_in()</button>\n"
     // + "<pre>"+ document.body.textContent +"</pre>"
        +          document.body.textContent
    ;
    document.body.removeAttribute( DATA_ATTR_JS_BOXING );
    document.body.style.whiteSpace = "pre";
};
/*}}}*/
/*_ format_data {{{*/
// const {{{
/* eslint-disable no-unused-vars */
let HTML_NBSP = "&nbsp;";
let HEX_21B2  = "\u21B2";
let HEX_2BCO  = "\u2BC0";
/* eslint-enable  no-unused-vars */
//}}}
let format_data = function(data_in)
{
//console.log("js_boxing.format_data");
    // LINE FILTER {{{
    let   data_out = "";
    const    lines = data_in.split("\n");
    for(let i = 0; i < lines.length; ++i)
    {
        let l = lines[i];
        l =         l.  replace(                               /</g, "&lt;"           ); // html entities
        l =         l.  replace(                               />/g, "&gt;"           ); // html entities
        //┌────────────────────────────────────────────────────────────────────┐
        //│ BOX START
        //└────────────────────────────────────────────────────────────────────┘
        l =         l.  replace(             / *\/[\/\\*] *(┌.*$)/g, "<BOXU>$1</BOXU>"); // BOX UP
        l =         l.  replace(             / *\/[\/\\*] *(│.*$)/g, "<BOXM>$1</BOXM>"); // BOX MIDDLE
        l =         l.  replace(             / *\/[\/\\*] *(├.*$)/g, "<BOXM>$1</BOXM>"); // BOX SEP
        l =         l.  replace(             / *\/[\/\\*] *(┼.*$)/g, "<BOXM>$1</BOXM>"); // BOX SEP
        l =         l.  replace(             / *\/[\/\\*] *(┤.*$)/g, "<BOXM>$1</BOXM>"); // BOX SEP
        l =         l.  replace(             / *\/[\/\\*] *(└.*$)/g, "<BOXD>$1</BOXD>"); // BOX DOWN
    if( l.includes("BOX") )
        l =         l.  replace(                    /[└┘┌┐│─├┼┤]+/g, "" /*HTML_NBSP*/ ); // remove utf-8 boxing (or not)
        //┌────────────────────────────────────────────────────────────────────┐
        //│ BOX DONE
        //└────────────────────────────────────────────────────────────────────┘
        l =         l.  replace(     /(.*)\{\{\{(.*)/, "<details>\n<summary>$1 $2</summary>\n<pre>" ); // FOLD-OPEN-CLOSE
        l =         l.  replace(     /(.*)\}\}\}(.*)/,                     "$1 $2</pre>\n</details>");
// FOLD_CLOSE {{{
//      l =         l.  replace(     /(.*)\}\}\}(.*)/,                     "$1 $2</pre>\n</details><!--FOLD_CLOSE-->");
//}}}
        //┌────────────────────────────────────────────────────────────────────┐
        //│ COMMENT
        //└────────────────────────────────────────────────────────────────────┘
        l =         l.  replace(                        / *\/\* */g, ""               ); // 👉  /*   👈 // COMMENT START
        l =         l.  replace(                        / *\*\/ */g, ""               ); // 👉  */   👈 // COMMENT END
        l =         l.  replace(                     / *\[\.+\] */g, ""               ); // 👉 [...] 👈 Copilot comment
        //┌────────────────────────────────────────────────────────────────────┐
        //│ SYMBOLS
        //└────────────────────────────────────────────────────────────────────┘
        l =         l.  replace(                             /\\n/g,      HEX_21B2    ); // [inline LF] TO  [↲] .. (i.e. \n\n)
//      l =         l.  replace(                           />\/\//g, ">"+ HEX_2BCO    ); //       [>//] TO [>⯀]
//      l =         l.  replace(                      /\> *\/\/ */g, ">"+ HEX_2BCO    ); //       [>//] TO [>⯀]
        //┌────────────────────────────────────────────────────────────────────┐
        //│ OPTIONAL
        //└────────────────────────────────────────────────────────────────────┘
      //l =         l.  replace(                    / *;* *\{\{\{/g, " "              ); // remove vim fold markers
      //l =         l.  replace(                    / *;* *\}\}\}/g, " "              );
        // Add Linefeed {{{
        let    s = l.trim();
        if(    s.length
           && !s.endsWith("<pre>"     )
           && !s.endsWith("</boxd>"   )
           && !s.endsWith("</details>")
          )
            l += "\n";
        //}}}
        // Del Linefeed {{{
        if(   l.includes("</pre>")
           && data_out.endsWith("\n")
        ) {
            data_out  = data_out.slice(0,-1);
// log {{{
//l = "<!-- Del Linefeed -->" + l;
//}}}
        }
        //}}}
        data_out += l;
    }
    //}}}
    // MARKDOWN TABLES TO HTML {{{
    data_out = convert( data_out );

    //}}}
           data_out = data_out.replace(/>\s*\/\/\s */gm, ">"+ HEX_2BCO); // [>//] TO [>⯀]
    return data_out;
};
/*}}}*/
/*● convert {{{*/
const TABLE_DELIM_1 = "- | -";
const TABLE_DELIM_2 =  "-|-";

let convert = function(data_in)
{
//console.log("js_boxing.convert");
    let data_out = "";

  //const lines = data_in.split("\n").map((l) => l.trim())                ; // keep empty lines
    const lines = data_in.split("\n")                                     ; // keep indentation

    for(let i = 0; i < lines.length; ++i)
    {
        let reached_md_table
            =   (i < lines.length -1)
             && (    lines[i+1].trim().startsWith("|")  )
             && (    lines[i+1].includes( TABLE_DELIM_1 )
                 ||  lines[i+1].includes( TABLE_DELIM_2 ));

        if( reached_md_table )
        {
            let table_rows = lines[i] + "\n";
            while(i < lines.length && lines[i].includes("|"))
            {
                let row =    lines[i].trim();
                if( row ) table_rows += row + "\n";
                i += 1;
            }

            if( table_rows ) {
                data_out   += convert_table_to_html( table_rows.trim() );
            }
            data_out     += lines[i] + "\n";
        }
        else {
            data_out     += lines[i] + "\n";
        }
    }

    return data_out;
};
/*}}}*/
/*_ convert_table_to_html {{{*/
let convert_table_to_html = function( md_table )
{
    // Split into lines, ignore empty lines
    const lines = md_table.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

    if (lines.length < 2) return "";

    // Parse header
    const headerCells = parseRow(lines[0].replace(/\\/g,"_backslash_")) ;
    // Skip separator line (lines[1])
    // Parse data rows
    const dataRows = [];
    for (let i = 2; i < lines.length; i++) {
        dataRows.push(  parseRow(lines[i].replace(/\\/g,"_backslash_")));
    }

    // Build HTML
    let html = "<table class='markdown_table'>\n<thead>\n<tr>\n";
    for (const cell of headerCells) {
        let     text = cell.trim().replace(/_backslash_/g,"\\");
        html        += `  <th>${text}</th>\n`;
    }
    html += "</tr>\n</thead>\n<tbody>\n";
    for (const row of dataRows) {
        html += "<tr>\n";
        for (const cell of row) {
            let text = cell.trim().replace(/_backslash_/g,"\\");
            html    += `  <td>${text}</td>\n`;
        }
        html += "</tr>\n";
    }
    html += "</tbody>\n</table>";
    return html;
};
/*}}}*/
/*_ parseRow {{{*/
let parseRow = function(line)
{
    //┌────────────────────────────────────────────────────────────────────────────┐
    //│ Parse a markdown table row into an array of cell strings.
    //│ Handles escaped pipes (\\|) and surrounding pipes.
    //└────────────────────────────────────────────────────────────────────────────┘

  // Remove leading/trailing pipe and whitespace
  let trimmed = line.trim();
  if (trimmed.startsWith("|")) trimmed = trimmed.slice(1);
  if (trimmed.endsWith  ("|")) trimmed = trimmed.slice(0, -1);

  // Split on unescaped pipes

// 1. ADDS EMPTY CELLS
  return trimmed.split(/\|(?=([^\\]*\\{2})*[^\\]*$)/).map((c) => (c ? c.trim() : ""))                            ; // leaves empty cells

// 2. EMPTY CELLS MAY SHIFT COLUMNS TO THE LEFT
//return trimmed.split(/\|(?=([^\\]*\\{2})*[^\\]*$)/).map((c) => (c ? c.trim() : "")).filter((e) => e.length > 0); // left-shift on missing columns

};
/*}}}*/
    // return {{{
    return { name: "js_boxing"
        ,    format_data
        ,    box_in
        ,    box_out
    };
    //}}}
})();
//    module.exports {{{
try { module.exports = js_boxing; } catch(ex) { console.log(ex.message); console.trace(); }
//}}}
globalThis.js_boxing = js_boxing; //DEBUG ONLY
if(typeof document  != "undefined") js_boxing.box_in(); // CLIENT-SIDE ONLY
