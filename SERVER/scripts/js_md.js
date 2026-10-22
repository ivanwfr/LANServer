//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_md.js                                               _TAG (261022:02h:54)
//└────────────────────────────────────────────────────────────────────────────┘
let js_md = (function() {
"use strict";
/*● md_format_header_line {{{*/
let md_head_level = 0;
let md_format_header_line  = function(l_in)
{
    let l_out = "";
    // CLOSE ALL OPENED HEADERs {{{
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
        l_out += l_in.replace(/(^ *#+.*)/, "<details>\n<summary>$1</summary>\n<pre>");
      //l_out += l_in.replace(/^ *#+(.*)/, "<details>\n<summary>$1</summary>\n<pre>");

        md_head_level += 1;
    }
    //}}}
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
                data_out   += md_format_table_to_html( table_rows.trim() );
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
/*_ md_format_table_to_html {{{*/
let md_format_table_to_html = function( table_rows )
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
            .  replace( /^ *\/\/ *│ */ ,""                     )   // table in a box
            .  replace(         /\\\|/g,"_backslash_pipe_"     )
            .  replace(         /\\\\/g,"_backslash_backslash_")
            .  replace(        /\\(.)/g,"$1"                   )
        ;

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
    let h=0;
    for (let cell of headerCells) {
        if(!(++h % 2)) continue; // skip even extra colums
        let     text = cell.trim().replace(/_backslash_pipe_/g     ,"|" )
                                  .replace(/_backslash_backslash_/g,"\\");
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
        let r=0;
        for(let cell of row) {
            if(!(++r % 2)) continue; // skip even extra colums
            let text = cell.trim().replace(/_backslash_pipe_/g     ,"|" )
                                  .replace(/_backslash_backslash_/g,"\\");
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
    //│ Parse a markdown table row into an array of cell strings.
    //│ Filter out:
    //│ - inlined         <br>
    //│ - escaped pipes   \\|
    //└────────────────────────────────────────────────────────────────────────┘
    let trimmed
        = line
        .  trim()
        .             replace(  / *&lt;br&gt;/g,"<br>"       )  // unescape <br>
        .             replace(          /\\\|/g,"|"          )  // escaped pipe
    ;

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ CONSUME PIPE DELIMITERS
    //└────────────────────────────────────────────────────────────────────────┘
    if (trimmed.startsWith("|")) trimmed = trimmed.slice(1   );
    if (trimmed.endsWith  ("|")) trimmed = trimmed.slice(0,-1);

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ decorations
    //└────────────────────────────────────────────────────────────────────────┘
    trimmed = trimmed.replace(          /null/g,"🖕"         ); // NUL
    trimmed = trimmed.replace(         /false/g,"👎"         ); // false
    trimmed = trimmed.replace(          /true/g,"👍"         ); // true
    trimmed = trimmed.replace(           / *▼/g,"_br_"       ); // LF
    trimmed = trimmed.replace(           / *➔/g,"\t"         ); // TAB
    trimmed = trimmed.replace( / *● *([^●]*●)/ ,"_br_👉 $1"  ); // or
    trimmed = trimmed.replace(         / *● */g,"_br_or "    ); // or
    trimmed = trimmed.replace(      /\|_br_ */g,"|"          ); // ...delete leading <br>
    trimmed = trimmed.replace(      /<br>_br_/g,"<br>"       ); // ...delete added <br> too many
    trimmed = trimmed.replace(          /_br_/g,"<br>"       ); // ...commit required <br>

    return trimmed.split(/\|(?=([^\\]*\\{2})*[^\\]*$)/).map((c) => (c ? c.trim() : ""));
  //return trimmed.split(/\|(?=([^\\]*\\{2})*[^\\]*$)/).map((c) => (c ? c.trim() : "")).filter((e) => e.length > 0); // left-shift on missing columns

};
/*}}}*/
    // return {{{
    return { name: "js_md"
        ,    md_format_header_line
        ,    md_format_table
    };
    //}}}
})();
export { js_md }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_md = js_md; // exposed to inline onclick handlers
