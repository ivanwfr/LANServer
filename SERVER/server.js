//┌────────────────────────────────────────────────────────────────────────────┐
/*│ server.js                 */ const SERVER_JS_TAG = "server (260929:01h:53)";
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/
// eslint-disable no-warning-comments */


/*}}}*/
let server = (function() {
"use strict";

//┌────────────────────────────────────────────────────────────────────────────┐
//│ REQUIRE
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/
//● Node.js ● fs http https networkInterfaces {{{
let   fs                        = require("fs"   );
let   http                      = require("http" );
let   https                     = require("https");
let   path                      = require("path" );
let { networkInterfaces }       = require("os"   );
//}}}
//➔ config ● PORT STATUS {{{
let   config =
{     LOAD_STATUS               : ""

    , PORT_HTTP                 :  81
    , PORT_HTTPS                : 444
};

let config_LOAD_STATUS_log = function(msg)
{
    if( config.LOAD_STATUS )
        config.LOAD_STATUS +=  LF;
    else
        config.LOAD_STATUS  =  "";
    config.LOAD_STATUS     += msg;
};
/*}}}*/
//➔ config.json / config_dev.json {{{
const CONFIG_JSON               = "config.json" ;
const CONFIG_DEV_JSON           = "config_dev.json" ;
let   config_json               = "../"+(fs.existsSync( CONFIG_DEV_JSON ) ? CONFIG_DEV_JSON : CONFIG_JSON);

try {
    config                      = require(      config_json );
    config_LOAD_STATUS_log(       `CONFIG    [${config_json}]`);




} catch(ex) {
    let cwd = process.cwd().replace(/\\/g,"/");
    config_LOAD_STATUS_log(       "****************************************"         + LF
                                + "*** ERROR WHILE LOADING FILE ["+ config_json  +"]"+ LF
                                + "*** IN FOLDER ["+                cwd          +"]"+ LF
                                + "*** "+ ex.message.replace(/\n/g,"\n*** ")         + LF
                                + "****************************************"             );
}
/*}}}*/
/*}}}*/
//  server_notes {{{
let server_notes = require("../SERVER/server_notes.js");

//}}}
//  server_log {{{
/* eslint-disable no-unused-vars */
let server_log = require("../SERVER/server_log.js");

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

} = server_log;
/* eslint-enable  no-unused-vars */
//}}}

//┌────────────────────────────────────────────────────────────────────────────┐
//│ SERVER
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/
/*➔ createServer .. [http__server] [https_server] {{{*/
/*{{{*/
let http__server;
let https_server;

let    started_folder;
let server_top_folder;
/*}}}*/
let createServer = function()
{

    /* [HTTP ] {{{*/
    try {
        http__server = http .createServer();
    }
    catch(ex) { log_R(ex); }

    /*}}}*/
    /* [HTTPS] {{{*/
    try {
        let ssl_options
            = {    key: fs.readFileSync(config.KEY_PEM )
                , cert: fs.readFileSync(config.CERT_PEM)
            };

        https_server    = https.createServer( ssl_options );
    }
    catch(ex) { log_R(ex);
        config.LOAD_STATUS
            = `ERROR    : https(ssl_options) ➔ ${ex.code}\n`
            + config.LOAD_STATUS;
    }
    /*}}}*/
    /* [FOLDER] {{{*/
    started_folder      = process.cwd().replace(/\\/g,"/");
    server_top_folder   = process.cwd().replace(/\\/g,"/")+"/LAN";

    /*}}}*/

    /* [PORT] {{{*/
    if(http__server) http__server.listen ( config.PORT_HTTP  ||  84);
    if(https_server) https_server.listen ( config.PORT_HTTPS || 447);

    /*}}}*/
    /* LISTEN {{{*/
    if(http__server) http__server.addListener("request", request_LISTENER.dispatch);
    if(https_server) https_server.addListener("request", request_LISTENER.dispatch);

    /*}}}*/
    /* STATUS {{{*/
    log_STATUS();

    /*}}}*/
};
/*}}}*/
/*_ log_STATUS {{{*/
let log_STATUS = function(response) // eslint-disable-line complexity
{
    /* CLEAR TERMINAL {{{*/
//  log_CLEAR();

    /*}}}*/
    /* CONFIG {{{*/
    /* COLORS {{{*/
    let s;
    let log_color  = config.LOAD_STATUS.includes("ERROR") ? R : M;
/*  response CSS {{{*/
if( response )
    response.write(
`<style>
.info  { background-color: #222; color: #0F3; }
.error { background-color: #222; color: #F03; }
</style>`
                  );

/*}}}*/
    /*}}}*/
    /* [config dir_items] {{{*/
    s  = "┌───────────────────────────────────────────────────────────────────── CONFIG ─┐";

    s += LF+`
│ ${SERVER_JS_TAG}
├
│ CONFIG            [${config_json        }]
│ CWD               [${process.cwd()      }]
├
│ PORT_HTTP         [${config.PORT_HTTP   }]
│ PORT_HTTPS        [${config.PORT_HTTPS  }]
│  KEY_PEM          [${config. KEY_PEM    }]
│ CERT_PEM          [${config.CERT_PEM    }]
├
│ server       ${ ellipsis( JSON.stringify( Object.keys( server       ) ), 60) }
│ server_notes ${ ellipsis( JSON.stringify( Object.keys( server_notes ) ), 60) }
│ server_log   ${ ellipsis( JSON.stringify( Object.keys( server_log   ) ), 60) }
    `.trim();

    if(config.I18N_ACTIVE)
        s += LF+"│ I18N_ACTIVE ●●● ["+    config.I18N_ACTIVE  +"] ● [bddservice NOT CALLED] ● [i18n translation TABLES]";

    if(config.LOG_MORE)
        s += LF+"│ LOG_MORE    ●●● ["+    config.LOG_MORE     +"] ● VERBOSE node server.js";

    s += LF+"└──────────────────────────────────────────────────────────────────────────────┘";

    log_N(log_color+s);
    /*  response {{{*/
    if( response )
        response.write(
`<pre class='${config.LOAD_STATUS.includes("ERROR") ? "error" : "info"}'>${s}</pre>`
                      );

    /*}}}*/
    /*}}}*/
    /*}}}*/
    /* FOLDER {{{*/

    s = `
┌──────────────────────────────────────────────────────────────────────────────┐
│ SERVER STARTED IN ${   started_folder}
│ SERVER TOP FOLDER ${server_top_folder}
└──────────────────────────────────────────────────────────────────────────────┘`;

    log_G(s);
/*  response {{{*/
if( response )
    response.write(
`<pre class='info'>${s}</pre>`
                  );

/*}}}*/
    /*}}}*/
    log_G("┌────────────────────────────────┐");
    /* HTTPS {{{*/

    let https_address = https_server  ?            https_server.address() : null;
    let https_port    = https_address ?            https_address.port     : null;
    let https_status  = https_port    ? (  "LISTENING PORT "+https_port ) : "NOT LISTENING";

    s = "HTTPS    :  "+ https_status;

    log_G("│ "+(https_server ? Y : R)+s+N);
/*  response {{{*/
if( response )
    response.write(
`<pre class='${https_server ? "info" : "error"}'>${s}</pre>`
                  );
/*}}}*/
    /*}}}*/
    /* HTTP  {{{*/

//lib_log.log_key_val("http__server", http__server);
    let http__address = http__server  ?            http__server.address() : null;
    let http__port    = http__address ?            http__address.port     : null;
    let http__status  = http__port    ? (  "LISTENING PORT "+http__port ) : "NOT LISTENING";

    s = "HTTP     :  "+ http__status;

    log_G("│ "+(http__server ? Y : R)+s+N);
/*  response {{{*/
if( response )
    response.write(
`<pre class='${http__server ? "info" : "error"}'>${s}</pre>
<script>document.body.contentEditable = true;</script>`
                  );

/*}}}*/
    /*}}}*/
    log_G("└────────────────────────────────┘");

    log_net_info( response );

};
/*}}}*/
/*_ log_net_info {{{*/
let     net_address;
let log_net_info = function(response)
{
    /*  response {{{*/
    if( response )
        response.write(
`<div class='info'>
 <b>Network:</b>
 <ul>`
                      );
    /*}}}*/
    let net_if  = networkInterfaces();
    let results = Object.create({});
    for(let name of Object.keys(net_if))
    {
        for(let net of net_if[name])
        {
            if (net.family === "IPv4" && !net.internal) // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            {
                if(!results[name])
                    results[name] = [];

                results[name].push(net.address);

                if(!net_address)
                    net_address = net.address;
                /*  response {{{*/
                if( response)
                    response.write("<li>"+name+" : "+net.address+"</li>\n");
                /*}}}*/
            }
        }
    }
    /*  response {{{*/
    if( response)
        response.write("</ul>\n</div>");
    /*}}}*/
console.table( results );
};
/*}}}*/
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ RESPONSE HEADER
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/
/* Content-Type HEADERS {{{*/
const   MISC_ARRAY           = [
    "Makefile"          // Makefile
  , "[\\\\\\/]\\.\\w+"  // .prefix
  , "[\\\\\\/]_\\w+"    // _prefix
];
const     JS_RESPONSE_HEADER = { "Content-Type" : "text/javascript; charset=utf-8" };
const     SH_RESPONSE_HEADER = { "Content-Type" : "text/sh;         charset=utf-8" };
const     MD_RESPONSE_HEADER = { "Content-Type" : "text/md;         charset=utf-8" };
const    INI_RESPONSE_HEADER = { "Content-Type" : "text/ini;        charset=utf-8" };
const    LNK_RESPONSE_HEADER = { "Content-Type" : "text/lnk;        charset=Windows-1252" };
const    AHK_RESPONSE_HEADER = { "Content-Type" : "text/autohotkey; charset=utf-8" };
const    AWK_RESPONSE_HEADER = { "Content-Type" : "text/awk;        charset=utf-8" };
const    CSS_RESPONSE_HEADER = { "Content-Type" : "text/css;        charset=utf-8" };
const    CSV_RESPONSE_HEADER = { "Content-Type" : "text/csv;        charset=utf-8" };
const    VIM_RESPONSE_HEADER = { "Content-Type" : "text/vim;        charset=utf-8" };
const    BAT_RESPONSE_HEADER = { "Content-Type" : "text/bat;        charset=utf-8" };
const    LUA_RESPONSE_HEADER = { "Content-Type" : "text/lua;        charset=utf-8" };
const   JSON_RESPONSE_HEADER = { "Content-Type" : "text/json;       charset=utf-8" };
const   MISC_RESPONSE_HEADER = { "Content-Type" : "text/misc;       charset=utf-8" };

