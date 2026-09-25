//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_notes.js     ● $APROJECTS/LANServer/SERVER       ● _TAG (260925:02h:41) │
//├────────────────────────────────────────────────────────────────────────────┤
//│ 🔴 Create, save, load and delete Notes in a section at the end of the body │
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/

// globals js_VIEW  */ // STUB FOR MVC VIEW
/* globals notes    */
/* globals js_input */

/*}}}*/
let js_notes    = (function()
{
//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_notes ● DATA ● LOAD ● LOCAL STORAGE ● NOTE TABLE ● STATUS LINE         🟤
//├────────────────────────────────────────────────────────────────────────────┤
//{{{

//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_notes ● DATA ● SERVER/style/notes.css ● SERVER/style/qtext.css         ●
//├────────────────────────────────────────────────────────────────────────────┤
/*{{{*/
let log_this = false;
let tag_this = false || log_this;

/* ●  BUTTONS {{{*/
const BUTTON_WASTED_NAME  = "No Deleted Notes";
const BUTTON_WASTED_TITLE = "▲ Import Deleted Notes";

const BUTTON_EXPORT_NAME  = "Export → 📝";
const BUTTON_EXPORT_TITLE = "Export Notes\nto Clipboard";

//nst BUTTON_IMPORT_NAME  = "<sub>↓</sub> Import <sup>↑</sup>";
const BUTTON_IMPORT_NAME  =            "↓ Import ↑";
const BUTTON_IMPORT_TITLE = "Import Notes\npasted in Input\n▲ above";

const STATUS_LINE_TITLE   = "Click: brighter — bigger — dimmer";

/*}}}*/
/* ●  NOTE_DETAILS_HTML {{{*/
const NOTE_DETAILS_HTML   = `
<summary >📝 My Notes for This Page</summary>
<div>
    <button   id="narr_button"         onclick='js_notes.narrower             (event);'></button>
    <button   id="tune_button"         onclick='js_notes.tunesize             (event);'></button>
    <button   id="wide_button"         onclick='js_notes.wider                (event);'></button>
    <br>
    <textarea id="note_input_TEXTAREA" placeholder="${notes.PLACEHOLDER_CREATE_PROMPT}"></textarea>
    <button   id="save_note_BUTTON"        XXclick='   notes.note_1_onclick_save  (event)'                               >Save Note</button>
    <button   id="wasted_note_BUTTON"      onclick='   notes.note_7_onclick_wasted(event)' title='${BUTTON_WASTED_TITLE}'>${BUTTON_WASTED_NAME}</button>
    <button       class="cb_BUTTON"        onclick='   notes.note_3_onclick_export(event)' title='${BUTTON_EXPORT_TITLE}'>${BUTTON_EXPORT_NAME}</button>
    <button       class="cb_BUTTON"        onclick='   notes.note_2_onclick_import(event)' title='${BUTTON_IMPORT_TITLE}'>${BUTTON_IMPORT_NAME}</button>
    <DIV      id="saved_notes_DIV">
     <TABLE   id="saved_notes_TABLE"></TABLE>
    </DIV>
    <div      id="status_line"         onclick='js_notes.tune_status  (event);' title='${STATUS_LINE_TITLE}'  ></div>
</div>
`;
/*}}}*/

/*_ wider {{{*/
let wider = function()
{
if(tag_this) console.log("wider");

    let rect = input.getBoundingClientRect();
    input.style.width = parseInt(rect.width * 1.2)+"px";
};
/*}}}*/
/*_ tunesize {{{*/
let tunesize = function(e)
{
if(tag_this) console.log("tunesize");

    let w;
    switch(e.target.className)
    {
    case "layout1": w =  "300px";  input.style.width = w;  saved_notes_DIV.style.width = w; e.target.title = e.target.className = "layout2"; break; /* eslint-disable-line no-multi-assign */
    case "layout2": w =  "700px";  input.style.width = w;  saved_notes_DIV.style.width = w; e.target.title = e.target.className = "layout3"; break; /* eslint-disable-line no-multi-assign */
    case "layout3": w =  "900px";  input.style.width = w;  saved_notes_DIV.style.width = w; e.target.title = e.target.className = "layout4"; break; /* eslint-disable-line no-multi-assign */
    case "layout4": w = "1000px";  input.style.width = w;  saved_notes_DIV.style.width = w; e.target.title = e.target.className = "default"; break; /* eslint-disable-line no-multi-assign */
    default       : w =  "500px";  input.style.width = w;  saved_notes_DIV.style.width = w; e.target.title = e.target.className = "layout1"; break; /* eslint-disable-line no-multi-assign */
    }
};
/*}}}*/
/*_ narrower {{{*/
let narrower = function(e) /* eslint-disable-line no-unused-vars */
{
if(tag_this) console.log("narrower");

    let rect = input.getBoundingClientRect();
    input.style.width = parseInt(rect.width * 0.8)+"px";
};
/*}}}*/

/* ●  BULLETS {{{*/
const BULLETS
        = [ "◯"
          , "🟤"
          , "🔴"
          , "🟠"
          , "🟡"
          , "🟢"
          , "🔵"
          , "🟣"
          , "⚫"
          , "⚪️"
        ];

/*}}}*/
// ●  auto_save INTERVAL ● auto_save TAG ●  CSS BG {{{
const AUTO_SAVE_INTERVAL_MS = 5000;
const AUTO_SAVE_TAG         = "(auto_save)\n";
const BG = [ /* eslint-disable-line no-unused-vars */
  "#964B00A0"
, "#FF0000A0"
, "#FFA500A0"
, "#FFFF00A0"
, "#9ACD32A0"
, "#6495EDA0"
, "#EE82EEA0"
, "#A0A0A0A0"
, "#FFFFFFA0"
, "#00000080"
];
//}}}

/*}}}*/
//└────────────────────────────────────────────────────────────────────────────┘

//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_notes ● LOAD                                                           ●
//├────────────────────────────────────────────────────────────────────────────┤
/* onload {{{*/
let onload = function()
{
if(tag_this) console.log("onload");
    // Save unfinished Notes when the user is leaving the tab {{{
    document.addEventListener("visibilitychange", function(e) {
        if( document.hidden )
        {
            js_input.input_save("visibilitychange listener");
            notes.note_1_onclick_save ( e );
        }
    });
    //}}}
    // Auto-save user input content until submitted with a save-buton click {{{
    setInterval(   notes.note_1_onclick_save, AUTO_SAVE_INTERVAL_MS, { type: "auto_save" });

    //}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ GUI LEAK ● DATA ➔ VIEW                                                 │
    //└────────────────────────────────────────────────────────────────────────┘
    add_notes_DETAILS();
    // Load saved Notes from localStorage {{{
    layout_notes("onload");

    //}}}
    // Restore last stored layout {{{*/
    js_input.layout_load();

    //}}}
//  js_VIEW.init();
};
/*}}}*/
//└────────────────────────────────────────────────────────────────────────────┘

//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_notes ● NOTES TABLE                                                    ●
//├────────────────────────────────────────────────────────────────────────────┤
/*_ add_notes_DETAILS {{{*/
/*{{{*/
let note_DETAILS;
let saved_notes_DIV;
let saved_notes_TABLE;
let input;
let save_note_BUTTON;
let wasted_note_BUTTON;
let status_line;

/*}}}*/
let add_notes_DETAILS = function()
{
if(tag_this) console.log("🔴 add_notes_DETAILS");

    // Create a Notes section near the bottom of the page {{{
/*{{{
    let note_DETAILS_STYLE          = document.createElement("LINK");
        note_DETAILS_STYLE.href     = NOTES_DETAILS_CSS_DATA;
        note_DETAILS_STYLE.id       = "notes_details_style";
        note_DETAILS_STYLE.type     = "text/css";
        note_DETAILS_STYLE.charset  = "utf-8";
        note_DETAILS_STYLE.rel      = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild( note_DETAILS_STYLE );
}}}*/

    note_DETAILS                    = document.createElement("DETAILS");
    note_DETAILS.id                 = "note_DETAILS";
    note_DETAILS.className          = "empty";
    note_DETAILS.innerHTML          = NOTE_DETAILS_HTML;

    document.body.appendChild( note_DETAILS );
    //}}}
//    /* ● sm_badge {{{*/
//    if( smTracer.log() )
//    {
//        let div
//            = document.createElement("DIV");

//        div.id
//            = "smTracer";

//        div.innerHTML
//            = "<span title='LOADING' class='LOADING'>🅻</span>"
//            + "<span title='READY'   class='READY'  >🆁</span>"
//            + "<span title='INPUT'   class='INPUT'  >🅸</span>"
//            + "<span title='UPDATE'  class='UPDATE' >🆄</span>";

//        note_DETAILS
//            .parentElement
//            .insertBefore(div, note_DETAILS);

//        div.classList.add("logging");
//        div.addEventListener("click", (e) => e.target.classList.toggle("logging", smTracer.logging()));
//    }
//    /*}}}*/
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ DOM ● note_DETAILS ● saved_notes_TABLE ● input ● save_note_BUTTON      │
    //└────────────────────────────────────────────────────────────────────────┘
    //{{{

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ NOTES ● scrollable div and table                                       │
    //└────────────────────────────────────────────────────────────────────────┘
    saved_notes_DIV     = document.querySelector("#saved_notes_DIV"  );
    saved_notes_TABLE   = document.querySelector("#saved_notes_TABLE");

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ INPUT TEXTAREA                                                         │
    //└────────────────────────────────────────────────────────────────────────┘
    input               = document.querySelector("#note_input_TEXTAREA");
    input.setAttribute("placeholder", notes.PLACEHOLDER_CREATE_PROMPT);

    input.addEventListener("blur" , input_blur_listener);
    input.addEventListener("focus", input_focus_listener);

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ SAVE BUTTON                                                            │
    //└────────────────────────────────────────────────────────────────────────┘
    save_note_BUTTON    = document.querySelector("#save_note_BUTTON");
    save_note_BUTTON    .setAttribute("disabled",""); // 2 arguments required

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ WASTED BUTTON                                                          │
    //└────────────────────────────────────────────────────────────────────────┘
    wasted_note_BUTTON  = document.querySelector("#wasted_note_BUTTON");
    wasted_note_BUTTON  .setAttribute("disabled",""); // 2 arguments required

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ STATUS-LINE                                                            │
    //└────────────────────────────────────────────────────────────────────────┘
    status_line         = document.querySelector("#status_line");

    //}}}
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
                         ,    note_DETAILS
                         ,    saved_notes_DIV
                         ,    saved_notes_TABLE
   });

};
/*}}}*/
//_ layout_notes — 🟤🔴🟠🟡🟢🔵🟣⚫⚪️◯ {{{
/*{{{*/
let layout_count = 0;

