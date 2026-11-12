//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_md.js                                               _TAG (261112:16h:29)
//├────────────────────────────────────────────────────────────────────────────┤
//│{{{
//│ *md_format_header_line* Opens and Close a DETAILS>SUMMARY,PRE for each MD header
//│}}}
//└────────────────────────────────────────────────────────────────────────────┘
let js_md = (function() {
//┌────────────────────────────────────────────────────────────────────────────┐
//│ OPEN AND CLOSE A *DETAILS > SUMMARY , PRE* FOR EACH *MD HEADER*
//└────────────────────────────────────────────────────────────────────────────┘
/*● md_format_header_line {{{*/
// GFM REGEX {{{
//............/^0-3space(......)...[spac](few)..[space$]
let md_head_level = null;
//}}}
let md_format_header_line  = function(l_in, file, l_num) /* eslint-disable-line no-unused-vars */
{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ IGNORE NON-MARKDOWN CONTENT LINES
    //└────────────────────────────────────────────────────────────────────────┘
    if( document_contains_hash_comment(document.location.pathname) )
        return l_in;
    let l_out = "";

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ CLOSING PREVIOUS HEADERS
    //├────────────────────────────────────────────────────────────────────────┤
    //│ *rank*       ● HEADER LEVEL GFM COMPLYING
    //│ - min: 1
    //│ - max: 6
    //│ - An empty line will be received at EOF
    //│   as a request to close all headers.
    //└────────────────────────────────────────────────────────────────────────┘
      let rank       = rank_of(l_in); /* eslint-disable-line no-unused-vars */
//    // close_sub_headers {{{
//    l_out += close_sub_headers( 0 ); // CLOSE ALL HEADER
//    //}}}
//{{{
// console.log(""
// + "┌─────────────────────────────────┐\n"
// +   l_in                           + "\n"
// + "● rank......=["+rank            +"]\n"
// + "└─────────────────────────────────┘"
// );
//}}}
//{{{
//    let eof = l_in.match(/^\s*EOF/);
//    if( eof || rank )
//        l_out += close_sub_headers( rank );
//    else
//        l_out  = l_in;
//}}}
    if(rank)
        l_out = l_in.replace(/^ *#+ *(.*?) *$/, "<h"+rank+">$1</h"+rank+">");

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ OPENING A NEW HEADER
    //├────────────────────────────────────────────────────────────────────────┤
    //│ *md_head_level* is the static **CURRENT HEADER LEVEL**
    //│ - It will have to be closed
    //│   before opening the next higher rank header
    //│   or when handling EOF.
    //└────────────────────────────────────────────────────────────────────────┘
//    // md_fold_line {{{
//    if(rank > 0) {
//        md_head_level += 1;
//        l_out += md_fold_line(l_in, file, l_num);
//    }
//    //}}}
//{{{
//if( l_in.match(/^\s*EOF/) ) console.log("md_format_header_line:\n"+ l_in);
// console.log(""
// + "┌─────────────────────────────────┐\n"
// +    l_in                          + "\n"
// + "● rank...=["+rank   +"]\n"
// + "● md_head_level=["+md_head_level+"]\n"
// + "└─────────────────────────────────┘"
// );
//}}}

    return l_out || l_in;
};
/*}}}*/
/*_ rank_of {{{*/
const RGX_ATX = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?[ \t]*$/;   // GFM-correct
let rank_of = function(l)
{
    let    m = l.match(RGX_ATX);
    return m
        ? m[1].length
        : 0
    ;
};
/*}}}*/
/*_ close_sub_headers {{{*/
let close_sub_headers = function(rank) /* eslint-disable-line no-unused-vars */
{
    // NO HEADER TO CLOSE ON FIRST PAGE ACCESS
    if(md_head_level == null)
    {
        md_head_level = 0;
        return "";
    }

    // CLOSE SUB HEADERS
    let l_out = "";
    while(   (md_head_level >  0         )
          && (md_head_level >= rank))
    {
        l_out += "</pre>\n</details>\n"
            +    "<!-- md_head_close='"+md_head_level+"' -->\n";
        md_head_level -= 1;
    }
    return l_out;
};
/*}}}*/
/*_ md_fold_line {{{*/
// MD_HEADER REGEX ➔ REPLACEMENT {{{

//... PATTERN
const PAT_MD_HEADER       = "^ *(#+) +"; // CAPTURING BLOC
const PAT_TAIL            = "(.*) *$"  ; // CAPTURING BLOC

//... REGEX
const RGX_MD_HEADER_LINE  = new RegExp(PAT_MD_HEADER + PAT_TAIL);

//... REPLACEMENT
const RPL_SUMMARY_TTL_LNU
    = "<!-- md_head_open='_MD_HEAD_LEVEL_' -->"
    + "<details>\n<summary title='_TTL_' data-badge='_LNU_'>$1 $2</summary>\n<pre>";

//}}}
let md_fold_line = function(l_in, file, l_num) /* eslint-disable-line no-unused-vars */
{
    let l = l_in
        .    replace(RGX_MD_HEADER_LINE           , RPL_SUMMARY_TTL_LNU      )
        .    replace(                  /_TTL_/    , "line number "+l_num     )
        .    replace(                  /_LNU_/    , file +" line "+l_num     ) // SERVER/style/to_html.css
    ;

    l   =  l.replace(/_MD_HEAD_LEVEL_/, md_head_level);
    return l;
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ FORMAT MD *EMPHASIS* AND *STRONG* TEXT STYLES @see SERVER/style/to_html.css
//└────────────────────────────────────────────────────────────────────────────┘
/*● md_format_line_style {{{*/
/* eslint-disable quotes */

//┌────────────────────────────────────────────────────────────────────────────┐
//│ USE A UNIQUE PLACEHOLDER THAT WON'T COLLIDE WITH USER CONTENT
//└────────────────────────────────────────────────────────────────────────────┘
const ESCAPE_PREFIX = '\x00MD_ESC\x00';

//┌────────────────────────────────────────────────────────────────────────────┐
//│ BROADER CHARACTER CLASS FOR GFM / UTF-8 SUPPORT
//│ MATCHES ANY WORD-LIKE CHARACTER INCLUDING
//│ UNICODE LETTERS, DIGITS, HYPHENS, DOTS
//└────────────────────────────────────────────────────────────────────────────┘
const WORD = `(?:[\\p{L}\\p{N}_\\.=\\-<>+/\\\\(){}\\[\\];:,!?'"#@$%^&|]|${ESCAPE_PREFIX}SPACE${ESCAPE_PREFIX})+`;

//┌────────────────────────────────────────────────────────────────────────────┐
//│ REGEX ● COMPILED ONCE AT MODULE LOAD, REUSED ON EVERY CALL
//└────────────────────────────────────────────────────────────────────────────┘
//{{{
const RE_CODE_BLOCK   = /```([\s\S]*?)```/g; // literal — already cached
const RE_CODE_INLINE  = new RegExp(         `\x60(${WORD})\x60`      , 'gu');
const RE_STRIKE       = new RegExp(           `~~(${WORD})~~`        , 'gu');
const RE_S_BOLDITALIC = new RegExp(    `\\*\\*\\*(${WORD})\\*\\*\\*` , 'gu');
const RE_S_BOLD       = new RegExp(       `\\*\\*(${WORD})\\*\\*`    , 'gu');
const RE_S_ITALIC     = new RegExp(          `\\*(${WORD})\\*`       , 'gu');
const RE_QUOTE        = new RegExp(`(?<![\\p{L}\\p{N}])${ESCAPE_PREFIX}QUOTE${ESCAPE_PREFIX}(${WORD})${ESCAPE_PREFIX}QUOTE${ESCAPE_PREFIX}`  , 'gu');
const RE_DQUOTE       = new RegExp(`(?<![\\p{L}\\p{N}])${ESCAPE_PREFIX}DQUOTE${ESCAPE_PREFIX}(${WORD})${ESCAPE_PREFIX}DQUOTE${ESCAPE_PREFIX}`, 'gu');

// WORD for CONTENT inside emphasis (includes letters, digits, dots, hyphens, spaces, underscores)
const WORD_CONTENT    = `(?:[\\p{L}\\p{N}_.\\-]|${ESCAPE_PREFIX}SPACE${ESCAPE_PREFIX})+`;

// Underscore italic: _ not preceded/followed by word char or underscore
const RE_U_ITALIC     = new RegExp(`(?<![\\p{L}_])_(${WORD_CONTENT})_(?![\\p{L}_])`    , 'gu');

// Underscore bold: __ not preceded/followed by word char or underscore
const RE_U_BOLD       = new RegExp(`(?<![\\p{L}_])__(${WORD_CONTENT})__(?![\\p{L}_])`  , 'gu');

// Underscore bold+italic: ___ not preceded/followed by word char or underscore
const RE_U_BOLDITALIC = new RegExp(`(?<![\\p{L}_])___(${WORD_CONTENT})___(?![\\p{L}_])`, 'gu');

//┌────────────────────────────────────────────────────────────────────────┐
//│ RESTORE ESCAPED CHARACTERS
//└────────────────────────────────────────────────────────────────────────┘
const ESC = (name) => new RegExp(ESCAPE_PREFIX + name + ESCAPE_PREFIX, 'g');
const RE_R_STAR       = ESC('BS_STAR'     );
const RE_R_UNDER      = ESC('BS_UNDER'    );
const RE_R_TILDE      = ESC('BS_TILDE'    );
const RE_R_BACKTICK   = ESC('BS_BACKTICK' );
const RE_R_QUOTE      = ESC('QUOTE'       );
const RE_R_DQUOTE     = ESC('DQUOTE'      );
const RE_R_SPACE      = ESC('SPACE'       );
const RE_R_ESC_QUOTE  = ESC('ESC_QUOTE'   );
const RE_R_ESC_DQUOTE = ESC('ESC_DQUOTE'  );
const RE_R_STRIP      = new RegExp(ESCAPE_PREFIX, 'g');

//}}}

let md_format_line_style = function(l_in)
{
    let l_out = l_in;

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ESCAPE SPECIAL CHARACTERS WITH UNIQUE PLACEHOLDERS
    //└────────────────────────────────────────────────────────────────────────┘
    l_out = l_out
        .replace(   /\\\*/g, ESCAPE_PREFIX + 'BS_STAR'     + ESCAPE_PREFIX)
        .replace(    /\\_/g, ESCAPE_PREFIX + 'BS_UNDER'    + ESCAPE_PREFIX)
        .replace(    /\\~/g, ESCAPE_PREFIX + 'BS_TILDE'    + ESCAPE_PREFIX)
        .replace( /\\\x60/g, ESCAPE_PREFIX + 'BS_BACKTICK' + ESCAPE_PREFIX)
        .replace(      /'/g, ESCAPE_PREFIX + 'QUOTE'       + ESCAPE_PREFIX)
        .replace(    /\\"/g, ESCAPE_PREFIX + 'ESC_DQUOTE'  + ESCAPE_PREFIX)
        .replace(    /\\'/g, ESCAPE_PREFIX + 'ESC_QUOTE'   + ESCAPE_PREFIX)
        .replace(      /"/g, ESCAPE_PREFIX + 'DQUOTE'      + ESCAPE_PREFIX)
        .replace(      / /g, ESCAPE_PREFIX + 'SPACE'       + ESCAPE_PREFIX)
        ;

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ DECORATE MARKDOWN — ORDER: STRONGEST FIRST TO AVOID NESTING ISSUES
    //└────────────────────────────────────────────────────────────────────────┘
    l_out = l_out
        // STRIKETHROUGH (GFM)
        .replace(RE_STRIKE      ,         '<del class="md d">$1</del>'         )

        // BOLD+ITALIC
        .replace(RE_S_BOLDITALIC, '<strong><em class="md b i">$1</em></strong>')
        .replace(RE_U_BOLDITALIC, '<strong><em class="md b i">$1</em></strong>')

        // BOLD
        .replace(RE_S_BOLD      ,      '<strong class="md b">$1</strong>'      )
        .replace(RE_U_BOLD      ,      '<strong class="md b">$1</strong>'      )

        // ITALIC
        .replace(RE_S_ITALIC    ,          '<em class="md i">$1</em>'          )
        .replace(RE_U_ITALIC    ,          '<em class="md i">$1</em>'          )

        // CODE
        .replace(RE_CODE_BLOCK  ,'<pre class="md code"><code>$1</code></pre>'  )
        .replace(RE_CODE_INLINE ,        '<code class="md c">$1</code>'        )

        // STRINGS
        .replace(RE_DQUOTE      ,          '<em class="md s">\x22$1\x22</em>'  )
        .replace(RE_QUOTE       ,          '<em class="md s">\x27$1\x27</em>'  )
        ;

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ RESTORE ESCAPED CHARACTERS
    //└────────────────────────────────────────────────────────────────────────┘
    l_out = l_out
        .replace(RE_R_STAR       , '*')
        .replace(RE_R_UNDER      , '_')
        .replace(RE_R_TILDE      , '~')
        .replace(RE_R_BACKTICK   , '`')
        .replace(RE_R_QUOTE      , "'")
        .replace(RE_R_DQUOTE     , '"')
        .replace(RE_R_SPACE      , ' ')
        .replace(RE_R_ESC_QUOTE  , "'")
        .replace(RE_R_ESC_DQUOTE , '"')
        .replace(RE_R_STRIP      ,  '')
        ;

    return l_out;
};
/* eslint-enable  quotes */
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ FORMAT *MD TABLE*
//└────────────────────────────────────────────────────────────────────────────┘
/*● md_format_table {{{*/
const RGX_TABLE_SEP    = new RegExp("-+ *:* *\| *:* *-+");

let md_format_table = function(data_in)
{
    let data_out = "";

    let lines = data_in.split("\n");                            // keep indentation

    let in_code;
    for(let i = 0; i < lines.length; ++i)
    {
        if( lines[i].includes("```") )
            in_code = !in_code;

        if(lines[i].match(/(?:BOX|^\s*\/\/)/))                  // non-capturing group
        {
            if(in_code) data_out += lines[i]                          + "\n";
            else        data_out += lines[i].replace(/ *\/\/ ?/ , "") + "\n";
            continue;
        }
        let single_pipe = lines[i].match(/(?:^|[^\|])(?:\|[^\|])/);
        let reached_md_table
            =                               single_pipe
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
            .  replace(          /\\§/g,"_cr_"                 ) // mask escaped cr
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
                                  .replace(/_backslash_backslash_/g,"\\")   // unmask escaped backspace
                                  .replace(/_cr_/g                 ,"§" )   // unmask escaped cr
        ;
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
                                  .replace(/_backslash_backslash_/g,"\\")   // unmask escaped backspace
                                  .replace(/_cr_/g                 ,"§" )   // unmask escaped cr
            ;
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
      //.replace(      /\bnull\b/g,"🖕"         ) // NUL
        .replace(         /false/g,"👎"         ) // false
        .replace(          /true/g,"👍"         ) // true
      //.replace(           / *▼/g,"_br_"       ) // LF
      //.replace(           / *↵/g,"_br_"       ) // LF  // inoremap: ^KCR
      //.replace(           / *¶/g,"_br_"       ) // LF  // digraphs: ^Kpp ¶ PARAGRAPH ● http://xahlee.info/comp/unicode_reference_symbol.html
        .replace(           / *§/g,"_br_"       ) // LF  // digraphs: ^KSE § SECTION   ● http://xahlee.info/comp/unicode_reference_symbol.html
        .replace(           / *➔/g,"\t"         ) // TAB
        .replace( / *● *([^●]*●)/ ,"_br_👉 $1"  ) // or
        .replace(         / *● */g,"_br_or "    ) // or
        .replace(      /\|_br_ */g,"|"          ) // ...delete leading <br>
        .replace(      /<br>_br_/g,"<br>"       ) // ...delete added <br> too many
        .replace(          /_br_/g,"<br>"       ) // ...commit required <br>
        .replace(          /_lb_/g,"{"          ) // guarded VIM_FOLDS OPEN
        .replace(          /_rb_/g,"}"          ) // guarded VIM_FOLDS CLOS
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
//┌────────────────────────────────────────────────────────────────────────────┐
//│ PUBLIC
//└────────────────────────────────────────────────────────────────────────────┘
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
