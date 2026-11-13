//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_js_BUS.js           ● $APROJECTS/LANServer/SERVER    ● _TAG (261113:04h:48)
//└────────────────────────────────────────────────────────────────────────────┘
//┌────────────────────────────────────────────────────────────────────────────┐
//│ *js_BUS* The communication contract singleton.
//│     ● Everyone talks ONLY through this.
//│     ● No direct refs anywhere.
//└────────────────────────────────────────────────────────────────────────────┘
// IMPORT {{{

/* globals js_log     */

/* exported js_BUS      */

import { js_log   } from "./js_log.js"
//}}}
let js_BUS = (function () {
// INTERN log {{{
const MODULE = "%c⭐🟡 js_BUS\t\t● ";
let log_this = false;
let tag_this = false || log_this;
 js_log.register({ module_name : "js_BUS"
                 , module_num  : 3
                 , log_this_fn : (state) => log_this = state
                 , tag_this_fn : (state) => tag_this = state });

let log                                        = js_log.log;
let console_clear                              = js_log.console_clear;
let lbB                                        = js_log.lbB;
let lfX                                        = js_log.lfX;

/* eslint-disable no-unused-vars */
let [lb0,lb1,lb2,lb3,lb4,lb5,lb6 ,lb7,lb8,lb9] = js_log.lbX;
let [lf0,lf1,lf2,lf3,lf4,lf5,lf6 ,lf7,lf8,lf9] = js_log.lfX;
/* eslint-enable  no-unused-vars */

//}}}
//┌────────────────────────────────────────────────────────────────────────────┐
//│ PRIVATE STATE
//└────────────────────────────────────────────────────────────────────────────┘
// ● listeners ● queue ● suspended {{{
let listeners = Object.create( null ); // e_type -> Set<handler>
let     queue = [];
let suspend_level = 0;
//}}}
//┌────────────────────────────────────────────────────────────────────────────┐
//│ PRIVATE HELPERS
//└────────────────────────────────────────────────────────────────────────────┘
/*_ notify_event {{{*/
//{{{
let         session_time = performance.now(); // SESSION START-TIME
let notifications        = 0;
let notify_event_guarded = false;
//}}}
let notify_event = function(e_type, details, ts)
{
//{{{
let caller = "notify_event("+e_type+")";
if(tag_this) console_clear("BUS."+caller);
if(tag_this) log(MODULE+caller, lbB+lf4);
//}}}
    let set = listeners[e_type];
    if(!set) {
if(tag_this) log("❌ NO LISTENERS TO NOTIFY FOR: %c e_type=["+e_type+"]", lbB,lb0+lf2);
        return;
    }
    //┌────────────────────────────────────────────────────────────────────────────┐
    //│ Guard against emit calls during a payload delivery
    //└────────────────────────────────────────────────────────────────────────────┘
    try {
        notify_event_guarded = true;

        for(let fn of [...set]) { // use a copy so handlers can unsubscribe while iterating
            try {
                notifications += 1;
if(tag_this) log("\t%c ✅ SENDING #"+ notifications.toFixed().padEnd  (3)
                 + "%c ⏲ "         +            ts.toFixed().padStart(4)+"ms"
                 + "%c "+e_type
                 ,  lb0+lfX[notifications % 10]
                 ,  lb0+lf9
                 ,  lb2+lf4
                );
                fn( details );
            }
            catch (err) {
                console.error(`[js_BUS.notify_event] handler failed for "${e_type}"`, err);
            }
        }
    }
    finally {
        notify_event_guarded = false;
    }
};
/*}}}*/
/*_ log_listeners {{{*/
let log_listeners = function()
{
    Object.keys( listeners ).forEach((e_type) => {
        log(" ● %c "+ e_type +" %c x"+ listeners[e_type].size +" listeners", lbB,lf5);

        listeners[e_type].forEach((handler) => {
            log("......handler: "+ (handler.name || "anonymous"));
        });
    });

    log("..."+ (queue.length || "No") +" pending notifications");
    queue.forEach((q) => {
        log("...%c "+q.e_type+" %c "+(q.details ? js_log.stringify(q.details) : ""), lbB,lf6);
    });

};
/*}}}*/
//┌────────────────────────────────────────────────────────────────────────────┐
//│ PUBLIC API ● MODULES INTERFACE
//└────────────────────────────────────────────────────────────────────────────┘
/*● TOPICS  ● The vocabulary {{ {*/
let TOPICS_MVC = {
    TOPICS_MODEL_TO_VIEW  : {
        MODEL_CHANGED     : "MODEL_CHANGED"
    },
    TOPICS_VIEW_TO_CNTRL  : {
        INPUT_CHANGED     : "INPUT_CHANGED"
     ,  SAVE_CLICKED      : "SAVE_CLICKED"
     ,  EDIT_CANCELED     : "EDIT_CANCELED"
    },
    TOPICS_CNTRL_TO_MODEL : {
        DATA_PATCHED      : "DATA_PATCHED"
    },
    TOPICS_CNTRL_TO_VIEW  : {
        STATE_CHANGED     : "STATE_CHANGED"
    }
};

let TOPICS = { ...TOPICS_MVC.TOPICS_MODEL_TO_VIEW
    ,          ...TOPICS_MVC.TOPICS_VIEW_TO_CNTRL
    ,          ...TOPICS_MVC.TOPICS_CNTRL_TO_MODEL
    ,          ...TOPICS_MVC.TOPICS_CNTRL_TO_VIEW
};
/*}} }*/
/*● on      ● Subscribe {{{*/
let on = function(e_type, handler)
{
//{{{
let caller = "on("+e_type+", handler: "+(handler.name || "anonymous")+")";
if(tag_this) log(MODULE+caller, lbB+lb0+lf4);
//}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Add a new listener
    //└────────────────────────────────────────────────────────────────────────┘
    let set =   listeners[e_type]
        ||     (listeners[e_type] = new Set());

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Warn duplicate listener
    //└────────────────────────────────────────────────────────────────────────┘
    if( set.has( handler ) )
        log("⚠️ DUPLICATE subscription %c"+e_type+" ● "+(handler.name||"anonymous")+" ● ignored", lbB, lb0+lf3);

     set.add( handler );

//{{{
if(tag_this) log_listeners();
//}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Return the unsubscribe 'off' function
    //└────────────────────────────────────────────────────────────────────────┘
  //return () => listeners[e_type]?.delete( handler );
    return () => { off_e_type(e_type, handler); };
};
let off_e_type = function(e_type, handler)
{
//{{{
let caller = "off_e_type("+e_type+", handler: "+(handler.name || "anonymous")+")";
if(tag_this) log(MODULE+caller, lbB+lb0+lf4);
//}}}
    if(!listeners[e_type])
        log("❌ NO LISTENERS TO DELETE FOR: %c e_type=["+e_type+"]", lbB,lb0+lf2);
    listeners[e_type]?.delete( handler );
if(tag_this) log_listeners();
};
/*}}}*/
/*● once    ● One-shot subscribe {{{*/
let once = function(e_type, handler)
{
//{{{
let caller = "once("+e_type+")";
if(tag_this) log(MODULE+caller, lbB+lb0+lf4);
//}}}
    let off = js_BUS.on(e_type, (e) => { off(); handler(e); });
    return off;
};
/*}}}*/
/*● emit    ● Publish {{{*/
let emit = function(e_type, details = {})
{
//{{{
let caller = "emit( "+e_type+")";
if(tag_this) log(MODULE+caller+"%c "+(  details ? js_log.stringify(  details) : ""), lbB+lf4, lb0+lf5);
//}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ insert emit time stamp
    //└────────────────────────────────────────────────────────────────────────┘
    let ts = (performance.now() - session_time);

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ While suspended, events are queued...
    //└────────────────────────────────────────────────────────────────────────┘
    if( suspend_level || notify_event_guarded )
    {
        queue.push({ e_type , details , ts });

if(tag_this) log("%c While SUSPENDED, events are queued: "+ queue.length +" pending notifications", lbB+lb2);
        return;
    }
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ...and flushed on resume
    //└────────────────────────────────────────────────────────────────────────┘
    notify_event(e_type, details, ts);
};
/*}}}*/
/*● suspend ● Buffer events {{{*/
let suspend = function()
{
//{{{
let caller = "suspend";
if(tag_this) log(MODULE+caller, lbB+lb0+lf4);
//}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Useful during bulk model writes
    //└────────────────────────────────────────────────────────────────────────┘
    suspend_level += 1;
if(tag_this) log("..."+ (queue.length || "No") +" pending notifications");
};
/*}}}*/
/*● resume  ● Queued events {{{*/
let resume = function()
{
    //{{{
    let caller = "resume";
    if(tag_this) log(MODULE+caller+": "+ queue.length +" pending notifications"                       , lbB+lf4, lb0);
    if(tag_this) log("%c QUEUED events notification resumed: "+ queue.length +" pending notifications", lbB+lf5);
    //}}}
    /**/suspend_level = Math.max(suspend_level-1, 0);
    if( suspend_level ) return; // if STILL SUSPENDED

    while( queue.length ) // may change during loop handling
    {
        //┌────────────────────────────────────────────────────────────────────┐
        //│ work on last 'queue' contents
        //│ and open a fresh 'queue'
        //│ to stack fresh events
        //│ while working on 'backlog'
        //└────────────────────────────────────────────────────────────────────┘
        let backlog = [ ...queue ];
        queue       = [];

        for(let {               e_type , details , ts } of backlog) {
            try { notify_event( e_type , details , ts ); }
            catch( err ) {
                console.error(`[js_BUS.resume] handler failed for "${e_type}"`, err);
            }
        }
    }
};
/*}}}*/
/*● clear   ● Testing helper {{{*/
let clear = function()
{
//{{{
let caller = "clear: "+Object.keys(listeners).length+" listeners ● queue length: "+queue.length;
if(tag_this) log(MODULE+caller, lbB+lb0+lf4);
//}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Testing helper: wipe all subscriptions
    //└────────────────────────────────────────────────────────────────────────┘
    for(let k of Object.keys(listeners)) delete listeners[k];
    queue.length         = 0;
    suspend_level        = 0;
    notify_event_guarded = false;
    session_time         = performance.now();   // SESSION START-TIME
};
/*}}}*/
/*● return {{{*/
return { TOPICS_MVC
    ,    TOPICS
    ,    on
    ,    once
    ,    emit

    ,    suspend
    ,    resume

    ,    clear

    ,    get_session_time : () => session_time

    // DEBUG
    , listeners : () => listeners
};
//}}}
})();
export { js_BUS            }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_BUS   = js_BUS  ;

