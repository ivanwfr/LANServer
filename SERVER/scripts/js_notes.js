//┌─────────────────────────────────────────────────────────────────[...]
//│ js_notes.js ● $APROJECTS/LANServer/SERVER     ● _TAG (261105:03h:47)
//├─────────────────────────────────────────────────────────────────[...]
//│{{{
//│ 🔵 View Helper: Renders, layouts, and scrolls notes in the DOM
//│    State Management ➔ js_CNTRL (via js_MODEL, js_VIEW)
//│    Data  Operations ➔ notes.js (via js_MODEL)
//│}}}
//└─────────────────────────────────────────────────────────────────[...]
/* IMPORT {{{*/

/* globals js_MODEL  */
/* globals notes     */

/* globals js_log    */

//port { js_CNTRL   } from "./js_CNTRL.js"
import { js_MODEL   } from "./js_MODEL.js"
//port { js_VIEW    } from "./js_VIEW.js"
//port { js_boxing  } from "./js_boxing.js"
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
//┌────────────────────────────────────────────────────────────────────────────┐
//│ ◯  INTERNING ● SERVER/scripts/js_log.js
//└────────────────────────────────────────────────────────────────────────────┘
const MODULE = "%c★🟢 js_notes\t● ";
let log_this = false;
let tag_this = false  || log_this;
//{{{
/* eslint-disable no-unused-vars */

