//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_log.js        ● $APROJECTS/LANServer/SERVER      ● _TAG (260923:21h:52) │
//└────────────────────────────────────────────────────────────────────────────┘
/* jshint {{{*/

/* exported js_log   */

/*}}}*/
globalThis.js_log = (function() {

let log_this = true;//false;
let tag_this = false || log_this;

    let log = console.log;

    let toggle = function() {
        log_this =  !log_this;
        console.log("log_this: "+ log_this);
        return       log_this;
    };
    let is_logging = function() { return log_this; };
    let is_tagging = function() { return tag_this; };

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ CONSOLE %c
    //└────────────────────────────────────────────────────────────────────────┘
    // lb0..lb9 ● lbX ● lbX {{{
    /* eslint-disable no-unused-vars */

    const lb1  = "background:#964B00; color:black; padding:0 0.5em;";
    const lb2  = "background:#FF0000; color:black; padding:0 0.5em;";
    const lb3  = "background:#FFA500; color:black; padding:0 0.5em;";
    const lb4  = "background:#FFFF00; color:black; padding:0 0.5em;";
    const lb5  = "background:#9ACD32; color:black; padding:0 0.5em;";
    const lb6  = "background:#6495ED; color:black; padding:0 0.5em;";
    const lb7  = "background:#EE82EE; color:black; padding:0 0.5em;";
    const lb8  = "background:#A0A0A0; color:black; padding:0 0.5em;";
    const lb9  = "background:#FFFFFF; color:black; padding:0 0.5em;";
    const lb0  = "background:#000000; color:gray ; padding:0 0.5em;";
    const lbX  = [ lb0 ,lb1 ,lb2 ,lb3 ,lb4 ,lb5 ,lb6 ,lb7 ,lb8 ,lb9 ];
    const lbB  = lb0 +"font-size: 150%; border-radius: 1em; padding: 0 1em; border: 1px solid red;";

    const lf1  = "color:#964B00;";
    const lf2  = "color:#FF0000;";
    const lf3  = "color:#FFA500;";
    const lf4  = "color:#FFFF00;";
    const lf5  = "color:#9ACD32;";
    const lf6  = "color:#6495ED;";
    const lf7  = "color:#EE82EE;";
    const lf8  = "color:#A0A0A0;";
    const lf9  = "color:#FFFFFF;";
    const lf0  = "color:#707070; text-shadow:#000 2px 2px 1px;"; /* offset-x offset-y blur-radius */
    const lfX  = [ lf0 ,lf1 ,lf2 ,lf3 ,lf4 ,lf5 ,lf6 ,lf7 ,lf8 ,lf9 ];


    /* eslint-enable  no-unused-vars */
    //}}}
    /*_ console_clear {{{*/
    //{{{
    const CONSOLE_CLEAR_COOLDOWN_DURATION_MS = 1000;

    let   console_clear_cooldown_timer;
    //}}}
    let console_clear = function(_caller)
    {
        // COOLDOWN
        if(console_clear_cooldown_timer)
        {
            if(log_this) console.log("%c CLEARED BY "+ _caller +" ● prevented by console clear cooldown", lbB+"border-color:#444;");
            return;
        }
        else {
            console_clear_cooldown_timer = setTimeout(() => console_clear_cooldown_timer=null, CONSOLE_CLEAR_COOLDOWN_DURATION_MS);
            console.clear();
            console.log("%c CLEARED BY "+ _caller, lbB);
        }
    };
    /*}}}*/

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ UTIL
    //└────────────────────────────────────────────────────────────────────────┘
    /* ● ellipsis {{{*/
    let ellipsis = function(str, n=128)
    {
        return  str
            ? ((str.length > n) ? str.slice(0, n - 1) + "… " : str)
            : ""
        ;
    };
    /*}}}*/
    /*_ get_src_link {{{*/
    let get_src_link = function(lvl=3)
    {
        return new Error().stack
            .split("\n")[lvl]
            .replace(/.*\((.*)\)/,"$1")
            .replace(/ *at */    ,""  );
    };
    /*}}}*/

    // return {{{
    return { name: "js_log"

        ,    console_clear
        ,    log
        ,    toggle
        ,    is_logging
        ,    is_tagging

        ,    get_src_link
        ,    ellipsis

        ,    lbB
        ,    lbX
        ,    lfX
        , ...lbX // js_log.lb0 .. js_log.lb9
        , ...lfX // js_log.lf0 .. js_log.lf9
    };
    //}}}
}());
