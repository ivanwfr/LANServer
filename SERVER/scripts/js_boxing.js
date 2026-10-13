//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_boxing.js                                           _TAG (261013:16h:29)
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
//console.log("js_boxing.box_in:");
//console.log("✔ document.readyState=["+document.readyState+"]");

    // ALREADY  FORMATTED {{{
    let value = document.body.getAttribute( DATA_ATTR_JS_BOXING );
    if( value )
    {
        console.log("ALREADY FORMATTED:  "+DATA_ATTR_JS_BOXING+"=["+value+"]");
        return;
    }
    //}}}
//console.log("document.body.innerHTML=["+document.body.innerHTML+"]");
//nsole.log("document.body.textContent=["+document.body.textContent+"]");
//nsole.log("document.body.innerText=["+document.body.innerText+"]");

    document.body.innerHTML = format_data( document.body.textContent );
  //document.body.innerHTML = format_data( document.body.innerText   );
//console.log("document.body.innerHTML=["+document.body.innerHTML+"]");

    document.body.setAttribute(DATA_ATTR_JS_BOXING, "client-side");
};
/*}}}*/
/*_ box_out {{{*/
let box_out = function(e) /* eslint-disable-line no-unused-vars */
{
//console.log("js_boxing.box_out:");

    document.body.innerHTML = ""
      //+ "<button onclick='js_boxing.box_in()'>js_boxing.box_in()</button>\n"
     // + "<pre>"+ document.body.textContent +"</pre>"
        +          document.body.textContent
    ;
    document.body.removeAttribute( DATA_ATTR_JS_BOXING );
    document.body.style.whiteSpace = "pre";
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ DOCUMENT BODY
//└────────────────────────────────────────────────────────────────────────────┘
/*● format_data {{{*/
// const {{{
/* eslint-disable no-unused-vars */
const HTML_NBSP = "&nbsp;";
const HEX_21B2  = "\u21B2";
const HEX_2BCO  = "\u2BC0"; // ⯀
const HEX_25A0  = "\u25A0"; // ■
/* eslint-enable  no-unused-vars */
//}}}
let format_data = function(data_in)
{
    let in_code;

    // LINE FILTER {{{
    let data_out = "";
    let    lines = data_in.split("\n");
    for(let i = 0; i < lines.length; ++i)
    {
        let l = lines[i];
//console.log("%c"+l, "background-color: #008;");//FIXME

        l =         l.  replace(                               /</g, "&lt;"           ); // html entities
        l =         l.  replace(                               />/g, "&gt;"           ); // html entities
        //┌────────────────────────────────────────────────────────────────────┐
        //│ BLANK LINES
        //└────────────────────────────────────────────────────────────────────┘
        l =         l.  replace(                               /^\s+$/, ""            );
        //┌────────────────────────────────────────────────────────────────────┐
        //│ BOX START
        //└────────────────────────────────────────────────────────────────────┘
    if(in_code) {
        l =         l.  replace(             /\/\/[└┘┌┐│─├┼┤]+/g, "");
    }
    else {
        l =         l.  replace(             / *\/[\/\\*] *(┌.*$)/g, "<BOXU>$1</BOXU>"); // BOX UP
        l =         l.  replace(             / *\/[\/\\*] *(│.*$)/g, "<BOXM>$1</BOXM>"); // BOX MIDDLE
        l =         l.  replace(             / *\/[\/\\*] *(├.*$)/g, "<BOXM>$1</BOXM>"); // BOX SEP
        l =         l.  replace(             / *\/[\/\\*] *(┼.*$)/g, "<BOXM>$1</BOXM>"); // BOX SEP
        l =         l.  replace(             / *\/[\/\\*] *(┤.*$)/g, "<BOXM>$1</BOXM>"); // BOX SEP
        l =         l.  replace(             / *\/[\/\\*] *(└.*$)/g, "<BOXD>$1</BOXD>"); // BOX DOWN
    if( l.includes("BOX") )
        l =         l.  replace(                    /[└┘┌┐│─├┼┤]+/g, "" /*HTML_NBSP*/ ); // remove utf-8 boxing (or not)
    }
        //┌────────────────────────────────────────────────────────────────────┐
        //│ VIM FOLD DETAILS
        //└────────────────────────────────────────────────────────────────────┘
        if( RGX_VOPEN_OR__VCLOSE_LINE.exec(l) ) {
            data_out += md_format_head_line(""); // CLOSE ALL PENDING DETAILS
            l = vim_fold_line( l );
        }
        //┌────────────────────────────────────────────────────────────────────┐
        //│ MARKDOWN DETAILS
        //└────────────────────────────────────────────────────────────────────┘
        if( l.match(/^ *#/) ) l = md_format_head_line( l );
        //┌────────────────────────────────────────────────────────────────────┐
        //│ COMMENT
        //└────────────────────────────────────────────────────────────────────┘
        l =         l.  replace(                        / *\/\* */g, ""               ); // 👉  /*   👈 // COMMENT START
        l =         l.  replace(                        / *\*\/ */g, ""               ); // 👉  */   👈 // COMMENT END
        l =         l.  replace(                     / *\[\.+\] */g, ""               ); // 👉 [...] 👈 Copilot comment
        //┌────────────────────────────────────────────────────────────────────┐
        //│ SYMBOLS
        //└────────────────────────────────────────────────────────────────────┘
        l =         l.  replace(                             /\\n/g,      HEX_21B2    ); // inline [LF]  TO [↲] .. (i.e. \n\n)
        l =         l.  replace(                      /\> *\/\/ */g, ">"              ); //       [>// ] TO []
//      l =         l.  replace(                        / *\/\/ */g,      HEX_25A0+" "); //        [//]  TO [■]
//      l =         l.  replace(                  /\> *[^:]\/\/ */g, ">"              ); //       [>// ] TO []
    if(!in_code)
        l =         l.  replace(                    / *[^:]\/\/ */g,      HEX_25A0+" "); //        [//]  TO [■]
        //┌────────────────────────────────────────────────────────────────────┐
        //│ OPTIONAL
        //└────────────────────────────────────────────────────────────────────┘
      //l =         l.  replace(                    / *;* *\{\{\{/g, " "              ); // remove vim fold markers
      //l =         l.  replace(                    / *;* *\}\}\}/g, " "              );
        //┌────────────────────────────────────────────────────────────────────┐
        //│ ENTERING .. LEAVING CODE SECTION
        //└────────────────────────────────────────────────────────────────────┘
        let       s = l.trim();
        let matches = RGX_CODE.exec( s );
        if( matches ) {
            in_code = matches[1]; // IN=[```code_type$] .. OUT=[```$]
//console.log("...in_code=["+in_code+"] \t"+ l);
        }
        // Add Linefeed {{{
        if( in_code )
        {
            l += "\n";
        }
        else if(    s.length
           && !s.endsWith("<pre>"     )
           && !s.endsWith("</boxd>"   )
           && !s.endsWith("</details>")
          ) {
            l += "\n";
        }
        //}}}
//        // Del Linefeed {{{
//        if(   l.includes("</pre>")
//           && data_out.endsWith("\n")
//        ) {
//            data_out  = data_out.slice(0,-1);
//        }
//        //}}}
//console.log("%c"+l, "border: 1px solid #FF0;");//FIXME
        data_out +=             l  ;
    }
    //}}}
    data_out += md_format_head_line( ""       ); // CLOSE DANGLING DETAILS
    data_out  = md_format_table    ( data_out );
    data_out  = add_spacing_lines  ( data_out );

    return "<pre>"+ data_out +"</pre>";
};
/*}}}*/
/*_ add_spacing_lines ● @see SERVER/style/qtext.css {{{*/
let add_spacing_lines = function( data_in )
{
    let data_out
        = data_in
        . replace(/(\n *\*+ *\d)/g  , "\n$1"                        ) // ##1 numbered lines
        . replace(/(```(\w+).*)\n/g , "\n<div class='code $2'>$1\n" ) // DIR ```javascript
        . replace(/(```)\n/g        , "$1\n</div>\n"                ) // DIR ```
    ;
    return data_out;
};
/*}}}*/
//┌────────────────────────────────────────────────────────────────────────────┐
//│ VIM FOLDS
//└────────────────────────────────────────────────────────────────────────────┘
/*● vim_fold_line {{{*/
// VIM REGEX {{{

//... PATTERN
const PAT_VOPEN                 = "\\{\\{\\{";
const PAT_VCLOSE                = "\\}\\}\\}";
const PAT_BLOC                  = "(.*)"     ; // CAPTURING BLOC

//... REGEX
const RGX_CODE                  = new RegExp("```(.*)");
const RGX_VOPEN_AND_VCLOSE_LINE = new RegExp(PAT_VOPEN + PAT_BLOC   + PAT_VCLOSE); // line contains both  vim folds .. remove both
const RGX_VOPEN_OR__VCLOSE_LINE = new RegExp(PAT_VOPEN +   "|"      + PAT_VCLOSE); // line contains     a vim fold  .. call filter
const RGX_VOPEN_LINE            = new RegExp(PAT_BLOC  + PAT_VOPEN  + PAT_BLOC  ); // line contains open  vim fold  .. remove open  fold
const RGX_VCLOSE_LINE           = new RegExp(PAT_BLOC  + PAT_VCLOSE + PAT_BLOC  ); // line contains close vim fold  .. remove close fold

//... REPLACEMENT
const RPL_VOPEN_AND_VCLOSE_LINE =                   "{{ {$1} }}"                 ; // remove both surrounding folds
const RPL_VOPEN_LINE            = "<details>\n<summary>$1 $2</summary>\n<pre>"   ; // vim open  => CLOSE details
const RPL_VCLOSE_LINE           =                     "$1 $2\n</pre>\n</details>"; // vim close => OPEN  details+summary


//}}}
let vim_fold_line = function(l)
{

    l = l.replace(RGX_VOPEN_AND_VCLOSE_LINE , RPL_VOPEN_AND_VCLOSE_LINE); // BOTH FIRST
    l = l.replace(RGX_VOPEN_LINE            , RPL_VOPEN_LINE           );
    l = l.replace(RGX_VCLOSE_LINE           , RPL_VCLOSE_LINE          );

    return l;
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ MARKDOWN
//└────────────────────────────────────────────────────────────────────────────┘
/*● md_format_head_line {{{*/
let md_head_level = 0;
let md_format_head_line  = function(l_in)
{
    let l_out = "";
    // CLOSE ALL OPENED HEADERs {{{
    if(!l_in)
    {
        while(md_head_level)
        {
            l_out += "md_head_level=["+md_head_level+"]"+
                     "\n</pre>\n</details>";
            md_head_level -= 1;
        }
        return l_out;
    }
    //}}}
    // COUNT POUND SIGNS (1..6) {{{
    let count = 1+ l_in.lastIndexOf("#");
    if(!count)
        return l_in;

    //}}}
//    // DETAILS LEVEL END ALL WITH LEVEL ABOVE THIS ONE {{{
//    while(count <= md_head_level )
//    {
//        l_out +=  "\n</pre>\n</details>";
//        md_head_level -= 1;
//    }

//    //}}}
    // CLOSE ALL markdown folds - single level for any # of # {{{
    while( md_head_level )
    {
        l_out +=  "\n</pre>\n</details>";
        md_head_level -= 1;
    }

    //}}}
    // DETAILS LEVEL START .. [LEVEL > 0] {{{
    if(count > 0) {
        l_out += l_in.replace(/(^ *#+.*)/, "<details>\n<summary>$1</summary>\n<pre>");
      //l_out += l_in.replace(/^ *#+(.*)/, "<details>\n<summary>$1</summary>\n<pre>");

        md_head_level += 1;
    }
    //}}}
    return l_out;
};
/*}}}*/
/*● md_format_table {{{*/
const MD_TABLE_DELIM_1 = "- | -";
const MD_TABLE_DELIM_2 =  "-|-";

let md_format_table = function(data_in)
{
//console.log("js_boxing.md_format_table");
    let data_out = "";

  //let lines = data_in.split("\n").map((l) => l.trim()) ; // keep empty lines
    let lines = data_in.split("\n")                      ; // keep indentation

    for(let i = 0; i < lines.length; ++i)
    {
        let reached_md_table
            =   (i < lines.length -1)
             && (    lines[i+1].trim().startsWith("|")  )
             && (    lines[i+1].includes( MD_TABLE_DELIM_1 )
                 ||  lines[i+1].includes( MD_TABLE_DELIM_2 ));

        if( reached_md_table )
        {
//console.log("%c"+           lines[i], "background-color: #400;");
            let matches = lines[i].match(/(^[^\|]*)(\|.*)/);
            if( matches ) {
                data_out +=   matches[1];
                lines[i]  =   matches[2];
//console.log("%c matches[1]=["+ matches[1] +"]", "color: #F00;");
//console.log("%c matches[2]=["+ matches[2] +"]", "color: #0FF;");
            }
            let table_rows = "";
            while(i < lines.length && lines[i].includes("|"))
            {
                let row = lines[i].replace(/^[^|]*/, "").trim();
                if( row ) table_rows += row + "\n";
                i += 1;
            }

            if( table_rows ) {
                data_out   += md_format_table_to_html( table_rows.trim() );
            }
//console.log("%c"+           lines[i], "background-color: #400;");
            data_out     += lines[i] + "\n";
        }
        else {
            data_out     += lines[i] + "\n";
        }
    }

    return data_out;
};
/*}}}*/
/*_ md_format_table_to_html {{{*/
let md_format_table_to_html = function( table_rows )
{
    // Split into lines, ignore empty lines
    let lines
        = table_rows.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

    if (lines.length < 2) return "";

    // Parse header
    let headerCells = md_format_table_row(lines[0].replace(/\\/g,"_backslash_")) ;

    // Parse data rows, skipping separator line (lines[1])
    let dataRows = [];
    for (let i = 2; i < lines.length; i++) {
        dataRows.push(  md_format_table_row(lines[i].replace(/\\/g,"_backslash_")));
    }

    // OPEN TABLE
    let html = ""
        + "<table class='markdown_table'>\n"
    ;

    // TABLE THEAD {{{
    html += ""
        +  " <thead>\n"
        +  "  <tr>\n"
    ;
    for (let cell of headerCells) {
        let     text = cell.trim().replace(/_backslash_/g,"\\");
        html        += `   <th>${text}</th>\n`;
    }
    html += ""
        +  "  </tr>\n"
        +  " </thead>\n"
    ;
    //}}}

    // TBODY {{{
    html += " <tbody>\n";

    for(let row of dataRows)
    {
        html += "  <tr>\n";
        for(let cell of row) {
            let text = cell.trim().replace(/_backslash_/g,"\\");
//console.log("%c["+text+"]", "background-color: #800;");
            html    += `   <td>${text}</td>\n`;
        }
        html += "  </tr>\n";
    }

    html += " </tbody>\n";
    //}}}

    // CLOSE TABLE
    html += "</table>\n";

//console.log("%c"+html, "background-color: #040; border: yellow;");
    return html;
};
/*}}}*/
/*_ md_format_table_row {{{*/
let md_format_table_row = function(line)
{
    //┌────────────────────────────────────────────────────────────────────────────┐
    //│ Parse a markdown table row into an array of cell strings.
    //│ Handles inlined <br>, escaped pipes (\\|) and surrounding pipes.
    //└────────────────────────────────────────────────────────────────────────────┘
    let trimmed = line.trim().replace(/ *&lt;br&gt;/g,"<br>");

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
try { module.exports = js_boxing; } catch(ex) { /*console.log(ex.message);*/ /*console.trace();*/ } /* eslint-disable-line no-unused-vars */
  globalThis.js_boxing = js_boxing; //DEBUG ONLY
  if(typeof document  != "undefined") js_boxing.box_in(); // CLIENT-SIDE ONLY//FIXME
//if(typeof document  != "undefined") document.addEventListener("DOMContentLoaded", js_boxing.box_in);
//console.log("%c❌❌❌ js_boxing.box_in() NOT CALLED", "font-size: 200%");
