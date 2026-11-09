//┌────────────────────────────────────────────────────────────────────────────┐
//│ Bus.js           ● $APROJECTS/LANServer/SERVER       ● _TAG (261109:01h:46)
//└────────────────────────────────────────────────────────────────────────────┘
//┌────────────────────────────────────────────────────────────────────────────┐
//│ *BUS* The communication contract singleton
//│       Everyone talks ONLY through this
//│       No direct refs anywhere
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{

//┌────────────────────────────────────────────────────────────────────────────┐
//│ **BUS TOPIC**                            **STATE**
//│         **emit**  *notify_event*                *transition*
//│     VIEW/helpers  ➔ CONTROLLER:          IDLE            EDITING:        SAVING:    DELETING:
//│     VC_INPUT_CHANGED: "VIEW:input:change"      SELECT_NOTE:    SELECT_NOTE:    "IDLE"
//│   VC_SAVE_CLICKED: "VIEW:form:submit"         "EDITING"       "IDLE"
//│    VC_EDIT_CANCELED: "VIEW:form:reset"        SAVE_NOTE:        "EDITING"
//│                                              "SAVING"      SAVE_NOTE:
//│       CONTROLLER: ➔ MODEL:                   "IDLE"          "SAVING"
//│      CM_DATA_PATCHED: "MODEL:patch"            DELETE_NOTE:      "IDLE"
//│                                              "DELETING"    DELETE_NOTE:
//│            MODEL: ➔ VIEW:                    "IDLE"          "DELETING"
//│    MV_DATA_LOADED: "MODEL:changed"                            "IDLE"
//│                                                            CANCEL:
//│       CONTROLLER: ➔ VIEW:                                    "IDLE"
//│    CM_SM_STATE_CHANGED: "CTRL:state:changed"
//└────────────────────────────────────────────────────────────────────────────┘

}}}*/
// IMPORT {{{

/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */

/* globals js_log     */
                         //┌─────────────┐
/* glogals js_MODEL   */ //│ - Model     │
/* glogals js_VIEW    */ //│ - View      │
/* globals js_CNTRL   */ //│ - Controler │
                         //└─────────────┘
/* globals    notes   */
/* globals js_details */
/* globals js_notes   */
/* globals js_input   */

//port { js_CNTRL   } from "./js_CNTRL.js"
//port { js_MODEL   } from "./js_MODEL.js"
//port { js_VIEW    } from "./js_VIEW.js"
//port { js_boxing  } from "./js_boxing.js"
//port { js_folds   } from "./js_folds.js"
//port { js_input   } from "./js_input.js"
//port { js_linkify } from "./js_linkify.js"
//port { js_log     } from "./js_log.js"
//port { js_details } from "./js_details.js"
//port { js_store   } from "./js_store.js"
//port { js_ticker  } from "./js_ticker.js"
//port { js_xpath   } from "./js_xpath.js"
//port { notes      } from "./notes.js"

