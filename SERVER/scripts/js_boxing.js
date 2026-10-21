//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_boxing.js                                           _TAG (261021:02h:34)
//└────────────────────────────────────────────────────────────────────────────┘
// doc {{{
//┌────────────────────────────────────────────────────────────────────────────┐
//│ BOXING text content and  Markdown table into HTML Handles:
//│ - Header row and separator row (|---|---|)
//│ - Multiple data rows
//│ - Inline pipes in cells (escaped as \|||)
//│ - Leading and trailing whitespace
//│ - table content decoration symbols
//│
//│ ● @see SERVER/style/to_html.css
//└────────────────────────────────────────────────────────────────────────────┘
//}}}
/* IMPORT {{{*/

/* globals js_md */
import {   js_md } from "./js_md.js"

/*}}}*/
let js_boxing = (function() {
"use strict";
/*● box_in {{{*/
const DATA_ATTR_JS_BOXING = "data-js_boxing";

let box_in = function(e) /* eslint-disable-line no-unused-vars */
{
//console.log("js_boxing.box_in:");
//console.log("✔ document.readyState=["+document.readyState+"]");

    // GUARD CHECK: ALREADY  FORMATTED {{{
    let value = document.body.getAttribute( DATA_ATTR_JS_BOXING );
    if( value ) {
        console.log("ALREADY FORMATTED:  "+DATA_ATTR_JS_BOXING+"=["+value+"]");
        return;
    }
    //}}}

    document.body.innerHTML = text_to_HTML( document.body.textContent );

    document.body.setAttribute(DATA_ATTR_JS_BOXING, "client-side");

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ RELOAD AN HTML EMBEDDED CONTENT
    //└────────────────────────────────────────────────────────────────────────┘
    let url = new URL(window.location.href);
    if(!url.searchParams.has("to_html"))
    {
      url.searchParams.set  ("to_html", ""     );
      history.replaceState  (     null, "", url); // no reload, just updates address bar
    }
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
//│ DOCUMENT BODY TEXT HTML EMBEDDING
//└────────────────────────────────────────────────────────────────────────────┘
/*● text_to_HTML {{{*/
// UTF-8 symbols {{{
/* eslint-disable no-unused-vars */
const HTML_NBSP = "&nbsp;";
const HEX_21B2  = "\u21B2";
const HEX_2BCO  = "\u2BC0"; // ⯀
const HEX_25A0  = "\u25A0"; // ■
/* eslint-enable  no-unused-vars */
//}}}
let text_to_HTML = function(data_in)
{
    let in_code;

    // LINE FILTER {{{
    let data_out = "";
    let    lines = data_in.split("\n");
    for(let i = 0; i < lines.length; ++i)
    {
        let l = lines[i];
//console.log("%c"+l, "background-color: #008;");//FIXME

        l =         l.  replace(                  /</g, "&lt;"           ); // html entities
        l =         l.  replace(                  />/g, "&gt;"           ); // html entities
        //┌────────────────────────────────────────────────────────────────────┐
        //│ BLANK LINES
        //└────────────────────────────────────────────────────────────────────┘
        l =         l.  replace(              /^\s+$/ , ""               );
        //┌────────────────────────────────────────────────────────────────────┐
        //│ BOX START
        //└────────────────────────────────────────────────────────────────────┘
        if(in_code) {
            l =     l.  replace(   /\/\/[└┘┌┐│─├┼┤]+/g,    ""            );
        }
        else {
            l =     l.  replace(/ *\/[\/\\*] *(┌.*$)/g, "<BOXU>$1</BOXU>"); // BOX UP
            l =     l.  replace(/ *\/[\/\\*] *(│.*$)/g, "<BOXM>$1</BOXM>"); // BOX MIDDLE
            l =     l.  replace(/ *\/[\/\\*] *(├.*$)/g, "<BOXM>$1</BOXM>"); // BOX SEP
            l =     l.  replace(/ *\/[\/\\*] *(┼.*$)/g, "<BOXM>$1</BOXM>"); // BOX SEP
            l =     l.  replace(/ *\/[\/\\*] *(┤.*$)/g, "<BOXM>$1</BOXM>"); // BOX SEP
            l =     l.  replace(/ *\/[\/\\*] *(└.*$)/g, "<BOXD>$1</BOXD>"); // BOX DOWN
            if( l.includes("BOX") )
                l = l.  replace(       /[└┘┌┐│─├┼┤]+/g, "" /*HTML_NBSP*/ ); // remove utf-8 boxing (or not)
        }

        //┌────────────────────────────────────────────────────────────────────┐
        //│ VIM FOLD DETAILS
        //└────────────────────────────────────────────────────────────────────┘
        if( RGX_VOPEN_OR__VCLOSE_LINE.exec(l) ) {
            data_out += js_md.md_format_head_line(""); // CLOSE ALL PENDING DETAILS
            l = vim_fold_line( l );
        }

        //┌────────────────────────────────────────────────────────────────────┐
        //│ MARKDOWN DETAILS
        //└────────────────────────────────────────────────────────────────────┘
        if( l.match(/^ *#/) ) l = js_md.md_format_head_line( l );

        //┌────────────────────────────────────────────────────────────────────┐
        //│ COMMENT
        //└────────────────────────────────────────────────────────────────────┘
        l =         l.  replace(           / *\/\* */g, ""               ); // 👉  /*   👈 // COMMENT START
        l =         l.  replace(           / *\*\/ */g, ""               ); // 👉  */   👈 // COMMENT END
        l =         l.  replace(        / *\[\.+\] */g, ""               ); // 👉 [...] 👈 Copilot comment

        //┌────────────────────────────────────────────────────────────────────┐
        //│ SYMBOLS
        //└────────────────────────────────────────────────────────────────────┘
        l =         l.  replace(                /\\n/g,      HEX_21B2    ); // inline [LF]  TO [↲] .. (i.e. \n\n)
        l =         l.  replace(         /\> *\/\/ */g, ">"              ); //       [>// ] TO []
//      l =         l.  replace(           / *\/\/ */g,      HEX_25A0+" "); //        [//]  TO [■]
//      l =         l.  replace(     /\> *[^:]\/\/ */g, ">"              ); //       [>// ] TO []
    if(!in_code)
        l =         l.  replace(       / *[^:]\/\/ */g,      HEX_25A0+" "); //        [//]  TO [■]

        //┌────────────────────────────────────────────────────────────────────┐
        //│ OPTIONAL
        //└────────────────────────────────────────────────────────────────────┘
      //l =         l.  replace(       / *;* *\{\{\{/g, " "              ); // remove vim fold markers
      //l =         l.  replace(       / *;* *\}\}\}/g, " "              );

        //┌────────────────────────────────────────────────────────────────────┐
        //│ ENTERING .. LEAVING CODE SECTION
        //└────────────────────────────────────────────────────────────────────┘
        let       s = l.trim();
        let matches = RGX_CODE.exec( s );
        if( matches ) {
            in_code = matches[1]; // IN=[```code_type$] .. OUT=[```$]
//console.log("...in_code=["+in_code+"] \t"+ l);
        }

        //┌────────────────────────────────────────────────────────────────────┐
        //│ ENDING .. SECTION
        //└────────────────────────────────────────────────────────────────────┘
        // Add Linefeed {{{
        if( in_code )
        {
            l += "\n";
        }
        else if( s.length
           &&   !s.endsWith("<pre>"     )
           &&   !s.endsWith("</boxd>"   )
           &&   !s.endsWith("</details>")
          ) {
            l += "\n";
        }
        //}}}

//console.log("%c"+l, "border: 1px solid #FF0;");//FIXME
        data_out +=             l  ;
    }
    //}}}
    data_out += js_md.md_format_head_line( ""       ); // CLOSE DANGLING DETAILS
    data_out  = js_md.md_format_table    ( data_out );
    data_out  = box_insert_LF  ( data_out );
    data_out  = box_insert_DIV ( data_out );

    return "\n<pre>"+ data_out +"</pre>\n";
};
/*}}}*/
/*_ box_insert_LF {{{*/
let box_insert_LF = function( data_in )
{
    //┌─────────────┐
    //│ *** NUMBER  │
    //│ ↓↓↓↓↓↓↓↓↓↓  │
    //│ LF          │
    //│ *** NUMBER  │
    //└─────────────┘
    return data_in
        . replace(/(\n *\*+ *\d)/g  , "\n$1"                        )
        . replace(/(```(\w+).*)\n/g , "\n<div class='code $2'>$1\n" )
        . replace(/(```)\n/g        , "$1\n</div>\n"                )
    ;
};
/*}}}*/
/*_ box_insert_DIV {{{*/
let box_insert_DIV = function( data_in )
{
    //┌─────────────────────┐
    //│ ```www              │
    //│ ```                 │
    //│ ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓  │
    //│ <div class='code'>  │
    //│ </div>              │
    //└─────────────────────┘
    return data_in
        . replace(/(\n *\*+ *\d)/g  , "\n$1"                        )
        . replace(/(```(\w+).*)\n/g , "\n<div class='code $2'>$1\n" )
        . replace(/(```)\n/g        , "$1\n</div>\n"                )
    ;
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

    // return {{{
    return { name: "js_boxing"
        ,    box_in
        ,    box_out
        // DEBUG ONLY
        ,    text_to_HTML
    };
    //}}}
})();
try { module.exports = js_boxing; } catch(ex) { /*console.log(ex.message);*/ /*console.trace();*/ } /* eslint-disable-line no-unused-vars */
  globalThis.js_boxing = js_boxing; //DEBUG ONLY
  if(typeof document  != "undefined") js_boxing.box_in(); // CLIENT-SIDE ONLY//FIXME
//if(typeof document  != "undefined") document.addEventListener("DOMContentLoaded", js_boxing.box_in);
//console.log("%c❌❌❌ js_boxing.box_in() NOT CALLED", "font-size: 200%");
