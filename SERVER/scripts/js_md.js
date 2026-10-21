//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_md.js                                               _TAG (261021:02h:51)
//└────────────────────────────────────────────────────────────────────────────┘
let js_md = (function() {
"use strict";
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
//nst MD_TABLE_DELIM_1 = "- | -";
//nst MD_TABLE_DELIM_2 =  "-|-";
const RGX_TABLE_SEP    = new RegExp("-+ *:* *\| *:* *-+");

let md_format_table = function(data_in)
{
//console.log("js_md.md_format_table");
    let data_out = "";

  //let lines = data_in.split("\n").map((l) => l.trim()) ; // keep empty lines
    let lines = data_in.split("\n")                      ; // keep indentation

    for(let i = 0; i < lines.length; ++i)
    {
        let reached_md_table
            =                               lines[i    ].includes("|"       )
            && (  ((i < lines.length -1) && lines[i + 1].match(RGX_TABLE_SEP) ) //   one-liner header
                ||((i < lines.length -2) && lines[i + 2].match(RGX_TABLE_SEP) ) //   two-liner header
                ||((i < lines.length -3) && lines[i + 3].match(RGX_TABLE_SEP) ) // three-liner header
               );

        if( reached_md_table )
        {
//console.log("%c"+           lines[i], "background-color: #400;");
            // collect any prefix
            let matches = lines[i].match(/(^[^\|]*)(\|.*)/);
            if( matches ) {
                data_out +=   matches[1];
                lines[i]  =   matches[2];
//console.log("%c matches[1]=["+ matches[1] +"]", "color: #F00;");
//console.log("%c matches[2]=["+ matches[2] +"]", "color: #0FF;");
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

    table_rows = table_rows.replace(/ *\\ *\n *\|/g, "<br />");

    //┌────────────────────────────────────────────────────────────────────────────┐
    //│ Split into lines ● ignore empty lines
    //└────────────────────────────────────────────────────────────────────────────┘
    let lines
        = table_rows.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

    if (lines.length < 2) return "";

    //┌────────────────────────────────────────────────────────────────────────────┐
    //│ Parse table header line lines[0]
    //└────────────────────────────────────────────────────────────────────────────┘
    //┌────────────────────────────────────────────────────────────────────────────┐
    //│ Parse table rows lines[2,]
    //└────────────────────────────────────────────────────────────────────────────┘
    let headerCells = [];
    let dataRows    = [];
    for(let i = 0; i < lines.length; i++)
    {
        //┌────────────────────────────────────────────────────────────────────────────┐
        //│ skip separator lines[1] `|-|-|`
        //└────────────────────────────────────────────────────────────────────────────┘
        if(i == 1) continue;

        let line
            = lines[i]
            .  replace(      / *\\ */g,"_backslash_")
            .  replace(/^ *\/\/ *│ */ ,           "")   // table in a box
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

    //┌────────────────────────────────────────────────────────────────────────────┐
    //│ CONSUME PIPE DELIMITERS
    //└────────────────────────────────────────────────────────────────────────────┘
    if (trimmed.startsWith("|")) trimmed = trimmed.slice(1   );
    if (trimmed.endsWith  ("|")) trimmed = trimmed.slice(0,-1);

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ decorations
    //└────────────────────────────────────────────────────────────────────────┘
    trimmed = trimmed.replace(          /null/g, "🖕"        ); // NUL
    trimmed = trimmed.replace(         /false/g,"👎"         ); // false
    trimmed = trimmed.replace(          /true/g,"👍"         ); // true
    trimmed = trimmed.replace(           / *▼/g, "<br>"      ); // LF
    trimmed = trimmed.replace(           / *➔/g, "\t"        ); // TAB
    trimmed = trimmed.replace( / *● *([^●]*●)/ ,"<br>👉 $1"  ); // or
    trimmed = trimmed.replace(         / *● */g,"<br>or "    ); // or
    trimmed = trimmed.replace(       /^<br> */g,""           ); // ...delete leading <br>

    // Split on unescaped pipes
    // 1. ADDS EMPTY CELLS
    return trimmed.split(/\|(?=([^\\]*\\{2})*[^\\]*$)/).map((c) => (c ? c.trim() : ""))                            ; // leaves empty cells

    // 2. EMPTY CELLS MAY SHIFT COLUMNS TO THE LEFT
    //return trimmed.split(/\|(?=([^\\]*\\{2})*[^\\]*$)/).map((c) => (c ? c.trim() : "")).filter((e) => e.length > 0); // left-shift on missing columns

};
/*}}}*/
    // return {{{
    return { name: "js_md"
        ,    md_format_head_line
        ,    md_format_table
    };
    //}}}
})();
export { js_md }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_md = js_md; // exposed to inline onclick handlers