//}}}
let Bus = (function ()
{
//┌────────────────────────────────────────────────────────────────────────────┐
//│ ◯  INTERNING ● SERVER/scripts/js_log.js
//└────────────────────────────────────────────────────────────────────────────┘
const MODULE = "%c⭐🟡 BUS\t\t● ";
let log_this = false;
let tag_this = false || log_this;
//{{{
/* eslint-disable no-unused-vars */

 js_log.register( { module_name : "BUS"
                 , module_num  : 3
                 , log_this_fn : (state) => log_this = state
                 , tag_this_fn : (state) => tag_this = state } );

let log                                        = js_log.log;
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

let LBB = lbB; // BIG+GRAY
/* eslint-enable  no-unused-vars */
//}}}

//┌────────────────────────────────────────────────────────────────────────────┐
//│ PRIVATE STATE
//└────────────────────────────────────────────────────────────────────────────┘
// ● listeners ● queue ● suspended {{{
let listeners = Object.create( null ); // e_type -> Set<handler>
let     queue = [];
let suspended = false;
//}}}
//┌────────────────────────────────────────────────────────────────────────────┐
//│ PRIVATE HELPERS
//└────────────────────────────────────────────────────────────────────────────┘
/*_ notify_event {{{*/
let session_time = performance.now();      // SESSION START-TIME
let notify_event = function(e_type, details)
{
//{{{
let caller = "notify_event("+e_type+")";
if(tag_this) log(MODULE+caller, lbB+lf4);
//}}}
    let set = listeners[e_type];
    if(!set) {
        log("❌ NO LISTENERS TO NOTIFY FOR: %c e_type=["+e_type+"]", LBB,lb0+lf2);
        return;
    }

    //┌────────────────────────────────────────────────────────────────────────────┐
    //│ copy so handlers can unsubscribe while iterating
    //└────────────────────────────────────────────────────────────────────────────┘
    let notifications = 0;
    for(let fn of [...set]) {
        try {
            let ts = (performance.now() - session_time).toFixed();
            fn({ ...details, ts });
            notifications += 1;
if(tag_this) log("%c ✅ NOTIFICATIONS #"+notifications +" SENT for %c "+e_type, LBB, lb0+lf4);
        } catch (err) {
            console.error(`[bus] handler failed for "${e_type}"`, err);
        }
    }
if(tag_this) log("%c"+((notifications && ("✅ NOTIFICATIONS #"+notifications)) || "❌ NO NOTIFICATION")+" SENT", LBB+lfX[notifications ? 4:2]);
};
/*}}}*/
/*_ log_listeners {{{*/
let log_listeners = function()
{
    Object.keys( listeners ).forEach((e_type) => {
        log(" ● %c "+ e_type +" %c x"+ listeners[e_type].size +" listeners", LBB,lf5);

        listeners[e_type].forEach((handler) => {
            log("......handler: "+ (handler.name || "anonymous"));
        });
    });

    log("..."+ (queue.length || "No") +" pending notifications");
    queue.forEach((q) => {
        log("...%c "+q.e_type+" %c "+(q.details ? JSON.stringify(q.details) : ""), LBB,lf6);
    });

};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ PUBLIC API ● MODULES INTERFACE
//└────────────────────────────────────────────────────────────────────────────┘
/*● TOPICS  ● The vocabulary {{{*/
let TOPICS = {
    MODEL_TO_VIEW        : {
        DATA_LOADED      : "DATA_LOADED"
    },
    VIEW_TO_CONTROLER    : {
        INPUT_CHANGED    : "INPUT_CHANGED" ,
        SAVE_CLICKED     : "SAVE_CLICKED"  ,
        EDIT_CANCELED    : "EDIT_CANCELED"
    },
    CONTROLLER_TO_MODEL  : {
        DATA_PATCHED     : "DATA_PATCHED",
        SM_STATE_CHANGED : "SM_STATE_CHANGED"
    }
};
/*}}}*/
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
    (listeners[e_type] || (listeners[e_type] = new Set()))
        .add( handler );
if(tag_this) log_listeners();

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Return an unsubscribe function
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
        log("❌ NO LISTENERS TO DELETE FOR: %c e_type=["+e_type+"]", LBB,lb0+lf2);
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
    let off = Bus.on(e_type, (e) => { off(); handler(e); });
    return off;
};
/*}}}*/
/*● emit    ● Publish {{{*/
let emit = function(e_type, details = {})
{
//{{{
let caller = "emit( "+e_type+")";
if(tag_this) log(MODULE+caller+"%c "+(  details ? JSON.stringify(  details) : ""), LBB+lf4, lb0+lf5);
//}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ While suspended, events are queued...
    //└────────────────────────────────────────────────────────────────────────┘
    if( suspended )
    {
        queue.push([e_type, details]);

if(tag_this) log("%c While SUSPENDED, events are queued: "+ queue.length +" pending notifications", LBB+lb2);
        return;
    }
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ...and flushed on resume
    //└────────────────────────────────────────────────────────────────────────┘
    notify_event(e_type, details);
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
    suspended = true;
if(tag_this) log("..."+ (queue.length || "No") +" pending notifications");
};
/*}}}*/
/*● resume  ● Queued events {{{*/
let resume = function()
{
//{{{
let caller = "resume";
if(tag_this) log(MODULE+caller+": "+ queue.length +" pending notifications"                       , LBB+lf4, lb0);
if(tag_this) log("%c QUEUED events notification resumed: "+ queue.length +" pending notifications", LBB+lf5);
//}}}
    suspended = false;

    while( queue.length )
    {
        let [t, d] = queue.shift();
        notify_event(t, d);
    }
};
/*}}}*/
/*● clear   ● Testing helper {{{*/
let clear = function()
{
//{{{
let caller = "clear: "+listeners.length+" listeners ● queue length: "+queue.length;
if(tag_this) log(MODULE+caller, lbB+lb0+lf4);
//}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Testing helper: wipe all subscriptions
    //└────────────────────────────────────────────────────────────────────────┘
    for(let k of Object.keys(listeners)) delete listeners[k];
    queue.length = 0;

    suspended = false;

    session_time = performance.now();      // SESSION START-TIME
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ TEST
//└────────────────────────────────────────────────────────────────────────────┘
/*_ test {{{*/
/* eslint-disable no-useless-assignment */
let test = async function(logging = false) {
// log ● TEST PAYLOAD {{{
let caller = "test";
log(MODULE+caller, lbB+lb0+lf4);

if(logging) js_log.logging( true,"BUS");

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

    let fn     = (payload) => console.log("\t⏩ fn("+(payload ? JSON.stringify(payload) : "")+")");
    let off;
    let p_num  = 0;

    Bus.clear();
//}}}
    log("%c ADD ONCE ● NOTIFY:", LBB); //{{{
    await js_log.sleep(1000);
    log("%c ADD ONCE:", lb0); off = Bus.once   (E_TYPE, fn);
    log("%c NOTIFY:"  , lb0);       Bus.emit   (E_TYPE, { payload: PAYLOAD[++p_num % 10] });

    //}}}
    log("%c ADD ● NOTIFY ● OFF:", LBB); //{{{
    await js_log.sleep(1000);
    log("%c ADD:"     , lb0); off = Bus.on     (E_TYPE, fn);
    log("%c NOTIFY:"  , lb0);       Bus.emit   (E_TYPE, { payload: PAYLOAD[++p_num % 10] });
    log("%c NOTIFY:"  , lb0);       Bus.emit   (E_TYPE, { payload: PAYLOAD[++p_num % 10] });
    log("%c NOTIFY:"  , lb0);       Bus.emit   (E_TYPE, { payload: PAYLOAD[++p_num % 10] });
    log("%c OFF:"     , lb0); off();
    //}}}
    log("%c ADD ● NOTIFY ● SUSPEND ● NOTIFY ● OFF:", LBB); //{{{
    await js_log.sleep(1000);
    log("%c ADD:"     , lb0); off = Bus.on     (E_TYPE, fn);
    log("%c NOTIFY:"  , lb0);       Bus.emit   (E_TYPE, { payload: PAYLOAD[++p_num % 10] });
    log("%c SUSPEND:" , lb0);       Bus.suspend();
    log("%c NOTIFY:"  , lb0);       Bus.emit   (E_TYPE, { payload: PAYLOAD[++p_num % 10] });
    log("%c NOTIFY:"  , lb0);       Bus.emit   (E_TYPE, { payload: PAYLOAD[++p_num % 10] });
    log("%c RESUME:"  , lb0);       Bus.resume();
    log("%c OFF:"     , lb0); off();
    //}}}
// log {{{
if(logging) js_log.logging(false,"BUS");
//}}}
};
/* eslint-enable  no-useless-assignment */
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ return
//└────────────────────────────────────────────────────────────────────────────┘
/*● return {{{*/
return { TOPICS
    ,    on
    ,    once
    ,    emit

    ,    suspend
    ,    resume

    ,    clear
    ,    test

    // DEBUG
    , listeners : () => listeners
};
//}}}
})();
export { Bus         }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . Bus   = Bus  ; /* exposed to inline onclick handlers */

