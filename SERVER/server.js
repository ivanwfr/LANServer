//┌──▼▼▼▼▼▼────────────────────────────────────────────────────────────────────┐
//│ [SERVER]                                     ● $APROJECTS/LANServer/SERVER │
//├──▲▲▲▲▲▲────────────────────────────────────────────────────────────────────┤
//│  $AHK/P.txt                                  🟤 HIDCONTROL/DOC/kb.html     │
//│✔ $APROJECTS/LANServer/SERVER/server.js       🔴 https://192.168.1.14:447   │
//│  $INPUTDIR/TWIDDLER/CFG/CONVERT/P.txt        🟠 Twiddler                   │
//│  $INPUTDIR/TWIDDLER/GitHub/P.txt             🟡 layout_browser             │
//└────────────────────────────────────────────────────────────────────────────┘
/* jshint esversion: 9, laxbreak:true, laxcomma:true, boss:true */ /*{{{*/

/* eslint-disable no-warning-comments */

//┌────────────────────────────────────────────────────────────────────────────┐
    const SERVER_JS_ID  = "server";
    const SERVER_JS_TAG = SERVER_JS_ID  +" (260914:00h:57)";
//└────────────────────────────────────────────────────────────────────────────┘
/*}}}*/

let server = (function() {
let log_this = false;

//┌────────────────────────────────────────────────────────────────────────────┐
//│ STYLE_DIR                                                                  │
//└────────────────────────────────────────────────────────────────────────────┘
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
/*    SCRIPT_QTEXT {{{*/
const SCRIPT_QTEXT = ""
    + "<meta name='color-scheme' content='light only'>"
    + "<script src='/scripts/js_folds.js'  ></script>"
    + "<script src='/scripts/js_store.js'  ></script>"
    + "<script src='/scripts/js_xpath.js'  ></script>"
    + "<script src='/scripts/js_linkify.js'></script>"
    + "<script src='/scripts/js_notes.js'  ></script>"
    ;
/*}}}*/
/*    STYLE_QTEXT {{{*/
const STYLE_QTEXT = ""
    + "<link type='text/css' href='/style/qtext.css' rel='stylesheet'>"
    ;
/*}}}*/
const TRACE_OPEN  = " {{{"; /* eslint-disable-line no-unused-vars */
const TRACE_CLOSE = " }}}";
//➔ ANSII-TERMINAL {{{*/
/* eslint-disable no-unused-vars */
const  LF = String.fromCharCode(10);
const ESC = String.fromCharCode(27);

const R   = ESC+"[1;31m"                ; //     RED
const G   = ESC+"[1;32m"                ; //   GREEN
const Y   = ESC+"[1;33m"                ; //  YELLOW
const B   = ESC+"[1;34m"                ; //    BLUE
const M   = ESC+"[1;35m"                ; // MAGENTA
const C   = ESC+"[1;36m"                ; //    CYAN
const N   = ESC+"[0m"                   ; //      NC

//nst Z   = ESC+"[H"+ESC+"[2J"+ESC+"[3J"; // tput CLEAR

let log_X = function(args         ) { console.log(      ...args ); };
let log_R = function(arg0, ...rest) { log_X([ R + arg0, ...rest]); };
let log_G = function(arg0, ...rest) { log_X([ G + arg0, ...rest]); };
let log_B = function(arg0, ...rest) { log_X([ B + arg0, ...rest]); };

let log_C = function(arg0, ...rest) { log_X([ C + arg0, ...rest]); };
let log_M = function(arg0, ...rest) { log_X([ M + arg0, ...rest]); };
let log_Y = function(arg0, ...rest) { log_X([ Y + arg0, ...rest]); }; // eslint-disable-line no-unused-vars

let log_N = function(arg0, ...rest) { log_X([ N + arg0, ...rest]); };

//t log_Z = function(arg0, ...rest) { log_X([ Z + arg0, ...rest]); };

/* eslint-enable  no-unused-vars */
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ DEPENDENCIES ●  REQUIRE         terminal fs http https config sql postgres │
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/
//➔ [fs http https networkInterfaces] {{{
let   fs                        = require("fs"   );
let   http                      = require("http" );
let   https                     = require("https");
let   path                      = require("path" );
let { networkInterfaces }       = require("os"   );
//}}}
//➔ [config defaults] {{{
let   config =
{     LOAD_STATUS               : ""

    , PORT_HTTP                 :  81
    , PORT_HTTPS                : 444
//  ,  KEY_PEM                  : "../../KEYSTORE/server/privkey.pem"
//  , CERT_PEM                  : "../../KEYSTORE/server/fullchain.pem"

//  , HOST                      : "localhost"
//  , USER                      : "postgres"
//  , PASSWORD                  : "ivan"
//  , DATABASE                  : "postgres"
//  , FEEDBACK_TABLE            : "feedbacks"
//  , URI_DIR                   :    "Files"
//  , URI_DIR_TARGET            : "C:/Files"

};

/*}}}*/
/*_ config_LOAD_STATUS_log {{{*/
let config_LOAD_STATUS_log = function(msg)
{
    if( config.LOAD_STATUS )
        config.LOAD_STATUS +=  LF;
    else
        config.LOAD_STATUS  =  "";
    config.LOAD_STATUS     += msg;
};
/*}}}*/
//➔ CONFIG_JSON {{{
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
//➔ SQL_REQUIRE {{{
const SQL_REQUIRE               = "../SERVER/server_sql.js";
let   server_sql;
try {
    server_sql                  = require(      SQL_REQUIRE );
    config_LOAD_STATUS_log(       `CONFIG    [${SQL_REQUIRE}]`);
} catch(ex) {
    config_LOAD_STATUS_log(       `******    [${SQL_REQUIRE}] ERROR ➔ ${ex}`);
}

/*}}}*/
//➔ [lib_postgres] {{{
const LIB_PG_REQUIRE            = "../lib/lib_postgres.js";
let   lib_postgres;
try {
    lib_postgres                = require(      LIB_PG_REQUIRE );
    config_LOAD_STATUS_log(       `CONFIG    [${LIB_PG_REQUIRE}]`);
} catch(ex) {
    config_LOAD_STATUS_log(       `******    [${LIB_PG_REQUIRE}] ERROR ➔ ${ex}`);
}

/*}}}*/
//➔ BDDSERVICE {{{
const BDDSERVICE_REQUIRE        = "../SERVER/bddservice.js";
let bddservice;
try {
    bddservice                  = require(        BDDSERVICE_REQUIRE);
    config_LOAD_STATUS_log(       `\nCONFIG    [${BDDSERVICE_REQUIRE}]`);
} catch(ex) {
    config_LOAD_STATUS_log(         `POSTGRES  [${BDDSERVICE_REQUIRE}] ERROR ➔ ${ex}\n`);
}

/*}}}*/
//➔ DOWNLOAD_REQUIRE {{{
const DOWNLOAD_REQUIRE          = "../CONTROL/server_download.js";
let   server_download;
try {
    server_download             = require(      DOWNLOAD_REQUIRE );
    config_LOAD_STATUS_log(       `CONFIG    [${DOWNLOAD_REQUIRE}]`);
} catch(ex) {
    config_LOAD_STATUS_log(       `******    [${DOWNLOAD_REQUIRE}] ERROR ➔ ${ex}`);
}

/*}}}*/
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ CREATE SERVER                                                          LOG │
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

    if( lib_postgres )
        lib_postgres.configure(config, server_sql);

    /*}}}*/
    /* LISTEN {{{*/
    if(http__server) http__server.addListener("request", server_request_listener.request_listener);
    if(https_server) https_server.addListener("request", server_request_listener.request_listener);

    /*}}}*/
    /* STATUS {{{*/
    log_STATUS();

    /*}}}*/
    /* WATCH SQL FOLDER {{{*/
    //watch_SQL_changes();

    /*}}}*/
    /* WATCH DOWNLOAD FOLDER {{{*/
    server_download.set_server( server );
    server_download.watch_DOWNLOAD_changes();

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

    s +=`
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
│ HOST              [${config.HOST        }]
│ USER              [${config.USER        }]
│ PASSWORD          [${config.PASSWORD    }]
│ DATABASE          [${config.DATABASE    }]
│ URI_DIR           [${config.URI_DIR     }]`
;

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
    /* POSTGRES {{{*/
    let postgres_args  = "["+config.HOST+"] ["+config.USER+"] ["+config.DATABASE+"]";
    let config_status  =     config.LOAD_STATUS.replace(/\n/g,"\n│ ");
    s = `
┌───────────────────────────────────────────────────────────────────── STATUS ─┐
│ ${postgres_args}
│ ${config_status}
└──────────────────────────────────────────────────────────────────────────────┘`;

    let   postgres_color = postgres_args.includes("undefined") ? R : log_color;
    log_N(postgres_color +s);

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
//│ RESPONSE HEADER                                               ● MISC_ARRAY │
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
//console.log(re);
        if(!header && file_name.match(re))
        {
//g_B("match: "+ re +" ["+file_name.replace(/.*[\\\/]/,"")+"]");
log_B(                    file_name.replace(/.*[\\\/]/,"")    );
            header = MISC_RESPONSE_HEADER;
        }
    });
    if(header) return header;
    /*}}}*/
    /*  html_format_requested {{{*/
    if( html_format_requested(_file_name,query) ) {
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
if(log_this) console.log(Y+"● writeHead "+_caller);

    response.writeHead(...args);
//console.trace();//FIXME
};
/*}}}*/
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ RESPONSE CONTROL ● FILES (async) ● VIM FOLD                                │
//└────────────────────────────────────────────────────────────────────────────┘
/*_ fs_read_file_callback {{{*/
/*{{{*/
const DEFAULT_URI_PATH = "./index.html";
const FOLD_OPEN = "{{{"; /* eslint-disable-line no-unused-vars */
const FOLD_CLOSE= "}}}"; /* eslint-disable-line no-unused-vars */
/*}}}*/
let fs_read_file_callback = function(request, file_name, query, response, err, data)
{
/*{{{*/
let caller = "fs_read_file_callback("+file_name+")";
/*}}}*/
/* [lang] [user_id] {{{*/
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
/* [err] {{{*/
    if(err) {
log_R( err );
        if( html_format_requested(file_name,query) )
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

            response.write( "fs_read_file_callback ["+file_name+"] :\n"
                           +JSON.stringify(err)
                          );
        }
//console.log("response.request_count["+response.request_count+"] fs_read_file_callback"+TRACE_CLOSE)
        response.end();
    }
