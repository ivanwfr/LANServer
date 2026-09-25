//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_ticker.js    ● $APROJECTS/LANServer/SERVER       ● _TAG (260925:20h:26) │
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/

/* globals  js_log */
/* exported js_ticker */

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
    let [b_0,b_1,b_2,b_3,b_4,b_5,b_6 ,b_7,b_8,b_9] =        b_X;
    let [lb0,lb1,lb2,lb3,lb4,lb5,lb6 ,lb7,lb8,lb9] =        lbX;
    let [lf0,lf1,lf2,lf3,lf4,lf5,lf6 ,lf7,lf8,lf9] =        lfX;

    /* eslint-enable  no-unused-vars */
    //}}}

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ 1.  setInterval ● May set, change or clear loop interval and handler
    //└────────────────────────────────────────────────────────────────────────┘
    /* 1. setInterval ...calls start() {{{*/
    let   setInterval = function(handler_arg, interval_ms_arg)
    {
if(is_logging()) log(b_1 +"js_ticker.setInterval("+(handler_arg ? handler_arg.name : handler_arg)+", "+interval_ms_arg+")");

        changeInterval( interval_ms_arg , "sync_canceled");

        changeHandler ( handler_arg     , "sync_canceled");

        sync();

        return js_ticker;
    };
    /*}}}*/

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ 1.1 changeInterval ● May set, change or clear the loop interval
    //└────────────────────────────────────────────────────────────────────────┘
    /*  changeInterval {{{*/
    let changeInterval = function(interval_ms_arg, sync_canceled)
    {
if(is_logging()) log("%c"+b_1+b_1 +"js_ticker.changeInterval("+interval_ms_arg+")", lbB);
        // ●  interval [MAX] {{{
        if(interval_ms_arg > INTERVAL_MS_MAX)
        {
            console.warn("js_ticker: interval_ms cap at "+ INTERVAL_MS_MAX +"ms");
            interval_ms = INTERVAL_MS_MAX;
        }
        //}}}
        // ●  interval [min] {{{
        else if( interval_ms_arg )
        {
            interval_ms = Math.max(0, interval_ms_arg);
        }
        //}}}
        // ●  interval unchanged {{{
        else {
if(is_logging()) log("interval unchanged ["+ interval_ms +"]");
        }
        //}}}
        if(!sync_canceled) sync();
        return js_ticker;
    };
    /*}}}*/

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ 1.2 changeHandler ● May set, change or remove the callback handler
    //└────────────────────────────────────────────────────────────────────────┘
    /*  changeHandler {{{*/
    let changeHandler = function(handler_arg, sync_canceled)
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
        if(!sync_canceled) sync();
        return js_ticker;
    };
    /*}}}*/

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ 1.3 sync        ● May start or stop by checking handler and interval
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

    /* 3 start {{{*/
    let   start = function()
    {
if(is_logging()) log(b_2 +"js_ticker.start");

        // start sync
        if( timeout ) clearTimeout( timeout );

        loop();
        return js_ticker;
    };
    /*}}}*/
    /* 4 stop {{{*/
    let   stop = function()
    {
if(is_logging()) log(b_3 +"js_ticker.stop");

        if( timeout ) clearTimeout( timeout );
        /**/timeout = null;
        return js_ticker;
    };
    /*}}}*/
    /* 5 loop {{{*/
    let   loop = function()
    {
if(is_logging()) console.log(b_4 +`loop @ ${new Date().toISOString()} [${interval_ms}]`);

        // done loop marker
        timeout = null;

        // handler_fnc call
        if( handler_fnc )
        {
            try {
                handler_fnc();
            } catch(ex) {
               console.warn(b_2 +" handler_fnc "+handler_fnc.name+" Exception:\n"+ ex);
            }
        }
        else
            return;

        // next tick re-arm
        timeout = setTimeout(loop, interval_ms);
    };
    /*}}}*/
    return { setInterval
        ,    changeHandler
        ,    changeInterval
        ,    stop
        ,    start
    };
})();
globalThis.js_ticker = js_ticker;

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
