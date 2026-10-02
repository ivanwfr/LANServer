//┌────────────────────────────────────────────────────────────────────────────┐
//│ server5_content.js                                        _TAG (261002:03h:46)
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
/*    STYLE_QTEXT {{{*/
const STYLE_QTEXT = ""
    + "<link type='text/css' href='/style/notes.css' rel='stylesheet'>"
    + "<link type='text/css' href='/style/qtext.css' rel='stylesheet'>"
    ;
/*}}}*/
/*    SCRIPT_QTEXT {{{*/
const SCRIPT_QTEXT = ""
    + "<meta name='color-scheme' content='light only'>"
    + "<script type='module' src='/scripts/js_log.js     '></script>\n"

    + "<script type='module' src='/scripts/js_folds.js   '></script>\n"
    + "<script type='module' src='/scripts/js_store.js   '></script>\n"
    + "<script type='module' src='/scripts/js_xpath.js   '></script>\n"
    + "<script type='module' src='/scripts/js_linkify.js '></script>\n"

    + "<script type='module' src='/scripts/js_MODEL.js   '></script>\n"
    + "<script type='module' src='/scripts/js_VIEW.js    '></script>\n"
    + "<script type='module' src='/scripts/js_CNTRL.js   '></script>\n"

    + "<script type='module' src='/scripts/js_ticker.js  '></script>\n"
    + "<script type='module' src='/scripts/js_input.js   '></script>\n"
    + "<script type='module' src='/scripts/notes.js      '></script>\n"
    + "<script type='module' src='/scripts/js_details.js '></script>\n"
    + "<script type='module' src='/scripts/js_notes.js   '></script>\n"
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
        //│ VIM FOLD ● BOX FORMAT
        //└──────────────────────┘
        /* qtext turn VIM FOLDS into DETAILS SUMMARY {{{*/
        if(data.includes( FOLD_OPEN ))
        {
            // ?qtext
            if(   server0_log.html_format_requested(file_name,query)
              && !file_name.match(/\.htm/)
              ) {
                data = String(data)
                // html entities
                    .  replace(                   /</gm, "&lt;"                                )
                    .  replace(                   />/gm, "&gt;"                                )
                // foldings
                    .  replace(   /(.*{{ *{.*)\r*\n*/gm, "<details><summary>$1</summary><pre>" )
                    .  replace(   /(.*}} *}.*)\r*\n*/gm,                   "$1</pre></details>")
                // remove vim fold markers
                    .  replace(         / *;* *{{ *{/gm, " "                                   )
                    .  replace(         / *;* *}} *}/gm, " "                                   )
                // box
/*{{{
                    .  replace(               /\/\/┌/gm , "TOP┌")
                    .  replace(               /\/\/│/gm , "MID│")
                    .  replace(               /\/\/└/gm , "BOT└")
}}}*/
/*{{{
                    .  replace(               /\/\/┌/gm , "🟤🔴🟠┌")
                    .  replace(               /\/\/│/gm , "🟤🔴🟠│")
                    .  replace(               /\/\/└/gm , "🟤🔴🟠└")
}}}*/

                    .  replace( / *\/[\/\\*] *(┌.*$)/gm , "<BOXU>$1</BOXU>")
                    .  replace( / *\/[\/\\*] *(│.*$)/gm , "<BOXM>$1</BOXM>")
                    .  replace( / *\/[\/\\*] *(└.*$)/gm , "<BOXD>$1</BOXD>")

                    .  replace( / *\/[\/\\*] *(├.*$)/gm , "<BOXM>$1</BOXM>")
                    .  replace( / *\/[\/\\*] *(┼.*$)/gm , "<BOXM>$1</BOXM>")
                    .  replace( / *\/[\/\\*] *(┤.*$)/gm , "<BOXM>$1</BOXM>")

                    .  replace(         /[└┘┌┐│─├┼┤]/gm , " "              )

                // comments {{{
                  //.  replace(   /[\n\r]( *)\/\/ */gm, "\n✔✓$1"          )
                  //.  replace(          /^ *\/\/ */  , "ℹ\n"             )
                //}}}
                ;
            }
            //{{{
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
            response.write( "<pre>"+ data +"</pre>");
        }
        else {
            if(net_address && config.DEFAULT_URI_PATH.includes(file_name))
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
//log_X("response.request_count["+response.request_count+"] details_folding"+TRACE_CLOSE)
        response.end();
    }
/*}}}*/
};
/*}}}*/

    // return ● server5_content, details_folding {{{
    return { name: "server5_content"
        ,    onload
        ,    details_folding
    };
    //}}}
})();
//    module.exports {{{
try { module.exports = server5_content;                  } catch(ex) { console.log(ex.message); console.trace(); }
//}}}
