//┌────────────────────────────────────────────────────────────────────────────┐
/*│ server2_listener.js                                   _TAG (261001:00h:30)
//└────────────────────────────────────────────────────────────────────────────┘
/* IMPORT {{{*/

/*}}}*/
let server2_listener = (function() {
"use strict";

//┌────────────────────────────────────────────────────────────────────────────┐
//│ REQUIRE
//└────────────────────────────────────────────────────────────────────────────┘
//● Node.js Modules     ● fs path os.networkInterfaces {{{
let { networkInterfaces }       = require("os"   ); /* eslint-disable-line no-unused-vars */
//}}}
//● Server Modules:     ● log header listener network notes qtext {{{
let server0_log      = require("./server0_log.js");
//...{{{
/* eslint-disable no-unused-vars */
// INLINING:
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
let server1_network  = require("./server1_network.js");
//t server2_listener = require("./server2_listener.js");
let server3_header   = require("./server3_header.js");
let server4_file     = require("./server4_file.js");
//t server5_content  = require("./server5_content.js");
let server6_notes    = require("./server6_notes.js");
//}}}
//● Server Config:      ● config https http modules {{{

let config;

let onload = function(args)
{
    config              = args.config;
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ LISTENER GET POST DISPATCH
//└────────────────────────────────────────────────────────────────────────────┘
/*● dispatch {{{*/
/*{{{*/
const CLEAR_COOLDOWN    = 3000;
let   last_request_time =    0;

const REQUEST_BUNCH     =   30;
let   request_count     =    0;
let last_request_count  =    0;
/*}}}*/
let dispatch = function(request, response) /* eslint-disable-line complexity */
{
/* log {{{*/
let caller = "dispatch";
if(is_logging()) log_G("..."+ caller);

    let on_first_request   = !last_request_time;
    let time_now_MS        = new Date().getTime();
    let not_on_cooldown    = ((time_now_MS   - last_request_time ) > CLEAR_COOLDOWN);
    let terminal_filled    = ((request_count - last_request_count) > REQUEST_BUNCH) ;
    let may_clear_terminal =    not_on_cooldown
        /*..............*/  && (terminal_filled || on_first_request);

    if( may_clear_terminal )
    {
        log_G("K0\x1Bc"+ M + "● dispatch: TERMINAL CLEARED BETWEEN REQUEST CHUNKS");
        last_request_time = time_now_MS  ;
        last_request_count= request_count;
    }

/*}}}*/
    // [uri] [request_count] {{{
    response.request_count = ++request_count;
    let uri = parse_url( request.url );
    if(!uri.path)
        uri.path = config.DEFAULT_URI_PATH;
    //}}}

//{{{
//log_X(G+"  ┌───────────────────────────────────────────────┐\n"
//     +  "● │ REQUEST #"+ response.request_count+" "+ request.method +" "+ uri.path +"\n"
//     +  "  └───────────────────────────────────────────────┘");
//}}}
log_X(G+"● REQUEST #"+ response.request_count+" "+ request.method +" "+ uri.path);

    // favicon.ico {{{
    if(uri.path == "favicon.ico")
    {
        server0_log.writeHead(response, caller, 404);

        response.end("Not found: ["+uri.ath+"]");
        return;
    }
    //}}}
    // reply_server_STATUS {{{
    let args = { uri , request , response };
    let  consumed_by = "";
    if( !consumed_by) consumed_by = reply_server_STATUS ( args );
    //}}}
    // handle_FETCH_POST {{{
    if( !consumed_by) consumed_by = handle_FETCH_POST( args );
    //}}}
    /* fs.readFile {{{*/
    if(!consumed_by && uri.path)
    {
        consumed_by = server4_file.fs_read_file_or_folder(request,response,uri);
    }
    /*}}}*/
// log {{{
if(is_logging()   ) log_X(N+"dispatch: consumed_by=["+consumed_by+"]");
//}}}
};
/*}}}*/
/*_ handle_FETCH_POST {{{*/
/*    REQUEST_URL_ARRAY {{{*/
const REQUEST_URL_ARRAY
    = [   "/fetch_notes"
        , "/upload_notes"
    ];

/*}}}*/
let handle_FETCH_POST = function(args)
{
//{{{
if(is_logging()) log_Y("...handle_FETCH_POST");
//}}}
    let {      request, response } = args;
    let consumed_by;

    /* [REQUEST_URL_ARRAY] {{{*/
    let url = request.url.replace(/\?.*/,"");
    if( REQUEST_URL_ARRAY.includes( url) )
    {
//{{{
//log_Y("  ┌───────────────────────────────────────────────┐\n"
//     +"● │ "+ request.method.padEnd(10) +" "+ request.url +"\n"
//     +"  └───────────────────────────────────────────────┘");
//}}}
log_X(Y+"● "+ request.method.padEnd(10) +" "+ request.url);
        if(     request.method == "POST") handle_POST(request, response);
        else if(request.method == "GET" ) handle_GET (request, response);
        else if(request.method == "OPTIONS")
        {
//console.dir(request)
log_Y("...allow access to the origin of the petition:");
            response.setHeader("Access-Control-Allow-Origin" , request.headers.origin);
            response.setHeader("Access-Control-Allow-Methods", "POST"                );
            response.setHeader("Access-Control-Allow-Headers", "accept, content-type");
            response.setHeader("Access-Control-Max-Age"      , "1728000"             );
            response.end();
            consumed_by = request.url; /* eslint-disable-line no-useless-assignment */
        }

        consumed_by = request.url;
    }
    /*}}}*/

    return consumed_by;
};
/*}}}*/
/*_ handle_POST {{{*/
let handle_POST = function(request,response)
{
if(is_logging()) log_X(B+"handle_POST");

    let body = "";
    request.on("data", (chunk) => {
        body += chunk.toString();
    });
if(is_logging()) log_X(C+"1 request [data] ● body:\n"+ body);

    request.on("end", () => {

        server6_notes.handle_request(request, response, body);
    });
};
/*}}}*/
/*_ handle_GET {{{*/
let handle_GET = function(request,response)
{
if(is_logging()) log_X("handle_GET");

    let body =     decodeURIComponent( request.url );

    server6_notes.handle_request(request, response, body);
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ SERVER STATUS
//└────────────────────────────────────────────────────────────────────────────┘
/*_ reply_server_STATUS {{{*/
let reply_server_STATUS = function(args)
{
/*{{{*/
let caller = "reply_server_STATUS";
/*}}}*/
    let { uri,          response } = args;
    let consumed_by;

    if( uri.path.endsWith("/status") )
    {
log_N("  ┌───────┐\n"
     +"● │ STATUS\n"
     +"  └───────┘");
        server0_log.writeHead(response, caller, 200, server3_header.get_HTML_RESPONSE_HEADER());

        server1_network.log_STATUS( response );

//log_X("response.request_count["+response.request_count+"] reply_server_STATUS"+TRACE_CLOSE)
        response.end();
        consumed_by = "status";
    }

    return consumed_by;
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ private
//└────────────────────────────────────────────────────────────────────────────┘
/*_ parse_url {{{*/
let parse_url = function(url)
{
// log {{{
//log_X("parse_url:")
//log_X("url:")
//console.dir( url  )
//log_X("decodeURIComponent(url):")
//console.dir( decodeURIComponent(url)  )
//}}}

    // setup default parsing_failed_empty_segments
    let url_match
        = [   ""/* [0]    url */
            , ""/* [1] scheme */
            , ""/* [2]   port */
            , ""/* [3] domain */
            , ""/* [4]   path */
            , ""/* [5]  query */
        ];

    try {
        //┌────────────────────────────────────────────────────────────────────┐
        //│ https://192.168.1.14:447/SERVER/server.js
        //└────────────────────────────────────────────────────────────────────┘
        url_match
            = decodeURIComponent(url)
            . replace(     /\+/g, " ")  // encoded space
            . replace(     /\r/g, " ")  // CR
            . replace(     /\n/g, " ")  // LF
            . replace(  /\s\s+/g, " ")  // multiple spaces
            . replace(/\s*;\s*$/,  "")  // trailing separator
            . match(/^(\w+)?(:\/\/)?([^\/]+)?\/([^\?]+)?\??(.*)?/);
//┌───────────────────▲───▲─▲─────▲─▲──────▲───▲──────▲────────────────────────┐
//│                   (111) (22222) (333333)   (444444)    (55)
//│                    ▲▲▲   ▲▲▲▲▲   ▲▲▲▲▲▲     ▲▲▲▲▲▲      ▲▲
//│                  scheme  port    domain      path     query
//└────────────────────────────────────────────────────────────────────────────┘
    }
    catch(err) { console.warn(err); }

    let args
        = {   scheme : url_match[1]
          //,   port : url_match[2]
            , domain : url_match[3]
            ,   path : url_match[4]
            ,  query : url_match[5]
        };
//console.dir(args)//FIXME

    return  args;
};
/*}}}*/

    // return ●     server2_listener, dispatch {{{
    return { name: "server2_listener"
        ,    onload
        ,    dispatch
    };
    //}}}
})();
//    module.exports {{{
try { module.exports = server2_listener;                 } catch(ex) { console.log(ex.message); console.trace(); }
//}}}
