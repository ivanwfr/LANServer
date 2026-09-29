//┌────────────────────────────────────────────────────────────────────────────┐
//│ server_log.js                                       _TAG (260928:21h:37)
//│ termio ● ANSII-TERMINAL
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/
// eslint-disable no-warning-comments */
/* eslint-disable no-unused-vars */

/*}}}*/
let server_log = (function() {
"use strict";

let log_this = false;
let tag_this = true || log_this;

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
//}}}

// console log {{{
let log_X = function(      ...rest) { console.log.apply(console, Array.prototype.slice.call(rest)); }; /* eslint-disable-line prefer-spread */

let log_R = function(arg0, ...rest) { if(tag_this) console.log(  R + arg0, ...rest ); };
let log_G = function(arg0, ...rest) { if(tag_this) console.log(  G + arg0, ...rest ); };
let log_B = function(arg0, ...rest) { if(tag_this) console.log(  B + arg0, ...rest ); };

let log_C = function(arg0, ...rest) { if(tag_this) console.log(  C + arg0, ...rest ); };
let log_M = function(arg0, ...rest) { if(tag_this) console.log(  M + arg0, ...rest ); };
let log_Y = function(arg0, ...rest) { if(tag_this) console.log(  Y + arg0, ...rest ); };

let log_N = function(arg0, ...rest) { if(tag_this) console.log(  N + arg0, ...rest ); };
//}}}

    /*● log toggle is_logging is_tagging {{{*/

    let log = console.log;

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
    /*● ellipsis {{{*/
    let ellipsis = function(str, n=128)
    {
        return  str
            ? ((str.length > n) ? str.slice(0, n - 1) + "… " : str)
            : ""
        ;
    };
    /*}}}*/
    // return {{{
    return { name: "server_log"
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

    };
    //}}}
})();
try { module.exports = server_log; } catch(ex) { console.log(ex.message); }
