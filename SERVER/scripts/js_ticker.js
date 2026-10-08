//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_ticker.js    ● $APROJECTS/LANServer/SERVER       ● _TAG (261008:22h:05) │
//└────────────────────────────────────────────────────────────────────────────┘
/* IMPORT {{{*/

/* globals  js_log */
/* exported js_ticker */

//port { js_CNTRL   } from "./js_CNTRL.js"
//port { js_MODEL   } from "./js_MODEL.js"
//port { js_VIEW    } from "./js_VIEW.js"
//port { js_boxing  } from "./js_boxing.js"
//port { js_folds   } from "./js_folds.js"
//port { js_input   } from "./js_input.js"
//port { js_linkify } from "./js_linkify.js"
import { js_log     } from "./js_log.js"
//port { js_notes   } from "./js_notes.js"
//port { js_store   } from "./js_store.js"
//port { js_ticker  } from "./js_ticker.js"
//port { js_xpath   } from "./js_xpath.js"
//port { notes      } from "./notes.js"

/*}}}*/
let js_ticker = (() => {
    // private {{{
    const INTERVAL_MS_MAX   = 10000;

    let   interval_ms       = 5000;
    let   timeout           = null;
    let   handler_fnc;
    //}}}

    // ● log-items inlining ● SERVER/scripts/js_log.js {{{
    /* eslint-disable no-unused-vars */

    let log                                        = js_log.log;
    let is_logging                                 = js_log.is_logging;
    let console_clear                              = js_log.console_clear;

    let ellipsis                                   = js_log.ellipsis;
    let get_src_link                               = js_log.get_src_link;

    let lbB                                        = js_log.lbB;

    let b_X                                        = js_log.b_X;
    let lbX                                        = js_log.lbX;
    let lfX                                        = js_log.lfX;
    let [b_0,b_1,b_2,b_3,b_4,b_5,b_6 ,b_7,b_8,b_9] = js_log.b_X;
    let [lb0,lb1,lb2,lb3,lb4,lb5,lb6 ,lb7,lb8,lb9] = js_log.lbX;
    let [lf0,lf1,lf2,lf3,lf4,lf5,lf6 ,lf7,lf8,lf9] = js_log.lfX;

    /* eslint-enable  no-unused-vars */
    //}}}

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ 1.  setInterval     ● May set, change or clear interval and handler
    //└────────────────────────────────────────────────────────────────────────┘
    /* 1. setInterval ...calls start() {{{*/
    let   setInterval = function(handler_arg, interval_ms_arg)
    {
if(is_logging()) log(b_1 +"js_ticker.setInterval("+(handler_arg ? handler_arg.name : handler_arg)+", "+interval_ms_arg+")");

        changeInterval( interval_ms_arg , "do_not_sync");

        changeHandler ( handler_arg     , "do_not_sync");

        sync();

        return js_ticker;
    };
    /*}}}*/

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ 1.1 changeInterval  ● May set, change or clear the loop interval
    //└────────────────────────────────────────────────────────────────────────┘
    /*  changeInterval {{{*/
    let changeInterval = function(interval_ms_arg, do_not_sync)
    {
if(is_logging()) log("%c"+b_1+b_1 +"js_ticker.changeInterval("+interval_ms_arg+")", lbB);
        // ●  interval [MAX] {{{
        if(interval_ms_arg > INTERVAL_MS_MAX)
        {
            console.warn("js_ticker: interval_ms cap at "+ INTERVAL_MS_MAX +"ms");
            interval_ms = INTERVAL_MS_MAX;
        }
        //}}}
        // ●  interval [min] ● 0 will stop the loop {{{
        else if(interval_ms_arg >= 0)
        {
            interval_ms = Math.max(0, interval_ms_arg);
        }
        //}}}
        // ●  interval unchanged {{{
        else {
if(is_logging()) log("interval unchanged ["+ interval_ms +"]");
        }
        //}}}
        if(!do_not_sync)
            sync();

        return js_ticker;
    };
    /*}}}*/

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ 1.2 changeHandler   ● May set, change or remove the callback handler
    //└────────────────────────────────────────────────────────────────────────┘
    /*  changeHandler {{{*/
    let changeHandler = function(handler_arg, do_not_sync)
    {
if(is_logging()) log(b_1+b_2 +"js_ticker.changeHandler("+ (handler_arg ? handler_arg.name : handler_arg) +")");
        // ● handler_fnc (required) {{{
        if( handler_arg )
        {
            if(typeof         handler_arg == "function") {
                handler_fnc = handler_arg;
            }
            else {
                console.warn("handler_arg is "+ (typeof handler_arg) +" ** function required **");
                handler_fnc = null;
            }
        }
        if( !handler_fnc )
        {
            console.warn("js_ticker: NO HANDLER TO CALL");
        }
        //}}}
        if(!do_not_sync)
            sync();

        return js_ticker;
    };
    /*}}}*/

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ 1.3 sync            ● May start or stop by checking handler or interval
    //└────────────────────────────────────────────────────────────────────────┘
    /*  sync {{{*/
    let sync = function()
    {
if(is_logging()) log(b_1+b_3 +"js_ticker.sync");
        // 1. START: [interval_ms] and [handler_fnc] {{{
        if(interval_ms && handler_fnc)
        {
            start();
        }
        //}}}
        // 2. STOP : [no interval] OR [no handler_fnc] {{{
        else {
            stop();
        }
        //}}}
    };
    /*}}}*/

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ 2.  start           ● May stop on missing interval or handler
    //└────────────────────────────────────────────────────────────────────────┘
    /* start {{{*/
    let   start = function()
    {
if(is_logging()) log(b_2 +"js_ticker.start");

        // interval or handler_fnc gone
        if(!interval_ms || typeof handler_fnc !== "function")
            return stop();

        // start sync
        if( timeout ) clearTimeout( timeout );

        loop();

        return js_ticker;
    };
    /*}}}*/

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ 3.  stop            ● May interrupt a schedule timeout
    //└────────────────────────────────────────────────────────────────────────┘
    /* stop {{{*/
    let   stop = function()
    {
if(is_logging()) log(b_3 +"js_ticker.stop");

        if( timeout ) {
            clearTimeout( timeout );
            timeout = null;
        }
        return js_ticker;
    };
    /*}}}*/

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ 4.  loop            ● May stop on missing handler, schedule next loop
    //└────────────────────────────────────────────────────────────────────────┘
    /* loop {{{*/
    let   loop = function()
    {
if(is_logging()) console.log(b_4 +`loop @ ${new Date().toISOString()} [${interval_ms}]`);

        timeout = null;

        // handler_fnc gone
        if(typeof handler_fnc !== "function")
            stop();

        // handler_fnc call
        try {
            handler_fnc();
        } catch(ex) {
            if(handler_fnc) {
                console.warn(b_2 +" handler_fnc "+handler_fnc.name+" Exception:\n"+ ex);
                stop();
                handler_fnc = null;
                console.warn(b_2 +" handler_fnc nullified");
            }
        }

        // next tick re-arm
        if( interval_ms > 0)
            timeout = setTimeout(loop, interval_ms);
    };
    /*}}}*/

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Public API
    //└────────────────────────────────────────────────────────────────────────┘
    return { setInterval
        ,    changeHandler
        ,    changeInterval
        ,    stop
        ,    start
    };
})();
// Devtools snippets {{{
//┌────────────────────────────────────────────────────────────────────────────┐
//│ ●  js_log.toggle(true)
//│ 🟤 js_ticker.setInterval(() => console.log("🟢 TIC" ) , 2000);
//│ 🟤 js_ticker.setInterval(() => console.log("🔵 TOC" )       );
//│ 🟤 js_ticker.setInterval(undefined, 2000);
//│ 🟤 js_ticker.setInterval(               );
//│ 🔴 js_ticker.start();
//│ 🟠 js_ticker.stop();
//│ 🟡 ...loop
//│ ● js_log.toggle(true);
//│ ● js_ticker.setInterval   (() => note_DETAILS.toggleAttribute("open"), 3000);
//│ ● js_ticker.changeHandler (() => console.log("🔵 CHANGED" ));
//│ ● js_ticker.changeInterval( 2000 );
//│ ● js_ticker.stop();
//└────────────────────────────────────────────────────────────────────────────┘
//}}}
//globalThis.js_ticker = js_ticker;
export { js_ticker }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_ticker = js_ticker;
