//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_CNTRL.js        ● $APROJECTS/LANServer/SERVER     ● _TAG (261113:19h:29)
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
/* globals  js_BUS    */

import { js_MODEL   } from "./js_MODEL.js"
import { js_VIEW    } from "./js_VIEW.js"
//port { js_CNTRL   } from "./js_CNTRL.js"
import { js_BUS     } from "./js_BUS.js"
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
const js_CNTRL     = (function() {
// INTERN log {{{
/* eslint-disable no-unused-vars */
const MODULE = "%c⭐🟣 CNTRL\t\t● ";
let log_this = false;
let tag_this = false || log_this;

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
// INTERN js_BUS {{{
const EVENT1_SELECT_NOTE   = js_BUS.EVENT1_SELECT_NOTE;
const EVENT2_SAVE_NOTE     = js_BUS.EVENT2_SAVE_NOTE;   /* eslint-disable-line no-unused-vars */ //TODO
const EVENT3_DELETE_NOTE   = js_BUS.EVENT3_DELETE_NOTE; /* eslint-disable-line no-unused-vars */ //TODO
const EVENT4_CANCEL        = js_BUS.EVENT4_CANCEL;      /* eslint-disable-line no-unused-vars */ //TODO
//}}}
/*● onload {{{*/
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
let onload = function(e)
{
js_log.load_logging_modules();
let caller = "onload";
if(tag_this) log(MODULE+caller, lbB+lf3);
    requestAnimationFrame(() => js_boxing   .onload(e));
    requestAnimationFrame(() => js_details  .onload(e));
    requestAnimationFrame(() => js_linkify  .onload(e));
    requestAnimationFrame(() => js_folds    .onload(e));
    requestAnimationFrame(() => js_VIEW     .onload(e));

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ● SERVER/scripts/js_BUS.js
    //│ ● SERVER/scripts/js_CNTRL.js
    //│ ● SERVER/scripts/js_VIEW.js
    //└────────────────────────────────────────────────────────────────────────┘
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ● FROM:
    //│  scripts/js_VIEW.js .bindEvents()
    //│
    //│ ● INSTEAD OF A DIRECT CALL TO scripts/js_CNTRL.js:
    //│   js_CNTRL.transition("EVENT1_SELECT_NOTE", { id: noteId, content });
    //│
    //│ ● LISTEN TO scripts/js_BUS.js:
    //│   js_BUS.emit(        "EVENT1_SELECT_NOTE", { id: noteId, content });
    //│
    //└────────────────────────────────────────────────────────────────────────┘
  //js_BUS.on(       EVENT1_SELECT_NOTE, (payload) => transition(EVENT1_SELECT_NOTE, payload) ); // transition = function(actionName, payload)
    js_BUS.on(js_BUS.EVENT1_SELECT_NOTE, (payload) => transition(EVENT1_SELECT_NOTE, payload) ); // transition = function(actionName, payload)
};
/*}}}*/
//┌────────────────────────────────────────────────────────────────────────────┐
//│ STATE 🟤🔴🟠🟡
//└────────────────────────────────────────────────────────────────────────────┘
//{{{
const STATE1_IDLE        = "STATE1_IDLE";
const STATE2_EDITING     = "STATE2_EDITING";
const STATE3_SAVING      = "STATE3_SAVING";
const STATE4_DELETING    = "STATE4_DELETING";
//}}}
//┌────────────────────────────────────────────────────────────────────────────┐
//│ TRANSITION
//└────────────────────────────────────────────────────────────────────────────┘
// SM_STATE1_IDLE       = { EVENT1_SELECT_NOTE() ● EVENT2_SAVE_NOTE() ● EVENT3_DELETE_NOTE() } {{{
const SM_STATE1_IDLE    = {
    // 🟠 EVENT1_SELECT_NOTE  ➔ [STATE2_EDITING  ] {{{
    EVENT1_SELECT_NOTE: (payload) => {
// log {{{
let caller = "SM_STATE1_IDLE ON: EVENT1_SELECT_NOTE";
if(log_this) log(MODULE+caller, lbB+lf3);
if(log_this) log("%c● payload.....:\t%c["+ ellipsis(JSON.stringify(payload)) +"]", lf3,lb1);
//}}}
        changeState(STATE2_EDITING, payload);
    },
    //}}}
    // 🟠 EVENT2_SAVE_NOTE  ➔ [STATE3_SAVING   ] ➔ await ➔ [STATE1_IDLE] {{{
    EVENT2_SAVE_NOTE: async (payload) => {
// log {{{
let caller = "SM_STATE1_IDLE ON: EVENT2_SAVE_NOTE";
if(tag_this) log(MODULE+caller, lbB+lf3);
if(log_this) log("%c● payload.....:\t%c["+ JSON.stringify(payload)   +"]", lf3,lb1);
//}}}
        changeState(STATE3_SAVING);
        let savedNote = await   js_MODEL.save( payload );
        changeState(STATE1_IDLE, savedNote);
    },
    //}}}
    // 🟠 EVENT3_DELETE_NOTE  ➔ [STATE4_DELETING ] ➔ await ➔ [STATE1_IDLE] {{{
    EVENT3_DELETE_NOTE: async (noteId) => {
// log {{{
let caller = "SM_STATE1_IDLE ON: EVENT3_DELETE_NOTE";
if(tag_this) log(MODULE+caller, lbB+lf3);
if(log_this) log("%c● noteId......:\t%c["+ noteId                    +"]", lf3,lb1);
//}}}
        changeState(STATE4_DELETING, noteId);
        /*...........*/ await   js_MODEL.remove( noteId );
        changeState(STATE1_IDLE);
    }
    //}}}
};
//}}}
/* SM_STATE2_EDITING    = { EVENT1_SELECT_NOTE() ● EVENT2_SAVE_NOTE() ● EVENT3_DELETE_NOTE() ● EVENT4_CANCEL() } {{{*/
const SM_STATE2_EDITING = {
    // 🟠 EVENT1_SELECT_NOTE  ➔ [STATE2_EDITING  ] ... possibly same or other notes_table entry {{{
    EVENT1_SELECT_NOTE: (payload) => {
// log {{{
let caller = "SM_STATE2_EDITING ON: EVENT1_SELECT_NOTE";
if(tag_this) log(MODULE+caller, lbB+lf3);
if(log_this) log("%c● payload.....:\t%c["+ JSON.stringify(payload)   +"]", lf3,lb1);
//}}}
        let              index  = get_editing_note_index();
        let canceling = (index == parseInt( payload.id ));
        if( canceling ) {
            changeState(STATE1_IDLE);
        }
        else {
            changeState(STATE2_EDITING, payload);
        }
    },
    //}}}
    // 🟠 EVENT2_SAVE_NOTE  ➔ [STATE3_SAVING   ] ➔ await ➔ [STATE1_IDLE] {{{
    EVENT2_SAVE_NOTE: async (payload) => {
// log {{{
let caller = "SM_STATE2_EDITING ON: EVENT2_SAVE_NOTE";
if(tag_this) log(MODULE+caller, lbB+lf3);
if(log_this) log("%c● payload.....:\t%c["+ JSON.stringify(payload)   +"]", lf3,lb1);
//}}}
        changeState(STATE3_SAVING, payload);
        let                 savedNote = await   js_MODEL.save( payload );
        changeState(STATE1_IDLE, savedNote);
    },
    //}}}
    // 🟠 EVENT3_DELETE_NOTE  ➔ [STATE3_SAVING   ] ➔ await ➔ [STATE1_IDLE] {{{
    EVENT3_DELETE_NOTE: async (noteId) => {
// log {{{
let caller = "SM_STATE2_EDITING ON: EVENT3_DELETE_NOTE";
if(tag_this) log(MODULE+caller, lbB+lf3);
if(log_this) log("%c● noteId......:\t%c["+ noteId                    +"]", lf3,lb1);
//}}}
        changeState(STATE4_DELETING, noteId);
        /*...........................*/ await   js_MODEL.remove( noteId );
        changeState(STATE1_IDLE    );
    },
    //}}}
    // 🟠 EVENT4_CANCEL  ➔ ....................➔ [STATE1_IDLE] {{{
    EVENT4_CANCEL: () => {
// log {{{
let caller = "SM_STATE2_EDITING ON: EVENT4_CANCEL";
if(tag_this) log(MODULE+caller, lbB+lf3);
//}}}
        changeState(STATE1_IDLE);
    }
    //}}}
};
/*}}}*/
// SM_STATE3_SAVING()   ➔ [STATE1_IDLE] {{{
const SM_STATE3_SAVING = () => {
// log {{{
let caller = "SM_STATE3_SAVING";
if(tag_this) log(MODULE+caller, lbB+lf3);
//}}}
    // Lock actions during network/persistence calls
    changeState(STATE1_IDLE);
};
//}}}
// SM_STATE4_DELETING() ➔ [STATE1_IDLE] {{{
const SM_STATE4_DELETING = () => {
// log {{{
let caller = "SM_STATE4_DELETING";
if(tag_this) log(MODULE+caller, lbB+lf3);
//}}}
    // Lock actions during network/persistence calls
};
//}}}
// SM_STATES {{{
const SM_STATES
    = {   STATE1_IDLE    : SM_STATE1_IDLE
        , STATE2_EDITING : SM_STATE2_EDITING
        , STATE3_SAVING  : SM_STATE3_SAVING
        , STATE4_DELETING: SM_STATE4_DELETING
    };

let cntrlStateKey  = STATE1_IDLE;

let get_state_num = function(state)
{
  //return 1+ Object.values( SM_STATES ).indexOf( state ); // return 0 when not found
    return 1+ Object.keys  ( SM_STATES ).indexOf( state ); // return 0 when not found
};
//}}}
//┌────────────────────────────────────────────────────────────────────────────┐
//│ LISTENER
//└────────────────────────────────────────────────────────────────────────────┘
// subscribe {{{
//┌────────────────────────────────────────────────────────────────────────┐
//│ Registers a listener callback to be called whenever state changes
//│
//│ @param {Function} listenerFn - Callback: (state, payload) => void
//└────────────────────────────────────────────────────────────────────────┘
let listeners = [];
let subscribe = function(module_name, listenerFn)
{
if(tag_this) js_log.trace(); // 🟤🔴🟠🟡🟢🔵🟣⚫⚪️◯
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
    //│ Immediately notify listener of current controler state upon subscription
    //└────────────────────────────────────────────────────────────────────┘
    if( log_this ) log("%c notifying listener", lf3);
    listenerFn(cntrlStateKey, null);

};
//}}}
// transition {{{
//┌────────────────────────────────────────────────────────────────────────┐
//│ INTENT TO TRIGGER A TRANSITION BASED ON A USER ACTION
//│ @param {string} actionName
//│ @param    {any} payload
//└────────────────────────────────────────────────────────────────────────┘
let transition = function(actionName, payload)
{
//(tag_this) js_log.trace(); // 🟤🔴🟠🟡🟢🔵🟣⚫⚪️◯
    let stateRules    = SM_STATES [ cntrlStateKey ];
    let actionHandler = stateRules[ actionName    ];
//{{{
let caller = "transition";
//(tag_this) console_clear("CNTRL."+caller);
if(log_this) log(MODULE+   caller+": %c FROM: "+           cntrlStateKey +"%c ON: "+js_log.stringify(actionName)
                 ,lbB+lf3           ,lbB+lbX[get_state_num(cntrlStateKey)] ,lbB);
if(log_this) {
    log("%c● called_by.:\t%c" + get_src_link()                                                           , lf3,lb0);
    log("%c● actionName:\t%c["+ actionName                        +"]"                                   , lf3,lb1);
    log("%c● payload...:\t%c["+ ellipsis(JSON.stringify(payload)) +"]"                                   , lf3,lb3);
    log("%c"+("                 cntrlStateKey"    ).padStart(32) +"%c"+             cntrlStateKey        , lf3,lb8);
    log("%c"+(" STATE_TRANS["+  cntrlStateKey +"]").padStart(32) +"%c"+ SM_STATES [ cntrlStateKey ]?.name, lf3,lb8);
    log("%c"+("  stateRules["+  actionName    +"]").padStart(32) +"%c"+ stateRules[ actionName    ]?.name, lf3,lb8);
    log("%c"+("                 actionHandler"    ).padStart(32) +"%c"+             actionHandler  ?.name, lf3,lb8);
}
//}}}

    if(typeof actionHandler === "function")
    {
        actionHandler( payload );
    }
    else {
        log(`%c Action "${actionName}" is invalid in state "${cntrlStateKey}".`, lbB+lb2);
    }
};
//}}}
// changeState {{{
//┌────────────────────────────────────────────────────────────────────────┐
//│ HELPER TO SAFELY TRANSITION AND NOTIFY SUBSCRIBERS
//└────────────────────────────────────────────────────────────────────────┘
let changeState = function(newState, data = null) {
// log {{{
let caller = "changeState";
if(tag_this) log(MODULE+caller+"%c from "+cntrlStateKey+"%c to "+newState, lbB+lf3, lbB+lbX[get_state_num(cntrlStateKey)], lbB+lbX[get_state_num(newState)]);
if(log_this) {
    log("%c● called_by....:\t%c" + get_src_link()                     , lf3,lb0);
    log("%c● cntrlStateKey:\t%c["+ cntrlStateKey                  +"]", lf3,lb1);
    log("%c● data.........:\t%c["+ ellipsis(JSON.stringify(data)) +"]", lf3,lb3);
    log("%c● newState.....:\t%c["+ newState                       +"]", lb3,lb2);
}
//}}}
    cntrlStateKey = newState;

    listeners.forEach((listener) => listener( cntrlStateKey , data)  ); // CONTROLER     direct bindings
    js_BUS                             .emit( cntrlStateKey , data   ); //       BUS on message bindings
    js_BUS.emit(js_BUS.CNTRL_STATE_CHANGED, { cntrlStateKey , data } ); //FIXME
};
//}}}
//┌────────────────────────────────────────────────────────────────────────────┐
//│ PRIVATE
//└────────────────────────────────────────────────────────────────────────────┘
/* set_editing_note_index {{{*/
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
/*  get_editing_note_index {{{*/
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
//│ PUBLIC
//└────────────────────────────────────────────────────────────────────────────┘
// return {{{
return { subscribe
    ,    transition

    ,    STATE1_IDLE
    ,    STATE2_EDITING
    ,    STATE3_SAVING
    ,    STATE4_DELETING

    // MVC MIGRATION
//  , SM_STATES
    , onload
    , get_editing_note_index
    , set_editing_note_index
    , get_state_num
};
//}}}
})();
/* TLDR {{{
### KEY TAKEAWAYS FROM THIS IMPLEMENTATION:

//┌────────────────────────────────────────────────────────────────────────────┐
//│
//│ 1. **State Isolation**:
//│    Actions in transient states (`STATE3_SAVING`, `STATE4_DELETING`)
//│    are omitted in the lookup table.
//│    Any user clicks arriving while in these states
//│    are automatically **ignored**
//│
//│ 2. **Predictable Flow**:
//│    The state machine directly
//│    manages the async boundary with `js_MODEL`, then cleanly
//│    transitions back to `STATE1_IDLE` before updating listeners.
//└────────────────────────────────────────────────────────────────────────────┘

}}}*/
export { js_CNTRL }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_CNTRL = js_CNTRL;
//┌────────────────────────────────────────────────────────────────────────────┐
//│ PAGE LOAD BOOTSTRAP
//└────────────────────────────────────────────────────────────────────────────┘
document.addEventListener("DOMContentLoaded", js_CNTRL.onload);
