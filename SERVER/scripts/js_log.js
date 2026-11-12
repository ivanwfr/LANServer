//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_log.js        ● $APROJECTS/LANServer/SERVER       ● _TAG (261112:21h:47)
//└────────────────────────────────────────────────────────────────────────────┘
/* IMPORT {{{*/

/* globals  js_store */
/* exported js_log   */

import { js_store   } from "./js_store.js"
/*}}}*/
let js_log = (function()
{
//┌────────────────────────────────────────────────────────────────────────────┐
//│  🟤 🔴 🟠 🟡 🟢 🔵 🟣 ⚫ ⚪️
//└────────────────────────────────────────────────────────────────────────────┘
//nst MODULE = "⭐ js_log";
let log_this = false;
let tag_this = false || log_this;

//┌────────────────────────────────────────────────────────────────────────┐
//│ CSS
//└────────────────────────────────────────────────────────────────────────┘
//● lb0..lb9 ● lbX ● lbX {{{
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
const lbB  = lb0 +"font-size: 150%; border-radius: 1em; padding: 0 1em; border: 1px solid red;";

const lbX  = [ lb0 ,lb1 ,lb2 ,lb3 ,lb4 ,lb5 ,lb6 ,lb7 ,lb8 ,lb9 ];

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

const b_1   = "🟤";
const b_2   = "🔴";
const b_3   = "🟠";
const b_4   = "🟡";
const b_5   = "🟢";
const b_6   = "🔵";
const b_7   = "🟣";
const b_8   = "⚫";
const b_9   = "⚪️";
const b_0   = "◯";

const b_X  = [ b_0 ,b_1 ,b_2 ,b_3 ,b_4 ,b_5 ,b_6 ,b_7 ,b_8 ,b_9 ];

/* eslint-enable  no-unused-vars */
//}}}

//┌────────────────────────────────────────────────────────────────────────┐
//│ LOG TOGGLE STATE
//└────────────────────────────────────────────────────────────────────────┘
let log = console.log;
/*_ logging {{{*/
let logging = function(state, name="", _caller="")
{
    // GET
    if(typeof state == "undefined")
    {
        log("%c⭐ logging:%c"+(js_store.localStorage_getItem( LOGGING_KEY ) || "NONE"), lbB, lbB+lf3);
        return;
    }
    // SET
    if(!registered_modules_sorted) registered_modules_sort();

    let notified = "";
    for(let i=0; i< registered_modules.length; ++i)
    {
        let { module_name, module_num, log_this_fn, tag_this_fn } = registered_modules[i]; /* eslint-disable-line no-unused-vars */
        if(log_this_fn && (!name || (module_name == name)) )
        {
            registered_modules[i].logging = state;
            log_this_fn( state );
            notified += " "+b_X[module_num % 10]+" "+module_name;
        }
    }
    log("★ logging notified %c"+(notified || "NONE"), lb0);

    // SAVE to localStorage
    if(_caller != "load_logging_modules") save_logging_modules();
};
/*}}}*/
/*_ tagging {{{*/
let tagging = function(state, name="", _caller="")
{
    // GET
    if(typeof state == "undefined")
    {
        log("%c⭐ tagging:%c"+(js_store.localStorage_getItem( TAGGING_KEY ) || "NONE"), lbB, lbB+lf3);
        return;
    }
    // SET
    if(!registered_modules_sorted) registered_modules_sort();

    let notified = "";
    for(let i=0; i< registered_modules.length; ++i)
    {
        let { module_name, module_num, log_this_fn, tag_this_fn } = registered_modules[i]; /* eslint-disable-line no-unused-vars */
        if(tag_this_fn && (!name || (module_name == name)) )
        {
            registered_modules[i].tagging = state;

            tag_this_fn( state );
            notified += " "+b_X[module_num % 10]+" "+module_name;
        }

    }
    log("★ tagging notified %c"+(notified || "NONE"), lb0);

    // SAVE to localStorage
    if(_caller != "load_logging_modules") save_logging_modules();
};
/*}}}*/
/*○ save_logging_modules {{{*/
//{{{
const LOGGING_KEY   = "site.logging";
const TAGGING_KEY   = "site.tagging";
const SAVE_COOLDOWN = 1000;
let save_logging_modules_timeout;
//}}}
let save_logging_modules = function()
{
    if(save_logging_modules_timeout) clearTimeout( save_logging_modules_timeout );
       save_logging_modules_timeout = setTimeout(save_logging_modules_handler, SAVE_COOLDOWN);
};
let save_logging_modules_handler = function()
{
    save_logging_modules_timeout = null;

    let tagging_modules = "";
    let logging_modules = "";
    registered_modules.forEach((m) => {
        if( m.tagging ) tagging_modules += " "+m.module_name;
        if( m.logging ) logging_modules += " "+m.module_name;
    });

    if( tagging_modules.trim() ) js_store.localStorage_setItem( TAGGING_KEY, tagging_modules.trim());
    else                         js_store.localStorage_delItem( TAGGING_KEY );
    if( logging_modules.trim() ) js_store.localStorage_setItem( LOGGING_KEY, logging_modules.trim());
    else                         js_store.localStorage_delItem( LOGGING_KEY );
};
/*}}}*/
/*○ load_logging_modules {{{*/
let load_logging_modules = function()
{
if(tag_this) js_log.trace(); // 🟤🔴🟠🟡🟢🔵🟣⚫⚪️◯
//{{{
let caller = "load_logging_modules";
//}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ This function can enforce all modules
    //│ localStorage persistant logging and tagging sates
    //│ after all modules have registered
    //└────────────────────────────────────────────────────────────────────────┘

    // TAGGING
    let tagging_modules = js_store.localStorage_getItem( TAGGING_KEY );
    if( tagging_modules ) tagging_modules.split(" ").forEach((m) => tagging(true, m, caller));
    // LOGGING
    let logging_modules = js_store.localStorage_getItem( LOGGING_KEY );
    if( logging_modules ) logging_modules.split(" ").forEach((m) => logging(true, m, caller));
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────┐
//│ MODULE REGISTER ● TO BE NOTIFIED OF LOG_THIS CHANGES
//└────────────────────────────────────────────────────────────────────────┘
/*_ register {{{*/
let registered_modules = [];
let registered_modules_sorted = false;
let register = function( mod )
{
if(tag_this) log("js_log.register("+ mod.module_name +")");

    registered_modules
        .push( mod  );

    // Replay persisted state for late arrivals
    if(js_store.localStorage_getItem(TAGGING_KEY)?.split(" ").includes(mod.module_name))
        mod.tag_this_fn?.(true);

    if(js_store.localStorage_getItem(LOGGING_KEY)?.split(" ").includes(mod.module_name))
        mod.log_this_fn?.(true);

    registered_modules_sorted = false;
};
/*}}}*/
/*_ registered_modules_sort {{{*/
let registered_modules_sort = function()
{
//log("registered_modules_sort");
    let next
        = registered_modules.reduce((n,a) =>   Math.max(n, a.module_num), 0              );
    registered_modules.forEach     ((a  ) => { if(!a.module_num) a.module_num = ++next; });
    registered_modules.sort        ((a,b) =>   a.module_num - b.module_num               );
    registered_modules_sorted = true;
//console.dir(registered_modules);
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────┐
//│ CONSOLE CLEAR
//└────────────────────────────────────────────────────────────────────────┘
/*● console_clear {{{*/
//{{{
const CONSOLE_CLEAR_COOLDOWN_DURATION_MS = 1000;

let   console_clear_cooldown_timer;
//}}}
let console_clear = function(_caller)
{
    // COOLDOWN
    if(console_clear_cooldown_timer)
    {
        log("%c CLEARED BY "+ _caller +" ● prevented by console clear cooldown", lbB+"border-color:#444;");
    }
    else {
        console.clear();
        log("%c CLEARED BY "+ _caller, lbB);
        console_clear_cooldown_timer = setTimeout(() => console_clear_cooldown_timer=null, CONSOLE_CLEAR_COOLDOWN_DURATION_MS);
    }
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────┐
//│ UTIL
//└────────────────────────────────────────────────────────────────────────┘
/*● ellipsis {{{*/
let ellipsis = function(_str, n=128)
{
    let str = _str.replace(/\n/g,"↲");
    return  str
        ? ((str.length > n) ? str.slice(0, n - 1) + "… " : str)
        : ""
    ;
};
/*}}}*/
/*_ stringify {{{*/
let stringify = function(v, n=128)
{
    let seen = new WeakSet();
    try {
        return ellipsis(JSON.stringify(v, (k, val) => {
            if(typeof val === "object" && val !== null) {
                if(seen.has(val)) return "[Circular]";
                seen.add(val);
            }
            return val;
        }), n);
    } catch(_) { return String(v); } /* eslint-disable-line no-unused-vars */
};
/*}}}*/
/*_ moveChar {{{*/
let moveChar = function(str, fromIndex, toIndex)
{
// moveChar("➔xxx", 0, 1); // "x➔xx"

  let  chars = [...str];
  let [char] = chars.splice(fromIndex, 1);
  chars.splice(toIndex, 0, char);
  return chars.join("");
};
/*}}}*/

/*● get_src_link {{{*/
let get_src_link = function(lvl=3)
{
    let stack
        =  new Error().stack
        || "";

    let lines
        = stack.split("\n").slice( 1 );

    let line
        =  lines[Math.max(0,lvl)]
        || "";

    if(!line ) return "";
    else       return get_src_link_line(line);
};
/*}}}*/
/*_ get_src_link_line {{{*/
let get_src_link_line = function(line)
{
    //..........................111111.............22222222222222222222222222..33333...444..5555
    //.........................(at____)...........(DOMAIN____________________)(PATH_):(LIN):(COL)
    let matches = line.match(/^([^\(]*)?(?:\s+\()?(?:https?:\/\/(?:[^\/]*)?\/)([^:]*):(\d+):(\d+)/);
    if(!matches )
        return "\t" + line.trim() + "\t";   // conform to 3-col shape

    let m_at     = matches[1]
                   .  replace(/at\s+/          ,   "")
                   .  replace(     /Object\./  ,   "")
                   .  trim();
    let m_domain = matches[2];
    let m_path   = matches[3];
    let m_src    = m_path.replace(/.*\//, "");
    let m_line   = matches[4];
    let m_col    = matches[5];
//{{{
//log(".......m_at["+ m_at     +"]");
//log("...m_domain["+ m_domain +"]");
//log("....m_path=["+ m_path   +"]");
//log(".....m_src=["+ m_src    +"]");
//log("....m_line=["+ m_line   +"]");
//log(".....m_col=["+ m_col    +"]");
//}}}
    let m_fnc_or_line = (m_at || ("line "+m_line));
    let m_link = m_domain
         +       m_path
         +  ":"+ m_line
         +  ":"+ m_col;
    line  = m_src         //.padEnd(20)
          +"\t"+ m_fnc_or_line //.padEnd(20)
          +"\t"+ m_link;

    return line;
};
/*}}}*/
/*● trace {{{*/
//{{{
const STACK_LAYER_MAX = 16;
//}}}
let trace = function()
{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ get call stack trace
    //└────────────────────────────────────────────────────────────────────────┘
    //{{{
    let lines = [];
    for(let lvl = STACK_LAYER_MAX; lvl > 1; --lvl)  // lvl=0 is js_log.log calling this function
    {
        let line  = get_src_link( lvl );
        if( line )
            lines.push(line);
    }
    //}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ column width padding: src fnc lnk
    //└────────────────────────────────────────────────────────────────────────┘
    //{{{
    let l_out = [];
    let src_len_max = 0;
    let fnc_len_max = 0;
    lines.forEach((line) => {

        let ix1 = line .indexOf("\t");
        let src = line.substr(0, ix1); src_len_max = Math.max(src_len_max, src.length);

        let ix2 = line .lastIndexOf("\t");
        let fnc = line.substr(ix1+1, ix2-ix1-1); fnc_len_max = Math.max(fnc_len_max, fnc.length);

        let lnk = line.substr(ix2+1);

//{{{
//log("src=["+src+"]");//FIXME
//log("fnc=["+fnc+"]");//FIXME
//log("lnk=["+lnk+"]");//FIXME
//}}}
        l_out.push({ src, fnc, lnk });
    });
//{{{
//log("src_len_max=["+src_len_max+"]");//FIXME
//log("fnc_len_max=["+fnc_len_max+"]");//FIXME
//}}}
//{{{
//    let caller_rank = 0;
//    lines.forEach((line) => {
//        caller_rank += 1;
//        log("%c"+ caller_rank +" "+ b_X[caller_rank] +" "+ line, lbB);
//    });
//}}}
    //}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ log call stack trace
    //└────────────────────────────────────────────────────────────────────────┘
    //{{{
    let arrow = "\u21b3".padEnd(l_out.length);
    let caller_rank = 0;
    l_out.forEach((item) => {
        caller_rank += 1;
        log("%c"+ caller_rank +" "+ b_X[caller_rank]
            +" "+ item.src.padEnd(src_len_max+1)
            +" "+ arrow
            +" "+ item.fnc.padEnd(fnc_len_max+1)
            +" "+ item.lnk
            , lb0);
        arrow = moveChar(arrow, caller_rank-1, caller_rank);
    });
    //}}}
};
/*}}}*/
/*● sleep {{{*/
let sleep = async function(delay)
{
    await new Promise(function executor(resolve/*,reject*/) {
        setTimeout(() => resolve(), delay);
    });
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────┐
//│ PUBLIC
//└────────────────────────────────────────────────────────────────────────┘
//● return {{{
return { name: "js_log"

    // CONSOLE
    ,    log
    ,    console_clear

    // LOGGING
    ,    load_logging_modules
    ,    register
    ,    logging
    ,    tagging

    // UTIL
    ,    ellipsis
    ,    stringify
    ,    get_src_link
    ,    trace
    ,    moveChar
    ,    sleep

    // STYLE
    ,    lbX, ...lbX // js_log.lb0 .. js_log.lb9
    ,    lfX, ...lfX // js_log.lf0 .. js_log.lf9
    ,    b_X, ...b_X // js_log.b_0 .. js_log.b_9
    ,    lbB         // BIG

    // DEBUGGER
    , tag_MVC: (state=true) => {
        tagging(state,"js_MODEL"    );
        tagging(state,"js_VIEW"     );
        tagging(state,"js_CNTRL"    );
        tagging(state,"notes"       );
        tagging(state,"js_notes"    );
        tagging(state,"js_details"  );
    }
};
//}}}
})();
export { js_log }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_log = js_log;
