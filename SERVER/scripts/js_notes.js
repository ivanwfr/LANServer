//┌─────────────────────────────────────────────────────────────────[...]
//│ js_notes.js ● $APROJECTS/LANServer/SERVER      ● _TAG (261004:01h:20)
//├─────────────────────────────────────────────────────────────────[...]
//│ 🔵 View Helper: Renders, layouts, and scrolls notes in the DOM
//│    State Management ➔ js_CNTRL (via js_MODEL, js_VIEW)
//│    Data  Operations ➔ notes.js (via js_MODEL)
//└─────────────────────────────────────────────────────────────────[...]
/* IMPORT {{{*/

// globals js_VIEW   */ // STUB FOR MVC VIEW
/* globals notes     */


/* globals js_log    */

//port { js_CNTRL   } from "./js_CNTRL.js"
//port { js_MODEL   } from "./js_MODEL.js"
//port { js_VIEW    } from "./js_VIEW.js"
//port { js_folds   } from "./js_folds.js"
//port { js_input   } from "./js_input.js"
//port { js_linkify } from "./js_linkify.js"
import { js_log     } from "./js_log.js"
//port { js_notes   } from "./js_notes.js"
//port { js_store   } from "./js_store.js"
import { js_ticker  } from "./js_ticker.js"
//port { js_xpath   } from "./js_xpath.js"
import { notes      } from "./notes.js"

