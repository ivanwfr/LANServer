//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_notes.js     ● $APROJECTS/LANServer/SERVER       ● _TAG (260923:23h:33) │
//├────────────────────────────────────────────────────────────────────────────┤
//│ 🔴 Create, save, load and delete Notes in a section at the end of the body │
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/

// globals js_VIEW */ // STUB FOR MVC VIEW
/* globals notes  */

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
            save_input("visibilitychange listner");
               notes.note_1_onclick_save ( e );
        }
    });
    //}}}
    // Auto-save user input content until submted with a save-buton click {{{
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
    load_id_wh();

    //}}}
//  js_VIEW.init();
};
/*}}}*/
//└────────────────────────────────────────────────────────────────────────────┘

//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_notes ● LOCAL STORAGE                                                  ●
//├────────────────────────────────────────────────────────────────────────────┤
/*_ get_page_storage_key ● get_page_fileName {{{*/
/*{{{*/
let parsed_location_href;
/*}}}*/
let get_page_storage_key = function()
{
    if(   !parsed_location_href ) parse_location_href();
    return parsed_location_href.page_storage_key;
};
let get_page_fileName = function()
{
    if(   !parsed_location_href ) parse_location_href();
    return parsed_location_href.fileName;
};

let parse_location_href = function()
{
if(log_this) console.log("◯ get_page_storage_key");

    let matches
        = location.href
        .  match(/(^.*\/\/[^\/]*)\/(.*)\/(.*)/ ,  "");
    //┌───────────▲────────────────▲─────▲─────────────────────────────────────┐
    //│           |                |     |                                     │
    //│           |                |     (js_notes.js)                         │
    //│           |                (APROJECTS_USR_SERVER_scripts/js_notes.js   │
    //│           (https://192.168.1.14:447)                                   │
    //└────────────────────────────────────────────────────────────────────────┘
    let baseName         = matches[1].replace(/\W+/g, "_");
    let pathName         = matches[2].replace(/\W+/g, "_");
    let fileName         = matches[3].replace(/\W+/g, "_");
    let page_storage_key = (pathName+"__"+fileName);

/*{{{*/
if(log_this) {
    console.log("◯ baseName         \t\t["+ baseName          +"]\n"
               +"◯ pathName         \t\t["+ pathName          +"]\n"
               +"◯ fileName         \t\t["+ fileName          +"]\n"
               +"◯ page_storage_key \t\t["+ page_storage_key  +"]\n");
}
/*}}}*/

    parsed_location_href = { baseName , pathName , fileName , page_storage_key };
};
let get_notes_storage_key = function() { return "notes__"+ get_page_storage_key(); };
let get_input_storage_key = function() { return "input__"+ get_page_storage_key(); };
let get_id_wh_storage_key = function() { return "id_wh__"+ get_page_storage_key(); };
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

    TextArea_IO.on( input , input_listener);
    resize_observe( input );

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
    //│ GUI LEAK ● DATA ➔ VIEW                                                 │
    //└────────────────────────────────────────────────────────────────────────┘
    notes.add_notes_GUI( { note_DETAILS
                         , input
                         , save_note_BUTTON
                         , wasted_note_BUTTON
                         , saved_notes_TABLE
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
    /* 2. POPULATE OR CLEAR [node_row] {{{*/
    let innerHTML = nArray.length
        ? nArray.map((n, i) => ""
+ "<!--🟤🔴🟠🟡🟢🔵🟣⚫⚪️◯-->"
+ "<TR          class='node_row "+   notes.get_checked(i)+(n.text.includes(AUTO_SAVE_TAG) ? " auto_save":"")+"'"
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
//● note_5_onclick_edit ● onclick ● node_row {{{
let note_5_onclick_edit = function(e,index)
{
if(tag_this) console.log("🟢 note_5_onclick_edit: "+ e.type);

    // STORE CURRENT INPUT CONTENT (WILL BE RESTORED BY NEXT RELOAD)
    js_notes.save_input("note_5_onclick_edit");

    // TOGGLE OFF ANY CURRENT EDIT
    let editing_note_index  = get_editing_note_index();
    if( editing_note_index >= 0)
    {
        js_notes.reset_input("note_5_onclick_edit");

        if(index == editing_note_index)
            return;
    }

    // COMMIT INPUT CONTENT AS A [NEW] OR [EDITED] NOTE
    notes.note_1_onclick_save ( e );

    // CLEAR TEXTAREA EDIT PROMPT
    notes.reset_input_placeholder();

    let  node_row;
    if(e.target)
    {
        for(   node_row =   e.target
             ; node_row && !node_row.classList.contains("node_row")
             ; node_row =   node_row.parentElement
           );

    //  input.value = node_row.getAttribute("title") +"\n";
        input.value = node_row.dataset.content;//FIXME
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
/*{{{*/
/*_ set_editing_note_index {{{*/
/*{{{*/
const EDITING_NOTE_NUM       = "editing_note_num";
/*}}}*/
let set_editing_note_index = function(index)
{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ SET   SAVE BUTTON ATTRIBUTE [EDITING_NOTE_NUM]
    //└────────────────────────────────────────────────────────────────────────┘

    if(index >= 0) {
        save_note_BUTTON.innerText= "Update Note #"+   (index+1);
        save_note_BUTTON.setAttribute(EDITING_NOTE_NUM, index+1);

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
/*_ save_note_auto {{{*/
let save_note_auto = function(e)
{
if(tag_this) console.log("🔴 save_note_auto");

    let text    = input.value.trim();
    // SAME AS ORIGINAL ● save_note_BUTTON disabled {{{
    if(!text || is_input_same_as_original())
    {
        save_note_BUTTON.setAttribute("disabled","");

        if(   (e.type == "auto_save")
           && is_last_note_auto_save()
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
        js_notes.layout_notes("save_note_auto", index);
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
/*}}}*/














//┌────────────────────────────────────────────────────────────────────────────┐
//│ USER INPUT                                                                🔴
//├────────────────────────────────────────────────────────────────────────────┤
/* input {{{*/
/*  input_listener {{{*/
let input_listener = function(e)
{
if(tag_this) console.log("🟣 input_listener: "+ e.type);

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

if(tag_this) console.log(`input_value changed:
● FROM \t"${ oldValue }"
● TO   \t"${ newValue }"`);

        //┌────────────────────────────────────────────────────────────────────┐
        //│ on first user-input ● transitioning from empty
        //└────────────────────────────────────────────────────────────────────┘
        if( !e.detail.oldValue )
        {
            notes.reset_input_placeholder();
                  save_note_auto( e );
            note_DETAILS.classList.remove("empty");
        }
    }
    else {
           notes.note_1_onclick_save( { type: "auto_save" } ); // text cleared ...worth a synchronized update
        note_DETAILS.classList.add   ("empty");

        reset_input("input_listener: ❌input empty");
    }
};
/*}}}*/
/*  resize_observe {{{*/
/*{{{*/
const ID_WH_SAVE_COOLDOWN = 2000;
let   id_wh_save_timeout;
let   resizeObserver;
/*}}}*/
let resize_observe = function(element)
{
//{{{
if(log_this) console.log("🟤 resize_observe:", (element.id || element.tagName));
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

if(log_this) console.log(`🟤 Element ${id_wh.id} resized to: ${id_wh.width} x ${id_wh.height}`);

                if( id_wh_save_timeout ) clearTimeout( id_wh_save_timeout );
                    id_wh_save_timeout = setTimeout(save_id_wh, ID_WH_SAVE_COOLDOWN);
            }
        });
    }
    /*}}}*/
    /* add element to observe {{{*/
    resizeObserver.observe( element );

    /*}}}*/
};
/*}}}*/
/*  save_id_wh {{{*/
let save_id_wh = function()
{

if(log_this) console.log("🟤 save_id_wh()");

    let id_wh_array
        = [ get_el_id_wh( input           )
          , get_el_id_wh( saved_notes_DIV ) ];

    localStorage.setItem(get_id_wh_storage_key(), JSON.stringify( id_wh_array ));

    id_wh_save_timeout = null;
};
/*}}}*/
/*_ get_el_id_wh {{{*/
let get_el_id_wh = function(el)
{
    let  rect =           el.getBoundingClientRect();
    let id_wh = { id    : el.id
                , width : parseInt( rect.width  )
                , height: parseInt( rect.height ) };
if(log_this) console.log(`🟤 get_el_id_wh: ${id_wh.id} size: ${id_wh.width} x ${id_wh.height}`);
    return id_wh;
};
/*}}}*/
/*  load_id_wh {{{*/
let load_id_wh = function()
{
if(log_this) console.log("🟤 load_id_wh:");

    let id_wh_storage_key = get_id_wh_storage_key();

    let val = localStorage.getItem( id_wh_storage_key);
    if(!val) return;
    let  id_wh_array = JSON.parse( val ) || [];

    for(let id_wh of id_wh_array)
    {
        let target = document.querySelector("#"+id_wh.id        );
        target.style.width                 =    id_wh.width +"px";
        target.style.height                =    id_wh.height+"px";

if(log_this) console.log(`🟤 Element ${id_wh.id} resized to: ${id_wh.width} x ${id_wh.height}`);
    }

    note_DETAILS.open = true;
};
/*}}}*/
/*  change_listener {{{*/
//let change_listener = function(e)
//{
//console.log("change_listener: "+ e.type);
//    if(e.target.value)
//        note_DETAILS.classList.remove("empty");
//    else
//        note_DETAILS.classList.add   ("empty");
//};
/*}}}*/
/*  load_input {{{*/
let load_input = function()
{
if(tag_this) console.log("🟣 load_input");

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ NO SAVED INPUT CONTENT FROM PREVIOUS SESSION DID                       │
    //└────────────────────────────────────────────────────────────────────────┘
    let input_storage_key = get_input_storage_key();

    let text = localStorage.getItem( input_storage_key )
        ||      "";

    // DEFAULT TO SCROLL LAST NOTE INTO VIEW
    if(!text) {
        notes.note_scrollIntoView();

        reset_input("load_input: !text");
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
            let node_row = saved_notes_TABLE.firstElementChild.children[index];
               note_5_onclick_edit({ target: node_row }, index);
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
    input.value = text;

    // SCROLL LAST NOTE INTO VIEW
    notes.note_scrollIntoView();

if(log_this) console.log( text );
};
/*}}}*/
/*  save_input {{{*/
let save_input = function(_caller)
{
if(tag_this) console.log("🟣 save_input"+ (_caller ? (" ← "+_caller) : ""));

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
/*  reset_input {{{*/
let reset_input = function(_caller)
{
if(tag_this) console.log("🟣 reset_input"+ (_caller ? (" ← "+_caller) : ""));

    // CLEAR TEXTAREA CONTENT
    input.dataset.content = input.value;
    input.value = "";

    // UPDATE STANDOUT IN [saved_notes_DIV]
    set_editing_note_index(-1);
};
/*}}}*/
/*}}}*/
//└────────────────────────────────────────────────────────────────────────────┘

//┌────────────────────────────────────────────────────────────────────────────┐
//│ TextArea_IO MODULE                                                        🟢
//├────────────────────────────────────────────────────────────────────────────┤
//{{{
let TextArea_IO = (function()
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

//┌────────────────────────────────────────────────────────────────────────────┐
//│ PUBLIC
//└────────────────────────────────────────────────────────────────────────────┘
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
//    let unsubscribe = TextArea_IO.on(input, (e) => {
//      console.log(`Value changed: "${e.detail.oldValue}" → "${e.detail.newValue}"`);
//    });

//    //┌────────────────────────────────────────────────────────────────────────┐
//    //│ Change via code (Triggers listener)
//    //└────────────────────────────────────────────────────────────────────────┘
//    TextArea_IO.value = "Hello World";

//    //┌────────────────────────────────────────────────────────────────────────┐
//    //│ User types in the box (Triggers listener)
//    //│ User types "Test" -> Listener fires: "Hello World" -> "Hello WorldTest"
//    //└────────────────────────────────────────────────────────────────────────┘

//    //┌────────────────────────────────────────────────────────────────────────┐
//    //│ Stop listening
//    //└────────────────────────────────────────────────────────────────────────┘
//    unsubscribe();

//    "}}}
//}}}
//└────────────────────────────────────────────────────────────────────────────┘

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
        , get_notes_storage_key
        , get_page_fileName
        , load_input
        , reset_input
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
        , escapeHTML
        , escape_note : (index) => escapeHTML( notes.get_nArray()[index].text )
        , layout_notes
        , print_note  : (index) =>             notes.get_nArray()[index].text
        , save_input
        , tail_status
        , tics_status
        , tapi        : TextArea_IO
        , log         : () => { log_this = !log_this; console.log("log_this=["+log_this+"]"); }
        , tag         : () => { tag_this = !tag_this; console.tag("tag_this=["+tag_this+"]"); }
};
//}}}
})();
document.addEventListener("DOMContentLoaded", js_notes.onload);
