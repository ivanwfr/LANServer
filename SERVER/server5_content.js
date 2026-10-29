//┌────────────────────────────────────────────────────────────────────────────┐
//│ server5_content.js                                     _TAG (261029:22h:32)
//└────────────────────────────────────────────────────────────────────────────┘
/* IMPORT {{{*/
let url_to_href      = require("./url_to_href.js");

/*}}}*/
let server5_content = (function() {
"use strict";

//┌────────────────────────────────────────────────────────────────────────────┐
//│ REQUIRE
//└────────────────────────────────────────────────────────────────────────────┘
//            ● Node.js Modules:    ● ...
//  ● Server Modules:     ● log header ● listener ● network ● notes ● to_html {{{
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

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ FIXME: MVC MIGRATION
    //├────────────────────────────────────────────────────────────────────────┤
    //│ CALLED BY SERVER/server.js:119
    //│           - createServer:172:
    //│             - server5_content.onload({ config });
    //└────────────────────────────────────────────────────────────────────────┘

    load_url_array();
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ PRETTY-PRINT FOLDING AND BOXING
//└────────────────────────────────────────────────────────────────────────────┘
const FOLD_OPEN = "{{{"; /* eslint-disable-line no-unused-vars */
const FOLD_CLOSE= "}}}"; /* eslint-disable-line no-unused-vars */
/*    PAGE_HEAD_INNER_HTML & PAGE_STYLE_LINKS {{{*/
const PAGE_HEAD_INNER_HTML = ""
    + "<meta   name='color-scheme' content='light only'>\n"
    + "\n"
    + "<!--base   href='https://ivanwfr.github.io/LANServer' /-->\n"
    + "\n"
    + "<script type='module'  src='/scripts/js_log.js'     ></script>\n"    // LOGGING
    + "\n"
    + "<script type='module'  src='/scripts/js_details.js' ></script>\n"    // VIM_FOLDS to DETAILS
    + "<script type='module'  src='/scripts/js_boxing.js'  ></script>\n"    // comments  to BOX
    + "<script type='module'  src='/scripts/js_linkify.js' ></script>\n"    // URL       to HTML
    + "<script type='module'  src='/scripts/js_md.js'      ></script>\n"    // markdown  to HTML (called from js_linkify)
    + "<script type='module'  src='/scripts/js_folds.js'   ></script>\n"    // open-close   DETAILS
    + "\n"
    + "<script type='module'  src='/scripts/js_store.js'   ></script>\n"
    + "<script type='module'  src='/scripts/js_xpath.js'   ></script>\n"
    + "\n"
    + "<script type='module'  src='/scripts/js_MODEL.js'   ></script>\n"    // MODEL SM
    + "<script type='module'  src='/scripts/js_VIEW.js'    ></script>\n"    // VIEW  SM
    + "<script type='module'  src='/scripts/js_CNTRL.js'   ></script>\n"    // CNTRL SM
    + "\n"
    + "<script type='module'  src='/scripts/notes.js'      ></script>\n"    // MODEL DATA
    + "<script type='module'  src='/scripts/js_notes.js'   ></script>\n"    // MODEL DATA
    + "\n"
    + "<script type='module'  src='/scripts/js_ticker.js'  ></script>\n"    // VIEW USER
    + "<script type='module'  src='/scripts/js_input.js'   ></script>\n"    // VIEW USER
    ;

const PAGE_STYLE_LINKS = ""
    + "<link type='text/css' href='/style/notes.css'   rel='stylesheet'>\n"
    + "<link type='text/css' href='/style/to_html.css' rel='stylesheet'>\n"
    ;
/*}}}*/
/*● send_file_content {{{*/
let send_file_content = function(request, file_path, query, response, err, data)
{
/* log {{{*/
let caller = "send_file_content("+file_path+")";
/*}}}*/
    /* LOG          ● lang ● user_id {{{*/
    let    lang = server0_log.get_query_arg(query,    "lang");
    let user_id = server0_log.get_query_arg(query, "user_id");

    let  params = (user_id   ? C+     " user_id=["+ user_id   +"]" : "")
        +         (lang      ? Y+        " lang=["+ lang      +"]" : "")
    ;
/* log {{{*/
if(is_logging())
    log_G(G+"  ┌────────────────────────────────────────────────────────────────────────────┐\n"
         +G+"● │ RESPONSE FILES (async)                                                     │\n"
         +G+"  │ "+file_path+" "+params+"\n"
         +G+"  └────────────────────────────────────────────────────────────────────────────┘");
/*}}}*/
/*}}}*/
    /* FILE         ● err {{{*/
    if( err ) {
log_R(  err );
        if( server0_log.to_html_requested(file_path,query) )
        {
            server0_log.writeHead(  response, caller+"", 404, server3_header.get_HTML_RESPONSE_HEADER());

            response.write("<pre style='background:black; color:#DDD;'>"
                           +"<b> file_path=["+    file_path +"</b>"
                           +"<b>     query=["+    query     +"</b>"
                           +LF   +JSON.stringify( err).replace(/,/g,LF+", ")
                           +"</pre>"
                          );
        }
        else {
            server0_log.writeHead(  response, caller, 404, {"Content-Type": "text/plain"});

            response.write( "send_file_content ["+file_path+"] :\n"
                           +JSON.stringify(err)
                          );
        }
//log_X("response.request_count["+response.request_count+"] send_file_content"+TRACE_CLOSE)
        response.end();
    }
/*}}}*/
    /* HTML_PRETTY_PRINT    ● data ● to_html {{{*/
    else {
        /* RESPONSE HEADER {{{*/

        let response_200_header
            = server3_header.get_response_200_header(file_path,query);
if(is_logging()) log_X("response_200_header=["+response_200_header["Content-Type"]+"]");

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
        /* [data] → HTML_PRETTY_PRINT VIM FOLDS {{{*/
        if( !file_path.match(/\.htm/ ))
        {
            //┌────────────────────────────────────────────────────────────────┐
            //│ ● Pretty print not requested yet...
            //│ ➔ insert banner HTML_PRETTY_PRINT
            //├────────────────────────────────────────────────────────────────┤
            //│ ⚠ but do not format inlined files (css, script, images ...)
            //│
            //│ |                            CONDITION | PROOF                 |
            //│ | ------------------------------------:|:--------------------- |
            //│ | 1. only for the visited page address | the cooldown trigger  |
            //│ | 2. HTML_PRETTY_PRINT not requested   | by query              |
            //│ | 3. HTML_PRETTY_PRINT not engaged     | by quick reload       |
            //│
            //└────────────────────────────────────────────────────────────────┘
            if(   !add_TO_HTML_BANNER_cooldown
               && !request.url.match(/\?to_html/)
               && !server0_log.to_html_requested(file_path, query)
            ) {
                data = add_TO_HTML_BANNER(request, file_path) + data;

            }
            //┌────────────────────────────────────────────────────────────────┐
            //│ ● Pretty print requested...
            //│ → insert recently VISITED HISTORY DETAILS
            //└────────────────────────────────────────────────────────────────┘
            else if( server0_log.to_html_requested(file_path, query) )
            {
                data = "{{{ Recently visited:\n"
                    +       add_recently_visited( request )
                    +  "}}}\n"
                    +  data;
            }
        }
        /*}}}*/
        /* 1/2 SEND PRETTY PRINT [data] {{{*/
        if( server0_log.to_html_requested(file_path,query) )
        {
            let title = file_path.replace(/.*[\\\/]/,"");
            let html  = `<html lang='en'>\n
<head>\n
<title>${ title      }</title>
${        PAGE_HEAD_INNER_HTML  }
${        PAGE_STYLE_LINKS }
</head>
<body>
<pre id='recently_visited'>${ escapeHTML(data) }</pre>
</body>
</html>
`;

//console.log("html=["+html.substr(1000,500)+"]");
            response.write( html );
        }
        /*}}}*/
        /* 2/2 SEND [data] .. replacing (127.0.0.1|\blocalhost\b) with [net_address] {{{*/
        else {
            // 1. REPLACE (127.0.0.1|\blocalhost\b) with [net_address]
            let net_address     = server1_network.get_net_address();
            if( net_address && config.DEFAULT_URI_PATH.includes(file_path))
                data = String(data).replace(/(127.0.0.1|\blocalhost\b)/gm, net_address);

            // 2. SEND DATA
            response.write( data );
        }
        /*}}}*/
        /* ADD HIDDEN ATTRIBUTES ● lang ● user_id {{{*/
        if(    lang ) response.write("<input type='hidden' id='lang'    name='lang'    value='"+lang   +"' />");
        if( user_id ) response.write("<input type='hidden' id='user_id' name='user_id' value='"+user_id+"' />");

        /*}}}*/
//log_X("response.request_count["+response.request_count+"] send_file_content"+TRACE_CLOSE)
        response.end();
     }
/*}}}*/
};
/*}}}*/
/*_ add_TO_HTML_BANNER {{{*/
let add_TO_HTML_BANNER_cooldown;
let add_TO_HTML_BANNER = function(request, file_path)
{

    if(!add_TO_HTML_BANNER_cooldown)
        add_TO_HTML_BANNER_cooldown
            = setTimeout(() => add_TO_HTML_BANNER_cooldown = null, 1000);

    let href_root = server1_network.get_net_href_root( request );
    let href      = server1_network.get_net_href_root( request ) + request.url +"?to_html";

    return `
//┌────────────────────────────────────────────────────────────────────────────┐
//│ THIS FILE CAN BE HTML_PRETTY_PRINT FORMATTED       ➔ by a reload within 5s
//├────────────────────────────────────────────────────────────────────────────┤
//│ 🟤 request.url.:\t${ request.url }
//│ 🔴 file_path...:\t${ file_path   }
//│ 🟠 href_root...:\t${ href_root   }
//│ 🎄 HTML URL....:\t${ href        }
//└────────────────────────────────────────────────────────────────────────────┘

`;

};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ url_array ● SAVE ● LOAD
//└────────────────────────────────────────────────────────────────────────────┘
//{{{
const   fs = require("fs");
const path = require("path");
const VISITED_URL_ARRAY_FILE = path.join("STORAGE", "visited_url_array.json");
//}}}
/*_ add_recently_visited {{{*/
//{{{
const ROOT_URL  = "/";
const VISITED_HISTORY_UNCHECK_SYMBOL = "**❌**";
const VISITED_HISTORY_CHECKED_SYMBOL = "* ✔*";

let   url_array =  [];
//}}}
let add_recently_visited = function(request, dir_list_page)
{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ SKIP QUERY
    //└────────────────────────────────────────────────────────────────────────┘
    let request_url
        = request.url.replace(/\?.*/,"");

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ NORMALIZE FOLDER WITH ENDING SLASH
    //└────────────────────────────────────────────────────────────────────────┘
    if( dir_list_page ) {
        if(!request_url.endsWith("/"))
            request_url += "/";
    }
    else {
        request_url += "?to_html";      // next time pretty print
    }

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ADD INITAL DEFAULTS
    //└────────────────────────────────────────────────────────────────────────┘
    if(!url_array.length)
        url_array.push    ( ROOT_URL );

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ADD TO THE VISITED LIST
    //└────────────────────────────────────────────────────────────────────────┘
    if(!url_array.includes( request_url ))
        url_array.push    ( request_url );

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ REMOVE SHORTER CONTAINED ENTRIEs
    //└────────────────────────────────────────────────────────────────────────┘
    url_array = remove_contained( url_array );
    url_array.unshift("/");

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ STORE VISITED LIST ● LOADED BY SERVER RESTART
    //└────────────────────────────────────────────────────────────────────────┘
    save_url_array();

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ VISITED URL LINES
    //└────────────────────────────────────────────────────────────────────────┘
    let dir_href   = server1_network.get_net_href_root( request ) + request.url +"?to_html";
    let text_lines = "";
    url_array
        .sort()
        .forEach(( dirent_url) => {
            let current_url    = (request_url ==  dirent_url  );
            let check_mark
                =  current_url              ? VISITED_HISTORY_CHECKED_SYMBOL
                : (dirent_url ==  ROOT_URL) ? ""
                :                             VISITED_HISTORY_UNCHECK_SYMBOL
            ;
            let dir_item = dir_list_page
                ? url_to_href.line_url_to_href(dirent_url, dir_href)
                :                              dirent_url
            ;
            text_lines      += check_mark +"\t"+ dir_item +"\n";
        });

    return dir_list_page
        ? "<pre id='recently_visited'>"+text_lines+"</pre>"
        :                               text_lines
    ;
};
/*}}}*/
/*_ remove_contained {{{*/
let remove_contained = function(str_array)
{
//console.log("str_array", str_array);
    let longer_first
        = [...str_array].sort((a, b) => b.length - a.length);

    let not_contained = [];

    for(let str of longer_first) {
        if(!not_contained.some((existing) => existing.includes(str)))
            not_contained.push( str );
    }

//console.log("not_contained", not_contained);
    return not_contained;
};
/*}}}*/
/*_ clear_this_visited_url {{{*/
let clear_this_visited_url = function( url )
{
//console.log("server5_content.clear_this_visited_url("+url+")");
    let index = url_array.indexOf( url    );
    if( index ) url_array.splice(index, 1);

    // STORE VISITED LIST ● LOADED BY SERVER RESTART
    save_url_array();

    return "server5_content.clear_this_visited_url";
};
/*}}}*/
/*_ save_url_array {{{*/
let save_url_array = function()
{
//console.log("server5_content.save_url_array( x"+url_array.length+" )");
    if(url_array.length > 1)
        fs. writeFileSync( VISITED_URL_ARRAY_FILE , JSON.stringify(url_array, null, 2));
    else if(fs.existsSync( VISITED_URL_ARRAY_FILE ) )
        fs.    unlinkSync( VISITED_URL_ARRAY_FILE );
};
/*}}}*/
/*_ load_url_array {{{*/
let load_url_array = function()
{
    url_array = [];
    try {
        let val = fs.readFileSync(VISITED_URL_ARRAY_FILE, "utf-8");
        if( val ) url_array = JSON.parse( val );
    } catch(ex) { /* eslint-disable-line no-unused-vars */
        //console.log("server5_content.load_url_array: ", ex);
    }
//console.log("server5_content.load_url_array( x"+url_array.length+" )");
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ UTIL
//└────────────────────────────────────────────────────────────────────────────┘
/*● escapeHTML ● Sanitize text for HTML {{{*/
let escapeHTML = function(text)
{
    if(!text) return "";

    return String(text)
        .replace(/&/gm, "&amp;" )
        .replace(/</gm, "&lt;"  )
        .replace(/>/gm, "&gt;"  )
        .replace(/"/gm, "&quot;")
        .replace(/'/gm, "&#039;");
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ PUBLIC
//└────────────────────────────────────────────────────────────────────────────┘
    // ● server5_content, send_file_content {{{
    return { name: "server5_content"
        ,    onload
        ,    send_file_content
        ,    add_recently_visited
        ,    clear_this_visited_url
        ,    get_visited_url_array_length : () => url_array.length
    };
    //}}}
})();
//    module.exports {{{
try { module.exports = server5_content;                  } catch(ex) { console.log(ex.message); console.trace(); }
//}}}
globalThis.server5_content = server5_content; //DEBUG ONLY