/*}}}*/
let js_notes    = (function()
{
"use strict";

//┌─────────────────────────────────────────────────────────────────[...]
//│ DATA                        ⚫⚫⚫⚫⚫⚫⚫⚫⚫⚫
//└─────────────────────────────────────────────────────────────────[...]
// LOGGING, CONSTANTS, DOM REFERENCES {{{
//┌─────────────────────────────────────────────────────────────────[...]
//│ LOGGING
//└─────────────────────────────────────────────────────────────────[...]
// ● log-items inlining ● SERVER/scripts/js_log.js {{{
/* eslint-disable no-unused-vars */

let log                                        = js_log.log;
let is_logging                                 = js_log.is_logging;
let console_clear                              = js_log.console_clear;

let ellipsis                                   = js_log.ellipsis;
let get_src_link                               = js_log.get_src_link;

let [lf0,lf1,lf2,lf3,lf4,lf5,lf6 ,lf7,lf8,lf9] = js_log.lfX;
let [lb0,lb1,lb2,lb3,lb4,lb5,lb6 ,lb7,lb8,lb9] = js_log.lbX;
let lbB                                        = js_log.lbB;
let lbX                                        = js_log.lbX;

/* eslint-enable  no-unused-vars */
//}}}
// ● log configuration {{{
let log_this = false;
let tag_this = false || log_this;
//}}}
//┌─────────────────────────────────────────────────────────────────[...]
//│ CONSTANTS
//└─────────────────────────────────────────────────────────────────[...]
/* ●  BULLETS {{{*/
const BULLETS
    = [ "◯","🟤","🔴","🟠","🟡","🟢","🔵","🟣","⚫","⚪️" ];

/*}}}*/
// ●  auto_save INTERVAL ● auto_save TAG {{{
const AUTO_SAVE_IDLE_INTERVAL_MS = 5000;
const AUTO_SAVE_EDIT_INTERVAL_MS = 1000;
const AUTO_SAVE_TAG         = "(auto_save)\n";
//}}}
//┌─────────────────────────────────────────────────────────────────[...]
//│ DOM REFERENCES                                    │
//└─────────────────────────────────────────────────────────────────[...]
/* Notes DIV TABLE {{{*/
let saved_notes_DIV;    // width
let saved_notes_TABLE;  // innerHTML
let layout_count = 0;
/*}}}*/
//}}}

//┌─────────────────────────────────────────────────────────────────[...]
//│ ● CACHE DOM REFERENCES      🟤🟤🟤🟤🟤🟤🟤🟤🟤🟤
//└─────────────────────────────────────────────────────────────────[...]
/*_ add_notes_DETAILS ● Initialize DOM refs {{{*/
let add_notes_DETAILS = function(args)
{
if(tag_this) console.log("🔵 add_notes_DETAILS");

    //┌─────────────────────────────────────────────────────────────[...]
    //│ CACHE DOM REFERENCES (from js_notes context, passed by VIEW)
    //└─────────────────────────────────────────────────────────────[...]
    saved_notes_DIV     = args.saved_notes_DIV    || document.querySelector("#saved_notes_DIV"  );
    saved_notes_TABLE   = args.saved_notes_TABLE  || document.querySelector("#saved_notes_TABLE");

    //┌─────────────────────────────────────────────────────────────[...]
    //│ VERIFY DOM AVAILABILITY
    //└─────────────────────────────────────────────────────────────[...]
    if(!saved_notes_DIV  ) {
        if( is_logging() ) log("%c● saved_notes_DIV not found", lb1+lbB);
        return false;
    }
    if(!saved_notes_TABLE) {
        if( is_logging() ) log("%c● saved_notes_TABLE not found", lb1+lbB);
        return false;
    }

    if( is_logging() ) {
        log("%c● saved_notes_DIV  :\t"+ (saved_notes_DIV   && saved_notes_DIV  .tagName), lf6 );
        log("%c● saved_notes_TABLE:\t"+ (saved_notes_TABLE && saved_notes_TABLE.tagName), lf6 );
    }

    return true;
};
/*}}}*/

//┌─────────────────────────────────────────────────────────────────[...]
//│ LAYOUT & RENDER             🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
//└─────────────────────────────────────────────────────────────────[...]
// layout_notes {{{
/*● layout_notes ● Populate or clear notes table {{{*/
//┌─────────────────────────────────────────────────────────────────[...]
//│ Purpose: Render nArray into saved_notes_TABLE
//│ Called from: js_MODEL after save/delete, js_VIEW on state change
//│ @param {string} _caller - Debug label
//│ @param {number} index - Which note to highlight (optional)
//└─────────────────────────────────────────────────────────────────[...]
let layout_notes = function(_caller="?", index_arg=-1)
{
if(tag_this) console.log("🔵 layout_notes ← "+ _caller);

    //┌──────────────────────────────────────────────────────────────[...]
    //│ ENSURE TABLE IS AVAILABLE
    //└──────────────────────────────────────────────────────────────[...]
    if(!saved_notes_TABLE) {
        if( is_logging() ) log("%c● layout_notes: TABLE NOT FOUND", lb1+lbB);
        return;
    }

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ 1. LOAD NOTES from server or localStorage
    //└────────────────────────────────────────────────────────────────────────┘
    let nArray = notes.get_nArray();
    if(!nArray.length && !notes.get_notes_loaded_from())
    {
        notes.load_notes();
    }

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ 2. POPULATE OR CLEAR [note_row] ● @see SERVER/style/notes.css
    //└────────────────────────────────────────────────────────────────────────┘
    let innerHTML
        = nArray.length
        ? nArray.map((note, index) => layout_get_TR(note,index)).join("")
        : "<TR><TD class='no_notes_yet_TD' colspan='6'>No notes yet</TD></TR>"
    ;

    saved_notes_TABLE.innerHTML =            "<TABLE id='saved_notes_TABLE'>"+ innerHTML +"</TABLE>";

    //┌──────────────────────────────────────────────────────────────[...]
    //│ LAYOUT COUNTER (for status display)
    //└──────────────────────────────────────────────────────────────[...]
    layout_count += 1;

    //┌──────────────────────────────────────────────────────────────[...]
    //│ HIGHLIGHT LAST HANDLED NOTE
    //└──────────────────────────────────────────────────────────────[...]
    standout_note_at_index( index_arg );

    //┌──────────────────────────────────────────────────────────────[...]
    //│ UPDATE SUMMARY (via notes.js)
    //└──────────────────────────────────────────────────────────────[...]
    notes.update_summary();

    //┌──────────────────────────────────────────────────────────────[...]
    //│ DEBUG: Log layout operation
    //└──────────────────────────────────────────────────────────────[...]
    if( is_logging() ) {
        let caller = "js_notes ● layout_notes";
        log("%c"+caller                                   , lf6     );
        log("%c● _caller...:\t%c["+ _caller           +"]", lf6, lb0);
        log("%c● index.....:\t%c["+ index_arg         +"]", lf6, lb1);
        log("%c● layout_cnt:\t%c["+ layout_count      +"]", lf6, lb2);
        log("%c● nArray.len:\t%c["+ nArray.length     +"]", lf6, lb3);
    }
};
/*}}}*/
/*_ layout_get_TR {{{*/
let layout_get_TR = function(note, index)
{
    return ""
        + "<TR         class='"+ layout_get_note_class  (note) +"'"
        +     "      data-id='"+                    index  +"'"
        +     " data-content='"+ layout_get_note_content(note) +"'"
        +  "                                                     >"
        + layout_get_TD_note_num(note, index)
        + layout_get_TD_check   (note, index)
        + layout_get_TD_edit    ()
        + layout_get_TD_text    (note)
        + layout_get_TD_time    (note)
        + layout_get_TD_delete  ()
        + "</TR>"
    ;
};
/*}}}*/
/*_ layout_get_TD_note_num {{{*/
let layout_get_TD_note_num = function(note, index)
{
    return  "<TD>"
        +   " <div class='note_num'>"+ (index+1) +"</div>"
        +   "</TD>"
    ;
};
/*}}}*/
/*_ layout_get_TD_check    {{{*/
let layout_get_TD_check    = function(note, index)
{
    return  "<TD>"
        +   " <button class='check_button'"
        +   "         title='Check note'"
        +   "       onclick='notes.note_4_onclick_check(event,"+index+")'>"
        +   " </button>"
        +   "</TD>"
    ;
};
/*}}}*/
/*_ layout_get_TD_edit     {{{*/
let layout_get_TD_edit     = function()
{
    return  "<TD>"
        +   " <button class='edit_button' title='Edit note'></button>"
        +   "</TD>"
    ;
    // @see ::before pseudo-element ● SERVER/style/notes.css
};
/*}}}*/
/*_ layout_get_TD_text     {{{*/
let layout_get_TD_text     = function(note)
{
    return "<TD>"
        +  " <div class='truncated'>"+ escapeHTML(note.text) +"</div>"
        +  "</TD>"
    ;
};
/*}}}*/
/*_ layout_get_TD_time     {{{*/
let layout_get_TD_time     = function(note)
{
    return "<TD onclick='event.cancelBubble = true;'>"
        +  " <small  class='timestamp'>"+ layout_get_note_time(note) +"</small>"
        +  "</TD>"
    ;
};
/*}}}*/
/*_ layout_get_TD_delete   {{{*/
let layout_get_TD_delete   = function()
{
    return "<TD>"
        +  " <button class='delete_button' title='Delete note'></button>"
        +  "</TD>"
    ;
    // @see ::before pseudo-element ● SERVER/style/notes.css
};
/*}}}*/
/*_ layout_get_note_class {{{*/
let layout_get_note_class = function(note)
{
    return "note_row "
        +   note.checked
        +  (note.text.includes( AUTO_SAVE_TAG ) ? " auto_save":"")+"'";
};
/*}}}*/
/*_ layout_get_note_content {{{*/
let layout_get_note_content = function(note)
{
    return escapeHTML( note.text ).replace(AUTO_SAVE_TAG, "");
};
/*}}}*/
/*_ layout_get_note_time {{{*/
let layout_get_note_time = function(note)
{
    return new Date( note.timestamp ).toLocaleString();
};
/*}}}*/
//}}}

//┌─────────────────────────────────────────────────────────────────[...]
//│ TABLE STATUS & HIGHLIGHTING 🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠
//└─────────────────────────────────────────────────────────────────[...]
/*_ standout_note_at_index ● Highlight note row {{{*/
/*{{{*/
let standout_note_index;
/*}}}*/
let standout_note_at_index = function(index)
{
if(tag_this) console.log("🔵 standout_note_at_index: "+ index);

    if(index < 0)
        index = standout_note_index;

    // clip at last note
    if( index >= notes.get_nArray().length)
        index  = notes.get_nArray().length - 1;

    // fallback to last standout_note_index
    let is_last_note
        =  (index >= 0)
        && (index == (notes.get_nArray().length -1));

    if( is_last_note && is_last_note_auto_save() )
        index = standout_note_index;

    document.querySelectorAll(".standout").forEach((el) => el.classList.remove("standout"));

    if(index >= 0)
    {
        standout_note_index = index;
        note_scrollIntoView( index );
    }
};
/*}}}*/

//┌─────────────────────────────────────────────────────────────────[...]
//│ SCROLLING UTILITIES         🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡
//└─────────────────────────────────────────────────────────────────[...]
// note_scrollIntoView {{{
/*_ note_scrollIntoView ● Scroll note into viewport {{{*/
let note_scrollIntoView = function(index=-1)
{
if(tag_this) console.log("🔵 note_scrollIntoView: "+ index);

    let nArray = notes.get_nArray();
    if( !nArray.length ) return;

    if(   (index <  0            )
       || (index >= nArray.length)
      )
        index  = nArray.length - 1;

    let tr = saved_notes_TABLE.firstElementChild.children[ index ];
    if( tr )
        tr.classList.add("standout");

    scroll_TR_intoView(tr);
};
/*}}}*/
/*_ scroll_TR_intoView ● Debounced scroll handler {{{*/
/* debounce timeout {{{*/
let SCROLL_TR_INTOVIEW_DELAY = 500;
let scroll_TR_intoView_timeout;
let scroll_TR_intoView = function(tr)
{
if(tag_this) console.log("🔵 scroll_TR_intoView: debounce set");

    if(scroll_TR_intoView_timeout) clearTimeout( scroll_TR_intoView_timeout );
       scroll_TR_intoView_timeout =  setTimeout( scroll_TR_intoView_handler , SCROLL_TR_INTOVIEW_DELAY, tr);
};
/*}}}*/
let scroll_TR_intoView_handler = function(tr)
{
if(tag_this) console.log("🔵 scroll_TR_intoView_handler: %c"+ellipsis(tr.innerText.trim(),50), "color: magenta");

    scroll_TR_intoView_timeout = null;

    //┌──────────────────────────────────────────────────────────────[...]
    //│ Get the nearest scrollable ancestor (vertical only)
    //└──────────────────────────────────────────────────────────────[...]
    let        box = getClosestScrollableAncestor( tr );
    if(       !box ) return;

    let   row_rect =  tr.getBoundingClientRect();
    let   box_rect = box.getBoundingClientRect();

    //┌──────────────────────────────────────────────────────────────[...]
    //│ Calculate scroll offset to center row in viewport
    //└──────────────────────────────────────────────────────────────[...]
    let offset_old  = parseInt(row_rect.top - box_rect.top     );
    let offset_new  = parseInt(  offset_old - box_rect.height/2);

    // [tr] is already fully visible, no scroll required
    if(   (row_rect.top    > box_rect.top)
       && (row_rect.bottom < box_rect.bottom)
     )
        return;
    let box_scrollY = box.scrollTop + offset_new;

    //┌──────────────────────────────────────────────────────────────[...]
    //│ Use requestAnimationFrame to ensure DOM is ready
    //└──────────────────────────────────────────────────────────────[...]
    requestAnimationFrame(() => {
        box.scrollTo({ top: box_scrollY, behavior: "smooth" });
    });
};
/*}}}*/
/*_ getClosestScrollableAncestor ● Find scrollable parent {{{*/
let getClosestScrollableAncestor = function(el)
{
    if(    !el ) return null;

    return (el == document.documentElement)
            ? null
            : ( el.scrollHeight > el.clientHeight)
              ? el
              : getClosestScrollableAncestor(el.parentElement);
};
/*}}}*/
//}}}

//┌─────────────────────────────────────────────────────────────────[...]
//│ SIZING & LAYOUT CONTROLS    🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
//└─────────────────────────────────────────────────────────────────[...]
// winder narrower tunesize {{{
/*_ wider ● Increase textarea width {{{*/
let wider = function()
{
if(tag_this) console.log("🔵 wider");

    let input = get_input();
    if(!input) return;

    let rect = input.getBoundingClientRect();
    input.style.width = parseInt(rect.width * 1.2)+"px";
};
/*}}}*/
/*_ narrower ● Decrease textarea width {{{*/
let narrower = function(e) /* eslint-disable-line no-unused-vars */
{
if(tag_this) console.log("🔵 narrower");

    let input = get_input();
    if(!input) return;

    let rect = input.getBoundingClientRect();
    input.style.width = parseInt(rect.width * 0.8)+"px";
};
/*}}}*/
/*_ tunesize ● Cycle layout sizes {{{*/
let tunesize = function(e)
{
if(tag_this) console.log("🔵 tunesize");

    if(!e.target) return;

    let w;
    switch(e.target.className)
    {
    case "layout1": w =  "300px";  update_layout_width(w); e.target.title = e.target.className = "layout2"; break; /* eslint-disable-line no-multi-assign */
    case "layout2": w =  "700px";  update_layout_width(w); e.target.title = e.target.className = "layout3"; break; /* eslint-disable-line no-multi-assign */
    case "layout3": w =  "900px";  update_layout_width(w); e.target.title = e.target.className = "layout4"; break; /* eslint-disable-line no-multi-assign */
    case "layout4": w = "1000px";  update_layout_width(w); e.target.title = e.target.className = "default"; break; /* eslint-disable-line no-multi-assign */
    default       : w =  "500px";  update_layout_width(w); e.target.title = e.target.className = "layout1"; break; /* eslint-disable-line no-multi-assign */
    }
};
/*}}}*/
/*_ update_layout_width ● Helper for tunesize {{{*/
let update_layout_width = function(w)
{
    let input = get_input();
    if(!input) return;

    input.style.width = w;
    if( saved_notes_DIV )
        saved_notes_DIV.style.width = w;
};
/*}}}*/
//}}}

//┌─────────────────────────────────────────────────────────────────[...]
//│ STATUS LINE & FEEDBACK      🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵
//└─────────────────────────────────────────────────────────────────[...]
// tune_status show_status tail_msg tics_status{{{
/*_ tune_status ● Cycle status display modes {{{*/
let tune_status = function(e) /* eslint-disable-line no-unused-vars */
{
if(tag_this) console.log("🔵 tune_status");

    let status_line = get_status_line();
    if(!status_line) return;

    if     ( !status_line.classList.contains("brighter") ) status_line.classList.add   ("brighter");
    else if( !status_line.classList.contains("bigger"  ) ) status_line.classList.add   ("bigger"  );
    else {                                                 status_line.classList.remove("brighter");
                                                           status_line.classList.remove("bigger"  );
    }
};
/*}}}*/
/*_ show_status ● Display status message {{{*/
let show_status = function(msg)
{
if(tag_this) console.log("🔵 show_status( "+msg+" )");

    let status_line = get_status_line();
    if(!status_line) return;

    status_line.msg        = msg;
    status_line.innerHTML  = msg +" "+ (status_line.tail_msg || "");

    // ... with a copy to [save_note_BUTTON] title
    let save_note_BUTTON = document.querySelector("#save_note_BUTTON");
    if( save_note_BUTTON ) save_note_BUTTON.title = msg;
};
/*}}}*/
/*_ tail_status ● Update tail message in status line {{{*/
/*{{{*/
let tail_msg_1;
let tail_msg_2;
/*}}}*/
let tail_status = function(...args)
{
    let status_line = get_status_line();
    if(!status_line) return;

    // CACHE
    tail_msg_1 = args[0] ? args[0] : tail_msg_1;
    tail_msg_2 = args[1] ? args[1] : tail_msg_2;

    // TITLE
    status_line.title = "Click: brighter — bigger — dimmer"
        + (tail_msg_1 ? "\n● " + tail_msg_1 : "")
        + (tail_msg_2 ? "\n● " + tail_msg_2 : "")
        +               "\n● x"+ layout_count +" layout count";

    // UPDATE STATUS TAIL MESSAGE
    status_line.tail_msg
    = (tail_msg_1 ? "<em class='tail_msg'>"+tail_msg_1+"</em>" : "")
    + (tail_msg_2 ? "<em class='tail_msg'>"+tail_msg_2+"</em>" : "");

    // REDISPLAY CURRENT MESSAGE
    show_status(status_line.msg || "…");
};
/*}}}*/
/*_ tics_status ● Format layout count as bullet string {{{*/
let tics_status = function( count )
{
if(tag_this) console.log("🔵 tics_status: "+ count);

    let   cent = parseInt(       count / 100);
    let   tens = parseInt(       count /  10);
    let   unit =                 count %  10 ;

    let b_cent = (count >= 100) ? BULLETS[  cent %  10] : "";
    let b_tens = (count >=  10) ? BULLETS[  tens %  10] : "";
    let b_unit = (count >=   0) ? BULLETS[  unit %  10] : "";

    return b_cent + b_tens + b_unit;
};
/*}}}*/
//}}}

//┌─────────────────────────────────────────────────────────────────[...]
//│ HELPER STATE CHECKERS       🟣🟣🟣🟣🟣🟣🟣🟣🟣🟣
//└─────────────────────────────────────────────────────────────────[...]
/*_ is_last_note_auto_save ● Check if last note is auto-save {{{*/
let is_last_note_auto_save = function()
{
    let nArray = notes.get_nArray();
   if(!nArray.length )
       return false;

    if(!nArray[nArray.length-1].text.startsWith(AUTO_SAVE_TAG) )
       return false;

if(log_this) console.log("🔵 IS_LAST_NOTE_AUTO_SAVE");
   return true;
};
/*}}}*/

//┌─────────────────────────────────────────────────────────────────[...]
//│ UTILITY
//└─────────────────────────────────────────────────────────────────[...]
// escapeHTML copy_to_clipboard get_input get_status_line {{{
/*● escapeHTML ● Sanitize text for HTML {{{*/
let escapeHTML = function(text)
{
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};
/*}}}*/
/*● copy_to_clipboard ● Copy text to system clipboard {{{*/
let copy_to_clipboard = function(buffer)
{
if(tag_this) console.log("🔵 copy_to_clipboard");
if(log_this) console.log( buffer );

    navigator.clipboard.writeText( buffer );
};
/*}}}*/
/*_ get_input ● Safe accessor for textarea {{{*/
let get_input = function()
{
    return document.querySelector("#note_input_TEXTAREA");
};
/*}}}*/
/*_ get_status_line ● Safe accessor for status line {{{*/
let get_status_line = function()
{
    return document.querySelector("#status_line");
};
/*}}}*/
//}}}

// return {{{
    return { name: "js_notes"

        //┌──────────────────────────────────────────────────────────────[...]
        //│ INITIALIZATION
        //├──────────────────────────────────────────────────────────────[...]
        //│ Called by js_VIEW to cache DOM references
        //└──────────────────────────────────────────────────────────────[...]
        ,    add_notes_DETAILS

        //┌──────────────────────────────────────────────────────────────[...]
        //│ LAYOUT & RENDERING
        //├──────────────────────────────────────────────────────────────[...]
        //│ Called by js_MODEL, js_VIEW on state changes
        //└──────────────────────────────────────────────────────────────[...]
        ,    layout_notes
        ,    standout_note_at_index

        //┌──────────────────────────────────────────────────────────────[...]
        //│ SCROLLING
        //├──────────────────────────────────────────────────────────────[...]
        //│ Called when highlighting notes
        //└──────────────────────────────────────────────────────────────[...]
        ,    note_scrollIntoView

        //┌──────────────────────────────────────────────────────────────[...]
        //│ SIZING & LAYOUT CONTROLS
        //├──────────────────────────────────────────────────────────────[...]
        //│ Called by onclick handlers (inline HTML)
        //└──────────────────────────────────────────────────────────────[...]
        ,    wider
        ,    tunesize
        ,    narrower

        //┌──────────────────────────────────────────────────────────────[...]
        //│ STATUS LINE DISPLAY
        //├──────────────────────────────────────────────────────────────[...]
        //│ Called by js_MODEL, js_VIEW, or inline handlers
        //└──────────────────────────────────────────────────────────────[...]
        ,    show_status
        ,    tune_status
        ,    tail_status
        ,    tics_status

        //┌──────────────────────────────────────────────────────────────[...]
        //│ UTILITY
        //└──────────────────────────────────────────────────────────────[...]
        ,    copy_to_clipboard
        ,    escapeHTML

        //┌──────────────────────────────────────────────────────────────[...]
        //│ CONSTANTS (for external consumption)
        //└──────────────────────────────────────────────────────────────[...]
        ,    AUTO_SAVE_IDLE_INTERVAL_MS
        ,    AUTO_SAVE_EDIT_INTERVAL_MS

        //┌──────────────────────────────────────────────────────────────[...]
        //│ DEBUG ONLY
        //└──────────────────────────────────────────────────────────────[...]
        , layout_count : () => layout_count
        , log         : () => { log_this = !log_this; console.log("log_this=["+log_this+"]"); }
        , tag         : () => { tag_this = !tag_this; console.log("tag_this=["+tag_this+"]"); }

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵 ▼▼▼ MVC REFACTORING ZONE ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
//└────────────────────────────────────────────────────────────────────────────┘
        , is_last_note_auto_save
//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵 ▲▲▲ MVC REFACTORING ZONE ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
//└────────────────────────────────────────────────────────────────────────────┘
    };

//}}}
})();
export { js_notes }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_notes = js_notes; // exposed to inline onclick handlers