js_log.register( { module_name : "js_notes"
                 , module_num  : 5
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

//┌─────────────────────────────────────────────────────────────────[...]
//│ DATA                        ⚫⚫⚫⚫⚫⚫⚫⚫⚫⚫
//└─────────────────────────────────────────────────────────────────[...]
// CONSTANTS, DOM REFERENCES {{{
/* ●  BULLETS {{{*/
const BULLETS
    = [ "◯","🟤","🔴","🟠","🟡","🟢","🔵","🟣","⚫","⚪️" ];

/*}}}*/
// ●  auto_save INTERVAL ● auto_save TAG {{{
const AUTO_SAVE_IDLE_INTERVAL_MS = 5000;
const AUTO_SAVE_EDIT_INTERVAL_MS = 1000;
const AUTO_SAVE_TAG         = "(auto_save)\n";
//}}}
/* ●  Notes DIV TABLE {{{*/
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
let caller = "add_notes_DETAILS";
if(tag_this) log(MODULE+caller+" add_notes_DETAILS", lbB);

    //┌─────────────────────────────────────────────────────────────[...]
    //│ CACHE DOM REFERENCES (from js_notes context, passed by VIEW)
    //└─────────────────────────────────────────────────────────────[...]
    saved_notes_DIV     = args.saved_notes_DIV    || document.querySelector("#saved_notes_DIV"  );
    saved_notes_TABLE   = args.saved_notes_TABLE  || document.querySelector("#saved_notes_TABLE");

    //┌─────────────────────────────────────────────────────────────[...]
    //│ VERIFY DOM AVAILABILITY
    //└─────────────────────────────────────────────────────────────[...]
    if(!saved_notes_DIV  ) {
if(log_this) log("...saved_notes_DIV not found");
        return false;
    }
    if(!saved_notes_TABLE) {
if(log_this) log("...saved_notes_TABLE not found");
        return false;
    }

if(log_this) log("...saved_notes_DIV..: "+ (saved_notes_DIV   && saved_notes_DIV  .tagName));
if(log_this) log("...saved_notes_TABLE: "+ (saved_notes_TABLE && saved_notes_TABLE.tagName));

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
let caller = "layout_notes";
if(tag_this) log(MODULE+caller+" ← "+ _caller, lbB);

    //┌──────────────────────────────────────────────────────────────[...]
    //│ ENSURE TABLE IS AVAILABLE
    //└──────────────────────────────────────────────────────────────[...]
    if(!saved_notes_TABLE) {
if(log_this) log("...TABLE NOT FOUND", lb1+lbB);
        return;
    }

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ 1. LOAD NOTES from server or localStorage
    //└────────────────────────────────────────────────────────────────────────┘
    let nArray = notes.get_nArray();
    if(!nArray.length && !notes.get_notes_loaded_from())
    {
        //┌────────────────────────────────────────────────────────────────────┐
        //│ MVC MIGRATION: load ● delegates to notes.load_notes
        //└────────────────────────────────────────────────────────────────────┘
      //notes.load_notes();
        js_MODEL.load();
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
    if(log_this) {
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
        +   "       onclick='js_MODEL.check(event,"+index+")'>"
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
    return "note_row"
        +  (note.checked                        ? " checked"  :"")+"'"
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
let standout_note_index;

let standout_note_at_index = function(index)
{
let caller = "standout_note_at_index";
if(tag_this) log(MODULE+caller+"(index "+index+")", lbB);

    if(index < 0)
        index = standout_note_index;

    // clip at last note
    if( index >= notes.get_nArray().length)
        index  = notes.get_nArray().length - 1;

    // fallback to last standout_note_index
    let is_last_note
        =  (index >= 0)
        && (index == (notes.get_nArray().length -1));

    if( is_last_note && notes.is_last_note_auto_save() )
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
let caller = "note_scrollIntoView";
if(tag_this) log(MODULE+caller+"(index "+ index+")", lbB);

    let nArray = notes.get_nArray();
    if( !nArray.length ) return;

    if(   (index <  0            )
       || (index >= nArray.length)
      )
        index  = nArray.length - 1;

    let tr = saved_notes_TABLE.firstElementChild.children[ index ];
    if( tr )
        tr.classList.add("standout");

    note_row_scrollIntoView(tr);
};
/*}}}*/
/*_ note_row_scrollIntoView {{{*/
let NOTE_ROW_SCROLLINTOVIEW_DELAY = 500;
let note_row_scrollIntoView_timeout;

let note_row_scrollIntoView = function(tr)
{
let caller = "note_row_scrollIntoView";
if(tag_this) log(MODULE+caller+": debounce set", lbB);

    if(note_row_scrollIntoView_timeout) clearTimeout( note_row_scrollIntoView_timeout );
       note_row_scrollIntoView_timeout =  setTimeout( note_row_scrollIntoView_handler , NOTE_ROW_SCROLLINTOVIEW_DELAY, tr);
};
/*}}}*/
/*_ note_row_scrollIntoView_handler {{{*/
let note_row_scrollIntoView_handler = function(tr)
{
let caller = "note_row_scrollIntoView_handler";
if(tag_this) log(MODULE+caller+"%c\t"+ellipsis(tr.innerText.trim(),50), lbB, lf5);

    note_row_scrollIntoView_timeout = null;

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
// wider narrower tunesize {{{
/*_ wider ● Increase textarea width {{{*/
let wider = function()
{
let caller = "wider";
if(tag_this) log(MODULE+caller, lbB);

    let input = get_input();
    if(!input) return;

    let rect = input.getBoundingClientRect();
    input.style.width = parseInt(rect.width * 1.2)+"px";
};
/*}}}*/
/*_ narrower ● Decrease textarea width {{{*/
let narrower = function(e) /* eslint-disable-line no-unused-vars */
{
let caller = "narrower";
if(tag_this) log(MODULE+caller, lbB);

    let input = get_input();
    if(!input) return;

    let rect = input.getBoundingClientRect();
    input.style.width = parseInt(rect.width * 0.8)+"px";
};
/*}}}*/
/*_ tunesize ● Cycle layout sizes {{{*/
let tunesize = function(e)
{
let caller = "tunesize";
if(tag_this) log(MODULE+caller, lbB);

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
let caller = "tune_status";
if(tag_this) log(MODULE+caller, lbB);

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
let caller = "show_status";
if(tag_this) log(MODULE+caller+" %c"+ msg, lbB, lb0);

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
let tail_msg_1;
let tail_msg_2;

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
let caller = "tics_status";
if(tag_this) log(MODULE+caller+"(count "+ count +")", lbB);

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
        .replace(/'/g, "&#039;")
        .replace(/\0x60/g, "&#096;")
    ;
};
/*}}}*/
/*● copy_to_clipboard ● Copy text to system clipboard {{{*/
let copy_to_clipboard = function(buffer)
{
let caller = "copy_to_clipboard";
if(tag_this) log(MODULE+caller, lbB);
if(log_this) log( buffer );

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
        , log          : () => { log_this = !log_this; log("log_this=["+log_this+"]"); }
        , tag          : () => { tag_this = !tag_this; log("tag_this=["+tag_this+"]"); }

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵 ▼▼▼ MVC REFACTORING ZONE ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
//└────────────────────────────────────────────────────────────────────────────┘
//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵 ▲▲▲ MVC REFACTORING ZONE ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
//└────────────────────────────────────────────────────────────────────────────┘
    };

//}}}
})();
export { js_notes }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_notes = js_notes; // exposed to inline onclick handlers
