//┌────────────────────────────────────────────────────────────────────────────┐
//│ server5_content.js                                     _TAG (261007:19h:06)
//└────────────────────────────────────────────────────────────────────────────┘
/* IMPORT {{{*/

/*}}}*/
let server5_content = (function() {
"use strict";

//┌────────────────────────────────────────────────────────────────────────────┐
//│ REQUIRE
//└────────────────────────────────────────────────────────────────────────────┘
//            ● Node.js Modules:    ● ...
//  ● Server Modules:     ● log header ● listener ● network ● notes ● qtext {{{
let server0_log      = require("./server0_log.js");
// log inlining {{{
/* eslint-disable no-unused-vars */
let { log
    ,    toggle
    ,    is_logging
    ,    is_tagging
    ,    ellipsis

    ,    N

    ,    R
    ,    G
    ,    B

    ,    M
    ,    C
    ,    Y

    ,    log_N

    ,    log_R
    ,    log_G
    ,    log_B

    ,    log_C
    ,    log_M
    ,    log_Y

    ,    log_X

    ,    LF
    ,    ESC

    ,    TRACE_OPEN
    ,    TRACE_CLOSE

} = server0_log;
/* eslint-enable  no-unused-vars */
//}}}
//t server4_file     = require("./server4_file.js");
let server1_network  = require("./server1_network.js");
//t server2_listener = require("./server2_listener.js");
let server3_header   = require("./server3_header.js");
//t server5_content  = require("./server5_content.js");
//t server6_notes    = require("./server6_notes.js");
//}}}
//● Server Config:      ● config https http modules {{{

let config;

let onload = function(args)
{
    config              = args.config;
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ PRETTY-PRINT FOLDING AND BOXING
//└────────────────────────────────────────────────────────────────────────────┘
const FOLD_OPEN = "{{{"; /* eslint-disable-line no-unused-vars */
const FOLD_CLOSE= "}}}"; /* eslint-disable-line no-unused-vars */
/*    SCRIPT_QTEXT & STYLE_QTEXT {{{*/
const SCRIPT_QTEXT = ""
    + "<meta   name='color-scheme' content='light only'>\n"
    + "\n"
    + "<!--base   href='https://ivanwfr.github.io/LANServer' /-->\n"
    + "\n"
    + "<script type='module'  src='/scripts/js_log.js'     ></script>\n"
    + "\n"
    + "<script type='module'  src='/scripts/js_folds.js'   ></script>\n"
    + "<script type='module'  src='/scripts/js_store.js'   ></script>\n"
    + "<script type='module'  src='/scripts/js_xpath.js'   ></script>\n"
    + "<script type='module'  src='/scripts/js_linkify.js' ></script>\n"
    + "\n"
    + "<script type='module'  src='/scripts/js_MODEL.js'   ></script>\n"
    + "<script type='module'  src='/scripts/js_VIEW.js'    ></script>\n"
    + "<script type='module'  src='/scripts/js_CNTRL.js'   ></script>\n"
    + "\n"
    + "<script type='module'  src='/scripts/js_ticker.js'  ></script>\n"
    + "<script type='module'  src='/scripts/js_input.js'   ></script>\n"
    + "<script type='module'  src='/scripts/notes.js'      ></script>\n"
    + "<script type='module'  src='/scripts/js_details.js' ></script>\n"
    + "<script type='module'  src='/scripts/js_notes.js'   ></script>\n"
    + "\n"
    ;

const STYLE_QTEXT = ""
    + "<link type='text/css' href='/style/notes.css' rel='stylesheet'>\n"
    + "<link type='text/css' href='/style/qtext.css' rel='stylesheet'>\n"
    + "\n"
    ;
/*}}}*/
/*_ details_folding {{{*/
let details_folding = function(request, file_name, query, response, err, data)
{
/* log {{{*/
let caller = "details_folding("+file_name+")";
/*}}}*/
    /* QUERY    ● lang ● user_id {{{*/
    let    lang = server0_log.get_query_arg(query,    "lang");
    let user_id = server0_log.get_query_arg(query, "user_id");

    let  params = (user_id   ? C+     " user_id=["+ user_id   +"]" : "")
        +         (lang      ? Y+        " lang=["+ lang      +"]" : "")
    ;
/* log {{{*/
if(is_logging())
    log_G(G+"  ┌────────────────────────────────────────────────────────────────────────────┐\n"
         +G+"● │ RESPONSE FILES (async)                                                     │\n"
         +G+"  │ "+file_name+" "+params+"\n"
         +G+"  └────────────────────────────────────────────────────────────────────────────┘");
/*}}}*/
/*}}}*/
    /* FILE     ● err {{{*/
    if( err ) {
log_R(  err );
        if( server0_log.html_format_requested(file_name,query) )
        {
            server0_log.writeHead(  response, caller+"", 404, server3_header.get_HTML_RESPONSE_HEADER());

            response.write("<pre style='background:black; color:#DDD;'>"
                           +"<b> file_name=["+    file_name +"</b>"
                           +"<b>     query=["+    query     +"</b>"
                           +LF   +JSON.stringify( err).replace(/,/g,LF+", ")
                           +"</pre>"
                          );
        }
        else {
            server0_log.writeHead(  response, caller, 404, {"Content-Type": "text/plain"});

            response.write( "details_folding ["+file_name+"] :\n"
                           +JSON.stringify(err)
                          );
        }
//log_X("response.request_count["+response.request_count+"] details_folding"+TRACE_CLOSE)
        response.end();
    }
/*}}}*/
    /* FILE     ● data ● qtext {{{*/
    else {
        /* RESPONSE HEADER {{{*/

        let response_200_header
            = server3_header.get_response_200_header(file_name,query);
if(is_logging()) log_X("response_200_header=["+response_200_header["Content-Type"]+"]");//FIXME

        if( response.content_disposition )
            response_200_header["Content-Disposition"]
                = response.content_disposition; // eslint-disable-line no-useless-computed-key

        if( response.content_disposition )
            delete response.content_disposition;

        if( response_200_header )
        {
            server0_log.writeHead(  response, caller, 200, response_200_header);

        }
        /*}}}*/
        //┌──────────────────────┐
        //│ VIM FOLD ● BOX FORMAT @see /SERVER/style/qtext.css
        //└──────────────────────┘
        /* qtext turn VIM FOLDS into DETAILS SUMMARY {{{*/
        if(data.includes( FOLD_OPEN ))
        {
            // ?qtext {{{
            if(   server0_log.html_format_requested(file_name,query)
              && !file_name.match(/\.htm/)
              ) {

                data = details_folding_to_HTML( String(data) );
            }
            //}}}
            // !qtext {{{
            else if( is_logging()) {
                console.dir(request);
                let    host = request.headers.host;
                let  scheme = request.socket.encrypted ? "https" : "http";
                let reqPath = decodeURIComponent(request.url.split("?")[0]);
                data = ""
                    + "● file_name:\n\t"+ file_name     +"\n"
                    + "● scheme:   \n\t"+ scheme        +"\n"
                    + "● host:     \n\t"+ host          +"\n"
                    + "● reqPath:  \n\t"+ reqPath       +"\n"
                    + "\n"
                    + "\t➔ "+ scheme +"://"+ host +"/"+ reqPath +"?qtext\n"
                    + "<hr>\n"
                    +  data;
            }
            //}}}
        }
        /*}}}*/
        /* WRITE FILE CONTENT .. replace (127.0.0.1|\blocalhost\b) with [net_address] {{{*/
        let net_address     = server1_network.get_net_address();

        if( server0_log.html_format_requested(file_name,query) )
        {
            let header
                = "<title>"+file_name.replace(/.*[\\\/]/,"")+"</title>\n"
                +  SCRIPT_QTEXT;

            response.write( header                 );
            response.write( STYLE_QTEXT            );
            response.write( "<pre>"+ data +"</pre>\n");
        }
        else {
            if(net_address && config.DEFAULT_URI_PATH.includes(file_name))
                data = String(data).replace(/(127.0.0.1|\blocalhost\b)/gm, net_address);

            response.write( data );
        }
        /*}}}*/
        /* ADD HIDDEN ATTRIBUTES ● lang ● user_id {{{*/
        if(    lang ) response.write("<input type='hidden' id='lang'    name='lang'    value='"+lang   +"' />");
        if( user_id ) response.write("<input type='hidden' id='user_id' name='user_id' value='"+user_id+"' />");

        /*}}}*/
//log_X("response.request_count["+response.request_count+"] details_folding"+TRACE_CLOSE)
        response.end();
     }
/*}}}*/
};
/*}}}*/
/*_ details_folding_to_HTML {{{*/
let details_folding_to_HTML = function(data)
{
    // PRE-CHAR FILTER {{{
    // html entities
    data =         data.replace(                   /</gm, "&lt;"            )
        .               replace(                   />/gm, "&gt;"            )
    ;
    //}}}
    // LINE FILTER {{{
    let   data_out = "";
    const    lines = data.split("\n");
    for(let i = 0; i < lines.length; ++i)
    {
        let l = lines[i];
    // BOX BORDERS
        l =         l.  replace(             / *\/[\/\\*] *(┌.*$)/g,            "<BOXU>$1</BOXU>"  ); // PRE-LINE

        l =         l.  replace(             / *\/[\/\\*] *(│.*$)/g, "<BOXM>$1</BOXM>");

        l =         l.  replace(             / *\/[\/\\*] *(└.*$)/g, "<BOXD>$1</BOXD>"             ); // PRE-LINE

    // BOX SEPARATORS
        l =         l.  replace(             / *\/[\/\\*] *(├.*$)/g, "<BOXM>$1</BOXM>");
        l =         l.  replace(             / *\/[\/\\*] *(┼.*$)/g, "<BOXM>$1</BOXM>");
        l =         l.  replace(             / *\/[\/\\*] *(┤.*$)/g, "<BOXM>$1</BOXM>");
    // BOX PARSE-DONE
    if( l.includes("BOX") )
        l =         l.  replace(             /[└┘┌┐│─├┼┤]+/g       , ""               );

    // FOLD-OPEN-CLOSE .. ANY LINE
        l =         l.  replace(     /(.*)\{\{\{(.*)/, "<details><summary>$1 $2</summary><pre>" );
        l =         l.  replace(     /(.*)\}\}\}(.*)/,                   "$1 $2</pre></details>");

    // remove COMMENT EN
        l =         l.  replace(                        / *\/\* */, ""               ); // 👉  /*   👈
        l =         l.  replace(                        / *\*\/ */, ""               ); // 👉  */   👈
    // remove COMMENT Copilot
        l =         l.  replace(                     / *\[\.+\] */, ""               ); // 👉 [...] 👈


    // add a newline
    //{{{
    //    let s = l.trim();
    //    if(     s.length
    //       &&  !s.endsWith("<pre>"     )
    //     &&  !s.endsWith("</boxd>"   )
    //     &&  !s.endsWith("</details>")
    //      )
              l += "\n";
    //}}}

        data_out += l;
    }
    data = data_out;
    //}}}
    // POST-CHAR FILTER {{{
    data =         data
    // remove utf-8 boxing (or not)
//                  .               replace(        /[└┘┌┐│─├┼┤]+/gm , "&nbsp;"         )
    // embedded LF
        .               replace(                 /\\n/gm , "\u21B2"         ) // ↲
    // remove vim fold markers
      //.               replace(         / *;* *\{\{\{/gm, " "               )
      //.               replace(         / *;* *\}\}\}/gm, " "               )
    ;
    //}}}
    // MARKDOWN TABLES TO HTML
    data = md_to_html.convert( data );

    return data;
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ MARKDOWN TO HTML
//└────────────────────────────────────────────────────────────────────────────┘
//  md_to_html {{{
let md_to_html = (function() {
"use strict";

//┌────────────────────────────────────────────────────────────────────────────┐
//│ Convert a Markdown table string into an HTML table string.
//│
//│ Handles:
//│ - Header row and separator row (|---|---|)
//│ - Multiple data rows
//│ - Inline pipes in cells (escaped as \|||)
//│ - Leading/trailing whitespace
//│
//└────────────────────────────────────────────────────────────────────────────┘
/*● convert {{{*/
const TABLE_DELIM_1 = "- | -";
const TABLE_DELIM_2 =  "-|-";

let convert = function(data_in)
{
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
    return { name: "md_to_html"
        ,    convert
    };
    //}}}
})();
//}}}

    // return ● server5_content, details_folding {{{
    return { name: "server5_content"
        ,    onload
        ,    details_folding
        ,    md_to_html
    };
    //}}}
})();
//    module.exports {{{
try { module.exports = server5_content;                  } catch(ex) { console.log(ex.message); console.trace(); }
//}}}
globalThis.server5_content = server5_content; //DEBUG ONLY
