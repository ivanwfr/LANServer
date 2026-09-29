//┌────────────────────────────────────────────────────────────────────────────┐
//│ server_header.js                                       _TAG (260929:02h:51)
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/

/*}}}*/
let server_header = (function() {
"use strict";

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
//  server_notes {{{
let server_notes = require("../SERVER/server_notes.js");

//}}}

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
/*}}}*/


    // return {{{
    return { name: "server_header"
        ,    get_response_200_header
    };
    //}}}
})();
try { module.exports = server_header; } catch(ex) { console.log(ex.message); }
