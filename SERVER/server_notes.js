//┌────────────────────────────────────────────────────────────────────────────┐
//│ server_notes     ● $APROJECTS/LANServer/SERVER      ● _TAG (260928:21h:54) │
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/
// eslint-disable no-warning-comments */

/*}}}*/
let server_notes = (function() {
"use strict";

//● Node.js ● fs {{{
let   fs                        = require("fs"   );
let   path                      = require("path" );
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

/*● handle_request {{{*/
let handle_request = function(request, response, body) // eslint-disable-line complexity
{
/*{{{*/
let caller = "handle_request";
log_C(caller+"("+request.url+")");
/*}}}*/
    /* NOTES    ● [upload_notes] ● [fetch_notes] {{{*/
    let    consumed_by;
    if(   !consumed_by
       && (request.url    == "/upload_notes")
       && (request.method == "POST")
    ) {
        consumed_by = handle_upload(request, response, body);
    }

    if(   !consumed_by
       &&  request.url.includes("/fetch_notes")
       && (request.method == "GET")
    ) {
        consumed_by = handle_fetch(request, response);
if(is_logging()) log_X(C+"consumed_by returned by handle_fetch=["+consumed_by+"]");
    }
    /*}}}*/
    /* log      ● why_not_handled {{{*/
    if(!consumed_by)
    {
        let args
            = {    user_id : get_query_arg(body, "user_id" )
                ,     lang : get_query_arg(body, "lang"    )
                ,  subject : get_query_arg(body, "subject" )
                , question : get_query_arg(body, "question")
                , feedback : get_query_arg(body, "feedback")
                ,  comment : get_query_arg(body, "comment" )
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

            writeHead(response, caller+" ("+ack_message+")", 200, "OK", {"Content-Type": "text/html; charset=UTF-8"});

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
log_Y("consumed_by=["+consumed_by+"]");
};
/*}}}*/
/*_ handle_fetch {{{*/
let handle_fetch = function(request, response)
{
/*{{{*/
let caller = "handle_fetch";
log_C(caller+"("+request.url+")");
/*}}}*/

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ● from load_notes                                                      │
    //│ ● in   SERVER/scripts/js_notes.js                                      │
    //│ ● TODO: ADD URL_KEY FIELD FOR PER-PAGE NOTES_FILE NAMES                │
    //└────────────────────────────────────────────────────────────────────────┘
    let notes_storage_key = request.url.replace(/.*=/,"");
    let notes_file        = get_notes_file_path( notes_storage_key );
if(is_logging()) log_X("...notes_file=["+notes_file+"]");

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
      //response.end( "["+err.message+"]" );    // NO FILE ...so that Array.isArray(data) ● should fail in load_notes
        response.end( "[]" );
    }

if(is_logging()) log_X(G+"..."+caller+": consumed_by=["+ consumed_by +"]");

    return consumed_by;
};
/*}}}*/
/*_ handle_upload {{{*/
let handle_upload = function(request, response, body)
{
/*{{{*/
let caller = "handle_upload";
/*}}}*/
if(is_logging()) log_X(Y+"handle_upload ● body:\n"+body);
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ● from upload_notes_to_server                                          │
    //│ ● in   SERVER/scripts/js_build.js                                      │
    //│ ● TODO: ADD URL_KEY FIELD FOR PER-PAGE NOTES_FILE NAMES                │
    //└────────────────────────────────────────────────────────────────────────┘
    try {
        // parse notes.nArray {{{
        let { notes_storage_key, nArray } = JSON.parse( body );
        let notes_file = get_notes_file_path( notes_storage_key );

if(is_logging()) {
  log_X(Y+"handle_upload");
  log_X(B+"notes_file=["+notes_file+"]");
  log_X(Y+"→ nArray:");
  console.dir(     nArray );
}
        //}}}
        // Overwrite notes — (propagate deletion) {{{
        let notes = nArray;

        //}}}
        // update notes_file as UTF-8 encoded content {{{
        fs.writeFile(notes_file, JSON.stringify(notes, null, 2), "utf-8", (err) => {
            // error {{{
            if( err ) {
                writeHead(response, caller+"("+err+")", 500, { "Content-Type": "application/json; charset=UTF-8" });

                response.end(JSON.stringify({ status: "error", message: err.message }));
console.warn("handle_upload: error "+ err.message);
                return;
            }
            //}}}
            // response {{{
            writeHead(response, caller, 200, { "Content-Type": "application/json; charset=UTF-8" });

            response.end(JSON.stringify({ status: "ok", notes_updated: Object.keys(nArray).length }));
if(is_logging()) log_X ("handle_upload: notes_updated"      +" ("+ Object.keys(nArray).length +" nArray) ● "+ new Date( Date.now() ).toLocaleString());
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
    let started_folder = process.cwd().replace(/\\/g,"/");
    return path.join(started_folder +"/STORAGE/", notes_storage_key +".json");
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

if(is_logging()) log_X("html_format_requested("+ file_name +") ...return "+!!state+"");
    return state;
};
/*}}}*/
return { name: "server_notes"
    ,           handle_request
    ,           html_format_requested
    };
})();
/*}}}*/
try { module.exports = server_notes; } catch(ex) {} /* server.js require */ /* eslint-disable-line no-unused-vars */ /* eslint-disable-line no-empty */
