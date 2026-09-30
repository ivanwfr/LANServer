//┌────────────────────────────────────────────────────────────────────────────┐
//│ server6_notes     ● $APROJECTS/LANServer/SERVER         _TAG (260930:23h:48)
//└────────────────────────────────────────────────────────────────────────────┘
/* IMPORT {{{*/

/*}}}*/
let server6_notes = (function() {
"use strict";

//┌────────────────────────────────────────────────────────────────────────────┐
//│ REQUIRE
//└────────────────────────────────────────────────────────────────────────────┘
//● Node.js             ● fs path {{{
let   fs                        = require("fs"   );
let   path                      = require("path" );
//}}}
//● Server Modules:     ● log header ● listener ● network ● notes ● qtext {{{
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
//t server1_network  = require("./server1_network.js");
//t server2_listener = require("./server2_listener.js");
//t server3_header   = require("./server3_header.js");
//t server4_file     = require("./server4_file.js");
//t server5_content  = require("./server5_content.js");
//t server6_notes    = require("./server6_notes.js");
//}}}
//            ● Server Config:      ● ...

//┌────────────────────────────────────────────────────────────────────────────┐
//│ NOTES ● GET ● POST
//└────────────────────────────────────────────────────────────────────────────┘
/*● handle_request {{{*/
let handle_request = function(request, response, body) // eslint-disable-line complexity
{
/* log {{{*/
let caller = "handle_request";
if(is_logging()) log_X(C+caller+"("+request.url+")");
/*}}}*/
    /* upload_notes {{{*/
    let    consumed_by;
    if(   !consumed_by
       && (request.url    == "/upload_notes")
       && (request.method == "POST")
    ) {
        consumed_by = hanle_POST(request, response, body);
    }
    /*}}}*/
    /* fetch_notes {{{*/
    if(   !consumed_by
       &&  request.url.includes("/fetch_notes")
       && (request.method == "GET")
    ) {
        consumed_by = handle_GET(request, response);
if(is_logging()) log_X(C+"consumed_by returned by handle_GET=["+consumed_by+"]");
    }
    /*}}}*/
    /* why_not_handled {{{*/
    if(!consumed_by)
    {
        let args
            = {    user_id : server0_log.get_query_arg(body, "user_id" )
                ,     lang : server0_log.get_query_arg(body, "lang"    )
                ,  subject : server0_log.get_query_arg(body, "subject" )
                , question : server0_log.get_query_arg(body, "question")
                , feedback : server0_log.get_query_arg(body, "feedback")
                ,  comment : server0_log.get_query_arg(body, "comment" )
            };
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
log_C(recap);

        /* NOT HANDLED {{{*/
            let why_not_handled
                = (args.user_id  ? "" :  " user_id")
                + (args.subject  ? "" :  " subject")
                + (args.question ? "" : " question")
                + (args.feedback ? "" : " feedback")
            ;
            why_not_handled += (why_not_handled) ? " MISSING\n":"";

            let ack_message =   why_not_handled.trim();

            server0_log.writeHead(response, caller+" ("+ack_message+")", 200, "OK", {"Content-Type": "text/html; charset=UTF-8"});

            if(request.method == "POST") {
                response.write(        ack_message );
            }
            else {
                response.write("<pre>"+ack_message+"</pre>");
                response.write("✔ <button onclick='history.go(-1);'>←</button>");
            }

            //log_X("response.request_count["+response.request_count+"] "+caller+TRACE_CLOSE)
            response.end();

            consumed_by = "NOT HANDLED: ["+request.url+"]"; /* eslint-disable-line no-useless-assignment */
        /*}}}*/
    }
    /*}}}*/
if(is_logging()) log_Y("handle_request: consumed_by=["+consumed_by+"]");
};
/*}}}*/
/*_ handle_GET {{{*/
let handle_GET = function(request, response)
{
/* log {{{*/
let caller = "handle_GET";
if(is_logging()) log_C(caller+"("+request.url+")");
/*}}}*/
    /* notes_file {{{*/
    let notes_storage_key = request.url.replace(/.*=/,"");
    let notes_file        = get_notes_file_path( notes_storage_key );

if(is_logging()) log_X("...notes_file=["+notes_file+"]");
    /*}}}*/
    /* READ FILE {{{*/
    let data;
    let consumed_by;
    try {
        data = fs.readFileSync( notes_file );

        server0_log.writeHead(response, caller, 200, { "Content-Type": "application/json; charset=UTF-8" });

        if(data.length) response.end( data );
        else            response.end( "[]" );

        consumed_by = "notes_fetched("+ data.length +" bytes) ● "+ new Date( Date.now() ).toLocaleString();
    }
    /*}}}*/
    // err {{{
    catch( err )
    {
        consumed_by = err.message;

        server0_log.writeHead(response, caller, 200, { "Content-Type": "application/json; charset=UTF-8" });
      //response.end( "["+err.message+"]" );    // NO FILE ...so that Array.isArray(data) ● should fail in load_notes
        response.end( "[]" );
    }
    //}}}
    return consumed_by;
};
/*}}}*/
/*_ hanle_POST {{{*/
let hanle_POST = function(request, response, body)
{
/* log {{{*/
let caller = "hanle_POST("+request.url+": body.length=["+body.length+"])";
if(is_logging()) log_X(M+caller);
    let    consumed_by;
/*}}}*/
    /* notes_file ● Parse and overwrite notes {{{*/
    let { notes_storage_key, nArray } = JSON.parse( body );

    let   notes_file                  = get_notes_file_path( notes_storage_key );

// log {{{
if(is_logging()) {
log_X(B+"notes_storage_key.\t["+ notes_storage_key +"]");
log_X(B+"→ notes_file......\t["+ notes_file        +"]");
log_X(Y+"→ nArray.length...\t["+ nArray.length     +"]");
}
//}}}
    /*}}}*/
    /* WRITE FILE {{{*/
    try {
        let notes = nArray;

        fs.writeFileSync(notes_file, JSON.stringify(notes, null, 2), "utf-8");
        consumed_by = "notes_updated("+ Object.keys(nArray).length +" nArray) ● "+ new Date( Date.now() ).toLocaleString();

        server0_log.writeHead(response, caller, 200, { "Content-Type": "application/json; charset=UTF-8" });
        response.end(JSON.stringify({ status: "ok", notes_updated: Object.keys(nArray).length }));
    }
    /*}}}*/
    // catch error {{{
    catch( err ) {
        consumed_by = caller +": error "+ err.message;
//{{{
        log_R(consumed_by);
if(is_logging()) console.dir(err);
//}}}
        server0_log.writeHead(response, caller+"("+err+")", 400, { "Content-Type": "application/json; charset=UTF-8" });
        response.end(JSON.stringify({ status: "error", message: "Invalid JSON format" }));
    }
    //}}}
    return consumed_by;
 };
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ private
//└────────────────────────────────────────────────────────────────────────────┘
/*_ get_notes_file_path {{{*/
let get_notes_file_path = function( notes_storage_key )
{
//  let file_name  = notes_storage_key.replace(/.*__/, "");
//  /**/file_name  = file_name.replace(/\./g,"_");
    let              started_folder = process.cwd().replace(/\\/g,"/");
    return path.join(started_folder +"/STORAGE/", notes_storage_key +".json");
};
/*}}}*/

    /* return handle_request {{{*/
    return { name: "server6_notes"
        ,           handle_request
    };
    /*}}}*/
})();
/*}}}*/
//    module.exports {{{
try { module.exports = server6_notes;                    } catch(ex) { console.log(ex.message); console.trace(); }
//}}}
