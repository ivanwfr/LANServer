//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_CNTRL.js        ● $APROJECTS/LANServer/SERVER     ● _TAG (261108:16h:07)
//├────────────────────────────────────────────────────────────────────────────┤
//│{{{
//│ Here is a minimal, clutter-free implementation of                          │
//│ a State Machine using an **IIFE** pattern:                                 │
//│                                                                            │
//│ It uses a finite state machine table where each                            │
//│ state defines allowed transitions, target next states,                     │
//│ and optional async side-effects (like calls to `js_MODEL` or `GUI`)        │
//│}}}
//└────────────────────────────────────────────────────────────────────────────┘
// IMPORT {{{

/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */
/* eslint-disable dot-notation */

/* globals  js_log    */

/* globals js_boxing  */
/* globals js_md      */
/* globals js_linkify */
/* globals js_details */
/* globals js_folds   */

/* globals  js_MODEL  */
/* globals  js_VIEW   */
/* exported js_CNTRL  */

//port { js_CNTRL   } from "./js_CNTRL.js"
import { js_MODEL   } from "./js_MODEL.js"
import { js_VIEW    } from "./js_VIEW.js"
import { js_boxing  } from "./js_boxing.js"
import { js_md      } from "./js_md.js"
import { js_folds   } from "./js_folds.js"
//port { js_input   } from "./js_input.js"
import { js_linkify } from "./js_linkify.js"
import { js_details } from "./js_details.js"
import { js_log     } from "./js_log.js"
//port { js_notes   } from "./js_notes.js"
//port { js_store   } from "./js_store.js"
//port { js_ticker  } from "./js_ticker.js"
//port { js_xpath   } from "./js_xpath.js"
//port { notes      } from "./notes.js"

