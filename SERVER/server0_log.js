//┌────────────────────────────────────────────────────────────────────────────┐
//│ server0_log.js ● termio ● ANSII-TERMINAL                _TAG (261008:21h:14)
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/
// eslint-disable no-warning-comments */
/* eslint-disable no-unused-vars */

/*}}}*/
let server0_log = (function() {
"use strict";
let log_this = false;   let tag_this = true || log_this;
//┌────────────────────────────────────────────────────────────────────────────┐
//│ REQUIRE
//└────────────────────────────────────────────────────────────────────────────┘
//            ● Server Modules:     ● ...
//            ● Server Modules:     ● ...
//            ● Server Config:      ● ...

//┌────────────────────────────────────────────────────────────────────────────┐
//│ SERVER LOG
//└────────────────────────────────────────────────────────────────────────────┘
// const {{{
const TRACE_OPEN  = " {{{";
const TRACE_CLOSE = " }}}";
const  LF = String.fromCharCode(10);
const ESC = String.fromCharCode(27);
//}}}
// colors {{{
const R   = ESC+"[1;31m"                ; //     RED
const G   = ESC+"[1;32m"                ; //   GREEN
const Y   = ESC+"[1;33m"                ; //  YELLOW
const B   = ESC+"[1;34m"                ; //    BLUE
const M   = ESC+"[1;35m"                ; // MAGENTA
const C   = ESC+"[1;36m"                ; //    CYAN
const N   = ESC+"[0m"                   ; //      NC

// TODO:  FIND ECC COLOR FOR ANSII-TERMINAL {{{
//┌────────────────────────────────────────────────────────────────────────────┐
//│ const lfX = [ R, G, Y, B, M, C, N ]     ;
//│ //            2  5  4  6  7
//└────────────────────────────────────────────────────────────────────────────┘
//}}}

//}}}
// log, log_X .. log_N, console {{{
let log   = console.log;

let log_X = function(      ...rest) { console.log.apply(console, Array.prototype.slice.call(rest)); }; /* eslint-disable-line prefer-spread */

let log_R = function(arg0, ...rest) { if(tag_this) console.log(  R + arg0, ...rest ); };
let log_G = function(arg0, ...rest) { if(tag_this) console.log(  G + arg0, ...rest ); };
let log_B = function(arg0, ...rest) { if(tag_this) console.log(  B + arg0, ...rest ); };

let log_C = function(arg0, ...rest) { if(tag_this) console.log(  C + arg0, ...rest ); };
let log_M = function(arg0, ...rest) { if(tag_this) console.log(  M + arg0, ...rest ); };
let log_Y = function(arg0, ...rest) { if(tag_this) console.log(  Y + arg0, ...rest ); };

let log_N = function(arg0, ...rest) { if(tag_this) console.log(  N + arg0, ...rest ); };
//}}}

//┌────────────────────────────────────────────────────────────────────────────┐
//│ TOGGLE LOGGING
//└────────────────────────────────────────────────────────────────────────────┘
    /*● toggle ● is_logging ● is_tagging {{{*/
    let toggle = function(state)
    {
        // true or false
        if(typeof state != "undefined") log_this =     state;
        // or toggle
        else                            log_this = !log_this;

        console.log("log_this: "+ log_this);
        return       log_this;
    };

    let is_logging = function() { return log_this; };
    let is_tagging = function() { return tag_this; };
    /*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ LOG TRUNCATION ELLIPSIS
//└────────────────────────────────────────────────────────────────────────────┘
    /*● ellipsis {{{*/
    let ellipsis = function(str, n=128)
    {
        return  str
            ? ((str.length > n) ? str.slice(0, n - 1) + "… " : str)
            : ""
        ;
    };
    /*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ parse query
//└────────────────────────────────────────────────────────────────────────────┘
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

//┌────────────────────────────────────────────────────────────────────────────┐
//│ PRETTY PRINT REQUESTED ➔ GET same url within a few seconds
//└────────────────────────────────────────────────────────────────────────────┘
/*● html_format_requested {{{*/
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

//┌────────────────────────────────────────────────────────────────────────────┐
//│ RESPONSE CHECKPOINT
//└────────────────────────────────────────────────────────────────────────────┘
/*● writeHead {{{*/
let writeHead = function(response, _caller, ...args)
{
if(is_logging()) log_X(Y+"● writeHead "+_caller);

    response.writeHead(...args);
//console.trace();//FIXME
};
/*}}}*/

    // return ● toggle, is_logging, is_tagging, ... {{{
    return { name: "server0_log"
        ,    log
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

        , writeHead
        , html_format_requested
        , get_query_arg
    };
    //}}}
})();
//    module.exports {{{
try { module.exports = server0_log;                      } catch(ex) { console.log(ex.message); console.trace(); }
//}}}