/*}}}*/
let layout_notes = function(_caller="?",index=-1)
{
if(tag_this) console.log("🔴 layout_notes ← "+ _caller);
//console.trace();//FIXME
    /* 1. LOAD NOTES from server or localStorage {{{*/
    let nArray = notes.get_nArray();
    if(!nArray.length && !notes.get_notes_loaded_from())
    {
        notes.load_notes();
        nArray = [];
    }
    /*}}}*/
    /* 2. POPULATE OR CLEAR [note_row] {{{*/
    let innerHTML = nArray.length
        ? nArray.map((n, i) => ""
+ "<!--🟤🔴🟠🟡🟢🔵🟣⚫⚪️◯-->"
+ "<TR          class='note_row "+   notes.get_checked(i)+(n.text.includes(AUTO_SAVE_TAG) ? " auto_save":"")+"'"
//                                  " title='"+ escapeHTML(n.text).replace(AUTO_SAVE_TAG               , "")+"'"
+                            " data-content='"+ escapeHTML(n.text).replace(AUTO_SAVE_TAG               , "")+"'"
+                            " data-id='"     + i                                                           +"'"
+  "                                                      XXXlick='js_notes.note_5_onclick_edit  (event, "+i+")'>"
+  "<TD><button class='check_button'  title='Check note'  onclick='   notes.note_4_onclick_check (event, "+i+")'></button></TD>"
+  "<TD><button class='edit_button'   title='Edit note'                                                         ></button></TD>"
+  "<TD><div    class='truncated'>"+            escapeHTML(n.text)                                          +"</div>   </TD>"
+  "<TD><small  class='timestamp'                         onclick='event.cancelBubble = true;'>"+ new Date(n.timestamp).toLocaleString() +"</small></TD>"
+  "<TD><button class='delete_button' title='Delete note' XXclick='   notes.note_6_onclick_delete(event, "+i+")'></button></TD>"
+ "</TR>"
).join("")

        : "<TR><TD class='no_notes_yet_TD' colspan='5'>No notes yet</TD></TR";

    saved_notes_TABLE.innerHTML =            "<TABLE id='saved_notes_TABLE'>"+ innerHTML +"</TABLE>";
    /*}}}*/
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ IF "No notes yet" → layout_notes will be called with next load results │
    //└────────────────────────────────────────────────────────────────────────┘
    layout_count += 1;
    tail_status(tics_status(layout_count), notes.get_notes_loaded_from());

    // STANDOUT LAST HANDLED NOTE
    notes.standout_note_at_index( index );

    // DISPLAY FILE NAME ● NUMBER OF NOTE ● FROM SERVER OR CLIENT
    notes.update_summary();
};
//}}}
//└────────────────────────────────────────────────────────────────────────────┘

