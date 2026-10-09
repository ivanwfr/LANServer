//┌────────────────────────────────────────────────────────────────────────────┐
//│ server5_content.js                                     _TAG (261009:23h:53)
//└────────────────────────────────────────────────────────────────────────────┘
/* IMPORT {{{*/
//t js_boxing        = require("./scripts/js_boxing.js");

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
/*    PAGE_HEAD & PAGE_STYLE {{{*/
const PAGE_HEAD = ""
    + "<meta   name='color-scheme' content='light only'>\n"
    + "\n"
    + "<!--base   href='https://ivanwfr.github.io/LANServer' /-->\n"
    + "\n"
    + "<script type='module'  src='/scripts/js_log.js'     ></script>\n"
    + "\n"
    + "<script type='module'  src='/scripts/js_boxing.js'  ></script>\n"
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
    + "<script type='module'  src='/scripts/js_notes.js'   ></script>"
    ;

const PAGE_STYLE = ""
    + "<link type='text/css' href='/style/notes.css' rel='stylesheet'>\n"
    + "<link type='text/css' href='/style/qtext.css' rel='stylesheet'>"
    ;
/*}}}*/
/*_ send_file_content {{{*/
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
        if( server0_log.html_format_requested(file_path,query) )
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
    /* HTML_PRETTY_PRINT    ● data ● qtext {{{*/
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
        /* HTML_PRETTY_PRINT VIM FOLDS ● @see /SERVER/style/qtext.css {{{*/
        if(data.includes( FOLD_OPEN ))
        {
            // 1/2 PRETTY PRINT
            if(   server0_log.html_format_requested(file_path,query)
              && !file_path.match(/\.htm/)
              ) {

              //data = js_boxing.format_data( String(data) );   // is now client-side
            }
            // 2/ PREPEND LOG HEADER
            else if( is_logging()) {
                data = get_request_log(request, file_path) + data;
            }
        }
        /*}}}*/
        /* 1/2 SEND PRETTY PRINT [data] {{{*/
        if( server0_log.html_format_requested(file_path,query) )
        {
            let title = file_path.replace(/.*[\\\/]/,"");
            let html  = `<html lang='en'>
<head>
<title>${ title      }</title>
${        PAGE_HEAD  }
${        PAGE_STYLE }
</head>
<body>
<pre>${   escapeHTML(data) }</pre>
</body>
</html>
`;

//console.log("html=["+html+"]");
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
//│ LOG
//└────────────────────────────────────────────────────────────────────────────┘
/*_ get_request_log {{{*/
let get_request_log = function(request, file_path)
{
    console.dir(request);

    let    host = request.headers.host;
    let  scheme = request.socket.encrypted ? "https" : "http";
    let reqPath = decodeURIComponent(request.url.split("?")[0]);
    return ""
        + "● file_path:\n\t"+ file_path     +"\n"
        + "● scheme:   \n\t"+ scheme        +"\n"
        + "● host:     \n\t"+ host          +"\n"
        + "● reqPath:  \n\t"+ reqPath       +"\n"
        + "\n"
        + "\t➔ "+ scheme +"://"+ host +"/"+ reqPath +"?qtext\n"
        + "<hr>\n"
    ;
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ return
//└────────────────────────────────────────────────────────────────────────────┘
    // return ● server5_content, send_file_content {{{
    return { name: "server5_content"
        ,    onload
        ,    send_file_content
    };
    //}}}
})();
//    module.exports {{{
try { module.exports = server5_content;                  } catch(ex) { console.log(ex.message); console.trace(); }
//}}}
globalThis.server5_content = server5_content; //DEBUG ONLY
