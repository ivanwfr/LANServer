//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_boxing.js                                           _TAG (261112:02h:09)
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

/* globals js_linkify */
/* globals js_log   */
/* globals js_md    */
/* globals js_xpath */

import {   js_linkify } from "./js_linkify.js"
import {   js_log     } from "./js_log.js"
import {   js_md      } from "./js_md.js"
import {   js_xpath   } from "./js_xpath.js"

/*}}}*/
let js_boxing = (function() {
// ◯ INTERNING ● SERVER/scripts/js_log.js {{{
const MODULE = "%c⭐🟣 js_boxing\t\t● ";
let log_this = false;
let tag_this = false || log_this; /* eslint-disable-line no-unused-vars */
//{{{
/* eslint-disable no-unused-vars */

js_log.register( { module_name : "js_boxing"
                 , module_num  : 0
                 , log_this_fn : (state) => log_this = state
                 , tag_this_fn : (state) => tag_this = state } );

let log                                        = js_log.log;
let console_clear                              = js_log.console_clear;

let ellipsis                                   = js_log.ellipsis;
let get_src_link                               = js_log.get_src_link;

let lbB                                        = js_log.lbB;

let b_X                                        = js_log.b_X;
let lbX                                        = js_log.lbX;
let lfX                                        = js_log.lfX;
let [b_0,b_1,b_2,b_3,b_4,b_5,b_6 ,b_7,b_8,b_9] = js_log.b_X;
let [lb0,lb1,lb2,lb3,lb4,lb5,lb6 ,lb7,lb8,lb9] = js_log.lbX;
let [lf0,lf1,lf2,lf3,lf4,lf5,lf6 ,lf7,lf8,lf9] = js_log.lfX;

/* eslint-enable  no-unused-vars */
//}}}
//}}}
/*● onload {{{*/
const DATA_ATTR_JS_BOXING = "data-js_boxing";

let onload = function(e) /* eslint-disable-line no-unused-vars */
{
let caller = "onload";
if(log_this) log(MODULE+caller, lbB);
if(log_this) log("✔ document.readyState=["+document.readyState+"]");

    // GUARD CHECK: ALREADY  FORMATTED {{{
    let value = document.body.getAttribute( DATA_ATTR_JS_BOXING );
    if( value ) {
        log("...ALREADY FORMATTED:  "+DATA_ATTR_JS_BOXING+"=["+value+"]");
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
let caller = "box_out";
if(log_this) log(MODULE+caller, lbB);

    document.body.innerHTML = ""
      //+ "<button onclick='js_boxing.onload()'>js_boxing.onload()</button>\n"
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
let caller = "text_to_HTML";
if(log_this) log(MODULE+caller, lbB);
    // TRACK CODE-SECTION LINES ● get page header offset to first file content {{{
    let last_BOXD_index;
    let in_code = {};
    let recently_visited_header_lines = 0;
    let first_closing_vim_fold = data_in.indexOf("\n}}");
    if( first_closing_vim_fold > 0) {
        recently_visited_header_lines
            = data_in.substr(0, first_closing_vim_fold).split("\n").length;
    }
    //}}}
    // FILTER ● file name related {{{
    let file_name
        = js_xpath
        .  parse_url(document.location.href)
        .  path
        .  match(/([^\/?#]*)(?:[?#]|$)/)?.[1] ?? "";  // strip any query or fragment

    // CODE-PAGE
    if(   js_linkify.line_match_supported_extension( file_name )
       && file_name.match(/\.js$/)
      ) {
        in_code.code_page = file_name;
        in_code.top_line  = 1;
    }
    //}}}
    // SPLIT MULTIPLE TOKEN ON THE SAME LINE {{{
    // i.e. ### The Workflow //PAT_VOPEN
    data_in = data_in.replace(/(#[^\n]*)(\/\/\{\{\{)/mg, "$1\n$2");

    //}}}
    // LINE FILTER {{{
    let data_out = "";
    let    lines = data_in.split("\n");
    for(let i = 0; i < lines.length; ++i)
    {
        // PAGE LINE #i {{{
        let l = lines[i];

//{{{
if(log_this) log("%c"+l, "background-color: #008;");//FIXME
//}}}
        //}}}
        // TRIM LINE {{{
        l =         l.  replace(                  /</g, "&lt;"           ); // html entities
        l =         l.  replace(                  />/g, "&gt;"           ); // html entities

        l =         l.  replace(              /^\s+$/ , ""               ); // trailing-spaces
        //}}}
        // VIM FOLD DETAILS {{{
        if( RGX_VOPEN_OR__VCLOSE_LINE.exec(l) )
        {
          //data_out += js_md.md_format_header_line(""); // CLOSE ALL PENDING DETAILS
            l =  vim_fold_line        (l, file_name, i-recently_visited_header_lines);

//if( l.includes("<!-- vim_fold") ) log(l);
        }
        //}}}
        // MARKDOWN * ➔ font-style {{{
        else if(!in_code.code_page && l.match(/[\*_~`'"][\S ]+[\*_~`'"]/))
        {
            l = js_md.md_format_line_style(l);
        }
//{{{
//        else if(in_code && l.match(/^\s*\/\//))
//        {
//            l = l.replace(/(\/\/.*)/, "<em class='md m'>$1</em>");
//        }
//}}}
        //}}}
        // MARKDOWN # HEADER line ➔ H1..H6 {{{
        if( l.match(/^ *#|^\s*EOF/) ) {
            l = js_md
                .md_format_header_line(l, file_name, i-recently_visited_header_lines);

        }
        //}}}
        // BOXING {{{
            l =     l.  replace(/ *\/[\/\\*] *(┌.*$)/g, "<BOXU>$1</BOXU>"); // BOX UP
            l =     l.  replace(/ *\/[\/\\*] *(│.*$)/g, "<BOXM>$1</BOXM>"); // BOX MIDDLE
            l =     l.  replace(/ *\/[\/\\*] *(├.*$)/g, "<BOXM>$1</BOXM>"); // BOX SEP
            l =     l.  replace(/ *\/[\/\\*] *(┼.*$)/g, "<BOXM>$1</BOXM>"); // BOX SEP
            l =     l.  replace(/ *\/[\/\\*] *(┤.*$)/g, "<BOXM>$1</BOXM>"); // BOX SEP
            l =     l.  replace(/ *\/[\/\\*] *(└.*$)/g, "<BOXD>$1</BOXD>"); // BOX DOWN

            if( l.includes("BOX") )
                l = l.  replace(       /[└┘┌┐│─├┼┤]+/g, "" /*HTML_NBSP*/ ); // UTF-8 BOXING

            //┌────────────────────────────────────────────────────────────────┐
            //│ Handle BOXD [last_of_group] not followed by a following BOXU
            //│ by altering last buffered line containing a BOXD at index
            //└────────────────────────────────────────────────────────────────┘
            if( l.includes("BOXD") ) {
                last_BOXD_index = data_out.length; // where it will be added
            }
            //┌────────────────────────────────────────────────────────────────┐
            //│ ENDING A BOX GROUP
            //└────────────────────────────────────────────────────────────────┘
            else if(!l.includes("BOX") && last_BOXD_index)
            {
                let at  = data_out.indexOf("<BOXD>", last_BOXD_index);
                if( at >= 0) {
                    data_out = data_out.slice(0, at)
                             + "<BOXD class='last_of_group'>"
                             + data_out.slice(at + "<BOXD>".length);
                }
                last_BOXD_index = undefined;
            }
        //}}}
        // COMMENT {{{
        l =         l.  replace(           / *\/\* */g, ""               ); // 👉  /*   👈 // COMMENT START
        l =         l.  replace(           / *\*\/ */g, ""               ); // 👉  */   👈 // COMMENT END
        l =         l.  replace(        / *\[\.+\] */g, ""               ); // 👉 [...] 👈 Copilot comment

        //┌────────────────────────────────────────────────────────────────────┐
        //│ LF ■
        //└────────────────────────────────────────────────────────────────────┘
        l =         l.  replace(                /\\n/g,      HEX_21B2    ); // inline [LF]  TO [↲] .. (i.e. \n\n)
        l =         l.  replace(         /\> *\/\/ */g, ">"              ); //       [>// ] TO []
//      l =         l.  replace(           / *\/\/ */g,      HEX_25A0+" "); //        [//]  TO [■]
//      l =         l.  replace(     /\> *[^:]\/\/ */g, ">"              ); //       [>// ] TO []

        //┌────────────────────────────────────────────────────────────────────┐
        //│ [//] TO [■]
        //└────────────────────────────────────────────────────────────────────┘
        if(   (!in_code.code_page && !in_code.top_line)
           || ( in_code.code_page &&  l.match(/^\s*\/\/\s<\/pre/))  // blank comment
          )
            l =     l.  replace(   /(^|[^:])(\/\/ *)/g, "$1"+HEX_25A0+" "); // [//]  TO [■]

        //┌────────────────────────────────────────────────────────────────────┐
        //│ Markdown comment decoration ● 'md m'  @see SERVER/style/to_html.css
        //└────────────────────────────────────────────────────────────────────┘
        if(     in_code.code_page ||  in_code.top_line) {
            l =     l.  replace(           /(\/\/.*?)(\<\/.*)/ , "<em class='md m'>$1</em>$2");
            l =     l.  replace(         /(\u25A0.*?)(\<\/.*)/ , "<em class='md m'>$1</em>$2");
        }

        //}}}
        // CODE_3BACK_TICS ● (entering or leaving code section) {{{
        let       s = l.trim();
        let matches = !in_code.code_page && RGX_CODE_3BACK_TICS.exec( lines[i] );
        if( matches )
        {
            // CODE END
            if( in_code.top_line )
            {
                l = "```</pre>\n";

                if(in_code.v_fold)
                    l +=  vim_fold_line(STR_VCLOSE, file_name, i-recently_visited_header_lines);

                in_code.top_line   = 0;
            }
            // CODE START
            else {
              //in_code.top_line   = i - recently_visited_header_lines;
                in_code.top_line   = i;

                in_code.code   = lines[i];

                let language   = (matches[1] || "");
                let v_fold     = (matches[2] || "");
                in_code.v_fold = v_fold;

                if( v_fold )
                    data_out  += vim_fold_line(STR_VOPEN+language, file_name, i-recently_visited_header_lines);

                l =  "<pre class='code "+      language +"'>"
                  +  "```"                   + language
                //+  "<code class='language-"+ language +"'>"    // @see SERVER/style/to_html.css
                ;
            }
        }
        //}}}
        //┌────────────────────────────────────────────────────────────────────┐
        //│ [code_line] IN CODE SECTION
        //└────────────────────────────────────────────────────────────────────┘
        else if((i > recently_visited_header_lines) && in_code.top_line)
        {
            //┌────────────────────────────────────────────────────────────────┐
            //│ When rendering an *in_code.code_page* source code,
            //│ while parsing the *recently visited section*
            //│ the first *top_line* may be negative
            //└────────────────────────────────────────────────────────────────┘
            if( in_code.top_line < recently_visited_header_lines) {
                in_code.top_line = recently_visited_header_lines;
            }
            //┌────────────────────────────────────────────────────────────────┐
            //│ decorate only when not already rendered by vim_fold_line
            //└────────────────────────────────────────────────────────────────┘
            if((in_code.top_line >= 1) && !l.includes("data-badge"))
            {
                let code_line = i - in_code.top_line;
              //l   =                      (""+code_line).padStart(5)          + l +"\n";
                l   = "<em class='md l'>"+ (""+code_line).padStart(5) +"</em> "+ l +"\n";
            }
        }
        //┌────────────────────────────────────────────────────────────────────┐
        //│ ENDING .. SECTION
        //└────────────────────────────────────────────────────────────────────┘
        // LF Add or Trim {{{
        if( s.length )
        {
            if(      s.endsWith("</pre>"    )
                  || s.endsWith("</boxd>"   )
                  || s.endsWith("</details>")
                  || s.endsWith("</h1>"     )
                  || s.endsWith("</h2>"     )
                  || s.endsWith("</h3>"     )
                  || s.endsWith("</h4>"     )
                  || s.endsWith("</h5>"     )
                  || s.endsWith("</h6>"     )
              )
                l  = l.trim();

            else if(!l.endsWith("\n") )
                l += "\n";
        }
        //}}}

        data_out +=             l  ;
    }
    //}}}
// WARN MISSING A CODE-END-MARKER {{{
if(/*tag_this &&*/ !in_code.code_page && in_code.top_line)//FIXME
{
    let i = lines.length;
    log( "❌ %c"+ (i - in_code.top_line) +" code lines: from "+in_code.top_line+" to "+ i +":\t%c"+ in_code.code
            ,lf6                                                                              ,lb2              );

    log( "❌ %c missing a code-end-marker: %c ``` "
            ,lf2                          ,lb2     );
}
//}}}
    // MARKDOWN BUFFER FORMAT {{{
    // ● close markdown-header-generated-details  (✘ currently opted-out)
    data_out += js_md.md_format_header_line( ""       );

    // ● markdown table
    data_out  = js_md.md_format_table      ( data_out );

    // ● markdown NUMBER-LINE-HEADER
    data_out  = box_insert_md_NUMBER_LF    ( data_out );

    //}}}
    // return a TO-HTML-PRE container {{{

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ● tag recently_visited section ● @see js_linkify.url_to_href decorating
    //└────────────────────────────────────────────────────────────────────────┘
    data_out  = data_out.replace(/<pre>/, "<pre id='recently_visited'>");

    return   "<pre>"+ data_out +"</pre>\n";
    //}}}
};
/*}}}*/
/*_ box_insert_md_NUMBER_LF {{{*/
let box_insert_md_NUMBER_LF = function( data_in )
{
    //┌─────────────┐
    //│ *** NUMBER  │
    //│ ↓↓↓↓↓↓↓↓↓↓  │
    //│ LF          │
    //│ *** NUMBER  │
    //└─────────────┘
    return data_in
        . replace(/(\n *\*+ *\d)/g  , "\n$1"                        )
    ;
};
/*}}}*/
//┌────────────────────────────────────────────────────────────────────────────┐
//│ VIM FOLDS
//└────────────────────────────────────────────────────────────────────────────┘
/*● vim_fold_line {{{*/
// VIM REGEX {{{

//... REGEX
const STR_VOPEN                 = "{{"+"{";
const STR_VCLOSE                = "}}"+"}";
const RGX_CODE_3BACK_TICS       = new RegExp("```(\\w*) *("+STR_VOPEN+"|"+STR_VCLOSE+")?");

//... PATTERN
const PAT_VOPEN                 = "\\{\\{\\{";
const PAT_VCLOSE                = "\\}\\}\\}";
const PAT_BLOC                  = "(.*)"     ; // CAPTURING BLOC

//... REGEX
const RGX_VOPEN_AND_VCLOSE_LINE = new RegExp(PAT_VOPEN    + PAT_BLOC   + PAT_VCLOSE      ); // line contains both  VIM_FOLDs .. remove both
const RGX_VOPEN_OR__VCLOSE_LINE = new RegExp(PAT_VOPEN    +   "|"      + PAT_VCLOSE      ); // line contains     a VIM_FOLD  .. filter
const RGX_VOPEN_LINE            = new RegExp(PAT_BLOC     + PAT_VOPEN  + PAT_BLOC        ); // line contains open  VIM_FOLD  .. replace
const RGX_VCLOSE_LINE           = new RegExp(PAT_BLOC     + PAT_VCLOSE + PAT_BLOC        ); // line contains close VIM_FOLD  .. replace

//... REPLACEMENT
const RPL_VOPEN_AND_VCLOSE_LINE = "{{ {$1} }}"                                                       ; // remove both surrounding folds
const RPL_VCLOSE_LINE = ""
    + "$1 $2</pre></details>"                                                // vim close => OPEN  details+summary
//  + "<!-- vim_fold_close='_MD_HEAD_LEVEL_' -->"
;
const RPL_SUMMARY_TTL_LNU = ""
//  + "<!-- vim_fold_open ='_MD_HEAD_LEVEL_' -->"
    + "<details><summary title='_TTL_' data-badge='_LNU_'>$1 $2</summary><pre>" // vim open  => CLOSE details
;
//}}}
let vim_fold_level= 0;
let vim_fold_line = function(l_in, file, l_num)
{

    let l = l_in.replace(RGX_VOPEN_AND_VCLOSE_LINE, RPL_VOPEN_AND_VCLOSE_LINE) // BOTH FIRST
        .    replace(RGX_VOPEN_LINE               , RPL_SUMMARY_TTL_LNU      )
        .    replace(                  /_TTL_/    , "line number "+l_num     )
        .    replace(                  /_LNU_/    , file +" line "+l_num     ) // SERVER/style/to_html.css
        .    replace(RGX_VCLOSE_LINE              , RPL_VCLOSE_LINE          )
    ;
    // [data-basename] ● @see js_linkify.linkify_file_pathes {{{
    if( l_in.includes("basename") )
    {
        //......................./00000000000000000000000000000000/
        //......................./                      111       /
        //......................./ (    basename   =    DIR     ) /
        //......................./ ▼    ▼▼▼▼▼▼▼▼   ▼    ▼▼▼     ▼ /
        let matches = l_in.match(/\(?\s*basename\s*=\s*(\S+)\s*\)?/);
        if( matches ) {
            l = l.replace( matches[0], "🔗"); // CONSUME DIRECTIVE
            let basename = matches[1].replace(/[\(\)]/,"");
            l = l.replace(/<pre>/, "<pre data-basename='"+basename+"'>");
//{{{
//log("%c matches[0]=["+ matches[0] +"]", "color: yellow");
//log("%c ..basename=["+ basename   +"]", "color: yellow");
//log("%c .........l=["+ l          +"]", "color: yellow");
//}}}
        }
    }
    //}}}

    if(     l.includes("vim_fold_open" )) vim_fold_level += 1;
    else if(l.includes("vim_fold_close")) vim_fold_level -= 1;
    l   =  l.replace(/_VIM_FOLD_LEVEL_/ , vim_fold_level);

    return l;
};
/*}}}*/

    // return {{{
    return { name: "js_boxing"
        ,    onload
        ,    box_out
        // DEBUG ONLY
        ,    text_to_HTML
    };
    //}}}
})();
try { module.exports = js_boxing; } catch(ex) {} /* eslint-disable-line no-unused-vars */ /* eslint-disable-line no-empty */
export { js_boxing }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window.js_boxing     = js_boxing;
