//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_input.js     ● $APROJECTS/LANServer/SERVER       ● _TAG (261105:00h:05) │
//├────────────────────────────────────────────────────────────────────────────┤
/* IMPORT {{{*/

/* globals     notes   */
/* globals  js_CNTRL   */
/* globals  js_details */
/* globals  js_log     */
/* globals  js_notes   */
/* globals  js_store   */
/* globals  js_ticker  */

/* exported js_input   */

import { js_CNTRL   } from "./js_CNTRL.js"
//port { js_MODEL   } from "./js_MODEL.js"
//port { js_VIEW    } from "./js_VIEW.js"
//port { js_boxing  } from "./js_boxing.js"
//port { js_folds   } from "./js_folds.js"
//port { js_input   } from "./js_input.js"
//port { js_linkify } from "./js_linkify.js"
import { js_log     } from "./js_log.js"
import { js_details } from "./js_details.js"
import { js_notes   } from "./js_notes.js"
import { js_store   } from "./js_store.js"
import { js_ticker  } from "./js_ticker.js"
//port { js_xpath   } from "./js_xpath.js"
import { notes      } from "./notes.js"

/*}}}*/
let js_input = (function()
{
//┌────────────────────────────────────────────────────────────────────────────┐
//│ ◯  INTERNING ● SERVER/scripts/js_log.js
//└────────────────────────────────────────────────────────────────────────────┘
const MODULE = "%c★🟢 js_input\t\t● ";
let log_this = false;
let tag_this = false || log_this;
// ●log-items inlining ● SERVER/scripts/js_log.js {{{
/* eslint-disable no-unused-vars */

js_log.register( { module_name : "js_input"
                 , module_num  : 0
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
//│ 🟤 GUI (js_notes)  GUI LEAK ● DATA ➔ VIEW                               🖥 │
//└────────────────────────────────────────────────────────────────────────────┘
/*  add_notes_GUI {{{*/
/*{{{*/
let input;
let note_DETAILS;
let saved_notes_DIV;
let saved_notes_TABLE;

/*}}}*/
let add_notes_GUI = function(args)
{
    input              = args.input;
    note_DETAILS       = args.note_DETAILS;
    saved_notes_DIV    = args.saved_notes_DIV;
    saved_notes_TABLE  = args.saved_notes_TABLE;

    js_input_IO.on( input , input_listener);

    layout_look( input );
};
/*}}}*/
/*  input_listener {{{*/
let input_listener = function(e)
{
let caller = "input_listener";
if(tag_this) log(MODULE+caller+"🟣 "+ e.type, lb0);

try{
    let input_value = input.value.trim();
    if( input_value )
    {

        //┌────────────────────────────────────────────────────────────────────┐
        //│ IGNORE blank header and trailer changes
        //└────────────────────────────────────────────────────────────────────┘
        let oldValue = e.detail.oldValue.trim();
        let newValue = e.detail.newValue.trim();
        if( newValue == oldValue)
            return;

        //┌────────────────────────────────────────────────────────────────────┐
        //│ [input.value] changed
        //└────────────────────────────────────────────────────────────────────┘
        //{{{
if(tag_this) log( "input_value changed:\n"
                        + "● FROM ["+oldValue+"]\n"
                        + "● TO   ["+newValue+"]");

        if((newValue != oldValue) && !input.classList.contains("edit"))
        {
            js_ticker.changeInterval( js_notes.AUTO_SAVE_EDIT_INTERVAL_MS );
            input.classList.add("edit");
        }
        //}}}

        //┌────────────────────────────────────────────────────────────────────┐
        //│ on first user-input
        //└────────────────────────────────────────────────────────────────────┘
        //{{{
        if(  !e.detail.oldValue
           || js_details.is_input_auto_insert_prefix()
          ) {
            notes.reset_input_placeholder();
            js_details.save_note_auto( e );
        }
        // SERVER/style/notes.css
        // SERVER/style/to_html.css
        //}}}
        // USER MAY HAVE REMOVED ITS CHANGES ● (...back to auto prefix) {{{
        if(  !input.value
           || js_details.is_input_auto_insert_prefix() )
        {
            if(!input.classList.contains("auto_insert_prefix"))
            {
                input.classList.add(     "auto_insert_prefix");
                js_details.save_note_auto( e );
                return;
            }
        }
        //}}}
        // USER DID INPUT SOMETHING ● remove auto_insert_prefix {{{
        if(input.classList.contains(     "auto_insert_prefix"))
        {
            input.classList.remove(      "auto_insert_prefix");
          //js_details.save_note_auto( e );
          //    return;
        }
        //}}}
        // check if `auto_insert_prefix` style may apply {{{
        if(    js_details.is_input_auto_insert_prefix()
           && !input.classList.contains("auto_insert_prefix")
          ) {
            input.classList.add(        "auto_insert_prefix");
            js_details.save_note_auto( e );

            return;
        }
        //}}}
    }
    else {
        notes.note_1_onclick_save ( { type: "auto_save" } ); // text cleared ...worth a synchronized update

        reset_input("input_listener: ❌input empty");
    }
}
finally {
    input_check_empty_state();
}
};
/*}}}*/
/*  input_check_empty_state {{{*/
let input_check_empty_state = function()
{
    let nothing_worth_to_copy
        = !input.value
        || js_details.is_input_auto_insert_prefix();

    note_DETAILS.classList.toggle("empty", nothing_worth_to_copy);
};
/*}}}*/

/*  reset_input {{{*/
let reset_input = function(_caller)
{
let caller = "reset_input";
if(tag_this) log(MODULE+caller+"🟣 "+ (_caller ? (" ← "+_caller) : ""), lb0);

    // CLEAR TEXTAREA CONTENT
    input.dataset.content = input.value; // backup, not used yet...

  //input.value           = "";
    js_input_IO.value     = "";

    input.classList.remove("edit"              );
    input.classList.remove("auto_insert_prefix");

    // UPDATE STANDOUT IN [saved_notes_DIV]
    js_CNTRL.set_editing_note_index(-1);

    js_ticker.changeInterval( js_notes.AUTO_SAVE_IDLE_INTERVAL_MS );
};
/*}}}*/

let get_input_storage_key = function() { return "input__"+ js_store.get_page_storage_key(); };
let get_id_wh_storage_key = function() { return "id_wh__"+ js_store.get_page_storage_key(); };
/*  input_save {{{*/
let input_save = function(_caller)
{
let caller = "input_save";
if(tag_this) log(MODULE+caller+"🟣 "+ (_caller ? (" ← "+_caller) : ""), lb0);

    if( js_details.is_input_auto_insert_prefix() ) return;

    // STORE CURRENT INPUT CONTENT (WILL BE RESTORED BY NEXT RELOAD)
    let input_storage_key = get_input_storage_key();

    let text = input.value.trim();
    if( text ) {
        let stored  = localStorage.getItem( input_storage_key ) || "";
        if( stored != text)
            localStorage.setItem( input_storage_key , text);
    }
    // — TAKE THIS OPPORTUNITY TO CLEAR STORAGE FROM A STALE STORED NOTE
    else {
        localStorage.removeItem( input_storage_key );
    }
};
/*}}}*/
/*  input_load {{{*/
let input_load = function()
{
let caller = "input_load";
if(tag_this) log(MODULE+caller, lb0);

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ NO SAVED INPUT CONTENT FROM PREVIOUS SESSION DID                       │
    //└────────────────────────────────────────────────────────────────────────┘
    let input_storage_key = get_input_storage_key();

    let text = localStorage.getItem( input_storage_key )
        ||      "";

    // DEFAULT TO SCROLL LAST NOTE INTO VIEW
    if(!text) {
        notes.note_scrollIntoView();

        reset_input("input_load: !text");
        return;
    }

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ some text was saved into localStorage on previous session exit         │
    //│ resuming edit                                                          │
    //└────────────────────────────────────────────────────────────────────────┘

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ RESUME EDITING SOME EXISTING NOTE                                      │
    //└────────────────────────────────────────────────────────────────────────┘
    let           nArray = notes.get_nArray();
    for(let index=nArray.length-1; index >= 0; --index)
    {
        let        note = nArray[index];
        if(text == note.text)
        {
            let note_row = saved_notes_TABLE.firstElementChild.children[index];
            js_details.note_5_onclick_edit({ target: note_row }, index);
// TRYING INPUT.FOCUS() TO RESUME NOTE EDIT {{{
//          input.addEventListener("mouseenter", (event) => event.target.focus());
//          input.addEventListener("mouseenter", ()      =>        input.focus());
//}}}
            return;
        }
    }
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ RELOAD UNCOMMITED INPUT CONTENT FROM PREVIOUS SESSION                  │
    //└────────────────────────────────────────────────────────────────────────┘
 // input.value = text;
 js_input.value = text;

    // SCROLL LAST NOTE INTO VIEW
    notes.note_scrollIntoView();

if(log_this) log( text );
};
/*}}}*/

/*_ layout_look {{{*/
/*{{{*/
const ID_WH_SAVE_COOLDOWN = 2000;
let   id_wh_save_timeout;
let   resizeObserver;
/*}}}*/
let layout_look = function(element)
{
//{{{
let caller = "layout_look";
if(tag_this) log(MODULE+caller+"🟤", (element.id || element.tagName), lb0);
//}}}
    /* create resizeObserver {{{*/
    if(!resizeObserver)
    {
        resizeObserver = new ResizeObserver((entries) => {
            for(let entry of entries)
            {
                let id_wh = {     id: entry.target.id
                    ,          width: entry.contentRect.width
                    ,         height: entry.contentRect.height };

if(log_this) log(`🟤 Element ${id_wh.id} resized to: ${id_wh.width} x ${id_wh.height}`);

                if( id_wh_save_timeout ) clearTimeout( id_wh_save_timeout );
                    id_wh_save_timeout = setTimeout(layout_save, ID_WH_SAVE_COOLDOWN);
            }
        });
    }
    /*}}}*/
    /* add element to observe {{{*/
    resizeObserver.observe( element );

    /*}}}*/
};
/*}}}*/
/*_ layout_save {{{*/
let layout_save = function()
{

let caller = "layout_save";
if(tag_this) log(MODULE+caller, lb0);

    let id_wh_array
        = [ layout_eval( input           )
          , layout_eval( saved_notes_DIV ) ];

    localStorage.setItem(get_id_wh_storage_key(), JSON.stringify( id_wh_array ));

    id_wh_save_timeout = null;
};
/*}}}*/
/*_ layout_eval {{{*/
let layout_eval = function(el)
{
    let  rect =           el.getBoundingClientRect();
    let id_wh = { id    : el.id
                , width : parseInt( rect.width  )
                , height: parseInt( rect.height ) };
let caller = "layout_eval";
if(tag_this) log(MODULE+caller+`🟤 ${id_wh.id} size: ${id_wh.width} x ${id_wh.height}`, lb0);
    return id_wh;
};
/*}}}*/
/*  layout_load {{{*/
let layout_load = function()
{
let caller = "layout_load";
if(tag_this) log(MODULE+caller, lb0);

    let id_wh_storage_key = get_id_wh_storage_key();

    let val = localStorage.getItem( id_wh_storage_key);
    if(!val) return;
    let  id_wh_array = JSON.parse( val ) || [];

    for(let id_wh of id_wh_array)
    {
        let target = document.querySelector("#"+id_wh.id        );
        target.style.width                 =    id_wh.width +"px";
        target.style.height                =    id_wh.height+"px";

if(log_this) log(`🟤 Element ${id_wh.id} resized to: ${id_wh.width} x ${id_wh.height}`);
    }

    //note_DETAILS.open = true; // let load_details_open_state do this
};
/*}}}*/
// return {{{
return { add_notes_GUI

    //┌────────────────────────────────────────────────────────────────────────────┐
    ,    reset_input
    //│ ● called by
    //│   js_details.note_5_onclick_edit
    //│    notes.note_1_onclick_save
    //│    notes.note_2_onclick_import
    //│    notes.note_6_onclick_delete
    //└────────────────────────────────────────────────────────────────────────────┘

    //┌────────────────────────────────────────────────────────────────────────────┐
    , input_save
    //│ ● called by
    //│   js_notes.onload ➔ visibilitychange listener
    //│   js_details.note_5_onclick_edit
    //└────────────────────────────────────────────────────────────────────────────┘

    //┌────────────────────────────────────────────────────────────────────────────┐
    , input_load
    //│ ● called by
    //│      notes.load_notes
    //│      notes.load_server_notes
    //└────────────────────────────────────────────────────────────────────────────┘

    //┌────────────────────────────────────────────────────────────────────────────┐
    , layout_load
    //│ ● called by
    //│      js_notes.onload
    //└────────────────────────────────────────────────────────────────────────────┘
    , get value()       { return input.value      ; }
    , set value(val)    {  js_input_IO.value = val; }

    //┌────────────────────────────────────────────────────────────────────────────┐
    //│ PRIVATE:
    //├────────────────────────────────────────────────────────────────────────────┤
    //│ ● layout_look
    //│ ● layout_save
    //│ ● layout_eval
    //└────────────────────────────────────────────────────────────────────────────┘

};
//}}}
})();

//┌────────────────────────────────────────────────────────────────────────────┐
//│ INPUT EVENTS                                                              🔴
//└────────────────────────────────────────────────────────────────────────────┘
let js_input_IO = (function()
{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ [textarea] gets initialized inside [on] subscription
    //└────────────────────────────────────────────────────────────────────────┘
    let textarea;

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ UNIFIED DISPATCH FUNCTION ● Both `USER INPUT` and `CODE CHANGE`
    //└────────────────────────────────────────────────────────────────────────┘
    //{{{
    let notifyChange = function(oldValue, newValue)
    {
        let event = new CustomEvent("text_input:event", {
            bubbles: true,
            detail: { oldValue, newValue }
        });
        textarea.dispatchEvent( event );
    };
    //}}}

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ 1. HANDLE USER INPUT (NATIVE HANDLING)
    //└────────────────────────────────────────────────────────────────────────┘
    /*_ text_inputListener {{{*/
    let text_inputListener = function(e) /* eslint-disable-line no-unused-vars */
    {
        //┌────────────────────────────────────────────────────────────────────────┐
        //│ We don't have "oldValue" in native input events, so we store it
        //│ Actually, we can just use e.target.value and rely on the listener to know the new value.
        //│ But for full parity, let's use a property descriptor to get the old value cleanly.
        //└────────────────────────────────────────────────────────────────────────┘

        //┌────────────────────────────────────────────────────────────────────────┐
        //│ Simpler approach: Just pass the new value and let the listener compare if needed
        //│ OR: Use the descriptor trick for perfect parity.
        //└────────────────────────────────────────────────────────────────────────┘

        //┌────────────────────────────────────────────────────────────────────────┐
        //│ Let's use the descriptor trick for perfect parity (Old/New)
        //└────────────────────────────────────────────────────────────────────────┘
        let currentVal = textarea.value;

        //┌────────────────────────────────────────────────────────────────────────┐
        //│ We need to know what it was before this input event.
        //│ Since 'input' fires *after* the DOM update, we can't get the 'old' value easily
        //│ without a stored reference or a descriptor.
        //└────────────────────────────────────────────────────────────────────────┘

        //┌────────────────────────────────────────────────────────────────────────┐
        //│ EASIEST PURE JS WAY: Just trigger the event with the new value.
        //│ The listener can compare against a stored state if needed.
        //└────────────────────────────────────────────────────────────────────────┘
        notifyChange(textarea.dataset.prevValue || "", currentVal);

        textarea.dataset.prevValue = currentVal;
    };
    /*}}}*/

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ 2. HANDLE CODE CHANGES (CENTRALIZED SETTER)
    //└────────────────────────────────────────────────────────────────────────┘
    //{{{
    let setValue = function(val)
    {
        let oldVal = textarea.value;
        if( oldVal === val) return;

        textarea.value = val;

        //┌────────────────────────────────────────────────────────────────────┐
        //│ Update stored prev value for next 'input' event
        //└────────────────────────────────────────────────────────────────────┘
        textarea.dataset.prevValue = val;

        notifyChange(oldVal, val);
    };
    //}}}

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PUBLIC
    //└────────────────────────────────────────────────────────────────────────┘
//{{{
return {

    //┌──────────────────────────────────────────────────────────────────────┐
    //│ GET SET
    //└──────────────────────────────────────────────────────────────────────┘
    get value()      { return textarea.value; },
    set value(val)   { setValue( val ); },

    //┌──────────────────────────────────────────────────────────────────────┐
    //│ SUBSCRIBE—UNSUBSCRIBE ● returns the un-subscribe function
    //└──────────────────────────────────────────────────────────────────────┘
    on: (ta, fn) => { textarea = ta;
        textarea              .addEventListener   ("input", text_inputListener); // centralize
        textarea              .addEventListener   ("text_input:event"     , fn); // redispatch
        return () =>  textarea.removeEventListener("text_input:event"     , fn); // redispatch
    }
};
//}}}
})();
//" Usage example {{{

//    //┌────────────────────────────────────────────────────────────────────────┐
//    //│ Initialize listener
//    //└────────────────────────────────────────────────────────────────────────┘
//    let unsubscribe = js_input_IO.on(input, (e) => {
//      console.log(`Value changed: "${e.detail.oldValue}" → "${e.detail.newValue}"`);
//    });

//    //┌────────────────────────────────────────────────────────────────────────┐
//    //│ Change via code (Triggers listener)
//    //└────────────────────────────────────────────────────────────────────────┘
//    js_input_IO.value = "Hello World";

//    //┌────────────────────────────────────────────────────────────────────────┐
//    //│ User types in the box (Triggers listener)
//    //│ User types "Test" -> Listener fires: "Hello World" -> "Hello WorldTest"
//    //└────────────────────────────────────────────────────────────────────────┘

//    //┌────────────────────────────────────────────────────────────────────────┐
//    //│ Stop listening
//    //└────────────────────────────────────────────────────────────────────────┘
//    unsubscribe();

//    "}}}
//globalThis.js_input = js_input;
export { js_input }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_input = js_input;
