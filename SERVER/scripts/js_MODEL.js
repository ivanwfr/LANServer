//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_MODEL.js      ● $APROJECTS/LANServer/SERVER      ● _TAG (261109:21h:22) │
//├────────────────────────────────────────────────────────────────────────────┤
//│{{{
//| SKELETON FOR SERVER/scripts/notes.js
//│}}}
//└────────────────────────────────────────────────────────────────────────────┘
// IMPORT {{{

/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */

/* globals  js_log    */
                         //┌─────────────┐
/* exported js_MODEL  */ //│ ● Model     │
/* -------- js_VIEW   */ //│ - View      │
/* globals  js_CNTRL  */ //│ - Controler │
                         //└─────────────┘
/* globals    notes   */
/* globals js_details */
/* globals js_notes   */

//port { js_CNTRL   } from "./js_CNTRL.js"
//port { js_MODEL   } from "./js_MODEL.js"
//port { js_VIEW    } from "./js_VIEW.js"
//port { js_boxing  } from "./js_boxing.js"
//port { js_folds   } from "./js_folds.js"
//port { js_input   } from "./js_input.js"
//port { js_linkify } from "./js_linkify.js"
import { js_log     } from "./js_log.js"
import { js_details } from "./js_details.js"
//port { js_store   } from "./js_store.js"
//port { js_ticker  } from "./js_ticker.js"
//port { js_xpath   } from "./js_xpath.js"
import { notes      } from "./notes.js"

//}}}
const js_MODEL   = (function()
{
//┌────────────────────────────────────────────────────────────────────────────┐
//│ ◯  INTERNING ● SERVER/scripts/js_log.js
//└────────────────────────────────────────────────────────────────────────────┘
const MODULE = "%c⭐🟣 MODEL\t\t● "; const CALLING = "%c ☎ CALLING\t";
let log_this = false;
let tag_this = false || log_this;
//{{{
/* eslint-disable no-unused-vars */

js_log.register( { module_name : "js_MODEL"
                 , module_num  : 1
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

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PRIVATE
    //└────────────────────────────────────────────────────────────────────────┘



    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PUBLIC
    //└────────────────────────────────────────────────────────────────────────┘
    /*  save    ● note_1_onclick_save {{{*/
    let save    = function( payload )
    {
let caller = "save";
if(tag_this) log(MODULE  + caller+"(payload "+ JSON.stringify(payload) +")", lbB+lf1);

if(log_this) log(CALLING + "notes.note_1_onclick_save(payload)"            , lbB+lf1); // SERVER/scripts/notes.js
        notes.note_1_onclick_save( { type: "payload", ...payload } );
    };
    /*}}}*/
    /*  edit    ● CALLS js_details.note_5_onclick_edit {{{*/
    let edit    = function( noteId )
    {
let caller = "edit";
if(tag_this) log(MODULE  + caller+"(noteId "+ noteId+")"   , lbB+lf1);

if(log_this) log(CALLING + "js_details.note_5_onclick_edit", lbB+lf1);
        let e = {};
        let index = parseInt( noteId );
        js_details.note_5_onclick_edit(e, index);
    };
    /*}}}*/
    /*  remove  ● note_6_onclick_delete {{{*/
    let remove  = function( noteId )
    {
//{{{
let caller = "remove";
if(tag_this) log(MODULE  + caller+"(noteId "+ noteId+")", lbB+lf1);

if(log_this) log(CALLING + "notes.note_6_onclick_delete", lbB+lf1);
//}}}
        notes.note_6_onclick_delete({}, noteId );
    };
    /*}}}*/

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ MVC MIGRATION: load ● delegates to notes.load_notes
    //└────────────────────────────────────────────────────────────────────────┘
/*_ load {{{*/
    let load = function()
    {
//log {{{
let caller = "load";
if(tag_this) log(MODULE  + caller              , lbB+lf1);

if(log_this) log(CALLING + "notes.load_notes()", lbB+lf1); // SERVER/scripts/notes.js
//}}}
        let promise = notes.load_notes();
if(log_this) log("promise:", promise);
        return promise;
    };
    /*}}}*/
    /*_ get_nArray {{{*/
    let prev_call_notes_length;
    let get_nArray = function()
    {
if(log_this) js_log.trace(); // 🟤🔴🟠🟡🟢🔵🟣⚫⚪️◯
        let nArray = notes.get_nArray();
//log (debounced) {{{
if(nArray.length != prev_call_notes_length)
{
    prev_call_notes_length = nArray.length;

//log {{{
let caller = "get_nArray";
if(log_this) log(MODULE  + caller              , lbB+lf1);

if(log_this) log(CALLING+"notes.get_nArray() ➔ "+ nArray.length+" notes", lbB+lf1); // SERVER/scripts/notes.js
//}}}
}
//}}}
        return nArray;
    };
    /*}}}*/
    let check = function(e, noteId)
    {
//log {{{
let caller = "check";
if(tag_this) log(MODULE  + caller+"(noteId "+noteId+")"                     , lbB+lf1);

if(log_this) log(CALLING+"notes.note_4_onclick_check("+e.type+","+noteId+")", lbB+lf1); // SERVER/scripts/notes.js
//}}}
        let promise = notes.note_4_onclick_check(e, noteId);
if(log_this) log("promise:", promise);
    };

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PUBLIC
    //└────────────────────────────────────────────────────────────────────────┘
    // return  ● edit ● save ● remove {{{
    return { edit
        ,    save
        ,    remove

        //┌────────────────────────────────────────────────────────────────────┐
        //│ MVC MIGRATION
        //└────────────────────────────────────────────────────────────────────┘
        , load
        , get_nArray
        , check
    };
    //}}}


})();
export { js_MODEL }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_MODEL = js_MODEL;
