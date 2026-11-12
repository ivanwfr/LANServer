//┌─────────────────────────────────────────────────────────────────[...]
//│ js_details.js ● $APROJECTS/LANServer/SERVER    ● _TAG (261109:21h:29)
//├─────────────────────────────────────────────────────────────────[...]
//│ 🔵
//│
//│
//└─────────────────────────────────────────────────────────────────[...]
/* IMPORT {{{*/

/* globals js_MODEL  */
/* globals js_input  */
/* globals js_log    */
/* globals js_notes  */
/* globals js_ticker */
/* globals notes     */

//port { js_CNTRL   } from "./js_CNTRL.js"
import { js_MODEL   } from "./js_MODEL.js"
//port { js_VIEW    } from "./js_VIEW.js"
//port { js_boxing  } from "./js_boxing.js"
//port { js_folds   } from "./js_folds.js"
import { js_input   } from "./js_input.js"
//port { js_linkify } from "./js_linkify.js"
//port { js_log     } from "./js_log.js"
import { js_notes   } from "./js_notes.js"
//port { js_store   } from "./js_store.js"
import { js_ticker  } from "./js_ticker.js"
//port { js_xpath   } from "./js_xpath.js"
import { notes      } from "./notes.js"

/*}}}*/
let js_details  = (function()
{
//┌────────────────────────────────────────────────────────────────────────────┐
//│ ◯  INTERNING ● SERVER/scripts/js_log.js
//└────────────────────────────────────────────────────────────────────────────┘
const MODULE = "%c⭐🟢 js_details\t● ";
let log_this = false;
let tag_this = false || log_this;
//{{{
/* eslint-disable no-unused-vars */

js_log.register( { module_name : "js_details"
                 , module_num  : 6
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
// NOTE DIV, TABLE, AUTO_SAVE TAG AND INTERVAL {{{


const AUTO_SAVE_IDLE_INTERVAL_MS = 5000;
const AUTO_SAVE_EDIT_INTERVAL_MS = 1000;
const AUTO_SAVE_TAG         = "(auto_save)\n";

let note_DETAILS;
let saved_notes_DIV;
let saved_notes_TABLE;

const BUTTON_WASTED_NAME  = "No Deleted Notes";
const BUTTON_WASTED_TITLE = "▲ Import Deleted Notes";

const BUTTON_EXPORT_NAME  = "Export → 📝";
const BUTTON_EXPORT_TITLE = "Export Notes\nto Clipboard";

//nst BUTTON_IMPORT_NAME  = "<sub>↓</sub> Import <sup>↑</sup>";
const BUTTON_IMPORT_NAME  =            "↓ Import ↑";
const BUTTON_IMPORT_TITLE = "Import Notes\npasted in Input\n▲ above";

const STATUS_LINE_TITLE   = "Click: brighter — bigger — dimmer";

/*}}}*/

//┌─────────────────────────────────────────────────────────────────[...]
//│ CACHE DOM REFERENCES        🟤🟤🟤🟤🟤🟤🟤🟤🟤🟤
//└─────────────────────────────────────────────────────────────────[...]
/*● onload ● DIV & TABLE ➔ js_notes ● listen ● ticker {{{*/
let onload = function()
{
let caller = "onload";
if(tag_this) log(MODULE+caller, lbB);

    document.addEventListener("visibilitychange", function(e) {
        if( document.hidden )
        {
            js_input.input_save("visibilitychange listener");
            notes.note_1_onclick_save ( e );
        }
    });

    // NOTES VIEW
    add_notes_DETAILS();
    js_notes.add_notes_DETAILS({ saved_notes_DIV, saved_notes_TABLE });

    // NOTES VIEW DATA OUT
    js_notes.layout_notes("onload");

    // NOTES VIEW DATA IN
    js_input.layout_load();

    // NOTES SERVER UPDATE
    js_ticker.setInterval(() => notes.note_1_onclick_save({ type: "auto_save" }), AUTO_SAVE_IDLE_INTERVAL_MS);
};
/*}}}*/

//┌─────────────────────────────────────────────────────────────────[...]
//│ LAYOUT & RENDER             🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
//├────────────────────────────────────────────────────────────────────────────┤
//│ ● js_CNTRL       . onload
//│ └ ● js_details   . onload
//│   └ ● js_details . add_notes_DETAILS
//└─────────────────────────────────────────────────────────────────[...]
/*_ add_notes_DETAILS ● NOTE_DETAILS_HTML ● onclick {{{*/
let add_notes_DETAILS = function()
{
let caller = "add_notes_DETAILS";
if(tag_this) log(MODULE+caller, lbB);

const NOTE_DETAILS_HTML   = `
<summary >📝 My Notes for This Page</summary>
<div>
    <button   id="narr_button"             onclick='js_notes.narrower            (event);'></button>
    <button   id="tune_button"             onclick='js_notes.tunesize            (event);'></button>
    <button   id="wide_button"             onclick='js_notes.wider               (event);'></button>
    <br>
    <textarea id="note_input_TEXTAREA" placeholder="${notes.PLACEHOLDER_CREATE_PROMPT}"></textarea>
    <button   id="save_note_BUTTON"        XXclick='  notes.note_1_onclick_save  (event)'                               >Save Note</button>
    <button   id="wasted_note_BUTTON"      onclick='  notes.note_7_onclick_wasted(event)' title='${BUTTON_WASTED_TITLE}'>${BUTTON_WASTED_NAME}</button>
    <button       class="cb_BUTTON"        onclick='  notes.note_3_onclick_export(event)' title='${BUTTON_EXPORT_TITLE}'>${BUTTON_EXPORT_NAME}</button>
    <button       class="cb_BUTTON"        onclick='  notes.note_2_onclick_import(event)' title='${BUTTON_IMPORT_TITLE}'>${BUTTON_IMPORT_NAME}</button>
    <DIV      id="saved_notes_DIV">
     <TABLE   id="saved_notes_TABLE"></TABLE>
    </DIV>
    <div      id="status_line"             onclick='js_notes.tune_status  (event);' title='${STATUS_LINE_TITLE}'  ></div>
</div>
`;

    note_DETAILS                    = document.createElement("DETAILS");
    note_DETAILS.id                 = "note_DETAILS";
    note_DETAILS.className          = "empty";
    note_DETAILS.innerHTML          = NOTE_DETAILS_HTML;

    document.body.appendChild( note_DETAILS );

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ INPUT TEXTAREA                                                         │
    //└────────────────────────────────────────────────────────────────────────┘
    let input       = document.querySelector("#note_input_TEXTAREA");
    input.setAttribute("placeholder", notes.PLACEHOLDER_CREATE_PROMPT);

    input.addEventListener("blur" , input_blur_listener);
    input.addEventListener("focus", input_focus_listener);

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ SAVE BUTTON                                                            │
    //└────────────────────────────────────────────────────────────────────────┘
    let save_note_BUTTON = document.querySelector("#save_note_BUTTON");
    if( save_note_BUTTON ) save_note_BUTTON .setAttribute("disabled",""); // 2 arguments required

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ WASTED BUTTON                                                          │
    //└────────────────────────────────────────────────────────────────────────┘
    let wasted_note_BUTTON  = document.querySelector("#wasted_note_BUTTON");
    wasted_note_BUTTON  .setAttribute("disabled",""); // 2 arguments required

    saved_notes_DIV   = document.querySelector("#saved_notes_DIV"  );
    saved_notes_TABLE = document.querySelector("#saved_notes_TABLE");

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ GUI VIEW LEAK ➔ DATA
    //└────────────────────────────────────────────────────────────────────────┘
    notes.add_notes_GUI( { input
                         , note_DETAILS
                         , saved_notes_TABLE
                         , save_note_BUTTON
                         , wasted_note_BUTTON
    });

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ GUI VIEW ➔ INPUT EVENTS HANDLER
    //└────────────────────────────────────────────────────────────────────────┘
    js_input.add_notes_GUI( { input
                            , note_DETAILS
                            , saved_notes_DIV
                            , saved_notes_TABLE
   });
    return true;
};
/*}}}*/

//┌─────────────────────────────────────────────────────────────────[...]
//│ EDIT NOTE                   🟠🟠🟠🟠🟠🟠🟠🟠🟠🟠
//│ MOVED FROM SERVER/scripts/notes.js
//│ CALLED BY  SERVER/scripts/js_details.js
//│ CALLED BY  SERVER/scripts/js_VIEW.js
//└─────────────────────────────────────────────────────────────────[...]
//● note_5_onclick_edit {{{
let note_5_onclick_edit = function(e,index)
{
// log {{{
let caller = "note_5_onclick_edit";
if(tag_this) log(MODULE+caller+"%c e.type "+ e.type +"%c index "+ index, lb0, lb0+lf1, lb0+lf2);
//}}}
    // STORE CURRENT INPUT CONTENT (to be restored by next reload) {{{
    js_input.input_save(caller);

    //}}}
    // TOGGLE OFF ANY CURRENT EDIT {{{
    let editing_note_index  = get_editing_note_index();
    if( editing_note_index >= 0)
    {
        js_input.reset_input(caller);
        if(index == editing_note_index)
            return;
    }
    //}}}
    // COMMIT INPUT CONTENT AS A [NEW] OR [EDITED] NOTE {{{
    notes.note_1_onclick_save ( e );

    //}}}
    // CLEAR TEXTAREA EDIT PROMPT {{{
    notes.reset_input_placeholder();

    let note_row;
    if( e.target )
    {
        for(  note_row =   e.target
            ; note_row && !note_row.classList.contains("note_row") // ? may used closest ?
            ; note_row =   note_row.parentElement
           );

        js_input.value = note_row.dataset.content;
    }
    else {
        let nArray     = js_MODEL.get_nArray();
        js_input.value = nArray[index].text;
    }

    let input = document.querySelector("#note_input_TEXTAREA");
    input.classList.remove("auto_insert_prefix");

    //}}}
    // STATE_EDITING A [checked] NOTE (OR NOT) {{{
    if( notes.get_checked(index)) input.classList.add   ("checked");
    else                          input.classList.remove("checked");

    //}}}
    // ADD [index] INTO [save_note_BUTTON] ATTRIBUTES {{{
    set_editing_note_index( index );

    //}}}
    // MAKE FIRST SYNCHRONOUS CALL TO START TRACKING CHANGES {{{
    notes.note_1_onclick_save( { type: "auto_save" } );
    //}}}
};
//}}}
/*_ set_editing_note_index {{{*/
const EDITING_NOTE_NUM     = "editing_note_num";
const BULLET_ECC_NUM       = "bullet_ecc_num";

let set_editing_note_index = function(index)
{
    // 1/2 - SET   SAVE BUTTON ATTRIBUTE [EDITING_NOTE_NUM] {{{
    if(index >= 0)
    {
        let save_note_BUTTON = document.querySelector("#save_note_BUTTON");
        if( save_note_BUTTON ) {
            save_note_BUTTON.innerText= "Update Note #"+   (index + 1);
            save_note_BUTTON.setAttribute(EDITING_NOTE_NUM, index + 1);
            save_note_BUTTON.setAttribute(BULLET_ECC_NUM  ,(index + 1) % 10);
        }

        // MARK PREVIOUS EDITED NOTE
        saved_notes_TABLE.querySelectorAll(".editing").forEach((el) => {
            el.classList.remove(            "editing");
            el.classList.add   (            "edited" );
        });

        // SELECTED STATE_EDITING NOTE
        saved_notes_TABLE.firstElementChild.children[index].classList.add("editing");
    }
    //}}}
    // 2/2 - CLEAR SAVE BUTTON ATTRIBUTE EDITING_NOTE_NUM {{{
    else {
        // STATE_EDITING NOTE LIST ITEM DONE
        saved_notes_TABLE.querySelectorAll(".editing").forEach((el) => {
            el.classList.remove(            "editing");
            el.classList.add   (            "edited");
        });

        // NEW LAST NOTE NUMBER
        index = js_MODEL.get_nArray().length;

        let save_note_BUTTON = document.querySelector("#save_note_BUTTON");
        if( save_note_BUTTON )
        {
            save_note_BUTTON.innerText      =     "Add Note #"+ (index + 1);
            save_note_BUTTON.setAttribute   (       "disabled", "");
            save_note_BUTTON.removeAttribute( EDITING_NOTE_NUM    );
            save_note_BUTTON.setAttribute   (   BULLET_ECC_NUM, (index+1) % 10);
        }
    }
    //}}}
    // STANDOUT LAST EDITED NOTE {{{
    notes.standout_note_at_index( index );

    //}}}
};
/*}}}*/
/*_ get_editing_note_index {{{*/
let get_editing_note_index = function()
{
    //┌────────────────────────────────────────────┐
    //│ SAVE BUTTON attribute USED AS DATA SOURCE! │
    //└────────────────────────────────────────────┘
    let index = -1;
    let save_note_BUTTON = document.querySelector("#save_note_BUTTON");
    if( save_note_BUTTON ) {
        let attr = save_note_BUTTON.getAttribute( EDITING_NOTE_NUM );
        if( attr ) index = parseInt(attr-1);
    }
    return index;
};
/*}}}*/

//┌─────────────────────────────────────────────────────────────────[...]
//│ AUTO-SAVE EDITED NOTE       🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡
//└─────────────────────────────────────────────────────────────────[...]
/*_ save_note_auto {{{*/
let save_note_auto = function(e={})
{
//{{{
let caller = "save_note_auto";
if(tag_this) log(MODULE+caller, lb0);

//}}}
    // SAME AS ORIGINAL ● save_note_BUTTON disabled {{{
    let  input = document.querySelector("#note_input_TEXTAREA");
    let   text = input.value.trim();
    if(  !text
       || is_input_auto_insert_prefix()
       || is_input_same_as_original()
      ) {
        let save_note_BUTTON = document.querySelector("#save_note_BUTTON");
        if( save_note_BUTTON ) save_note_BUTTON.setAttribute("disabled","");

        if(notes.is_last_note_auto_save())
        {
if(tag_this) log("🔴 AUTO_SAVE DELETE NOTE");

            let nArray = js_MODEL.get_nArray();
            notes.note_6_onclick_delete(e, nArray.length-1);

            js_ticker.changeInterval( js_details.AUTO_SAVE_IDLE_INTERVAL_MS );
            input.classList.remove("edit");
        }
        return;
    }
    //}}}
    /* NO INPUT TEXT ● ...return {{{*/
    if( !text )
        return;
    /*}}}*/
    // SOME INPUT MODS              ● save_note_BUTTON  enabled {{{
    else {
        let save_note_BUTTON = document.querySelector("#save_note_BUTTON");
        if( save_note_BUTTON ) save_note_BUTTON.removeAttribute("disabled");
    }
    //}}}
    // SAME AS LAST SAVED {{{
    if( is_input_same_as_last_auto_save() )
    {
        return;
    }
    //}}}
    // CHANGED ● ADDING AUTO_SAVE NOTE {{{
    let nArray = js_MODEL.get_nArray();
    let index;
    if( notes.is_last_note_auto_save() )
    {
        index = nArray.length-1;
    }
    else {
        index = nArray.length;
    }
    if( index >= 0) {
        text      = AUTO_SAVE_TAG + text;
        if(index >= nArray.length) nArray.push({ text , timestamp: Date.now() });
        else                       nArray[index].text = text;
        js_notes.layout_notes(caller, index);

            js_ticker.changeInterval( AUTO_SAVE_EDIT_INTERVAL_MS );
            input.classList.add("edit");
    }
    //}}}
};
/*}}}*/
/*_ is_input_same_as_original {{{*/
let is_input_same_as_original = function()
{
    let input = document.querySelector("#note_input_TEXTAREA");
    let text  = input.value.trim();

    // edited note index
    let index = get_editing_note_index();

    // no original to compare to
    if(index < 0)
        return false;

    // input text == note text
    let auto_save_text = AUTO_SAVE_TAG + text;

    let nArray = js_MODEL.get_nArray();
    if(   nArray[index].text.trim()
       != auto_save_text.substring(AUTO_SAVE_TAG.length).trim()
      )
        return false;

//{{{
let caller = "is_input_same_as_original";
if(log_this) log(MODULE+caller+"⚫ AUTO_SAVE SAME AS ORIGINAL", lb0);
//}}}
    return true;
};
/*}}}*/
/*_ is_input_same_as_last_auto_save {{{*/
let is_input_same_as_last_auto_save = function()
{
    let input  = document.querySelector("#note_input_TEXTAREA");
    let text   = input.value.trim();
    let nArray = js_MODEL.get_nArray();
    if(!nArray.length)
        return false;

    let auto_save_text  = AUTO_SAVE_TAG + text;
    if(nArray[nArray.length-1].text.trim() != auto_save_text.trim())
        return false;

//{{{
let caller = "is_input_same_as_last_auto_save";
if(log_this) log(MODULE+caller+"🔵 AUTO_SAVE: INPUT UNCHANGED", lb0);
//}}}
    return true;
};
            /*}}}*/

//┌─────────────────────────────────────────────────────────────────[...]
//│ INPUT FOCUS-BLUR            🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
//└─────────────────────────────────────────────────────────────────[...]
/*● input_focus_listener {{{*/
let input_focus_listener = function()
{
//{{{
let caller = "input_focus_listener";
if(log_this) log(MODULE+caller+"🟢 input_focus_listener", lb0);
//}}}

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ● INSERT AUTO-INSERT NEW NOTE NUM
    //└────────────────────────────────────────────────────────────────────────┘
    let input = document.querySelector("#note_input_TEXTAREA");
    if(!input.value ) {
     // input.value      = get_input_auto_insert_prefix();
     js_input.value      = get_input_auto_insert_prefix();
        input.classList.add("auto_insert_prefix");
    }
};
/*}}}*/
/*● input_blur_listener {{{*/
let input_blur_listener = function()
{
//{{{
let caller = "input_blur_listener";
if(log_this) log(MODULE+caller+"⚫ input_blur_listener", lb0);
//}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ● EVENT_CANCEL AUTO-INSERT NEW NOTE NUM
    //└────────────────────────────────────────────────────────────────────────┘
    if( is_input_auto_insert_prefix() )
    {
     // input.value = "";
     js_input.value = "";
        save_note_auto();
    }
};
/*}}}*/
/*● is_input_auto_insert_prefix {{{*/
let is_input_auto_insert_prefix = function()
{
//{{{
let caller = "is_input_auto_insert_prefix";
if(log_this) log(MODULE+caller+"⚫ input_blur_listener", lb0);
//}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ● CHECK  AUTO-INSERT NEW NOTE NUM
    //└────────────────────────────────────────────────────────────────────────┘
    let input = document.querySelector("#note_input_TEXTAREA");
    if(!input      ) return false;
    if(!input.value) return false;

    // contains the auto-number (trimming aside)

    let     new_note_num  = get_input_auto_insert_prefix();
    return (new_note_num.trim() == input.value.trim());

};
//}}}
/*_ get_input_auto_insert_prefix {{{*/
let get_input_auto_insert_prefix = function()
{
    let nArray       = js_MODEL.get_nArray();
    let num =           nArray.length + 1;

    if( notes.is_last_note_auto_save() )
       num -= 1;

    return             num+".\t";
};
/*}}}*/

    // return {{{
    return { name: "js_details"
        ,    get_editing_note_index

        ,    is_input_auto_insert_prefix
        ,    is_input_same_as_last_auto_save

        ,    note_5_onclick_edit            //...onclick

        ,    onload
        ,    save_note_auto
        ,    set_editing_note_index

    };
    //}}}

})();
export { js_details }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_details = js_details; // exposed to inline onclick handlers

