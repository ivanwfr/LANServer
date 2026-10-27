//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_md.js                                               _TAG (261027:17h:54)
//└────────────────────────────────────────────────────────────────────────────┘
let js_md = (function() {
"use strict";
/*● md_format_header_line {{{*/
let md_head_level = 0;
let md_format_header_line  = function(l_in, l_num)
{
    if( document_contains_hash_comment(document.location.pathname) )
        return l_in;
    let l_out = "";
    // CLOSE ANY OPENED HEADER {{{
    if(!l_in)
    {
        while(md_head_level)
        {
            l_out += ""
              //+    "md_head_level=["+md_head_level+"]\n" // DEBUG
                +    "</pre>\n</details>";
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
        l_out += l_in.replace(/(^ *#+.*)/, "<details>\n<summary title='line number "+l_num+"'>$1</summary>\n<pre>");
      //l_out += l_in.replace(/^ *#+(.*)/, "<details>\n<summary>$1</summary>\n<pre>");

        md_head_level += 1;
    }
    //}}}
    return l_out;
};
/*}}}*/
/*_ md_format_line_style {{{*/
let md_format_line_style = function(l_in)
{
    // @see SERVER/style/to_html.css
    let l_out
        = l_in
        .replace(            /\\\*/g,"_backslash_star_"                ) // mask   escaped star
        .replace(/\*\*([^\*]+)\*\*/g,"<strong class='md b'>$1</strong>")
        .replace(    /\*([^\*]+)\*/g,"<em     class='md i'>$1</em>"    )
        .replace(/_backslash_star_/g,"*"                               ) // unmask escaped star
    ;
    return l_out;
};
/*}}}*/
/*● md_format_table {{{*/
const RGX_TABLE_SEP    = new RegExp("-+ *:* *\| *:* *-+");

let md_format_table = function(data_in)
{
    let data_out = "";

    let lines = data_in.split("\n")                      ;  // keep indentation

    for(let i = 0; i < lines.length; ++i)
    {
        if(lines[i].match(/(?:BOX|\/\/)/))                  // non-capturing group
        {
            data_out     += lines[i].replace(/ *\/\/ ?/ , "") + "\n";
            continue;
        }
        let reached_md_table
            =                               lines[i    ].includes("|"       )
            && (  ((i < lines.length -1) && lines[i + 1].match(RGX_TABLE_SEP) ) //   one-liner header
                ||((i < lines.length -2) && lines[i + 2].match(RGX_TABLE_SEP) ) //   two-liner header
                ||((i < lines.length -3) && lines[i + 3].match(RGX_TABLE_SEP) ) // three-liner header
               );

        if( reached_md_table )
        {
            // collect any prefix
            let matches = lines[i].match(/(^[^\|]*)(\|.*)/);
            if( matches ) {
                data_out +=   matches[1];
                lines[i]  =   matches[2];
            }
            //┌────────────────────────────────────────────────────────────────┐
            //│ Swallow all lines containing a pipe `|`
            //└────────────────────────────────────────────────────────────────┘
            let table_rows = "";
            while(i < lines.length && lines[i].includes("|"))
            {
                let row = lines[i].replace(/^[^|]*/, "").trim();
                if( row ) table_rows += row + "\n";
                i += 1;
            }
            //┌────────────────────────────────────────────────────────────────────────────┐
            //│ ...and give them to the table formatter
            //└────────────────────────────────────────────────────────────────────────────┘
            if( table_rows ) {
                data_out   += md_format_table_row_to_html( table_rows.trim() );
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
/*_ md_format_table_row_to_html {{{*/
let md_format_table_row_to_html = function( table_rows )
{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ...................................LF...|..... remove leading <br>
    //└────────────────────────────────────▼▼───▼──────────────────────────────┘
    table_rows = table_rows.replace(/ *\\ *\n *\| */g, "<br>");
    table_rows = table_rows.replace(        /\|<br>/g, "|"   );

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Split into lines ● ignore empty lines
    //└────────────────────────────────────────────────────────────────────────┘
    let lines
        = table_rows.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

    if (lines.length < 2) return "";

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Parse table header line lines[0]
    //└────────────────────────────────────────────────────────────────────────┘
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Parse table rows lines[2,]
    //└────────────────────────────────────────────────────────────────────────┘
    let headerCells = [];
    let dataRows    = [];
    for(let i = 0; i < lines.length; i++)
    {
        //┌────────────────────────────────────────────────────────────────────┐
        //│ skip separator lines[1] `|-|-|`
        //└────────────────────────────────────────────────────────────────────┘
        if(i == 1) continue;

        let line
            = lines[i]
            .  replace( /^ *\/\/ *│ */ ,""                     ) // extract table from a box
            .  replace(         /\\\|/g,"_backslash_pipe_"     ) // mask escaped pipe
            .  replace(         /\\\\/g,"_backslash_backslash_") // mask escaped backspace
            .  replace(        /\\(.)/g,"$1"                   ) // mask escaped ...others
        ;

        //┌────────────────────────────────────────────────────────────────────┐
        //│ PARSE ROW LINES
        //└────────────────────────────────────────────────────────────────────┘
        let row
            = md_format_table_row( line );

        if(i == 0)  headerCells  = row  ;
        else        dataRows.push( row );
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
        let     text = cell.trim().replace(/_backslash_pipe_/g     ,"|" )   // unmask escaped pipe
                                  .replace(/_backslash_backslash_/g,"\\");  // unmask escaped backspace
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
            let text = cell.trim().replace(/_backslash_pipe_/g     ,"|" )   // unmask escaped pipe
                                  .replace(/_backslash_backslash_/g,"\\");  // unmask escaped backspace
            html    += `   <td>${text}</td>\n`;
        }
        html += "  </tr>\n";
    }

    html += " </tbody>\n";
    //}}}

    // CLOSE TABLE
    html += "</table>\n";

    return html;
};
/*}}}*/
/*_ md_format_table_row {{{*/
let md_format_table_row = function(line)
{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ CONSUME PIPE DELIMITERS
    //└────────────────────────────────────────────────────────────────────────┘
    if (line.startsWith("|")) line = line.slice(1   );
    if (line.endsWith  ("|")) line = line.slice(0,-1);

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ decorations
    //└────────────────────────────────────────────────────────────────────────┘
    line = line
        .replace(    /&lt;br&gt;/g,"_br_"       ) // <br>
        .replace(          /null/g,"🖕"         ) // NUL
        .replace(         /false/g,"👎"         ) // false
        .replace(          /true/g,"👍"         ) // true
        .replace(           / *▼/g,"_br_"       ) // LF
        .replace(           / *➔/g,"\t"         ) // TAB
        .replace( / *● *([^●]*●)/ ,"_br_👉 $1"  ) // or
        .replace(         / *● */g,"_br_or "    ) // or
        .replace(      /\|_br_ */g,"|"          ) // ...delete leading <br>
        .replace(      /<br>_br_/g,"<br>"       ) // ...delete added <br> too many
        .replace(          /_br_/g,"<br>"       ) // ...commit required <br>
    ;

    //......................._▼___(NOBS__+BS2___NoBS)_$_________________(DEFAULT_STRING___)
    let result = line.split(/\|(?=(?:[^\\]*\\{2})*[^\\]*$)/).map((c) => (c ? c.trim() : ""));
    //............................(non-capturing-group___)

    return result;
};
/*}}}*/
/*_ document_contains_hash_comment {{{*/
//{{{
const RGX_DOC_PATH_NAMES
    = [  ".bash"
      ,  ".ksh"
      ,  ".py"
      ,  ".pyw"
      ,  ".sh"
      ,  ".tcl"
      ,  ".zsh"
      ,  "makefile"
    ];
let   RGX_DOC_PATH;
//}}}
let document_contains_hash_comment = function(pathname)
{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ RGX_DOC_PATH
    //└────────────────────────────────────────────────────────────────────────┘
    //{{{
    if(!RGX_DOC_PATH )
    {
        let s = "";
        RGX_DOC_PATH_NAMES.forEach((pattern) => s += "|"+pattern.replace(".","\."));
        s     = s.substr(1); // trim extra first pipe
        RGX_DOC_PATH = new RegExp("("+s+")","i");
//console.log("RGX_DOC_PATH:", RGX_DOC_PATH);
    }
    //}}}

    //┌────────────────────────────────────────────────────────────────────────┐
    //│.................server_loop.sh
    //└────────────────────────────▼(▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼)─────────────────┘
    let matches = pathname.match( RGX_DOC_PATH );
    let result  = matches && matches[1];
    return result;
};
/*}}}*/
    // return {{{
    return { name: "js_md"
        ,    md_format_header_line
        ,    md_format_line_style
        ,    md_format_table
    };
    //}}}
})();
export { js_md       }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_md = js_md; /* exposed to inline onclick handlers */