const   DEFAULT_TEXT_PLAIN   = { "Content-Type" : "text/plain;      charset=UTF-8" };
const   HTML_RESPONSE_HEADER = { "Content-Type" : "text/html;       charset=UTF-8", "Access-Control-Allow-Origin" : "*"
                               , "color-scheme" : "light only" };

const    DOC_RESPONSE_HEADER = { "Content-Type" : "application/msword" };
const    ICO_RESPONSE_HEADER = { "Content-Type" : "image/x-icon"       };
const    JPG_RESPONSE_HEADER = { "Content-Type" : "image/jpeg"         };
const    PDF_RESPONSE_HEADER = { "Content-Type" : "application/pdf"    };
const    PNG_RESPONSE_HEADER = { "Content-Type" : "image/png"          };
const    SVG_RESPONSE_HEADER = { "Content-Type" : "image/svg+xml"      };
const    GIF_RESPONSE_HEADER = { "Content-Type" : "image/gif"          };
const    PPT_RESPONSE_HEADER = { "Content-Type" : "vnd.ms-powerpoint"  };
const    XLS_RESPONSE_HEADER = { "Content-Type" : "application/vnd.ms-excel" };
const   XLSX_RESPONSE_HEADER = { "Content-Type" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
const   DEFAULT_OCTET_STREAM = { "Content-Type" : "application/octet-stream"  };

/*
:!start explorer "https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types"
 */
/*}}}*/
/*_ get_response_200_header {{{*/
let get_response_200_header = function(_file_name,query)
{
    let file_name = _file_name.toLowerCase();
    /* MISC_RESPONSE_HEADER {{{*/
    let header;
    MISC_ARRAY.forEach((pattern) => {
        let re = RegExp(pattern, "mgi");
//log_X(re);
        if(!header && file_name.match(re))
        {
//g_B("match: "+ re +" ["+file_name.replace(/.*[\\\/]/,"")+"]");
log_B(                    file_name.replace(/.*[\\\/]/,"")    );
            header = MISC_RESPONSE_HEADER;
        }
    });
    if(header) return header;
    /*}}}*/
    /*  server_notes.tml_format_requested {{{*/
    if( server_notes.html_format_requested(_file_name,query) )
    {
        if (file_name.endsWith("js"     )) return { "Content-Type" : "text/html;  charset=UTF-8" };
        if (file_name.endsWith("css"    )) return { "Content-Type" : "text/html;  charset=UTF-8" };
        if (file_name.endsWith("ahk"    )) return { "Content-Type" : "text/html;  charset=UTF-8" };
        if (file_name.endsWith("awk"    )) return { "Content-Type" : "text/html;  charset=UTF-8" };
        if (file_name.endsWith("vim"    )) return { "Content-Type" : "text/html;  charset=UTF-8" };
        if (file_name.endsWith("txt"    )) return { "Content-Type" : "text/html;  charset=UTF-8" };
    }
    /*}}}*/
    return (file_name.endsWith("html"   )) ? HTML_RESPONSE_HEADER
        :  (file_name.endsWith("htm"    )) ? HTML_RESPONSE_HEADER

        :  (file_name.endsWith("ahk"    )) ?  AHK_RESPONSE_HEADER
        :  (file_name.endsWith("awk"    )) ?  AWK_RESPONSE_HEADER
        :  (file_name.endsWith("css"    )) ?  CSS_RESPONSE_HEADER
        :  (file_name.endsWith("csv"    )) ?  CSV_RESPONSE_HEADER
        :  (file_name.endsWith("doc"    )) ?  DOC_RESPONSE_HEADER
        :  (file_name.endsWith("docx"   )) ?  DOC_RESPONSE_HEADER
        :  (file_name.endsWith("ico"    )) ?  ICO_RESPONSE_HEADER
        :  (file_name.endsWith("jpg"    )) ?  JPG_RESPONSE_HEADER
        :  (file_name.endsWith("js"     )) ?   JS_RESPONSE_HEADER
        :  (file_name.endsWith("json"   )) ? JSON_RESPONSE_HEADER
        :  (file_name.endsWith("pdf"    )) ?  PDF_RESPONSE_HEADER
        :  (file_name.endsWith("png"    )) ?  PNG_RESPONSE_HEADER
        :  (file_name.endsWith("svg"    )) ?  SVG_RESPONSE_HEADER
        :  (file_name.endsWith("gif"    )) ?  GIF_RESPONSE_HEADER
        :  (file_name.endsWith("ppt"    )) ?  PPT_RESPONSE_HEADER
        :  (file_name.endsWith("sh"     )) ?   SH_RESPONSE_HEADER
        :  (file_name.endsWith("md"     )) ?   MD_RESPONSE_HEADER
        :  (file_name.endsWith("ini"    )) ?  INI_RESPONSE_HEADER
        :  (file_name.endsWith("lnk"    )) ?  LNK_RESPONSE_HEADER
        :  (file_name.endsWith("vim"    )) ?  VIM_RESPONSE_HEADER
        :  (file_name.endsWith("bat"    )) ?  BAT_RESPONSE_HEADER
        :  (file_name.endsWith("lua"    )) ?  LUA_RESPONSE_HEADER
        :  (file_name.endsWith("xls"    )) ?  XLS_RESPONSE_HEADER

        :  (file_name.endsWith("xlsx"   )) ? XLSX_RESPONSE_HEADER
        :  (file_name.endsWith("txt"    )) ? DEFAULT_TEXT_PLAIN
        :                                    DEFAULT_OCTET_STREAM // FALLBACK (OTHER)
    ;

};
/*}}}*/
/*_ writeHead {{{*/
let writeHead = function(response, _caller, ...args)
{
if(is_logging()) log_X(Y+"● writeHead "+_caller);

    response.writeHead(...args);
//console.trace();//FIXME
};
/*}}}*/
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ request_LISTENER 🟤 dispatch  🟤🟤🟤🟤🟤🟤🟤🟤🟤🟤🟤 │
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/
let request_LISTENER = (function() {
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
        uri.path = DEFAULT_URI_PATH;
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
        writeHead(response, caller, 404);

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
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ customize_FILE_CONTENT
    //└────────────────────────────────────────────────────────────────────────┘
    /* fs.readFile {{{*/
    if(!consumed_by && uri.path)
    {
        consumed_by = fs_readFile(request,response,uri);
    }
    /*}}}*/
// log {{{
if(is_logging()) log_X(N+"dispatch: consumed_by=["+consumed_by+"]");
if(config.LOG_MORE) log_X(TRACE_CLOSE);//DEBUG
//}}}
};
/*}}}*/
//┌────────────────────────────────────────────────────────────────────────────┐
//│ TODO IIFE
//└────────────────────────────────────────────────────────────────────────────┘
/*_ fs_readFile {{{*/
let fs_readFile = function(request,response,uri)
{
//{{{
let caller = "fs_readFile";
//}}}
        let   reqPath  = decodeURIComponent(request.url.split("?")[0]);
        let file_path  = path.join(server_top_folder, reqPath);
//{{{
//console.dir(                   uri             )
//console.dir(                   request         )
//console.dir("request.url \t["+ request.url +"]")
//console.dir("reqPath     \t["+ reqPath     +"]")
//console.dir("file_path   \t["+ file_path   +"]")
//}}}
        if( file_path == "query")
            file_path  = uri.query.match(/qtext=([^\?]+)/)[1];
//{{{
//log_G("  ┌────────────────────────────────────────────────────────────────────────────┐\n"
//     +"● │ READFILE:\n"
//     +"  │      uri.path =["+ uri.path  +"]\n"
//     +"  │      uri.query=["+ uri.query +"]\n"
//     +"  │      file_path=["+ file_path +"]\n"
//     +"  └────────────────────────────────────────────────────────────────────────────┘");
//}}}
        fs.stat(file_path, (err, stats) => {
            /* err {{{*/
            if(err) {
                writeHead(response, caller, 404);

                response.end("Not found: ["+file_path+"]");
                return;
            }
            /*}}}*/
            /* directory {{{*/
            if(stats.isDirectory())
            {
                request_directory_listing(request, response, reqPath, file_path);

            }
            /*}}}*/
            /* file {{{*/
            else {
                fs.readFile(file_path, function(read_err,data) { customize_FILE_CONTENT(request, file_path, uri.query, response, read_err, data); });
            }
            /*}}}*/
        });

//      log_B("┌──────────────────────────────────────────────────────────────────────────────┐\n"
//           +"● SERVE FILES ["+uri.path +"]\n"
//           +"└──────────────────────────────────────────────────────────────────────────────┘");
if(is_logging()) log_B("● SERVING FILE ["+uri.path+"]");
        return "fs.readFile";
};
/*}}}*/
//┌────────────────────────────────────────────────────────────────────────────┐
//│ TODO IIFE
//└────────────────────────────────────────────────────────────────────────────┘
/*_ request_directory_listing {{{*/
/*{{{*/
const CUSTOM_HTML_TAG_FOLDER        = "folder_tag";
const CUSTOM_HTML_TAG_JS            = "js_tag"    ;
const CUSTOM_HTML_TAG_IMG           = "img_tag"   ;
const CUSTOM_HTML_TAG_FILE          = "file_tag"  ;
/*}}}*/
/* STYLE_DIR {{{*/
const STYLE_DIR = `
<!DOCTYPE html>
<html lang="en">
 <head> <!--{{{-->
  <!-- meta {{{-->
  <meta charset="utf-8">
  <meta name="color-scheme" content="light only">
  <!--}}}-->
<!-- style {{{-->
  <style>
/* style CUSTOM_HTML_TAG_... {{{*/

    ${ CUSTOM_HTML_TAG_FOLDER},
    ${ CUSTOM_HTML_TAG_JS    },
    ${ CUSTOM_HTML_TAG_IMG   },
    ${ CUSTOM_HTML_TAG_FILE  } {
        display     :  inline-block;
        border-radius: 0.5em;
    }
    ${ CUSTOM_HTML_TAG_FOLDER}         { margin-top: 1em; }

/*}}}*/
/* style CUSTOM_HTML_TAG_...::before {{{*/

    ${ CUSTOM_HTML_TAG_FOLDER}::before,
    ${ CUSTOM_HTML_TAG_JS    }::before,
    ${ CUSTOM_HTML_TAG_IMG   }::before,
    ${ CUSTOM_HTML_TAG_FILE  }::before {
        display         :  inline-block;
        margin-right    :  0.5em;
        min-width       :    2em;
        padding         :  0 0.25em;
        vertical-align  :  middle;
/*{{{
        outline         :  1px solid #8888;
        outline-offset  :  2px;
        text-align      :  center;
}}}*/
        text-align      :  end;
    }
    ${ CUSTOM_HTML_TAG_FOLDER}::before { content: '📂'; color: #FF0; }
    ${ CUSTOM_HTML_TAG_JS    }::before { content: '💻'; color: #FF0; }
    ${ CUSTOM_HTML_TAG_IMG   }::before { content: '📷'; color: #0AF; }
    ${ CUSTOM_HTML_TAG_FILE  }::before { content:  '…'; color: #F00; }

/*}}}*/
/* style body input btn_copy li {{{*/
   body      { color: #FEE; background-color: #111; line-height: 1.5em; }
A:link    {            color: #8FF; }
A:visited {            color: #F0F; }
   input  {
    width           : 80%;
    letter-spacing  : 0.2em;'
    height          : 1em;
    color           : #FFF4;
    background-color: transparent;
    border          : none;
   }
   #btn_copy {
       display: inline-block;
       cursor: pointer;
       user-select: none;
/*{{{
       border-radius: 0.5em;
       border: 1px solid white;
       background: #8888;
}}}*/
   }
/*
   LI:nth-of-type(odd) { padding-left: 3em; }
*/
   LI        { padding-left: 2em; }
   LI:has(B) { padding-left: 0em !important; margin: 1em; }
/*}}}*/
  </style>
<!--}}}-->
 </head>
<!--}}}-->
 <body> <!--{{{-->
  Index of:
  <em title="copy folder path\nto clipboard" id="btn_copy"
      onclick='
      let input = event.target.nextElementSibling;
      input.select();
      document.execCommand("copy");
      '>📋</em>
  <input type="text" value="{file_path}">
  <br>      <b    style='margin-left:4em;'                  > {top_title} </b>
  <br>      <b    style='margin-left:4em;'                  > {link_list} </b>
  <ul>
   {dir_items}
  </ul>
 </body> <!--}}}-->
</html>
`;
/*}}}*/
let request_directory_listing = function(request, response, reqPath, file_path)
{
/*{{{*/
let caller = "request_directory_listing";
/*}}}*/
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ [top_list]  ● no href                        ● above SERVER TOP FOLDER │
    //└────────────────────────────────────────────────────────────────────────┘
    let head_path        =  server_top_folder.replace(/^[\/\\]|[\/\\]$/g,  "");
    let head_list        =  head_path        .replace(/[\/\\]/g         , " ").split(" ");

    let top_list         =  [];
    head_list.map((name) => top_list.push({ name }));

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ [dir_list] ● <a href>dir-name<>             ● below SERVER TOP FOLDER  │
    //└────────────────────────────────────────────────────────────────────────┘
    let scheme          =  request.socket.encrypted ?            "https" : "http";
    let port            =  request.socket.encrypted ? config.PORT_HTTPS  : config.PORT_HTTP;

    let dir_path        =  file_path.substring( server_top_folder.length ).replace(/^[\/\\]|[\/\\]$/g,"");
    let dir_list        =   dir_path.replace(/\\/g," ").split(" ");

    let href_root       =  scheme +"://"+ net_address +":"+ port;
    let href            =  href_root;

    let url_list        =  [];
    dir_list.map((name) => { href += "/"+name; url_list.push({ name, href }); });

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ [folder_title] ● [top_list]         ● [dir_list <a href>dir_name</a>   │
    //└────────────────────────────────────────────────────────────────────────┘
    let top_title       = ""; top_list.map((a) => { top_title += " ⚫ <b>"+                   a.name +"</b>"; });

    if( url_list[0].name && (url_list[0].name != "Root"))
        url_list.unshift({ name: "Root", href: href_root });

    let link_list       = ""; url_list.map((a) => { link_list += " 🟣 <a href='"+a.href+"'>"+ (a.name||"Root") +"</a>"; });

    // [readdir] ● BOLD ENTRY NAME
    fs.readdir(file_path, (read_err, files) => {
        files.unshift("..");
        let dir_items
            = files.map((name) => ""+get_dirEntry_link(reqPath, name)+"\n")
            . join("");
        writeHead(response, caller, 200, { "Content-Type": "text/html" });

        response.end( STYLE_DIR.replace("{file_path}", file_path)
                      .         replace("{top_title}", top_title)
                      .         replace("{link_list}", link_list)
                      .         replace("{dir_items}", dir_items)
                    );
    });
};
/*}}}*/
/*_ get_dirEntry_link {{{*/
let get_dirEntry_link = function(reqPath, name)
{
    return "<li>"
        +   "<a href="+ path.join(reqPath, name ) +">"
        +   "<"+         get_dirEntry_tag( name ) +"/>"+ name
        +   "</a>"
        +  "</li>";
};
/*}}}*/
/*_ get_dirEntry_tag {{{*/
let get_dirEntry_tag = function(name)
{
    let dirEntry_tag;

    let matches = name.match(/\.(\w+)$/);
    let     ext = matches ? matches[1] : "";
    switch( ext ) {
    case   "jpg":
    case   "gif":
    case   "png": dirEntry_tag              = CUSTOM_HTML_TAG_IMG ; break;
    case   "js" : dirEntry_tag              = CUSTOM_HTML_TAG_JS  ; break;
    default     : dirEntry_tag
                = name.match(/^[A-Z_]+$/)   ? CUSTOM_HTML_TAG_FOLDER    // all caps //FIXME
                                            : CUSTOM_HTML_TAG_FILE;
    }

    return dirEntry_tag;
};
/*}}}*/
/*_ parse_url {{{*/
let parse_url = function(url)
{
//{{{
//log_X("parse_url:")
//log_X("url:")
//console.dir( url  )
//log_X("decodeURIComponent(url):")
//console.dir( decodeURIComponent(url)  )
//}}}

    let url_match
        = [   ""/* [0]    url */
            , ""/* [1] scheme */
            , ""/* [2]   port */
            , ""/* [3] domain */
            , ""/* [4]   path */
            , ""/* [5]  query */
        ];

    try {
        url_match
            = decodeURIComponent(url)
            . replace(     /\+/g, " ")  // encoded space
            . replace(     /\r/g, " ")  // CR
            . replace(     /\n/g, " ")  // LF
            . replace(  /\s\s+/g, " ")  // multiple spaces
            . replace(/\s*;\s*$/,  "")  // trailing separator
            . match(/^(\w+)?(:\/\/)?([^\/]+)?\/([^\?]+)?\??(.*)?/)
        //.........(111111).(22222).(333333)...(444444)....(55)...
        //..........scheme...port_...domain.....path__.....query..
        ;
    } catch(err) {
        console.warn(err);
    }

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
return { dispatch };
})();
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

        server_notes.handle_request(request, response, body);
    });
};
/*}}}*/
/*_ handle_GET {{{*/
let handle_GET = function(request,response)
{
if(is_logging()) log_X("handle_GET");

    let body =     decodeURIComponent( request.url );

    server_notes.handle_request(request, response, body);
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ TODO IIFE
//└────────────────────────────────────────────────────────────────────────────┘
/*_ customize_FILE_CONTENT {{{*/
/*{{{*/
const DEFAULT_URI_PATH = "./index.html";
const FOLD_OPEN = "{{{"; /* eslint-disable-line no-unused-vars */
const FOLD_CLOSE= "}}}"; /* eslint-disable-line no-unused-vars */
/*    STYLE_QTEXT {{{*/
const STYLE_QTEXT = ""
    + "<link type='text/css' href='/style/notes.css' rel='stylesheet'>"
    + "<link type='text/css' href='/style/qtext.css' rel='stylesheet'>"
    ;
/*}}}*/
/*    SCRIPT_QTEXT {{{*/
const SCRIPT_QTEXT = ""
    + "<meta name='color-scheme' content='light only'>"
    + "<script src='/scripts/js_log.js     '></script>\n"

    + "<script src='/scripts/js_folds.js   '></script>\n"
    + "<script src='/scripts/js_store.js   '></script>\n"
    + "<script src='/scripts/js_xpath.js   '></script>\n"
    + "<script src='/scripts/js_linkify.js '></script>\n"

    + "<script src='/scripts/js_MODEL.js   '></script>\n"
    + "<script src='/scripts/js_VIEW.js    '></script>\n"
    + "<script src='/scripts/js_CNTRL.js   '></script>\n"

    + "<script src='/scripts/js_ticker.js  '></script>\n"
    + "<script src='/scripts/js_input.js   '></script>\n"
    + "<script src='/scripts/notes.js      '></script>\n"
    + "<script src='/scripts/js_notes.js   '></script>\n"
    ;
/*}}}*/
/*}}}*/
let customize_FILE_CONTENT = function(request, file_name, query, response, err, data)
{
/*{{{*/
let caller = "customize_FILE_CONTENT("+file_name+")";
/*}}}*/
    /* QUERY    ● lang ● user_id {{{*/
    let    lang = get_query_arg(query,    "lang");
    let user_id = get_query_arg(query, "user_id");

    let  params = (user_id   ? C+     " user_id=["+ user_id   +"]" : "")
        +         (lang      ? Y+        " lang=["+ lang      +"]" : "")
    ;
/*{{{*/
if(config.LOG_MORE)
    log_G(G+"  ┌────────────────────────────────────────────────────────────────────────────┐\n"
         +G+"● │ RESPONSE FILES (async)                                                     │\n"
         +G+"  │ "+file_name+" "+params+"\n"
         +G+"  └────────────────────────────────────────────────────────────────────────────┘");
/*}}}*/
/*}}}*/
    /* FILE     ● err {{{*/
    if(err) {
log_R( err );
        if( server_notes.html_format_requested(file_name,query) )
        {
            writeHead(  response, caller+"", 404, HTML_RESPONSE_HEADER );

            response.write("<pre style='background:black; color:#DDD;'>"
                           +"<b> file_name=["+    file_name +"</b>"
                           +"<b>     query=["+    query     +"</b>"
                           +LF   +JSON.stringify( err).replace(/,/g,LF+", ")
                           +"</pre>"
                          );
        }
        else {
            writeHead(  response, caller, 404, {"Content-Type": "text/plain"});

            response.write( "customize_FILE_CONTENT ["+file_name+"] :\n"
                           +JSON.stringify(err)
                          );
        }
//log_X("response.request_count["+response.request_count+"] customize_FILE_CONTENT"+TRACE_CLOSE)
        response.end();
    }
/*}}}*/
    /* FILE     ● data ● qtext {{{*/
    else {
        /* RESPONSE HEADER {{{*/

        let response_200_header
            = get_response_200_header(file_name,query);
if(is_logging()) log_X("response_200_header=["+response_200_header["Content-Type"]+"]");//FIXME

        if( response.content_disposition )
            response_200_header["Content-Disposition"]
                = response.content_disposition; // eslint-disable-line no-useless-computed-key

        if( response.content_disposition )
            delete response.content_disposition;

        if( response_200_header )
        {
            writeHead(  response, caller, 200, response_200_header);

        }
        /*}}}*/
        //┌──────────────────────┐
        //│ VIM FOLD ● BOX FORMAT
        //└──────────────────────┘
        /* qtext turn VIM FOLDS into DETAILS SUMMARY {{{*/
        if(data.includes( FOLD_OPEN ))
        {
            // ?qtext
            if(   server_notes.html_format_requested(file_name,query)
              && !file_name.match(/\.htm/)
              ) {
                data = String(data)
                // html entities
                    .  replace(                /</gm, "&lt;"                                )
                    .  replace(                />/gm, "&gt;"                                )
                // foldings
                    .  replace(/(.*{{ *{.*)\r*\n*/gm, "<details><summary>$1</summary><pre>" )
                    .  replace(/(.*}} *}.*)\r*\n*/gm,                   "$1</pre></details>")
                // remove vim fold markers
                    .  replace(      / *;* *{{ *{/gm, " "                                   )
                    .  replace(      / *;* *}} *}/gm, " "                                   )
                // box
/*{{{
                    .  replace(           /\/\/┌/gm , "TOP┌")
                    .  replace(           /\/\/│/gm , "MID│")
                    .  replace(           /\/\/└/gm , "BOT└")
}}}*/
/*{{{
                    .  replace(           /\/\/┌/gm , "🟤🔴🟠┌")
                    .  replace(           /\/\/│/gm , "🟤🔴🟠│")
                    .  replace(           /\/\/└/gm , "🟤🔴🟠└")
}}}*/

                    .  replace(         / *\/\/ *(┌.*$)/gm , "<BOXU>$1</BOXU>")
                    .  replace(         / *\/\/ *(│.*$)/gm , "<BOXM>$1</BOXM>")
                    .  replace(         / *\/\/ *(└.*$)/gm , "<BOXD>$1</BOXD>")

                    .  replace(         / *\/\/ *(├.*$)/gm , "<BOXM>$1</BOXM>")
                    .  replace(         / *\/\/ *(┼.*$)/gm , "<BOXM>$1</BOXM>")
                    .  replace(         / *\/\/ *(┤.*$)/gm , "<BOXM>$1</BOXM>")

                    .  replace(          /[└┘┌┐│─├┼┤]/gm , " "           )

                // comments
                  //.  replace( /[\n\r]( *)\/\/ */gm, "\n✔✓$1")
                  //.  replace(        /^ *\/\/ */  , "ℹ\n"  )
                ;
            }
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
        }
        /*}}}*/
        /* WRITE FILE CONTENT .. replace (127.0.0.1|\blocalhost\b) with [net_address] {{{*/
        if( server_notes.html_format_requested(file_name,query) )
        {
            let header
                = "<title>"+file_name.replace(/.*[\\\/]/,"")+"</title>\n"
                +  SCRIPT_QTEXT;

            response.write( header                 );
            response.write( STYLE_QTEXT            );
            response.write( "<pre>"+ data +"</pre>");
        }
        else {
            if(net_address && DEFAULT_URI_PATH.includes(file_name))
                data = String(data).replace(/(127.0.0.1|\blocalhost\b)/gm, net_address);

/*{{{
            data = "<button onclick='document.location.replace(document.location.url +\"?qtext\")'>?qtext</button>\n"
                 + "<pre>"+ data +"</pre>";
}}}*/

            response.write(       data);
        }
        /*}}}*/
        /* ADD HIDDEN ATTRIBUTES ● lang ● user_id {{{*/
        if(    lang ) response.write("<input type='hidden' id='lang'    name='lang'    value='"+lang   +"' />");
        if( user_id ) response.write("<input type='hidden' id='user_id' name='user_id' value='"+user_id+"' />");

        /*}}}*/
//log_X("response.request_count["+response.request_count+"] customize_FILE_CONTENT"+TRACE_CLOSE)
        response.end();
    }
/*}}}*/
};
/*}}}*/
/*_ get_query_arg {{{*/
let get_query_arg = function(query, arg)
{
    //log_N(query)
    //log_N(arg  )
    if(!query || !arg) return "";

    let    query_regexp = new RegExp(arg+"=([^&]*)");
    let    query_match  = query.match(query_regexp);
    return query_match  ? query_match[1] : "";
};
/*}}}*/

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
        writeHead(response, caller, 200, HTML_RESPONSE_HEADER );

        log_STATUS( response );

//log_X("response.request_count["+response.request_count+"] reply_server_STATUS"+TRACE_CLOSE)
        response.end();
        consumed_by = "status";
    }

    return consumed_by;
};
/*}}}*/



return { name: "server", config , createServer }; /*{{{*/

/*}}}*/
})();
server.createServer();