//}}}
const js_CNTRL     = (function()
{
//┌────────────────────────────────────────────────────────────────────────────┐
//│ ◯  INTERNING ● SERVER/scripts/js_log.js
//└────────────────────────────────────────────────────────────────────────────┘
const MODULE = "%c⭐🟣 CNTRL\t\t● ";
let log_this = false;
let tag_this = false || log_this;
//{{{
/* eslint-disable no-unused-vars */

js_log.register( { module_name : "js_CNTRL"
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

/* eslint-enable  no-unused-vars */
//}}}

//┌────────────────────────────────────────────────────────────────────────────┐
//│ LOAD-TIME SINGLE POINT **DOM-RESHAPING** SCRIPT CALL ORDER
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{
 | ONLOAD ORDER       | RESHAPING THE DOM        |
 |--------------------|--------------------------|
 |1 🟤 **js_CNTRL**   | ONLOAD ORDER             |
 |2 🟠 **js_boxing**  | *TEXT*      to *BOX*     |
 |3 🔴 **js_details** | *VIM_FOLDS* to *DETAILS* |
 |4 🟡 **js_linkify** | *URL*       to *HTML*    |
 |5 🟢 **js_folds**   | open-close   DETAILS     |
 |6 🔵 **js_VIEW**    | *MVC* State Machine      |
}}}*/
/*_ onload {{{*/
let onload = function(e)
{
let caller = "onload";
if(tag_this) log(MODULE+caller, lbB+lf3);
    requestAnimationFrame(() => js_boxing   .onload(e));
    requestAnimationFrame(() => js_details  .onload(e));
    requestAnimationFrame(() => js_linkify  .onload(e));
    requestAnimationFrame(() => js_folds    .onload(e));
    requestAnimationFrame(() => js_VIEW     .onload(e));
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ PRIVATE
//└────────────────────────────────────────────────────────────────────────────┘
//  currentState listeners {{{
//┌────────────────────────────────────────────────────────────────────────┐
//│ INTERNAL STATE
//└────────────────────────────────────────────────────────────────────────┘
const SM_STATES = [
  "BADSTATE"    // 0
, "IDLE"        // 1
, "EDITING"     // 2
, "SAVE_NOTE"   // 3
, "SAVING"      // 4
, "SELECT_NOTE" // 5
, "DELETE_NOTE" // 6
, "DELETING"    // 7
, "CANCEL"      // 8
];
let get_state_num = function(state)
{
    return 1+ SM_STATES.indexOf(state); // 0 when not found
};

let currentState = "IDLE";
let listeners = [];
//}}}
// changeState {{{
//┌────────────────────────────────────────────────────────────────────────┐
//│ HELPER TO SAFELY TRANSITION AND NOTIFY SUBSCRIBERS
//└────────────────────────────────────────────────────────────────────────┘
let changeState = function(newState, data = null) {
// log {{{
let caller = "changeState";
if(tag_this) log(MODULE+caller+"%c from "+currentState+"%c to "+newState, lbB+lf3, lbB+lbX[get_state_num(currentState)], lbB+lbX[get_state_num(newState)]);
if(log_this) {
    log("%c● called_by...:\t%c" +   get_src_link()                   , lf3,lb0);
    log("%c● currentState:\t%c["+ currentState                   +"]", lf3,lb1);
    log("%c● data........:\t%c["+ ellipsis(JSON.stringify(data)) +"]", lf3,lb3);
    log("%c● newState....:\t%c["+ newState                       +"]", lb3,lb2);
}
//}}}
    currentState = newState;

    listeners.forEach((listener) => listener(currentState, data));
};
//}}}

//┌────────────────────────────────────────────────────────────────────────────┐
//│ TRANSITIONS
//└────────────────────────────────────────────────────────────────────────────┘
// TRANSITION TABLE {{{
//┌────────────────────────────────────────────────────────────────────────┐
//│ ●  Current State
//│ ●  Action
//│ ●  Next State / Action Handler
//└────────────────────────────────────────────────────────────────────────┘
// IDLE     = { SELECT_NOTE() ● SAVE_NOTE() ● DELETE_NOTE() } {{{
const IDLE = {
    // 🟠 SELECT_NOTE   ➔ [EDITING  ] {{{
    SELECT_NOTE: (payload) => {
// log {{{
let caller = "IDLE ● SELECT_NOTE";
if(tag_this) log(MODULE+caller, lbB+lf3);
if(log_this) log("%c● payload.....:\t%c["+ ellipsis(JSON.stringify(payload)) +"]", lf3,lb1);
//}}}
        changeState("EDITING", payload);
    },
    //}}}
    // 🟠 SAVE_NOTE     ➔ [SAVING   ] ➔ await ➔ [IDLE] {{{
    SAVE_NOTE: async (payload) => {
// log {{{
let caller = "IDLE ● SAVE_NOTE";
if(tag_this) log(MODULE+caller, lbB+lf3);
if(log_this) log("%c● payload.....:\t%c["+ JSON.stringify(payload)   +"]", lf3,lb1);
//}}}
        changeState("SAVING"  );
        const               savedNote = await   js_MODEL.save(payload);
        changeState("IDLE", savedNote);
    },
    //}}}
    // 🟠 DELETE_NOTE   ➔ [DELETING ] ➔ await ➔ [IDLE] {{{
    DELETE_NOTE: async (noteId) => {
// log {{{
let caller = "IDLE ● DELETE_NOTE";
if(tag_this) log(MODULE+caller, lbB+lf3);
if(log_this) log("%c● noteId......:\t%c["+ noteId                    +"]", lf3,lb1);
//}}}
        changeState("DELETING", noteId);
        /*...........................*/ await   js_MODEL.remove( noteId );
        changeState("IDLE"    );
    }
    //}}}
};
//}}}
/* EDITING  = { SELECT_NOTE() ● SAVE_NOTE() ● DELETE_NOTE() ● CANCEL() } {{{*/
const EDITING = {
    // 🟠 SELECT_NOTE   ➔ [EDITING  ] ... possibly same or other notes_table entry {{{
    SELECT_NOTE: (payload) => {
// log {{{
let caller = "IDLE ● SELECT_NOTE";
if(tag_this) log(MODULE+caller, lbB+lf3);
if(log_this) log("%c● payload.....:\t%c["+ JSON.stringify(payload)   +"]", lf3,lb1);
//}}}
        let              index  = get_editing_note_index();
        let canceling = (index == parseInt( payload.id ));
        if( canceling ) {
            changeState("IDLE");
        }
        else {
            changeState("EDITING", payload);
        }
    },
    //}}}
    // 🟠 SAVE_NOTE     ➔ [SAVING   ] ➔ await ➔ [IDLE] {{{
    SAVE_NOTE: async (payload) => {
// log {{{
let caller = "EDITING ● SAVE_NOTE";
if(tag_this) log(MODULE+caller, lbB+lf3);
if(log_this) log("%c● payload.....:\t%c["+ JSON.stringify(payload)   +"]", lf3,lb1);
//}}}
        changeState("SAVING", payload);
        const               savedNote = await   js_MODEL.save( payload );
        changeState("IDLE", savedNote);
    },
    //}}}
    // 🟠 DELETE_NOTE   ➔ [SAVING   ] ➔ await ➔ [IDLE] {{{
    DELETE_NOTE: async (noteId) => {
// log {{{
let caller = "EDITING ● DELETE_NOTE";
if(tag_this) log(MODULE+caller, lbB+lf3);
if(log_this) log("%c● noteId......:\t%c["+ noteId                    +"]", lf3,lb1);
//}}}
        changeState("DELETING", noteId);
        /*...........................*/ await   js_MODEL.remove( noteId );
        changeState("IDLE"    );
    },
    //}}}
    // 🟠 CANCEL        ➔ ....................➔ [IDLE] {{{
    CANCEL: () => {
// log {{{
let caller = "EDITING ● CANCEL";
if(tag_this) log(MODULE+caller, lbB+lf3);
//}}}
        changeState("IDLE");
    }
    //}}}
};
/*}}}*/
// SAVING()         ➔ ....................➔ [IDLE] {{{
const SAVING = () => {
// log {{{
let caller = "SAVING";
if(tag_this) log(MODULE+caller, lbB+lf3);
//}}}
    // Lock actions during network/persistence calls
    changeState("IDLE");
};
//}}}
// DELETING()       ➔ ....................➔ [IDLE] {{{
const DELETING = () => {
// log {{{
let caller = "DELETING";
if(tag_this) log(MODULE+caller, lbB+lf3);
//}}}
    // Lock actions during network/persistence calls
};
//}}}
const TRANSITIONS = {
    IDLE,
    EDITING,
    SAVING,
    DELETING
};
//}}}

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🟤  M V C🚧 REFACTORING ZONE ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
//└────────────────────────────────────────────────────────────────────────────┘
/*_ set_editing_note_index {{{*/
//{{{
let     noteId_cache;
//}}}
let set_editing_note_index = function(noteId)
{
let caller = "set_editing_note_index";

if(noteId != noteId_cache) {
if(log_this) log(MODULE+caller+"(noteId "+noteId+")", lbB+lf3);
    noteId_cache = noteId;
}
    js_details.set_editing_note_index( noteId );
};
/*}}}*/
/*_ get_editing_note_index {{{*/
let get_editing_note_index = function()
{
let caller = "get_editing_note_index";

    let noteId = js_details.get_editing_note_index();

if(noteId != noteId_cache) {
if(log_this) log(MODULE+caller+"(noteId "+noteId+")", lbB+lf3);
    noteId_cache = noteId;
}
    return noteId;
};
/*}}}*/
//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🟤  M V C🚧 REFACTORING ZONE ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
//└────────────────────────────────────────────────────────────────────────────┘
// subscribe {{{
//┌────────────────────────────────────────────────────────────────────────┐
//│ Registers a listener callback to be called whenever state changes
//│
//│ @param {Function} listenerFn - Callback: (state, payload) => void
//└────────────────────────────────────────────────────────────────────────┘
let subscribe = function(module_name, listenerFn)
{
// log {{{
let caller = "subscribe";
if(tag_this) log(MODULE+caller+"( "+module_name+" )", lbB+lf3);
if(log_this) log("%c● listenerFn.\t%c["+ listenerFn.name +"]", lf3,lb1);
//}}}

    //┌────────────────────────────────────────────────────────────────────┐
    //│ REGISTER
    //└────────────────────────────────────────────────────────────────────┘
    listeners.push( listenerFn );

    //┌────────────────────────────────────────────────────────────────────┐
    //│ NOTIFY
    //│ Immediately notify listener of current state upon subscription
    //└────────────────────────────────────────────────────────────────────┘
    if( log_this ) log("%c notifying listener", lf3);
    listenerFn(currentState, null);

};
//}}}
// transition {{{
//┌────────────────────────────────────────────────────────────────────────┐
//│ Attempts to trigger a transition based on user intent/action
//│
//│ @param {string} actionName - e.g., "SAVE_NOTE", "SELECT_NOTE"
//│ @param {any} payload - Optional payload (e.g., note content or ID)
//└────────────────────────────────────────────────────────────────────────┘
let transition = function(actionName, payload)
{
    const stateRules    = TRANSITIONS[ currentState ];
    const actionHandler = stateRules [ actionName   ];
//{{{
let caller = "transition";
if(tag_this) console_clear("CNTRL."+caller);
if(tag_this) log(MODULE+   caller+"%c from "+currentState+"%c actionName "+actionName, lbB+lf3, lbB+lbX[get_state_num(currentState)], lbB);
if(tag_this) log(MODULE+caller, lbB+lf3);
if(log_this) {
    log("%c● called_by.:\t%c" +   get_src_link()                                                        , lf3,lb0);
    log("%c● actionName:\t%c["+   actionName                +"]"                                        , lf3,lb1);
    log("%c● payload...:\t%c["+   ellipsis(JSON.stringify(payload))  +"]"                               , lf3,lb3);
    log("%c"+("                  currentState  " ).padStart(32) +"%c"+              currentState        , lf3,lb8);
    log("%c"+(" TRANSITIONS["+ currentState +"] ").padStart(32) +"%c"+ TRANSITIONS[ currentState ]?.name, lf3,lb8);
    log("%c"+("  stateRules["+ actionName   +"] ").padStart(32) +"%c"+ stateRules [ actionName   ]?.name, lf3,lb8);
    log("%c"+("                 actionHandler  " ).padStart(32) +"%c"+              actionHandler ?.name, lf3,lb8);
}
//}}}

    if(typeof actionHandler === "function")
    {
        actionHandler( payload );
    }
    else {
        log(`%c Action "${actionName}" is invalid in state "${currentState}".`, lbB+lb2);
    }
};
//}}}
// getState {{{
//┌────────────────────────────────────────────────────────────────────────┐
//│ Returns current state string
//└────────────────────────────────────────────────────────────────────────┘
let getState = function()
{
// log {{{
let caller = "getState";
if(tag_this) log(MODULE+caller, lbB+lf3);
if(log_this) log("%c● currentState.\t%c["+ currentState              +"]", lb3,lb1);
//}}}
    return currentState;
};
//}}}
// return subscribe transition getState {{{
return { subscribe
    ,    transition
    ,    getState
    // MVC MIGRATION
    , onload
    , get_editing_note_index
    , set_editing_note_index
    // DEBUG
    ,  TRANSITIONS
};
//}}}

})();

/* TLDR {{{
### KEY TAKEAWAYS FROM THIS IMPLEMENTATION:

//┌────────────────────────────────────────────────────────────────────────────┐
//│
//│ 1. **State Isolation**: Actions in transient states
//│    (`SAVING`, `DELETING`) are omitted in the lookup table.
//│    Any user clicks arriving while in these states
//│    are automatically **ignored**
//│
//│ 2. **Predictable Flow**: The state machine directly
//│    manages the async boundary with `js_MODEL`, then cleanly
//│    transitions back to `IDLE` before updating listeners.
//└────────────────────────────────────────────────────────────────────────────┘

}}}*/
export { js_CNTRL }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_CNTRL = js_CNTRL;
document.addEventListener("DOMContentLoaded", js_CNTRL.onload);
