//┌────────────────────────────────────────────────────────────────────────────┐
//│ server_qtext.js                                        _TAG (260929:03h:25)
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/

/*}}}*/
let server_qtext = (function() {
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
//  server_header {{{
let server_header = require("../SERVER/server_header.js");

let get_response_200_header = server_header.get_response_200_header;
//}}}
//  server_network {{{
let server_network = require("../SERVER/server_network.js");

let get_net_address = server_network.get_net_address;
//}}}

/*_ writeHead {{{*/
let writeHead = function(response, _caller, ...args)
{
if(is_logging()) log_X(Y+"● writeHead "+_caller);

    response.writeHead(...args);
//console.trace();//FIXME
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

const   HTML_RESPONSE_HEADER = { "Content-Type" : "text/html;       charset=UTF-8", "Access-Control-Allow-Origin" : "*"
                               , "color-scheme" : "light only" };
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
if( is_logging() )
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
        let net_address     = get_net_address();

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

    // return {{{
    return { name: "server_qtext"
        ,    customize_FILE_CONTENT
    };
    //}}}
})();
try { module.exports = server_qtext; } catch(ex) { console.log(ex.message); }