let js_BUS_test = (function () { //{{{
// TEST_DESCRIPTIONS {{{
// ON_DESCRIPTION {{{
const ON_DESCRIPTION = `
┌──────────────────────────────────────────────────────┐
│ TO ADD A LISTENER:
│  let off = js_BUS.on(e_type, fn);
│  use ▲▲▲ to unsubscribe      ▲▲ will be called
│                              to notify e_type events
└──────────────────────────────────────────────────────┘`;
//}}}
// FN_DESCRIPTION {{{
const FN_DESCRIPTION = `
┌─────────────────────────────────────────────────────────────────────────┐
│ test_fn : (payload) => {
│   log("\t⏩ fn("+(payload ? js_log.stringify(payload) : "")+")");
│ };
└─────────────────────────────────────────────────────────────────────────┘`;
//}}}
// ONCE_DESCRIPTION {{{
const ONCE_DESCRIPTION = `
┌──────────────────────────────────────────────────────┐
│ TO ADD A LISTENER FOR A SINGLE EVENT:
│  js_BUS.once(e_type, fn);
│  ...will unsusbscribe after first event
└──────────────────────────────────────────────────────┘`;
//}}}
// EMIT_DESCRIPTION {{{
const EMIT_DESCRIPTION = `
┌──────────────────────────────────────────────────────┐
│ TO DISPATCH NOTIFICATION of an e_type event:
│  js_BUS.emit(e_type);
└──────────────────────────────────────────────────────┘`;
//}}}
// SUSPEND_DESCRIPTION {{{
const SUSPEND_DESCRIPTION = `
┌──────────────────────────────────────────────────────┐
│ TO SUSPEND EVENTS NOTIFICATION
│   js_BUS.suspend();
│   ................... DO SYNC STUFF
│   js_BUS.resume();
│ → To be used to SYNC-INJECT more than one payload
└──────────────────────────────────────────────────────┘`;
//}}}
//}}}
// INTERN log {{{
/* eslint-disable no-unused-vars */
let log                                        = js_log.log;
let lbB                                        = js_log.lbB;

let [b_0,b_1,b_2,b_3,b_4,b_5,b_6 ,b_7,b_8,b_9] = js_log.b_X;
let [lb0,lb1,lb2,lb3,lb4,lb5,lb6 ,lb7,lb8,lb9] = js_log.lbX;
let [lf0,lf1,lf2,lf3,lf4,lf5,lf6 ,lf7,lf8,lf9] = js_log.lfX;
/* eslint-enable  no-unused-vars */
//}}}
/*_ run {{{*/
/* eslint-disable no-useless-assignment */
// E_TYPE PAYLOAD {{{
const E_TYPE = "TEST";
const PAYLOAD
    = [     "payload #0 ◯ "
        ,   "payload #1 🟤"
        ,   "payload #2 🔴"
        ,   "payload #3 🟠"
        ,   "payload #4 🟡"
        ,   "payload #5 🟢"
        ,   "payload #6 🔵"
        ,   "payload #7 🟣"
        ,   "payload #8 ⚫"
        ,   "payload #9 ⚪️"
    ];
//}}}
let run = function()
{
    // log ● fn(payload) {{{
    log("%c js_BUS_test.run", lbB+lb0+lf4);

    let fn     = (payload) => log("\t%c ⏩ fn("+(payload ? js_log.stringify(payload) : "")+")", lb0+lf4);
    let off;
    let p_num  = 0;

    js_BUS.clear();
    //}}}
    // OFF=ON {{{
    console.groupCollapsed("%c🟢on", lbB);
    log("%c"+ ON_DESCRIPTION        , lb0+lf5);
    log("%c"+ FN_DESCRIPTION        , lb0+lf3);
    log("%c off = on:", lb0); off = js_BUS.on     (E_TYPE, fn);
    console.groupEnd();
    //}}}
    // EMIT..OFF {{{
    console.groupCollapsed("%c🟡emit .. 🔴off", lbB);
    log("%c"+ EMIT_DESCRIPTION      , lb0+lf4);
    log("%c emit:"    , lb0);       js_BUS.emit   (E_TYPE, { payload: PAYLOAD[++p_num % 10] });
    log("%c emit:"    , lb0);       js_BUS.emit   (E_TYPE, { payload: PAYLOAD[++p_num % 10] });
    log("%c emit:"    , lb0);       js_BUS.emit   (E_TYPE, { payload: PAYLOAD[++p_num % 10] });
    log("%c off:"     , lb0); off(); off = null;
    console.groupEnd();
    //}}}
    // ONCE..EMIT {{{
    console.groupCollapsed("%c🟢once .. 🟡emit", lbB);
    log("%c"+ ONCE_DESCRIPTION      , lb0+lf5);
    log("%c off = on:", lb0);       js_BUS.once   (E_TYPE, fn);
    log("%c emit:"    , lb0);       js_BUS.emit   (E_TYPE, { payload: PAYLOAD[++p_num % 10] });
    console.groupEnd();
    //}}}
    // ON..EMIT..SUSPEND..RESUME..OFF {{{
    console.groupCollapsed("%c🟢on .. 🟡emit .. 🔵suspend .. 🔵resume .. 🔴off", lbB);
    log("%c"+ SUSPEND_DESCRIPTION   , lb0+lf6);
    log("%c off= on"  , lb0); off = js_BUS.on     (E_TYPE, fn);
    log("%c emit:"    , lb0);       js_BUS.emit   (E_TYPE, { payload: PAYLOAD[++p_num % 10] });
    log("%c suspend:" , lb0);       js_BUS.suspend();
    log("%c emit:"    , lb0);       js_BUS.emit   (E_TYPE, { payload: PAYLOAD[++p_num % 10] });
    log("%c emit:"    , lb0);       js_BUS.emit   (E_TYPE, { payload: PAYLOAD[++p_num % 10] });
    log("%c resume:"  , lb0);       js_BUS.resume();
    log("%c off:"     , lb0); off(); off = null;
    console.groupEnd();
    //}}}
};
/* eslint-enable  no-useless-assignment */
/*}}}*/
/*● return {{{*/
return { run };
//}}}
})();
export { js_BUS_test            }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_BUS_test = js_BUS_test  ;
//}}}