/*}}}*/
    //┌─────────────┐
    //│ VIM FOLD ●● │
    //└─────────────┘
 /* [data] {{{*/
    else {
        /* RESPONSE HEADER {{{*/

        let response_200_header
            = get_response_200_header(file_name,query);
if(log_this) console.log("response_200_header=["+response_200_header["Content-Type"]+"]");//FIXME

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
        /* qtext turn VIM FOLDS into DETAILS SUMMARY {{{*/
        if(data.includes( FOLD_OPEN ))
        {
            // ?qtext
            if(   html_format_requested(file_name,query)
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

                    .  replace(           /\/\/ *(┌.*$)/gm , "<BOX>$1</BOX>")
                    .  replace(           /\/\/ *(│.*$)/gm , "<BOX>$1</BOX>")
                    .  replace(           /\/\/ *(└.*$)/gm , "<BOX>$1</BOX>")

                    .  replace(           /\/\/ *(├.*$)/gm , "<BOX>$1</BOX>")
                    .  replace(           /\/\/ *(┼.*$)/gm , "<BOX>$1</BOX>")
                    .  replace(           /\/\/ *(┤.*$)/gm , "<BOX>$1</BOX>")

                    .  replace(          /[└┘┌┐│─├┼┤]/gm , " "           )

                // comments
                    .  replace( /[\n\r]( *)\/\/ */gm, "\n$1")
                    .  replace(        /^ *\/\/ */  , "\n"  )
                ;
            }
            else if( log_this) {
if(log_this) console.dir(request);
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
        if( html_format_requested(file_name,query) )
        {
            response.write( SCRIPT_QTEXT           );
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
//console.log("response.request_count["+response.request_count+"] fs_read_file_callback"+TRACE_CLOSE)
        response.end();
    }
/*}}}*/
};
/*}}}*/
/*_ html_format_requested {{{*/
/*{{{*/
let prev_file_name;
let cooldown_timer;
/*}}}*/
let html_format_requested = function(file_name,query)
{
    if( !cooldown_timer )
    {
        cooldown_timer = setTimeout(() => {
            cooldown_timer = false;
            prev_file_name = file_name;
            setTimeout(() => prev_file_name = undefined, 5000); // clear history
        }, 500); //............................................ // while processsing the same request
    }
    let state =  (file_name == prev_file_name           )
        ||       (    query && query.startsWith("qtext"))
    ;

if(log_this) console.log("html_format_requested("+ file_name +") ...return "+state+"");
    return state;
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
/*_ get_args_from_request_cookies {{{*/
let get_args_from_request_cookies = function(args,request)
{
    let cookies = request.headers.cookie ? request.headers.cookie.split("; ") : "";
    if( cookies )
    {
        for(let c=0; c<cookies.length; ++c)
        {
            for(let k=0; k < Object.keys(args).length; ++k)
            {
                let key    = Object.keys(args)[k];
                if(cookies[c].startsWith(key+"="))
                    args[key] = cookies[c].substring(key.length +1);
            }
        }
    }

    return args;
};
/*}}}*/





//┌────────────────────────────────────────────────────────────────────────────┐
//│ REQUEST LISTEN          🟤 server_request_listener  🟤🟤🟤🟤🟤🟤🟤🟤🟤🟤🟤 │
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/
let server_request_listener = (function() {
/*➔ request_listener {{{*/
/*{{{*/
const CLEAR_COOLDOWN = 1000;
let last_request_time= 0;
let request_count = 0;
/*}}}*/
let request_listener = function(request, response) /* eslint-disable-line complexity */
{
/*{{{*/
let caller = "request_listener";
/*}}}*/
    /* CLEAR TERMINAL BETWEEN REQUEST CHUNKS {{{*/
    let time_now_MS = new Date().getTime();
    if((time_now_MS - last_request_time) > CLEAR_COOLDOWN) {
        console.log("\x1Bc"+ M + "● request_listener: TERMINAL CLEARED BETWEEN REQUEST CHUNKS");
    }
    last_request_time = time_now_MS; // restart cooldown start time
    /*}}}*/
    /* [uri] {{{*/
    let uri = parse_url( request.url );
    if(!uri.path)
        uri.path = DEFAULT_URI_PATH;

//log_N("uri")
//console.dir( uri )
    /*}}}*/
    // favicon.ico {{{
    if(uri.path == "favicon.ico")
    {
        writeHead(response, caller, 404);

        response.end("Not found: ["+uri.ath+"]");
        return;
    }
    //}}}
    /* request_count {{{*/
    response.request_count = ++request_count;
//if(config.LOG_MORE)
//  console.log(C+"\n● REQUEST #"+response.request_count+" "+TRACE_OPEN+" uri.path=["+uri.path+"] ");//DEBUG
log_B("  ┌───────────────────────────────────────────────┐\n"
     +"● │ ● REQUEST #"+ response.request_count+" "+ request.method +" "+ uri.path +"\n"
     +"  └───────────────────────────────────────────────┘");

    let consumed_by = "";
    /*}}}*/
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ SERVER: [CLEAR I18N LOG_MORE STATUS EXIT]                                            │
    //└────────────────────────────────────────────────────────────────────────┘
/*{{{*/
    let args = { uri , request , response };

    if(     !consumed_by) consumed_by = server_request_commands.request_CLEAR       ( args );
    if(     !consumed_by) consumed_by = server_request_commands.request_I18N_ACTIVE ( args );
    if(     !consumed_by) consumed_by = server_request_commands.request_LOG_MORE    ( args );
    if(     !consumed_by) consumed_by = server_request_commands.request_STATUS      ( args );
    if(     !consumed_by) consumed_by = server_request_commands.request_EXIT        ( args );

/*}}}*/
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ SERVER: [CONTROL]                                                      │
    //└────────────────────────────────────────────────────────────────────────┘
/*{{{*/
//  if( lib_postgres )
    {
        if( !consumed_by) consumed_by = server_request_data_io   .request_data_io    ( args );
        if( !consumed_by) consumed_by = server_request_js_script .request_js_script  ( args );
        if( !consumed_by) consumed_by = server_request_commands  .request_dump_TABLES( args );
        if( !consumed_by) consumed_by = server_request_sql_query .request_sql_query  ( args );

    }
/*}}}*/
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ SERVER: [URI]                                                          │
    //└────────────────────────────────────────────────────────────────────────┘
/*{{{*/
    if(     !consumed_by )
    {
        if(    uri.path.includes( config.URI_DIR )
            &&     fs.existsSync( config.URI_DIR )
          )
            consumed_by = server_request_uri.request_uri( args );

    }
/*}}}*/
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ SERVER: SERVE FILE FROM CURRENT DIRECTORY                              │
    //└────────────────────────────────────────────────────────────────────────┘
    /* 7. fs.readFile {{{*/
    if(!consumed_by && uri.path)
    {
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
                fs.readFile(file_path, function(read_err,data) { fs_read_file_callback(request, file_path, uri.query, response, read_err, data); });
            }
            /*}}}*/
        });

        consumed_by = "fs.readFile"; /* eslint-disable-line no-useless-assignment */
//      log_G("┌──────────────────────────────────────────────────────────────────────────────┐\n"
//           +"● SERVE FILES ["+uri.path +"]\n"
//           +"└──────────────────────────────────────────────────────────────────────────────┘");
        log_G("● "+uri.path);
    }
    /*}}}*/
//{{{
//log_N("consumed_by=["+consumed_by+"]")
if(config.LOG_MORE) console.log(TRACE_CLOSE);//DEBUG
//}}}
};
/*}}}*/
/*_ request_directory_listing {{{*/
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
            = files.map((name) => get_dirEntry_link(reqPath, name))
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
/*{{{*/
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
//console.log("parse_url:")
//console.log("url:")
//console.dir( url  )
//console.log("decodeURIComponent(url):")
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
return { request_listener };
})();
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ REQUEST HANDLE          🟢 server_request 🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢 │
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/
let server_request = (function() {
//"use strict";
//➔{{{*/
const THANKS_FOR_YOUR_FEEDBACK      = "Thank you for your feedback";
/*}}}*/
/*_ handle_request {{{*/
let handle_request = function(request, response, body) // eslint-disable-line complexity
{
/*{{{*/
let caller = "handle_request";
if(config.LOG_MORE) console.log(caller+"("+request.url+")");
//console.log("body");
//console.dir( body );
/*}}}*/
    let consumed_by;
    /* NOTES ● /upload_notes ● /fetch_notes {{{*/
    if(   !consumed_by
       && (request.url    == "/upload_notes")
       && (request.method == "POST")
    ) {
        consumed_by = handle_upload_notes(request, response, body);
    }

    if(   !consumed_by
       &&  request.url.includes("/fetch_notes")
       && (request.method == "GET")
    ) {
        consumed_by = handle_fetch_notes(request, response);
console.log(C+"consumed_by returned by handle_fetch_notes=["+consumed_by+"]");
    }
    /*}}}*/
    /* [i18n] {{{*/
    if( !consumed_by)
    {
        let lang_errors = get_query_arg(body, "lang_errors");
        if( lang_errors )
        {
            /* HANDLED {{{*/
            if( config.I18N_TABLE )
            {
                lang_errors = lang_errors.replace(/""/g,'"'); // eslint-disable-line quotes
    //console.log("lang_errors:")
    //console.dir( lang_errors )
                lang_errors = JSON.parse( lang_errors      ); // OBJECTIFY JSON STRING ARGUMENT
                handle_request_lang_errors(request,response,lang_errors);
            }
            /*}}}*/
            /* NOT HANDLED {{{*/
            else {
                writeHead(response, caller, 200, "OK", {"Content-Type": "text/html; charset=UTF-8"});

                response.write("config.I18N_TABLE IS NOT DEFINED");

//console.log("response.request_count["+response.request_count+"] "+caller+TRACE_CLOSE)
                response.end();
            }
            /*}}}*/
            consumed_by = "lang_errors";
        }
    }
    /*}}}*/
    /* XPATH {{{*/
    if(       !consumed_by
       &&      config.XPATH_TABLE
       && (   (request.url == "/domains")
           || (request.url == "/urls"   )
           || (request.url == "/xpaths" ))
      ) {
        body      = body.replace(/""/g,'"'); // eslint-disable-line quotes
//console.log("body=["+body+"]")
        let  args = JSON.parse(body);

        handle_request_xpath(request, response, args);

        consumed_by = "xpaths";
    }
    /*}}}*/
    /* [bddservice.submit_feedbacks] {{{*/
    if(   !consumed_by
       && !config.I18N_ACTIVE)
    {
        if(   (request.url == "/feedback_submit")
           || (request.url == "/feedback_purge" )
          ) {
            let args
                = {    user_id    : get_query_arg(body, "user_id"    )
                    ,     lang    : get_query_arg(body, "lang"       )
                    ,  subject    : get_query_arg(body, "subject"    )
                    , question    : get_query_arg(body, "question"   )
                    , question_id : get_query_arg(body, "question_id")
                    , qcm_rank    : get_query_arg(body, "qcm_rank"   )
                    ,  comment    : get_query_arg(body, "comment"    )
                };

            /* [bddservice.submit_feedbacks] {{{*/
            let missing_args
                = (args.user_id     ? "" : " user_id"    )
                + (args.lang        ? "" : " lang"       )
                + (args.subject     ? "" : " subject"    )
                + (args.question    ? "" : " question"   )
                + (args.question_id ? "" : " question_id")
                + (args.qcm_rank    ? "" : " qcm_rank"   )
              //+ (args.comment     ? "" : " comment"    ) // COMMENT IS OPTIONAL
            ;

            if(!missing_args.length)
            {
                bddservice.submit_feedbacks(config, args, response);
            }
            else {
                let warning = "*** "+caller+": missing arguments: ["+missing_args+"] while calling [bddservice.submit_feedbacks] ***";

                args.origin = "bddservice";
                lib_postgres.query_callback_err(args, response, warning);
                response.end();
            }

            consumed_by = "bddservice.submit_feedbacks";
            /*}}}*/
        }
    }
    /*}}}*/
    /* [feedback] [populate] .. (I18N_ACTIVE) {{{*/
    if(!consumed_by)
    {
        /* HANDLED [user_id lang subject question feedback comment] {{{*/
        let args
            = {    user_id : get_query_arg(body, "user_id" )
                ,     lang : get_query_arg(body, "lang"    )
                ,  subject : get_query_arg(body, "subject" )
                , question : get_query_arg(body, "question")
                , feedback : get_query_arg(body, "feedback")
                ,  comment : get_query_arg(body, "comment" )
            };
/*{{{
let recap
    = "  ┌─────────────────────────────────────────────────────────────────┐\n"
    + "  │ "+caller    +": request=["+request.url                        +"]\n"
    + "  │ .     user_id=[" + args.user_id                               +"]\n"
    + "  │ .        lang=[" + args.lang                                  +"]\n"
    + "● │ .     subject=[" + args.subject                               +"]\n"
    + "  │ .    question=[" + args.question                              +"]\n"
    + "  │ .    feedback=[" + args.feedback                              +"]\n"
    + "  │ .     comment:\n"+ args.comment.replace(/^/gm,"  │         │")+ "\n"
    + "  └─────────────────────────────────────────────────────────────────┘";
log_M(recap);
}}}*/

        if     (   (request.url == "/feedback_submit")
                || (request.url == "/feedback_purge" )
               ) {
            handle_request_feedback(request,response,args);

            consumed_by = request.url; /* eslint-disable-line no-useless-assignment */
        }
        else if(   (request.url == "/populate_submit")
                || (request.url == "/populate_purge" )
               ) {
            handle_request_populate(request,response,args);

            consumed_by = request.url; /* eslint-disable-line no-useless-assignment */
        }
        /*}}}*/
        /* NOT HANDLED {{{*/
        else {
            let why_not_handled
                = (args.user_id  ? "" :  " user_id")
                + (args.subject  ? "" :  " subject")
                + (args.question ? "" : " question")
                + (args.feedback ? "" : " feedback")
            ;
            why_not_handled += (why_not_handled) ? " MISSING\n":"";

            let ack_message =  (why_not_handled || THANKS_FOR_YOUR_FEEDBACK).trim();

            writeHead(response, caller+" ("+ack_message+")", 200, "OK", {"Content-Type": "text/html; charset=UTF-8"});

            if(request.method == "POST") {
                response.write(        ack_message );
            }
            else {
                response.write("<pre>"+ack_message+"</pre>");
                response.write("✔ <button onclick='history.go(-1);'>←</button>");
            }

            //console.log("response.request_count["+response.request_count+"] "+caller+TRACE_CLOSE)
            response.end();

            consumed_by = "NOT HANDLED: ["+request.url+"]"; /* eslint-disable-line no-useless-assignment */
        }
        /*}}}*/
    }
    /*}}}*/

//console.log("consumed_by=["+consumed_by+"]")
};
/*}}}*/
/*_ handle_fetch_notes {{{*/
let handle_fetch_notes = function(request, response)
{
/*{{{*/
let caller = "handle_fetch_notes";
if(log_this) console.log(M+"handle_fetch_notes");
/*}}}*/

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ● from load_notes                                                      │
    //│ ● in   SERVER/scripts/js_notes.js                                      │
    //│ ● TODO: ADD URL_KEY FIELD FOR PER-PAGE NOTES_FILE NAMES                │
    //└────────────────────────────────────────────────────────────────────────┘
    let notes_storage_key = request.url.replace(/.*=/,"");
    let notes_file        = get_notes_file_path( notes_storage_key );
if(log_this) console.log("...notes_file=["+notes_file+"]");

    let data;
    let consumed_by;
    try {
        data = fs.readFileSync( notes_file );

        writeHead(response, caller, 200, { "Content-Type": "application/json; charset=UTF-8" });

        if(data.length) response.end( data );
        else            response.end( "[]" );

        consumed_by = "notes_fetched("+ data.length +" bytes) ● "+ new Date( Date.now() ).toLocaleString();
    }
    catch( err )
    {
        consumed_by = err.message;

        writeHead(response, caller, 200, { "Content-Type": "application/json; charset=UTF-8" });

        response.end( err.message );    // NO FILE ...so that Array.isArray(data) ● should fail in load_notes
    }

if(log_this) console.log(G+"..."+caller+": consumed_by=["+ consumed_by +"]");

    return consumed_by;
};
/*}}}*/
/*_ handle_upload_notes {{{*/
let handle_upload_notes = function(request, response, body)
{
/*{{{*/
let caller = "handle_upload_notes";
/*}}}*/
if(log_this) console.log(Y+"handle_upload_notes ● body:\n"+body);
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ● from upload_notes_to_server                                          │
    //│ ● in   scripts/js_notes.js                                             │
    //│ ● TODO: ADD URL_KEY FIELD FOR PER-PAGE NOTES_FILE NAMES                │
    //└────────────────────────────────────────────────────────────────────────┘
    try {
        // parse notes.nArray {{{
        let { notes_storage_key, nArray } = JSON.parse( body );
        let notes_file = get_notes_file_path( notes_storage_key );

if(log_this) {
  console.log(Y+"handle_upload_notes");
  console.log(B+"notes_file=["+notes_file+"]");
  console.log(Y+"→ nArray:");
  console.dir(     nArray );
}
        //}}}
        // Overwrite server_notes — (propagate deletion) {{{
        let server_notes = {};
        server_notes     = nArray;

        //}}}
        // update notes_file as UTF-8 encoded content {{{
        fs.writeFile(notes_file, JSON.stringify(server_notes, null, 2), "utf-8", (err) => {
            // error {{{
            if( err ) {
                writeHead(response, caller+"("+err+")", 500, { "Content-Type": "application/json; charset=UTF-8" });

                response.end(JSON.stringify({ status: "error", message: err.message }));
console.warn("handle_upload_notes: error "+ err.message);
                return;
            }
            //}}}
            // response {{{
            writeHead(response, caller, 200, { "Content-Type": "application/json; charset=UTF-8" });

            response.end(JSON.stringify({ status: "ok", notes_updated: Object.keys(nArray).length }));
if(log_this) console.log ("handle_upload_notes: notes_updated"      +" ("+ Object.keys(nArray).length +" nArray) ● "+ new Date( Date.now() ).toLocaleString());
            //}}}
        });
        //}}}
    }
        // exception {{{
        catch( ex ) {
            writeHead(response, caller+"("+ex+")", 400, { "Content-Type": "application/json; charset=UTF-8" });

            response.end(JSON.stringify({ status: "error", message: "Invalid JSON format" }));
            console.dir(ex);
        }
        //}}}
    let    consumed_by = request.url;
    return consumed_by;
};
/*}}}*/
/*_ get_notes_file_path {{{*/
let get_notes_file_path = function( notes_storage_key )
{
//  let file_name  = notes_storage_key.replace(/.*__/, "");
//  /**/file_name  = file_name.replace(/\./g,"_");
    return path.join(started_folder +"/STORAGE/", notes_storage_key +".json");
};
/*}}}*/
/*_ handle_request_feedback {{{*/
let handle_request_feedback = function(request,response,args)
{
/*{{{*/
let caller = "handle_request_feedback";
/*}}}*/
if(config.LOG_MORE) console.log("handle_request_feedback: config.FEEDBACK_TABLE=["+config.FEEDBACK_TABLE+"]");
if(config.LOG_MORE) console.dir( args );

    args.subject  = args.subject .replace(  /;/g , ",,"     );
    args.question = args.question.replace(  /;/g , ",,"     );
    args.comment  = args.comment .replace(  /;/g , ",,"     );
    args.comment  = args.comment .replace( /""/g , '\\"\\"' ); /* eslint-disable-line quotes */

    let purging   = request.url.includes("purge");

    let sql       =      server_sql.delete_FROM_FEEDBACK_TABLE(config,args);

    if( !purging )
        sql      += LF + server_sql.insert_INTO_FEEDBACK_TABLE(config,args);

if(config.LOG_MORE) console.log("● sql=["+sql+"]");

    writeHead(response, caller, 200, "OK", {"Content-Type": "text/html; charset=UTF-8"});

    try {
        lib_postgres.sql_query(response, sql);
    }
    catch(ex)
    {
        console.log("response.request_count["+response.request_count+"] handle_request_feedback"+TRACE_CLOSE);//DEBUG
        response.end();
        console.dir(ex);
    }
};
/*}}}*/
/*_ handle_request_lang_errors {{{*/
let handle_request_lang_errors = function(request,response,lang_errors)
{
/*{{{*/
let caller = "handle_request_lang_errors";
/*}}}*/
//console.log("handle_request_lang_errors: config.I18N_TABLE=["+config.I18N_TABLE+"]")

    /* [lang_errors] {{{*/
    let recap
        =  "  ┌──────────────────────────────────────────────────────────────────┐\n"
        +  "  │ handle_request_lang_errors: request=["+request.url +"]\n"
        +  "  │ ...MISSING LANG TERMS (x"+lang_errors.length       +")\n"
        +  "  │──────────────────────────────────────────────────────────────────┤\n"
    ;

    for(let k=0; k<lang_errors.length; ++k)
    {
        let          count = (k<9 ? " ":"")+(k+1);
        recap
        += "  │"+count+": "+lang_errors[k].lang+": "+lang_errors[k].miss+"\n";
    }
    recap
        += "  └─────────────────────────────────────────────────────────────────┘";

    log_M(recap);
    /*}}}*/

    let sql = "";
    for(let k=0; k<lang_errors.length; ++k)
    {

//        let lng = lang_errors[k].lang;
//        let key = lang_errors[k].miss;
//        let val =                  ""; // assumed to be a missing translation when part of [lang_errors]
//        if( lng )
//            sql +=
//`INSERT INTO    ${config.I18N_TABLE}
//        values('${lng}', '${key}', '${val}')
//        ON CONFLICT DO NOTHING;\n`;

        let args = { lang : lang_errors[k].lang
            ,         key : lang_errors[k].miss
            ,         val : ""
        };
        sql += LF + server_sql.insert_INTO_I18N_TABLE(config,args);
    }
//log_G("v v v v v v v v v v v v v v v v v v v v")
//log_Y(sql)
//log_G("^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^")

    writeHead(response, caller, 200, "OK", {"Content-Type": "text/html; charset=UTF-8"});

    try {
        lib_postgres.sql_query(response, sql);
    }
    catch(ex)
    {
        console.log("response.request_count["+response.request_count+"] handle_request_lang_errors"+TRACE_CLOSE);//DEBUG
        response.end();
        console.dir(ex);
    }
};
/*}}}*/
/*_ handle_request_populate {{{*/
let handle_request_populate = function(request,response,args)
{
/*{{{*/
let caller = "handle_request_populate";
/*}}}*/
//console.log("handle_request_populate: config.I18N_TABLE=["+config.I18N_TABLE+"]")
    args          = { lang : args.subject .replace(/;/g,",,")
        ,              key : args.question.replace(/;/g,",,")
        ,              val : args.comment .replace(/;/g,",,")
    };
//console.dir(args)

    let purging   = request.url.includes("purge");

    let sql       =      server_sql.delete_FROM_I18N_TABLE(config,args);

    if( !purging )
        sql      += LF + server_sql.insert_INTO_I18N_TABLE(config,args);

//console.log("sql=["+sql+"]")

    writeHead(response, caller, 200, "OK", {"Content-Type": "text/html; charset=UTF-8"});

    try {
        lib_postgres.sql_query(response, sql);
    }
    catch(ex)
    {
        console.log("response.request_count["+response.request_count+"] handle_request_populate"+TRACE_CLOSE);//DEBUG
        response.end();
        console.dir(ex);
    }
};
/*}}}*/
/*_ handle_request_xpath {{{*/
let handle_request_xpath = function(request,response,args)
{
//console.log("handle_request_xpath: config.XPATH_TABLE=["+config.XPATH_TABLE+"]")
/*{{{*/
let caller = "handle_request_xpath";

    let recap
        = "  ┌─────────────────────────────────────────────────────────────────┐\n"
        + "  │ "+caller    +": request=["+request.url                        +"]\n"
        + "  │ .         cmd=[" + args.cmd                                   +"]\n"
        + "● │ .      domain=[" + args.domain                                +"]\n"
        + "● │ .         url=[" + args.url                                   +"]\n"
        + "  │ .       xpath=[" + args.xpath                                 +"]\n"
        + "  │ .        text=[" + args.text                                  +"]\n"
        + "  └─────────────────────────────────────────────────────────────────┘";
    log_Y(recap);
/*}}}*/
    /* NORMALIZE SYNTAX {{{*/
    if( args.xpath ) args.xpath  = args.xpath .replace( /;/g,",,");
    if( args.text  ) args.text   = args.text  .replace( /;/g,",,");
    if( args.url   ) args.url    = args.url   .replace( /;/g,",,");

    let sql;
    /*}}}*/

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ XPATH_TABLE [url, xpath, text] .. USR/server_index.html                │
    //└────────────────────────────────────────────────────────────────────────┘
    /* 1. [request /domains] {{{*/
    if(     request.url == "/domains")
    {
        sql = `SELECT url FROM ${config.XPATH_TABLE} ORDER BY url`;
    }
    /*}}}*/
    /* 2. [request /urls   domain] {{{*/
    else if(request.url == "/urls"   )
    {
        sql = `SELECT url FROM ${config.XPATH_TABLE} ,REGEXP_MATCHES(url, '$1' ) ORDER BY url`.replace(/\$1/, args.domain);
    }
    /*}}}*/
    /* 4. [request /xpaths url cmd xpath] ..  cmd=(add|delete)) {{{*/
    else if((request.url == "/xpaths" ) && (args.xpath))
    {
        let args_url   = "$$"+ args.url   +"$$";
        let args_xpath = "$$"+ args.xpath +"$$";
        let args_text  = "$$"+ args.text  +"$$";

        sql = `DELETE       FROM ${config.XPATH_TABLE} WHERE url = ${args_url} AND xpath=${args_xpath};`;

        if(args.cmd != "delete")
        sql += "\n"+
`INSERT INTO    ${config.XPATH_TABLE}
        values( ${args_url}, ${args_xpath}, ${args_text});`;
    }
    /*}}}*/
    /* 5. [request /xpaths url] {{{*/
    else if((request.url == "/xpaths" ) && (args.url))
    {
        let args_url   = "$$"+ args.url   +"$$";

        sql = `SELECT xpath FROM ${config.XPATH_TABLE} WHERE url = ${args_url};`;
    }
    /*}}}*/

if(log_this) console.log("sql=["+sql+"]");//FIXME

    /* ANSWER WITH SQL QUERY OUTPUT {{{*/
    writeHead(response, caller, 200, "OK", {"Content-Type": "text/html; charset=UTF-8"});

//  try {
        lib_postgres.sql_query(response, sql, request.url);
//  }
//  catch(ex)
//  {
//      console.log("response.request_count["+response.request_count+"] handle_request_xpath"+TRACE_CLOSE);//DEBUG
//      response.end();
//      console.dir(ex);
//  }
    /*}}}*/
};
/*}}}*/
return { handle_request
    ,    handle_request_feedback
    ,    handle_request_lang_errors
    ,    handle_request_xpath
    };
})();
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ REQUEST URI             🔴 server_request_uri 🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 │
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/
let server_request_uri = (function() {
/*_ request_uri {{{*/
const FILE_HEAD_REGEXP = new RegExp(config.URI_DIR+"/(.*)/[^/]*$"); /* URI_DIR SUB-FOLDER(s) */
const FILE_NAME_REGEXP = new RegExp( ".*\\[[^\\]]*\\](.*$)"      ); /* the part after some [version] between brackets */
const FILE_UUID_REGEXP = new RegExp(      ".*\/(.*)$"            ); /* FILE NAME TAIL */
let request_uri = function(args)
{
console.log("request_uri");

    /* [config.URI_DIR] {{{*/
    let { uri, request, response } = args;
//console.dir(uri);

    if(!fs.existsSync(config.URI_DIR))
    {
log_R("["+config.URI_DIR+"] NOT FOUND UNDER PROCESS CURRENT DIRECTORY ["+process.cwd()+"]");
        return null;
    }
    /*}}}*/
    /*  REGEX {{{*/
    let file_head_match   = uri.path.match( FILE_HEAD_REGEXP );
    let file_head         = file_head_match ? file_head_match[1] : "";

    let file_uuid_match   = uri.path.match( server_download.FILE_UUID_REGEXP );
    if(!file_uuid_match)
    {
log_R("["+config.URI_DIR+"] NO MATCH FOR [server_download.FILE_UUID_REGEXP]");

        return null;
    }
    let file_uuid        = file_uuid_match[1];

console.dir( { FILE_HEAD_REGEXP
             , FILE_UUID_REGEXP
             , FILE_NAME_REGEXP
             , file_head
             , file_uuid
});
/*{{{
}}}*/
    /*}}}*/
    /* SEARCH [file_path] [file_tail] .. f(file_uuid) {{{*/
    let consumed_by;

    let file_path = request_uri_search_dir(config.URI_DIR+"/"+file_head, file_uuid);
console.log("file_path=["+file_path+"]");
    if(!file_path ) return undefined;

    let file_path_match  = file_path.match( server_download.FILE_NAME_REGEXP );
    let file_tail        = file_path_match ? file_path_match[1] : "";
console.log("file_tail=["+file_tail+"]");

    if(!file_path ) return undefined;
    /*}}}*/
    /* [response] SAVE AS {{{*/
    if( response )
    {
        // [response] piggyback
/*
:!start explorer "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition"
*/
        //sponse.content_disposition =     'inline; filename="'+file_tail+'"'; // eslint-disable-line quotes
        response.content_disposition = 'attachment; filename="'+file_tail+'"'; // eslint-disable-line quotes

        fs.readFile(file_path, function(err,data) { fs_read_file_callback(request, file_path, uri.query, response, err, data); });

        consumed_by   = "URI: .. file_uuid=["+file_uuid+"] .. ["+file_tail+"]";

if(consumed_by) console.log( consumed_by );
        return consumed_by;
    }
    /*}}}*/
    else {
        return { file_path , file_tail };
    }
};
/*}}}*/
/*_ request_uri_search_dir {{{*/
let request_uri_search_dir = function(dir_name, file_uuid)
{
//log_Y("request_uri_search_dir("+dir_name+", "+file_uuid+")");

    /* [dir_name] {{{*/
    if(!fs.existsSync( dir_name ))
    {
log_M("["+dir_name+"] NOT FOUND");

        return null;
    }
    /*}}}*/
    let file_path;

    let                      options = { withFileTypes: true };
    fs.readdirSync(dir_name, options)
        .forEach( (dirent) => {
//log_N("...file_path=["+file_path+"] ..["+dirent.type+"] .. ["+dirent.name+"]"); // VERBOSE config.URI_DIR SEARCH
            if(!file_path) {
                /* dirent {{{*/
/*{{{
                let dirent_type
                    = dirent.isDirectory()    ? "DIR:"
                    : dirent.isFile()         ? "FILE"
                    : dirent.isSymbolicLink() ? "LINK"
                    :                           dirent["Symbol(type)"];

                let color
                    = (dirent_type == "DIR:") ? Y
                    : (dirent_type == "FILE") ? G
                    : (dirent_type == "LINK") ? C
                    :                           R;

log_N("..."+color+"["+dirent_type+"] .. ["+dirent.name+"]"); // VERBOSE config.URI_DIR SEARCH
}}}*/
                /*}}}*/
                /* DIR {{{*/
                if(dirent.isDirectory() || dirent.isSymbolicLink())
                {
                    let sub_dir_name = dir_name+"/"+dirent.name;
                    file_path = request_uri_search_dir(sub_dir_name, file_uuid);
                }
                /*}}}*/
                /* FILE {{{*/
                else {
                    if(dirent.name.startsWith( file_uuid ))
                        file_path = dir_name+"/"+dirent.name;
                }
                /*}}}*/
            }
        });

//console.log("request_uri_search_dir("+dir_name+"): ...return file_path=["+file_path+"]")
    return file_path;
};
/*}}}*/
return { request_uri };
})();
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ REQUEST js_script       🔴 server_request_js_script 🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 │
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/
let server_request_js_script = (function() {
/*_ request_js_script {{{*/
let request_js_script = function(args) /* eslint-disable-line complexity */
{
/*{{{*/
let caller = "request_js_script";
/*}}}*/
    let { uri, request, response } = args;
    let consumed_by;
    /* [file_name] [lang] [user_id] {{{*/
    let match     = uri.path.match(/([^\/]+$)/);
    if(!match     ) return "";
    let file_name = match[1];

    let { lang , user_id  }
        = get_args_from_request_cookies({"lang":"" , "user_id":""}, request);


    /*}}}*/
    // [from_a_tool_page] {{{
    let from_a_tool_page
        =      request.headers
        &&     request.headers.referer
        && (   request.headers.referer.includes("_dev"     )
            || request.headers.referer.includes("_populate"))
    ;
if(config.LOG_MORE) console.log("request_js_script: from_a_tool_page=["+from_a_tool_page+"]");
if(config.LOG_MORE) console.log("args.uri:");
if(config.LOG_MORE) console.dir( args.uri  );

    /*}}}*/
    /* GENERATE FILE */
    /* [bddservice] .. f(!I18N_ACTIVE) {{{*/
    if(!config.I18N_ACTIVE)
    {
        /* [bddservice.get_topics] {{{*/
        if( uri.path.includes("feedback_topics_json.js") )
        {
            let missing_args
                = (user_id ? "" : " user_id" )
                + (lang    ? "" : " lang"    );

            if(!missing_args.length)
            {
                bddservice.get_topics({ config, lang, user_id }, response);
            }
            else {
                let warning = "*** request_js_script: missing arguments: ["+missing_args+"] while calling [bddservice.get_topics] ***";

                lib_postgres.query_callback_err({ user_id , lang , origin:"bddservice" }, response, warning);
                response.end();
            }

            consumed_by = "bddservice.get_topics HAS BEEN CALLED";
        }
        /*}}}*/
        /* from_a_tool_page {{{*/
        else if( from_a_tool_page )
        {
            console.log("from_a_tool_page ● not consumed_by bddservice");
        }
        /*}}}*/
        // CLIENT SHOULD NOT REQUEST THESE FILE
        else if(    uri.path.includes("i18n_translate_json.js"       )
                 || uri.path.includes("populate_lang_key_val_json.js")
                 || uri.path.includes("feedback_replies_json.js"     )
               )
        {
            writeHead(response, caller, 200, {"Content-Type" : "text/javascript;"});

            consumed_by = "bddservice RETURNED A STUB FOR ["+uri.path+"]";
            let js_array_name = uri.path.replace(/.*\/(\w+).*/,"$1");
            let             jscode = "let "+js_array_name+" = [];";
            response.write( jscode );
            response.end();

            consumed_by += " "+jscode;
            console.log( consumed_by );
        }
        // CLIENT SHOULD NOT REQUEST THIS FILE
/*{{{*/
if( consumed_by )
    console.log( "┌─────────────────────────────────────────┐\n"
               + "│ bddservice                              │\n"
               + "├─────────────────────────────────────────┘\n"
               + "│ request.url.....=["+ request.url      +"]\n"
               + "│ ........uri.path=["+ uri.path         +"]\n"
               + "│ from_a_tool_page=["+ from_a_tool_page +"]\n"
               + "└─────────────────────────────────────────┘\n");
/*}}}*/
    }
    /*}}}*/
    /*{{{*/
    if(!consumed_by
       && (   uri.path.includes(       "feedback_topics_json.js")
           || uri.path.includes(        "i18n_translate_json.js")
           || uri.path.includes( "populate_lang_key_val_json.js")
           || uri.path.includes(      "feedback_replies_json.js")
//         || uri.path.includes(                "jqgram_tree.js")
          )
      ) {
        let file_args
            = { file_name , lang , user_id };
        if( uri.path.includes("feedback_replies_json.js") )
            file_args.no_reply_ok = true;

        lib_postgres.generate_file(file_args, response);

        consumed_by = "PUPULATE FILE";
    }
    /*}}}*/
/*{{{*/
if( consumed_by ) {
    log_B(    "┌────────────────────────────────────────────────────────────────────────────┐\n"
             +"│ SERVER: GENERATE FILE ["+ file_name +"]");
if(config.LOG_MORE || !config.I18N_ACTIVE)
    log_B(    "│        lang=["+ lang        +"]\n"
             +"│     user_id=["+ user_id     +"]\n"
             +"│ consumed_by=["+ consumed_by +"]");
    log_B(    "└────────────────────────────────────────────────────────────────────────────┘");
}
/*}}}*/

    return consumed_by;
};
/*}}}*/
return { request_js_script };
})();
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ REQUEST sql_query       🔴 server_request_sql_query 🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴 │
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/
let server_request_sql_query = (function() {
/*_ request_sql_query {{{*/
let request_sql_query = function(args)
{
/*{{{*/
let caller = "request_sql_query";
/*}}}*/
    let { uri,          response } = args;

    let consumed_by;

    if(uri.path == "query")
    {
log_N("  ┌─────────┐\n"
     +"● │SQL query \n"
     +"  └─────────┘");
        consumed_by = "SQL query";

        writeHead(response, caller, 200, HTML_RESPONSE_HEADER);

        /* [qtext] {{{*/
        let qtext        =            get_query_arg(uri.query, "qtext"  );
        response.as_html = JSON.parse(get_query_arg(uri.query, "as_html") || "false");
        if( qtext )
        {
            qtext = decodeURIComponent( qtext ).replace(/\+/g," "); // "+" URL ENCODED
log_N("  ┌────────────────────────────────────────────────────────────────────────────┐\n"
     +"● │ SERVER: "+((qtext.length < 65) ? qtext : qtext.substring(0,65)+"…")       +"\n"
     +"  └────────────────────────────────────────────────────────────────────────────┘");
console.dir(qtext);

            /* POSTGRES SQL {{{*/
            if(qtext.includes(" "))
            {
                lib_postgres.sql_query(response, qtext);

                consumed_by = "SQL qtext";
            }
            /*}}}*/
        }
        /*}}}*/
        /* [missing args] {{{*/
        if(!consumed_by)
        {
            response.write("<pre style='color:magenta;'>QUERY MISSING ARGS IN uri.path=["+ JSON.stringify(uri.path) +"]</pre>");
//console.log("response.request_count["+response.request_count+"] request_sql_query"+TRACE_CLOSE)
            response.end();

            consumed_by = "QUERY MISSING ARGS";
        }
        /*}}}*/
    }

//console.log("consumed_by=["+consumed_by+"]");
    return consumed_by;
};
    /*}}}*/
return { request_sql_query };
})();
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ RESPONSE DATA GET POST  🟠 server_request_data_io 🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠 │
//│                                             [lang_errors] [submit] [purge] │
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/
let server_request_data_io = (function() {
/*    REQUEST_URL_ARRAY {{{*/
const REQUEST_URL_ARRAY
    = [   "/feedback_submit"
        , "/feedback_purge"
        , "/lang_errors"
        , "/populate_submit"
        , "/populate_purge"
        , "/upload_notes"
        , "/fetch_notes"

        , "/domains"
        , "/urls"
        , "/xpaths"
    ];

/*}}}*/
/*_ request_data_io {{{*/
let request_data_io = function(args)
{
console.log(B+"request_data_io");
    let {      request, response } = args;
    let consumed_by = "";

    /* [REQUEST_URL_ARRAY] {{{*/
    let url = request.url.replace(/\?.*/,"");
    if( REQUEST_URL_ARRAY.includes( url) )
    {
log_Y("  ┌───────────────────────────────────────────────┐\n"
     +"● │ "+ request.method.padEnd(10) +" "+ request.url +"\n"
     +"  └───────────────────────────────────────────────┘");
        if(     request.method == "POST") post_callback(request, response);
        else if(request.method == "GET" )  get_callback(request, response);
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
/*_ post_callback {{{*/
let post_callback = function(request,response)
{
//console.log(B+"post_callback")

    let body = "";
    request.on("data", (chunk) => {
        body += chunk.toString();
    });
//console.log(C+"1 request [data] ● body:\n"+ body);

    request.on("end", () => {

//{{{
//try {
//        body = decodeURIComponent(body);
//} catch(err) {
//    console.warn(err);
//console.log(R+"* post_callback ● body:\n"+ body);
//}
//}}}
//console.log(M+"2 decodeURIComponent ● body:\n"+body);

/*{{{
        body = body
            .replace( /\+/g     , " "   )
            .replace( /'/g      , "''"  )
            .replace( /"/g      , '""'  ) // eslint-disable-line quotes
          //.replace( /"/g      , '\\"' ) // eslint-disable-line quotes
          //.replace( /\\r\\n/g , "\n"  )
          //.replace(    /\\n/g , "\n"  )
        ;
//console.log(Y+"3 replace [+'\"] ● body:\n"+body);
}}}*/

        server_request.handle_request(request, response, body);
    });
};
/*}}}*/
/*_ get_callback {{{*/
let get_callback = function(request,response)
{
//console.log("get_callback")

    let body =     decodeURIComponent( request.url );

    server_request.handle_request(request, response, body);
};
/*}}}*/
return { request_data_io };
})();
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ REQUEST COMMAND         🟡 server_request_commands  🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡 │
//└────────────────────────────────────────────────────────────────────────────┘
/* request... {{{*/
let server_request_commands = (function() {
/*_ request_I18N_ACTIVE {{{*/
let request_I18N_ACTIVE = function(args)
{
/*{{{*/
let caller = "request_I18N_ACTIVE";
/*}}}*/
    let { uri,          response } = args;
    let consumed_by;

    if(uri.path == "i18n_active")
    {
log_N("  ┌────────────┐\n"
     +"● │ I18N_ACTIVE\n"
     +"  └────────────┘");

        writeHead(response, caller, 200, HTML_RESPONSE_HEADER);

        config.I18N_ACTIVE = !config.I18N_ACTIVE;
        log_STATUS(response);

        response.write("<span style='color:gray;'>...i18n=["+config.I18N_ACTIVE+"]</span>");

//console.log("response.request_count["+response.request_count+"] request_I18N_ACTIVE"+TRACE_CLOSE)
        response.end();
        consumed_by = "i18n_active";
    }

    return consumed_by;
};
/*}}}*/
/*_ request_CLEAR {{{*/
let request_CLEAR = function(args)
{
/*{{{*/
let caller = "request_CLEAR";
/*}}}*/
    let { uri,          response } = args;
    let consumed_by;

    if(uri.path == "clear")
    {
log_N("\x1Bc"); // CLEAR TERMINAL <esc>c
log_N("  ┌─────┐\n"
     +"● │ CLEAR\n"
     +"  └─────┘");
        writeHead(response, caller, 200, HTML_RESPONSE_HEADER );

        response.write("<span style='color:gray;'>...cleared</span>");
//console.log("response.request_count["+response.request_count+"] request_CLEAR"+TRACE_CLOSE)
        response.end();

        consumed_by = "clear";
    }

    return consumed_by;
};
/*}}}*/
/*_ request_LOG_MORE {{{*/
let request_LOG_MORE = function(args)
{
/*{{{*/
let caller = "request_LOG_MORE";
/*}}}*/
    let { uri,          response } = args;
    let consumed_by;

    if(uri.path == "log_more")
    {
log_N("  ┌─────────┐\n"
     +"● │ LOG_MORE\n"
     +"  └─────────┘");
        writeHead(response, caller, 200, HTML_RESPONSE_HEADER );

        config.LOG_MORE = !config.LOG_MORE;
        log_STATUS(response);

        response.write("<span style='color:gray;'>...log_more=["+config.LOG_MORE+"]</span>");

//console.log("response.request_count["+response.request_count+"] request_LOG_MORE"+TRACE_CLOSE)
        response.end();
        consumed_by = "log_more";
    }

    return consumed_by;
};
/*}}}*/
/*_ request_STATUS {{{*/
let request_STATUS = function(args)
{
/*{{{*/
let caller = "request_STATUS";
/*}}}*/
    let { uri,          response } = args;
    let consumed_by;

    if(uri.path == "status")
    {
log_N("  ┌───────┐\n"
     +"● │ STATUS\n"
     +"  └───────┘");
        writeHead(response, caller, 200, HTML_RESPONSE_HEADER );

        log_STATUS(response);

//console.log("response.request_count["+response.request_count+"] request_STATUS"+TRACE_CLOSE)
        response.end();
        consumed_by = "status";
    }

    return consumed_by;
};
/*}}}*/
/*_ request_dump_TABLES {{{*/
let request_dump_TABLES = function(args)
{
/*{{{*/
let caller = "request_dump_TABLES";
/*}}}*/
    let { uri,          response } = args;
    let consumed_by;

    if(   (uri.path  && uri.path .includes("dump_TABLES")
       || (uri.query && uri.query.includes("dump_TABLES"))))
    {
log_M("  ┌─────────────┐\n"
     +"● │ dump_TABLES │\n"
     +"  └─────────────┘");
        writeHead(response, caller, 200, HTML_RESPONSE_HEADER );

        response.write("<h3>"+uri.path+"</h3>");
        lib_postgres.dump_TABLES( response );

        consumed_by = "dump_TABLES";
    }

    return consumed_by;
};
/*}}}*/
/*_ request_EXIT {{{*/
let request_EXIT = function(args)
{
/*{{{*/
let caller = "request_EXIT";
/*}}}*/
    let { uri,          response } = args;
    let consumed_by;

    if(uri.path == "exit")
    {
log_N("  ┌─────┐\n"
     +"● │ exit\n"
     +"  └─────┘");
        writeHead(response, caller, 200, HTML_RESPONSE_HEADER);

        response.write("<h3 style='color:darkred;'>...terminating server</h3>");
//console.log("response.request_count["+response.request_count+"] request_EXIT"+TRACE_CLOSE)
        response.end();

        consumed_by = "SERVER PROCESS EXIT";

log_N("* "+consumed_by+" *");
        process.exit(0);
    }

    return consumed_by;
};
/*}}}*/

return {  request_CLEAR
    ,     request_EXIT
    ,     request_I18N_ACTIVE
    ,     request_LOG_MORE
    ,     request_STATUS
    ,     request_dump_TABLES
};
})();
/*}}}*/





return { config , createServer }; /*{{{*/

/*}}}*/
})();
server.createServer();