//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_notes ● STATUS LINE                                                    ●
//├────────────────────────────────────────────────────────────────────────────┤
/*{{{*/
/*_ show_status {{{*/
let show_status = function(msg)
{
if(log_this) console.log("⚫ show_status( "+msg+" )");

    status_line.msg        = msg;
    status_line.innerHTML  = msg +" "+ (status_line.tail_msg || "");

    // ...with a copy to [save_note_BUTTON] title
    save_note_BUTTON.title = msg;
};
/*}}}*/
/*_ tail_status {{{*/
/*{{{*/
let tail_msg_1;
let tail_msg_2;
/*}}}*/
let tail_status = function(...args)
{
    // CACHE
    tail_msg_1 = args[0] ? args[0] : tail_msg_1;
    tail_msg_2 = args[1] ? args[1] : tail_msg_2;

    // TITLE
    status_line.title = STATUS_LINE_TITLE
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
/*_ tune_status {{{*/
let tune_status = function(e) /* eslint-disable-line no-unused-vars */
{
    if     ( !status_line.classList.contains("brighter") ) status_line.classList.add   ("brighter");
    else if( !status_line.classList.contains("bigger"  ) ) status_line.classList.add   ("bigger"  );
    else {                                                 status_line.classList.remove("brighter");
                                                           status_line.classList.remove("bigger"  );
    }
};
/*}}}*/
/*_ tics_status {{{*/
let tics_status = function( count )
{
    let   cent = parseInt(       count / 100);
    let   tens = parseInt(       count /  10);
    let   unit =                 count %  10 ;

    let b_cent = (count >= 100) ? BULLETS[  cent %  10] : "";
    let b_tens = (count >=  10) ? BULLETS[  tens %  10] : "";
    let b_unit = (count >=   0) ? BULLETS[  unit %  10] : "";

    return b_cent + b_tens + b_unit;
};
/*}}}*/
/*}}}*/
//└────────────────────────────────────────────────────────────────────────────┘

//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_notes ● UTIL                                                           ●
//├────────────────────────────────────────────────────────────────────────────┤
//{{{
/* ● copy_to_clipboard {{{*/
let copy_to_clipboard = function(buffer)
{
if(tag_this) console.log("copy_to_clipboard:");
if(log_this) console.log( buffer );

    navigator.clipboard.writeText( buffer );
};
/*}}}*/
/*● escapeHTML {{{*/
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
//}}}
//└────────────────────────────────────────────────────────────────────────────┘

//}}}
//└────────────────────────────────────────────────────────────────────────────┘

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🟢 EDIT   ● note_5_onclick_edit                                         ✎  │
//└────────────────────────────────────────────────────────────────────────────┘
//● note_5_onclick_edit ● onclick ● note_row {{{
let note_5_onclick_edit = function(e,index)
{
if(tag_this) console.log("🟢 note_5_onclick_edit: "+ e.type);

    // STORE CURRENT INPUT CONTENT (WILL BE RESTORED BY NEXT RELOAD)
    js_input.input_save("note_5_onclick_edit");

    // TOGGLE OFF ANY CURRENT EDIT
    let editing_note_index  = get_editing_note_index();
    if( editing_note_index >= 0)
    {
        js_input.reset_input("note_5_onclick_edit");

        if(index == editing_note_index)
            return;
    }

    // COMMIT INPUT CONTENT AS A [NEW] OR [EDITED] NOTE
    notes.note_1_onclick_save ( e );

    // CLEAR TEXTAREA EDIT PROMPT
    notes.reset_input_placeholder();

    let  note_row;
    if(e.target)
    {
        for(   note_row =   e.target
             ; note_row && !note_row.classList.contains("note_row")
             ; note_row =   note_row.parentElement
           );

    //  input.value = note_row.getAttribute("title") +"\n";
        input.value = note_row.dataset.content;//FIXME
    }
    else {
        let nArray = notes.get_nArray();
        input.value = nArray[index].text;
    }

    // EDITING A [checked] NOTE (OR NOT)
    if( notes.get_checked(index)) input.classList.add   ("checked");
    else                    input.classList.remove("checked");

    // ADD [index] INNTO [save_note_BUTTON] ATTRIBUTES
    set_editing_note_index( index );

    // MAKE FIRST SYNCHRONOUS CALL TO START TRACKING CHANGES
    notes.note_1_onclick_save( { type: "auto_save" } );
};
//}}}

//┌────────────────────────────────────────────────────────────────────────────┐
//│ CALLERS OF `save_note_auto`
//│
//│ ● USER CLICK      ➔ CLICK SAVE BUTTON
//│ ● USER INPUT      ➔ input_listener [sync on first user input input empty]
//│ ● js_notes.onload ➔ setInterval-AUTO_SAVE_INTERVAL_MS
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/
/*_ save_note_auto {{{*/
let save_note_auto = function(e={})
{
//{{{
let caller = "save_note_auto";
if(tag_this) console.log("🔴 "+ caller);

//}}}
    // SAME AS ORIGINAL ● save_note_BUTTON disabled {{{
    let   text = input.value.trim();
    if(  !text
       || is_input_auto_insert_prefix()
       || is_input_same_as_original()
      ) {
        save_note_BUTTON.setAttribute("disabled","");

        if(   is_last_note_auto_save()
//         && (e.type == "auto_save")
          ) {
if(tag_this) console.log("🔴 AUTO_SAVE DELETE NOTE");

            let nArray = notes.get_nArray();
            notes.note_6_onclick_delete(e, nArray.length-1);
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
        save_note_BUTTON.removeAttribute("disabled");
    }
    //}}}
    // SAME AS LAST SAVED {{{
    if( is_input_same_as_last_auto_save() )
    {
        return;
    }
    //}}}
    // CHANGED ● ADDING AUTO_SAVE NOTE {{{
    let nArray = notes.get_nArray();
    let index;
    if( is_last_note_auto_save() )
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
    }
    //}}}
};
/*}}}*/
/*_ is_input_same_as_original {{{*/
let is_input_same_as_original = function()
{
    let text    = input.value.trim();

    // edited note index
    let index = get_editing_note_index();

    // no original to compare to
    if(index < 0)
        return false;

    // input text == note text
    let auto_save_text = AUTO_SAVE_TAG + text;

    let nArray = notes.get_nArray();
    if(   nArray[index].text.trim()
       != auto_save_text.substring(AUTO_SAVE_TAG.length).trim()
      )
        return false;

if(log_this) console.log("⚫ AUTO_SAVE SAME AS ORIGINAL");
    return true;
};
/*}}}*/
/*_ is_input_same_as_last_auto_save {{{*/
let is_input_same_as_last_auto_save = function()
{
    let nArray = notes.get_nArray();
    let text    = input.value.trim();
    if(!nArray.length)
        return false;

    let auto_save_text  = AUTO_SAVE_TAG + text;
    if(nArray[nArray.length-1].text.trim() != auto_save_text.trim())
        return false;

if(log_this) console.log("🔵 AUTO_SAVE: INPUT UNCHANGED");
    return true;
};
            /*}}}*/
/*_ is_last_note_auto_save {{{*/
let is_last_note_auto_save = function()
{
    let nArray = notes.get_nArray();
   if(!nArray.length )
       return false;

    if(!nArray[nArray.length-1].text.startsWith(AUTO_SAVE_TAG) )
       return false;

if(log_this) console.log("🟣 AUTO_SAVE: LAST SAVED");
   return true;
};
/*}}}*/
/*_ set_editing_note_index {{{*/
/*{{{*/
const EDITING_NOTE_NUM       = "editing_note_num";
const BULLET_ECC_NUM         = "bullet_ecc_num";
/*}}}*/
let set_editing_note_index = function(index)
{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ SET   SAVE BUTTON ATTRIBUTE [EDITING_NOTE_NUM]
    //└────────────────────────────────────────────────────────────────────────┘

    if(index >= 0) {
        save_note_BUTTON.innerText= "Update Note #"+   (index + 1);
        save_note_BUTTON.setAttribute(EDITING_NOTE_NUM, index + 1);
        save_note_BUTTON.setAttribute(BULLET_ECC_NUM  ,(index + 1) % 10);

        //┌────────────────────────────────────────────────────────────────────┐
        //│ MARK PREVIOUS EDITED NOTE
        //└────────────────────────────────────────────────────────────────────┘
        saved_notes_TABLE.querySelectorAll(".editing").forEach((el) => {
            el.classList.remove(            "editing");
            el.classList.add   (            "edited" );
        });

        //┌────────────────────────────────────────────────────────────────────┐
        //│ SELECTED EDITING NOTE
        //└────────────────────────────────────────────────────────────────────┘
        saved_notes_TABLE.firstElementChild.children[index].classList.add("editing");
    }
    // CLEAR SAVE BUTTON ATTRIBUTE EDITING_NOTE_NUM
    else {
        //┌────────────────────────────────────────────────────────────────────┐
        //│ EDITING NOTE LIST ITEM DONE
        //└────────────────────────────────────────────────────────────────────┘
        saved_notes_TABLE.querySelectorAll(".editing").forEach((el) => {
            el.classList.remove(            "editing");
            el.classList.add   (            "edited");
        });

        let nArray = notes.get_nArray();
        save_note_BUTTON.innerText        = "Add Note #"+ (nArray.length+1);
        save_note_BUTTON.setAttribute(      "disabled","");
        save_note_BUTTON.removeAttribute( EDITING_NOTE_NUM );
        save_note_BUTTON.removeAttribute( BULLET_ECC_NUM   );
    }

    // standout edited note
    notes.standout_note_at_index( index );
};
/*}}}*/
/*_ get_editing_note_index {{{*/
let get_editing_note_index = function()
{
    //┌──────────────────────────────────┐
    //│ VIEW BUTTON AS DATA SOURE !!!!!! │
    //└──────────────────────────────────┘
    let    attr  = save_note_BUTTON.getAttribute( EDITING_NOTE_NUM );
    let    index = (attr != null) ? parseInt(attr-1) : -1;
    return index;
};
/*}}}*/
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ INPUT FOCUS-BLUR
//└────────────────────────────────────────────────────────────────────────────┘
/*● input_focus_listener {{{*/
let input_focus_listener = function()
{
//console.log("🟢 input_focus_listener");

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ● INSERT AUTO-INSERT NEW NOTE NUM
    //└────────────────────────────────────────────────────────────────────────┘
    if(!input.value ) {
        input.value      = get_input_auto_insert_prefix();
        input.classList.add("auto_insert_prefix");
    }
};
/*}}}*/
/*● input_blur_listener {{{*/
let input_blur_listener = function()
{
//console.log("⚫ input_blur_listener");

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ● CANCEL AUTO-INSERT NEW NOTE NUM
    //└────────────────────────────────────────────────────────────────────────┘
    if( is_input_auto_insert_prefix() )
    {
        input.value = "";
        save_note_auto();
    }
};
/*}}}*/
/*● is_input_auto_insert_prefix {{{*/
let is_input_auto_insert_prefix = function()
{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ● CHECK  AUTO-INSERT NEW NOTE NUM
    //└────────────────────────────────────────────────────────────────────────┘
    if(!input.value) return false;

    // contains the auto-number (trimming aside)

    let     new_note_num  = get_input_auto_insert_prefix();
    return (new_note_num.trim() == input.value.trim());

};
//}}}
/*_ get_input_auto_insert_prefix {{{*/
let get_input_auto_insert_prefix = function()
{
    let nArray       = notes.get_nArray();
    let num =           nArray.length + 1;

    if( is_last_note_auto_save() )
       num -= 1;

    return             num+".\t";
};
/*}}}*/

//{{{
    return { name: "js_notes"
        ,    onload

        ,    get_input  : () => input

        //   onclick
        ,    wider
        ,    tunesize
        ,    narrower
        ,    tune_status

        // used by notes
        , copy_to_clipboard
        , show_status

    // EDIT ● WAS IN SERVER/scripts/notes.js
    ,    note_5_onclick_edit            //...onclick
    ,    set_editing_note_index
    ,    get_editing_note_index
    ,    save_note_auto
    ,    is_input_same_as_original
    ,    is_input_same_as_last_auto_save
    ,    is_last_note_auto_save

        // DEBUG ONLY
        , get_input_auto_insert_prefix
        , is_input_auto_insert_prefix
        , escapeHTML
        , escape_note : (index) => escapeHTML( notes.get_nArray()[index].text )
        , layout_notes
        , print_note  : (index) =>             notes.get_nArray()[index].text
        , tail_status
        , tics_status
        , log         : () => { log_this = !log_this; console.log("log_this=["+log_this+"]"); }
        , tag         : () => { tag_this = !tag_this; console.tag("tag_this=["+tag_this+"]"); }
};
//}}}
})();
document.addEventListener("DOMContentLoaded", js_notes.onload);
