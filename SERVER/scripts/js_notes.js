//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_notes.js     ● $APROJECTS/LANServer/SERVER       ● _TAG (260914:00h:46) │
//├────────────────────────────────────────────────────────────────────────────┤
//│ 🔴 Create, save, load and delete Notes in a section at the end of the body │
//│                                                                            │
//└────────────────────────────────────────────────────────────────────────────┘
/* jshint esversion: 9, laxbreak:true, laxcomma:true, boss:true */ /*{{{*/

/*}}}*/
let js_notes    = (function()
{
let log_this = false;
let tag_this = true;//false || log_this;
/*  DATA {{{*/
/* ●  NOTES_DETAILS_STYLE {{{*/

const EDITING_NOTE_NUM       = "editing_note_num";
const NOTES_DETAILS_CSS_DATA = "data:text/css,"+ encodeURIComponent (`
/* scrollbar {{{*/
#note_input_TEXTAREA                                { scrollbar-width :       thin; }
#note_input_TEXTAREA                                { scrollbar-color : #DDD #6666; }
#saved_notes_DIV                                    { scrollbar-width :       thin; }
#saved_notes_DIV                                    { scrollbar-color : #DDD #6666; }
/*}}}*/
/* [saved_notes_TABLE] TD WIDTH {{{*/
/*{{{
    @see $LOCAL/DATA/GESTION/CONTACTS/PASSWORDS/Chrome_passwords.html
}}}*/
/* saved_notes_DIV {{{*/
#saved_notes_DIV {
    margin-top      : 1rem;
    padding-right   :  5px; /* offsets the scrollbar from the outline */
    width           : 100%;
min-width           : 100%; /* ...to grow with textarea */

    resize:both;
    overflow        : auto;
min-height          : 8em;
    height          : 30%;
}
/*}}}*/
/* saved_notes_TABLE {{{*/
#saved_notes_TABLE {
    width           : 100%;
    border-collapse : collapse;
}
/*}}}*/
/* saved_notes_TABLE ● FIRST AND LAST NOTES ROW LAYOUT {{{*/
#saved_notes_TABLE>tbody {
    border-radius   : 1em;
    outline         : 2px solid #7778;
    outline-offset  :-2px;
}

#saved_notes_TABLE>tbody tr:first-child td { padding-top     : 3em;          }
#saved_notes_TABLE>tbody tr:last-child  td { padding-bottom  : 3em;          }

#saved_notes_TABLE>tbody tr:first-child    { border-radius: 1em 1em 0em 0em; }
#saved_notes_TABLE>tbody tr:last-child     { border-radius: 0em 0em 1em 1em; }

#saved_notes_TABLE>tbody tr:first-child    { background: linear-gradient(to bottom, #8884 30%, #4444 30%, #222); }
#saved_notes_TABLE>tbody tr:last-child     { background: linear-gradient(to bottom, #8884 30%, #4444 30%, #222); }
/*}}}*/
/* saved_notes_TABLE ● COLUMNS LAYOUT {{{*/
#saved_notes_TABLE TD:nth-of-type( 1) {     width:  2em; } /* check     */
#saved_notes_TABLE TD:nth-of-type( 2) {     width:  2em; } /* edit      */
#saved_notes_TABLE TD:nth-of-type( 3) { max-width: 25em; } /* truncated */
#saved_notes_TABLE TD:nth-of-type( 4) {     width: 11em; } /* timestamp */
#saved_notes_TABLE TD:nth-of-type( 5) {     width:  2em; } /* delete    */

/*}}}*/
/* saved_notes_TABLE no_notes_yet {{{*/
#saved_notes_TABLE .no_notes_yet_TD { text-align: center; color: #888; font-style: italic; }
/*}}}*/
/*}}}*/
/* [narr_button ● wide_button] {{{*/

#narr_button         { float:  left; background: #222; color: 444; text-shadow: 1px 1px 1px #FFF; width: 50%; margin-left : 0em; }
#wide_button         { float: right; background: #222; color: 444; text-shadow: 1px 1px 1px #FFF; width: 50%; margin-right: 0em; }
#narr_button::before { content: "< < < <"; }
#wide_button::after  { content: "> > > >"; }

/*}}}*/
#note_DETAILS { /*{{{*/
    margin-top      : 2rem;
    border          : 1px solid #ccc;
    border-radius   : 6px;
    padding         : 1rem;
}
#note_DETAILS.empty>SUMMARY>EM {
    opacity         : 0.2 !important;
    rotate          : -45deg;
}
/*}}}*/
#note_DETAILS>SUMMARY { /*{{{*/
    cursor          : pointer;
    font-weight     : bold;
}
/*}}}*/
#note_input_TEXTAREA { /*{{{*/
/*{{{
    resize          : both;
}}}*/
    display         : block;
    margin-bottom   : 10px;
    border          : 1px solid #ddd;
    border-radius   : 4px;
        height      : 8em;
    min-height      : 5em;
    min-width       : 100%;
    padding         : 8px;
    background-color: #222;
    color           : #FF8;
}
#note_input_TEXTAREA.center_input_placeholder {
    text-align      : center;
}
/*}}}*/
#save_note_BUTTON { /*{{{*/
    cursor          : pointer;
    padding         : 6px 12px;
/*{{{
    background      : #4CAF50;
}}}*/
    background      : transparent;
    color           : white;

    border-radius   : 4px;
/*{{{
    border          : 5px  solid #888;
}}}*/
    outline         : 4px groove #800;
    outline-offset  : 4px;
}
#save_note_BUTTON[disabled] {
    background      : #222;
    color           : #888;
}
#save_note_BUTTON.notes_uploaded {
    outline         : 4px solid #040;
}

#save_note_BUTTON[${EDITING_NOTE_NUM}$="1"]::before { content: "🟤"; }
#save_note_BUTTON[${EDITING_NOTE_NUM}$="2"]::before { content: "🔴"; }
#save_note_BUTTON[${EDITING_NOTE_NUM}$="3"]::before { content: "🟠"; }
#save_note_BUTTON[${EDITING_NOTE_NUM}$="4"]::before { content: "🟡"; }
#save_note_BUTTON[${EDITING_NOTE_NUM}$="5"]::before { content: "🟢"; }
#save_note_BUTTON[${EDITING_NOTE_NUM}$="6"]::before { content: "🔵"; }
#save_note_BUTTON[${EDITING_NOTE_NUM}$="7"]::before { content: "🟣"; }
#save_note_BUTTON[${EDITING_NOTE_NUM}$="8"]::before { content: "⚫"; }
#save_note_BUTTON[${EDITING_NOTE_NUM}$="9"]::before { content: "⚪️"; }
#save_note_BUTTON[${EDITING_NOTE_NUM}$="0"]::before { content: "◯ "; }

/*}}}*/
#status_line { /*{{{*/
    user-select     : none;
    transform       : translate(0, 0.5rem);
    border          : 0;
    border-radius   : 4px;
    padding         : 0;
    background      : #8882;
    color           : #888F;
    opacity         : 0.5;
}

.tail_msg {
    float: right;
    border-radius: 1em;
    border       : 1px inset #888;
    margin-left  : 1em;
    padding      : 0 0.5em;
    text-shadow  : 2px 1px 2px #AAA;
}

#status_line.brighter { opacity   :  1.0; color: #DDF; }
#status_line.bigger   { font-size : 150%; }

/*}}}*/
.cb_BUTTON { /*{{{*/
    margin          : 0.2em;
    float           : right;
    cursor          : pointer;
    border          : none;
    border-radius   : 4px;
    padding         : 6px 12px;
    background      : #222250;
    color           : white;
    text-align      : right;
}
.cb_BUTTON[disabled] {
    background      : #444;
    color           : #888;
}
/*}}}*/
/* node_row ellipsis timestamp {{{*/
.node_row {
    user-select     : none; /* better for long-press on touchscreen */
    outline-offset: -2px;
    border-radius : 0.3em;
    background-color: #222;
    color           : #DD4;
}
.node_row.auto_save {
    color           : #888;
}

.node_row .timestamp {
    color           : #888;
    margin-right    : 1em;
}

/*}}}*/
/* node_row BUTTONS {{{*/

.node_row BUTTON {
    cursor          : pointer;
    border          : none;
    border-radius   : 0.5em;
    background      : none;
    padding         : 0;
    color           : red;
    margin-right    : 0.2em;
 }
.node_row BUTTON::before {
    display         : inline-block;
    padding         : 0;
}

.truncated {
  white-space       :   nowrap;
  overflow          :   hidden;
  text-overflow     : ellipsis;
}
.timestamp {
  white-space       :   nowrap;
  margin            : 0 0.5em;
}

/* color */
.check_button           {   color:  red; }

/* content */
.editing   .edit_button::before  { content:   "✎"; color: yellow; }
           .edit_button::before  { content:   "✐"; color:    red; }
         .delete_button::before  { content:   "✕"; background-color: #F004; padding: 0.4em; }
/*{{{
          .check_button::before  { content:  "🚧"; }
 .checked .check_button::before  { content:   "✔"; }
}}}*/
          .check_button::before  { content:  "🔵"; }
 .checked .check_button::before  { content:  "✅"; }
  .check_button.onShift::before  { font-size: 150%; border: 1px solid white; }
/*}}}*/
/* checked  ● TEXTAREA  ● node_row {{{*/
#note_input_TEXTAREA.checked                       {   color: lightgreen; }
           .node_row.checked                       {   color: lightgreen; }
                    .checked .check_button         {   color: lightgreen; }

.auto_save .check_button { visibility: hidden; }
.auto_save .edit_button  { visibility: hidden; }
/*}}}*/
/* node_row ● hover     ● standout {{{*/

/* ROW */
.node_row.standout              { outline: 2px dotted #FF08; }
.node_row.editing               { outline: 2px dashed #FF0F; }

/* BUTTONS */
.node_row                BUTTON { padding: 0 0  ; transition: all 1000ms  500ms ease-out; border: 1px solid #0000; }
#saved_notes_TABLE:hover BUTTON { padding: 0 1em; transition: all  200ms    0ms ease    ; border: 1px solid #8888; }

/* TD */
.node_row                TD     {                 transition: all 1000ms 2000ms ease-out; }
.node_row:hover          TD     { padding: 1em 0; transition: all  200ms    0ms ease    ; }
.node_row.standout       TD     { padding: 1em 0; transition: all  200ms    0ms ease    ; }

/*{{{
.node_row          BUTTON::before { padding: 0   0  ; transition: padding 1000ms      500ms ease-out; }
.node_row:hover    BUTTON         { padding: 0 2.0em 0 0 ; transition: padding 200ms ease    0ms    ; }
.node_row.standout BUTTON         { padding: 0 2.0em 0 0 ; transition: padding 200ms ease    0ms    ; }
.node_row:hover    BUTTON::before { padding: 0 1.0em;                                                 }
.node_row.standout BUTTON::before { padding: 0 1.0em;                                                 }
}}}*/

/*{{{
#saved_notes_TABLE::hover         BUTTON::before { padding: 0 1.0em; }
#saved_notes_TABLE:has(.standout) BUTTON::before { padding: 0 1.0em; }
}}}*/

/*}}}*/
/*# sourceURL=note_details.css */
`
)
 .replace(/\\(\\x+)/g,"\\\\$1")
;
/*}}}*/
/* ●  INPUT PLACEHOLDER {{{*/

const PLACEHOLDER_CREATE_PROMPT = "Type your note here...";
const PLACEHOLDER_IMPORT_PROMPT = "\n" + "Paste all Notes to import here...";
const PLACEHOLDER_EXPORT_REPORT = "\n" + "{count}Notes\n" + "have been exported\n" + "into the clipboard";
const PLACEHOLDER_IMPORT_REPORT = "\n" + "{count}Notes\n" + "have been imported\n" + "from the clipboard";

/*}}}*/
/* ●  BUTTONS {{{*/
const BUTTON_EXPORT_NAME  = "Export → 📝";
const BUTTON_EXPORT_TITLE = "Export Notes\nto Clipboard";

const BUTTON_IMPORT_NAME  = "<sub>↓</sub> Import <sup>↑</sup>";
const BUTTON_IMPORT_TITLE = "Import Notes\npasted in Input\nabove";
const STATUS_LINE_TITLE   = "Click: brighter — bigger — dimmer";

/*}}}*/
/* ●  NOTE_DETAILS_HTML {{{*/
const NOTE_DETAILS_HTML   = `
<summary >📝 My Notes for This Page</summary>
<div>
    <button   id="narr_button"         onclick='js_notes.narrower             (event);'></button>
    <button   id="wide_button"         onclick='js_notes.wider                (event);'></button>
    <br>
    <textarea id="note_input_TEXTAREA" placeholder="`+PLACEHOLDER_CREATE_PROMPT+`"></textarea>
    <button   id="save_note_BUTTON"    onclick='js_notes.note_1_onclick_save  (event);'>Save Note</button>
    <button       class="cb_BUTTON"    onclick='js_notes.note_3_onclick_export(event);' title='${BUTTON_EXPORT_TITLE}'>${BUTTON_EXPORT_NAME}</button>
    <button       class="cb_BUTTON"    onclick='js_notes.note_2_onclick_import(event);' title='${BUTTON_IMPORT_TITLE}'>${BUTTON_IMPORT_NAME}</button>
    <DIV      id="saved_notes_DIV">
     <TABLE   id="saved_notes_TABLE"></TABLE>
    </DIV>
    <div      id="status_line"         onclick='js_notes.tune_status  (event);' title='${STATUS_LINE_TITLE}'  ></div>
</div>
`;
/*}}}*/
/*_ wider {{{*/
let wider = function(e) /* eslint-disable-line no-unused-vars */
{
    let rect = input.getBoundingClientRect();
    input.style.width = parseInt(rect.width * 1.2)+"px";
};
/*}}}*/
/*_ narrower {{{*/
let narrower = function(e) /* eslint-disable-line no-unused-vars */
{
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

/* onload {{{*/
let onload = function()
{
    // Save unfinished Notes when the user is leaving the tab {{{
    document.addEventListener("visibilitychange", function(e) {
        if( document.hidden )
        {
            save_input();
            notes.note_1_onclick_save ( e );
        }
    });
    //}}}
    // Auto-save user input content until submted with a save-buton click {{{
    setInterval(notes.note_1_onclick_save, AUTO_SAVE_INTERVAL_MS, { type: "auto_save" });

    //}}}
    /* Notes taking GUI injection {{{*/
    add_notes_DETAILS();

    /*}}}*/
    // Load saved Notes from localStorage {{{
    layout_notes("onload");

    //}}}
    // Restore last stored layout {{{*/
    load_id_wh();

    //}}}
};
/*}}}*/
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
    //┌────────────────────────────────────────────────────────────────────────┐
    //│           ▲                ▲     ▲                                     │
    //│           │                │     │                                     │
    //│           │                │     (js_notes.js)                         │
    //│           │                (APROJECTS_USR_SERVER_scripts/js_notes.js   │
    //│           (https://192.168.1.14:447)                                   │
    //└────────────────────────────────────────────────────────────────────────┘
    let baseName         = matches[1].replace(/\W+/g, "_");
    let pathName         = matches[2].replace(/\W+/g, "_");
    let fileName         = matches[3].replace(/\W+/g, "_");
    let page_storage_key = (pathName+"__"+fileName);

/*{{{*/
if(tag_this) {
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
/*_ add_notes_DETAILS {{{*/
/*{{{*/
let note_DETAILS;
let saved_notes_DIV;
let saved_notes_TABLE;
let input;
let save_note_BUTTON;
let status_line;

/*}}}*/
let add_notes_DETAILS = function()
{
    // Create a Notes section near the bottom of the page {{{
    let note_DETAILS_STYLE          = document.createElement("LINK");
        note_DETAILS_STYLE.href     = NOTES_DETAILS_CSS_DATA;
        note_DETAILS_STYLE.id       = "notes_details_style";
        note_DETAILS_STYLE.type     = "text/css";
        note_DETAILS_STYLE.charset  = "utf-8";
        note_DETAILS_STYLE.rel      = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild( note_DETAILS_STYLE );

    note_DETAILS                    = document.createElement("DETAILS");
    note_DETAILS.id                 = "note_DETAILS";
    note_DETAILS.className          = "empty";
    note_DETAILS.innerHTML          = NOTE_DETAILS_HTML;

    document.body.appendChild( note_DETAILS );
    //}}}
    // DOM ● note_DETAILS ● saved_notes_TABLE ● input ● save_note_BUTTON{{{
    saved_notes_DIV  = document.getElementById("saved_notes_DIV" );
//  resize_observe( saved_notes_DIV );

    saved_notes_TABLE= document.getElementById("saved_notes_TABLE");

    input            = document.getElementById("note_input_TEXTAREA");
  //input.addEventListener("input" , input_listener);
    TextAreaAPI.on        ( input  , input_listener);
  //input.addEventListener("change" , change_listener);
    resize_observe( input );

    save_note_BUTTON = document.getElementById("save_note_BUTTON");
    save_note_BUTTON.setAttribute("disabled","");

    status_line      = document.getElementById("status_line");
    //}}}
};
/*}}}*/
//_ layout_notes — 🟤🔴🟠🟡🟢🔵🟣⚫⚪️◯ {{{
/*{{{*/
let layout_count = 0;

/*}}}*/
let layout_notes = function(_caller="?",index=-1)
{
if(log_this) console.log("🔴%c layout_notes ← "+ _caller, "color: #F00");
    /* 1. LOAD NOTES from localStorage {{{*/
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
+ "<TR class='node_row "+ notes.get_checked(i)+  (n.text.includes(AUTO_SAVE_TAG) ? " auto_save":"")+"'"
+  " title='"+    escapeHtml(n.text).replace(AUTO_SAVE_TAG, "") +"'"
+  "                                  onclick=' js_notes.note_5_onclick_edit(event, "+i+")'>"

+  "<TD><button class='check_button'  onclick=' js_notes.note_4_onclick_check(event, "+i+")' title='Check note'        ></button></TD>"
+  "<TD><button class='edit_button'                                                          title='Edit note'         ></button></TD>"
+  "<TD><div    class='truncated'>"+  escapeHtml(n.text)                                                              +"   </div></TD>"
+  "<TD><small  class='timestamp'     onclick=' event.cancelBubble = true;'>"+ new Date(n.timestamp).toLocaleString() +" </small></TD>"
+  "<TD><button class='delete_button' onclick=' js_notes.note_6_onclick_delete(event, "+i+")' title='Delete note'      ></button></TD>"

+ "</TR>"
).join("")

        : "<TR><TD class='no_notes_yet_TD' colspan='5'>No notes yet</TD></TR";

    saved_notes_TABLE.innerHTML = "<TABLE id='saved_notes_TABLE'>"+ innerHTML +"</TABLE>";
    /*}}}*/
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ IF "No notes yet" → layout_notes will be called with next load results │
    //└────────────────────────────────────────────────────────────────────────┘
    layout_count += 1;
    tail_status(tics_status(layout_count), notes.get_notes_loaded_from());//FIXME recyle/count symbol

    // STANDOUT LAST HANDLED NOTE
    notes.standout_note_at_index( index );

    // DISPLAY FILE NAME ● NUMBER OF NOTE ● FROM SERVER OR CLIENT
    notes.update_summary();
};
//}}}

//┌────────────────────────────────────────────────────────────────────────────┐
//│ [status_line]                                                              │
//└────────────────────────────────────────────────────────────────────────────┘
/*_ show_status {{{*/
let show_status = function(msg)
{
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

//┌────────────────────────────────────────────────────────────────────────────┐
//│ NOTES                                                                   🟠 │
//└────────────────────────────────────────────────────────────────────────────┘
 // notes {{{
let notes = (function()
{
//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🟤 STORAGE                                                                 │
//└────────────────────────────────────────────────────────────────────────────┘
//{{{
let nArray = [];

//}}}
/*_ upload_notes_to_server {{{*/
/*{{{*/
const UPLOAD_NOTES_INTERVAL_MS = 5000;

let upload_notes_to_server_timeout;
/*}}}*/
let upload_notes_to_server = function(_caller="timeout")
{
/*{{{*/
let caller = "upload_notes_to_server";
/*}}}*/
    // SCHEDULE NEXT UPDATE {{{
    if( upload_notes_to_server_timeout)  clearTimeout( upload_notes_to_server_timeout );
    /**/upload_notes_to_server_timeout =   setTimeout( upload_notes_to_server, UPLOAD_NOTES_INTERVAL_MS);

    //}}}
    // NOTES UNCHANGED or [server_upload_pending] {{{
    let change_time = new Date( Date.now() ).toLocaleString();
    let server_upload_pending = request_server_upload_pending();
    if(!server_upload_pending )
    {
if(log_this) console.log("%c "+caller+" ● ["+_caller+"] ● Notes unchanged ["+ change_time +"]", "color: #888");

        return;
    }
//console.log( JSON.stringify( nArray ) );
    //}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ● from upload_notes_to_server   localStorage redundant                 │
    //│ ● in   SERVER/server.js                                                │
    //│ ● TODO: ADD URL_KEY FIELD FOR PER-PAGE NOTES_FILE NAMES                │
    //└────────────────────────────────────────────────────────────────────────┘
/*{{{*/
if(tag_this) console.log("%c "+caller                    + ":\n"
                         +" ▲ [ "+ _caller               +" ]\n"
                         +" ● [ "+ server_upload_pending +" ]\n"
                         +" ● nArray[ x"+nArray.length   +" ]\n"
                         +" ● time now ["+ change_time   +" ]\n"
                         , "color: #FF0");
/*}}}*/
    let          notes_storage_key = get_notes_storage_key();
    let body = { notes_storage_key , nArray };
    /**/body = JSON.stringify( body);

if(log_this) console.log( JSON.parse( body ) );

    // SEND NARRAY TO THE SERVER
    fetch("/upload_notes"
          , {   method  :   "POST"
              , headers : { "Content-Type": "application/json; charset=utf-8" }
              , body })
    .then ((response) =>    response.json() )
    .then ((    data) => {  if(tag_this) console.log  ("Notes upload status:", data); request_server_upload( false ); })
    .catch((     err) => {  console.error("Notes upload failed:",  err); });

if(tag_this) console.log("%c ● UPLOADED: ["+ new Date( Date.now() ) +"]", "color: green");
};
/*}}}*/
/*_ request_server_upload ● ADDED ● EDITED ● false {{{*/
/*{{{*/
let notes_has_changed_reason;

/*}}}*/
let request_server_upload = function(upload_reason=undefined)
{
    //┌────────────────────────────────────────────────────────────────────┐
    //│ SERVER UPDATE SYNC STATUS                    ●  notes_storage.json │
    //└────────────────────────────────────────────────────────────────────┘
    if( upload_reason )
    {
        save_note_BUTTON.classList.remove("notes_uploaded");

        show_status("🚧 UPLOAD to server still pending");
    }
    else {
        save_note_BUTTON.classList.add   ("notes_uploaded");

        show_status("✅ IN-SYNC with server notes");    //TODO [HANDLE SHOWING SYNC FAILURE]
    }

    //┌────────────────────────────────────────────────────────────────────┐
    //│ ASYNC UPDATE START (re-armed)                                      │
    //└────────────────────────────────────────────────────────────────────┘
    if(!upload_notes_to_server_timeout) upload_notes_to_server( upload_reason );

    //┌────────────────────────────────────────────────────────────────────┐
    //│ +SYNC UPDATE ON EVERY CHANGE                                       │
    //└────────────────────────────────────────────────────────────────────┘
  //if( upload_reason   ) upload_notes_to_server( upload_reason );

    // REMEMBER LAST CHANGE REASON
    notes_has_changed_reason = upload_reason;
};
/*}}}*/
/*_ request_server_upload_pending {{{*/
let request_server_upload_pending = function()
{
    return notes_has_changed_reason;

};
/*}}}*/
/*_ load_notes {{{*/
/*{{{*/
let notes_loaded_from;

/*}}}*/
let load_notes = function() /* eslint-disable-line no-unused-vars */
{
    let notes_storage_key = get_notes_storage_key();
if(tag_this) console.log("🟡%c load_notes\t\t  ["+ notes_storage_key +"]", "color: #FF0");

    fetch("/fetch_notes?notes_storage_key="+notes_storage_key)
        .then(( res  ) => res.json())
        .then(( data ) => {
//console.log("data=["+data+"]");

            // SERVER-SIDE NOTES
            if(Array.isArray(data) && data.length)
            {
                notes_loaded_from = "🟢 from server";
                nArray = data;

                // BACKUP SERVER-SIDE NOTES INTO localStorage
                if(nArray.length)
                    localStorage.setItem(notes_storage_key, JSON.stringify(nArray));
                else
                    localStorage.removeItem(get_notes_storage_key());

                layout_notes("load_notes: "+ notes_loaded_from);
            }
            // LOAD CLIENT-SIDE NOTES AS A FALLBACK
            else {
                notes_loaded_from = "🔴 from device";
                load_client_notes();
                layout_notes("load_notes: "+ notes_loaded_from);
            }
            // input may contain one of the saved note .. resume editing
            load_input();
        })
        .catch((err) => {
            console.warn("Could not retrieve notes from server", err);
            notes_loaded_from     = "◯ missing on server!";
            load_client_notes();
            layout_notes    ("load_notes: "+ notes_loaded_from);
            // input may contain one of the saved note .. resume editing
            load_input();
        });
};
/*}}}*/
/*_ load_client_notes {{{*/
let load_client_notes = function()
{
if(tag_this) console.log("%c load_client_notes", "color: #F00");

    let notes_storage_key = get_notes_storage_key();
    try {
        nArray = JSON.parse(localStorage.getItem( notes_storage_key ) || "[]");
    }
    catch( ex ) {
        console.warn("load_client_notes("+notes_storage_key+")", ex);
    }
};
/*}}}*/
//┌────────────────────────────────────┐
//│ 🟤 SAVE                            │
//└────────────────────────────────────┘
//● note_1_onclick_save ● onclick ● save_note_BUTTON {{{
let note_1_onclick_save = function(e)
{
    /* input text {{{*/
    let  text = input.value.trim();

    //}}}
    // save_note_auto ...return {{{
    if(e.type == "auto_save")
    {
        save_note_auto( e );

        return;
    }
    //}}}
    // delete auto_save ... {{{
    else if( is_last_note_auto_save()  )
    {
        nArray.splice(nArray.length-1, 1);
    }
    //}}}
    // input empty ...return {{{
    if( !text )
        return;

    //}}}
    // ADD OR REPLACE NOTE {{{
    let index  = get_editing_note_index();
    if( index >= 0) {
        nArray.splice(index, 1, { text, timestamp: Date.now() });
        request_server_upload("Note #"+(index            )+" EDITED");
    }
    else {
        nArray.push(            { text, timestamp: Date.now() });
        request_server_upload("Note #"+(nArray.length + 1)+" ADDED");
    }

    //}}}
    // ... 🟢 STORE ALL NOTES °update localStorage {{{
    localStorage.setItem(get_notes_storage_key(), JSON.stringify( nArray ));

    //}}}
    // ... 🔵 CLEAR USER INPUT ONCE SAVED {{{
    reset_input();

    //}}}
    layout_notes("note_1_onclick_save", index);
};
//}}}
//┌────────────────────────────────────┐
//│ 🔴 IMPORT 🟠 EXPORT                │
//└────────────────────────────────────┘
/*● note_2_onclick_import ● onclick ● cb_BUTTON {{{*/
let note_2_onclick_import = function(e)
{
if(tag_this) console.log(e.target.innerText +"note_2_onclick_import");
/*{{{
// requires clipboard access permission
    navigator
        .clipboard
        .readText()
        .then((buffer) => { input.value = buffer; });
}}}*/
    // IF INPUT IS EMPTY {{{
    let buffer = input.value.trim();
    if(!buffer) {
        center_input_placeholder(PLACEHOLDER_IMPORT_PROMPT, 5000);
        return;
    }

    // clear input
    reset_input();

    //}}}
    //{{{
    //┌──────────────────────────────────────────────────┐
    //│ 🔴 Note #1                                       │
    //│ 2/4 AUTO-SAVE LOOP DONE DELETE TEMPORARY NOTE    │
    //│ if(nArray.length && not...                        │
    //│ replace with is_last_note_auto_save              │
    //└──────────────────────────────────────────────────┘
    //}}}
    // cancel pending auto_save message {{{
    if( is_last_note_auto_save())
        note_6_onclick_delete(e, nArray.length-1);

    //}}}
    // parse pasted lines {{{
    let lines = buffer.split("\n");
    let text  = "";
    let count = 0;
    for(let i = 0; i < lines.length; ++i)
    {
        let line = lines[i].trim();
        if(!line) continue;

        // 🟤 NEXT NOTE # ● SAVE CURRENT
        let matches = line.match(/Note #(\d)/i);
        if( matches )
        {
            // 🔴 FLUSH PREVIOUS
            if( text ) {
                nArray.push({ text , timestamp: Date.now() });
                count += 1;
            }

            // 🟠 SKIP "Node #..." LINE
            text = "";
        }
        // next line of text
        else if( !line.includes( NOTE_H_SEP ) )
        {
            text += line+"\n";
        }
    }
    // 🟡 FLUSH LAST
    if( text ) {
        nArray.push({ text , timestamp: Date.now() });
        count += 1;
    }

    request_server_upload("Note (x"+ nArray.length +") " +" IMPORTED");
    //}}}
    center_input_placeholder(PLACEHOLDER_IMPORT_REPORT .replace("{count}", count+" "), 10000);
    // update message list {{{
    layout_notes("note_2_onclick_import");
    //}}}
};
/*}}}*/
/*● note_3_onclick_export ● onclick ● cb_BUTTON {{{*/
const FOLD_OPEN = "{{{"; /* eslint-disable-line no-unused-vars */
const FOLD_CLOSE= "}}}"; /* eslint-disable-line no-unused-vars */
const NOTE_H_SEP = " ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●"+FOLD_OPEN+"1";
let note_3_onclick_export = function(e)
{
if(tag_this) console.log(e.target.innerText +"note_3_onclick_export");
    if(!nArray.length) return;

    let buffer = "";
    let index  =  1;
    nArray.forEach((note) => buffer += (note.checked ? "✓":"□")             +" "
                   +                   "Note "+ String(index++).padStart(3) +" "
                   +                   formatDate( note.timestamp )         +" "
                   +                   NOTE_H_SEP                           +"\n"
                   +                   note.text                            +"\n\n"
                  );

    copy_to_clipboard( buffer.trim() );

    center_input_placeholder(PLACEHOLDER_EXPORT_REPORT.replace("{count}", nArray.length+" "), 10000);
};
/*}}}*/
/*_ formatDate {{{*/
let formatDate = function(timestamp)
{
  let date   = new Date(timestamp);

  let year   = String(date.getFullYear ()    ).slice(-2);
  let month  = String(date.getMonth    () + 1).padStart(2, "0");
  let day    = String(date.getDate     ()    ).padStart(2, "0");
  let hour   = String(date.getHours    ()    ).padStart(2, "0");
  let minute = String(date.getMinutes  ()    ).padStart(2, "0");

  return `${year}${month}${day}:${hour}.${minute}`;
};
/*}}}*/
/*_ center_input_placeholder {{{*/
let center_input_placeholder = function(placeholder,delay)
{
    input.setAttribute( "placeholder", placeholder);
    input.classList.add("center_input_placeholder");

    setTimeout(reset_input_placeholder, delay);
};
let reset_input_placeholder = function()
{
    input.setAttribute(    "placeholder", PLACEHOLDER_CREATE_PROMPT);

    input.classList.remove("center_input_placeholder");
};
/*}}}*/
//┌────────────────────────────────────┐
//│ 🟡 CHECK                           │
//└────────────────────────────────────┘
//● note_4_onclick_check ● onclick ● check_button ● [✓] i.e. **Done** {{{
let note_4_onclick_check = function(e,index)
{
if(tag_this) console.log("note_4_onclick_check: "+ e.type);

    // cancelBubble ● cancel container's click delegation {{{
    e.cancelBubble = true;

    //}}}

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ SHIFT KEY ● TOGGLE COSMETIC NOTE GUI CSS TRANSCIENT DECORATION         │
    //│ ● i.e. volatile page session state (just a user style graffiti)        │
    //│ — no check/uncheck involved, COSMETIC-GUI-VISIBLE ● SESSION-ONLY       │
    //└────────────────────────────────────────────────────────────────────────┘
    if(e.shiftKey)
    {
        e.target.classList.toggle("onShift");
        return;
    }
    e.target.classList.remove("onShift");

    // TOGGLE NOTE CHECKED STATE
    nArray[index].checked = !nArray[index].checked;

    // SYNC NOTE GUI CSS
    if( nArray[index].checked ) e.target.classList.add   ("checked");
    else                        e.target.classList.remove("checked");

    // SYNC CHECKED TR STYLE ● @see [layout_notes] (populating saved_notes_TABLE TR)
    e.target.closest("TR")
        .className
        = "node_row "
        +  get_checked(index)
        +  (nArray[index].text.includes(AUTO_SAVE_TAG) ? " auto_save":"");

    // UPDATE CLIENT-SIDE STORAGE
    localStorage.setItem(get_notes_storage_key(), JSON.stringify( nArray ));

    // UPDATE GUI LAYOUT
//  layout_notes("note_4_onclick_check", index);

    // SYNC INPUT ● while editing checked note
    if(get_editing_note_index() == index)
    {
        if( get_checked(index)) input  .classList.add   ("checked");
        else                    input  .classList.remove("checked");
    }

    // PROPAGATE STATE CHANGE TO STORAGE HANDLERS
    request_server_upload("Note #"+index+" CHECKED");
};
//}}}
/*_ get_checked {{{*/
let get_checked = function(index)
{
    return nArray[index].checked ? "checked" : "";
};
/*}}}*/
//┌────────────────────────────────────┐
//│ 🟢 EDIT                            │
//└────────────────────────────────────┘
//● note_5_onclick_edit ● onclick ● node_row {{{
let note_5_onclick_edit = function(e,index)
{
    // STORE CURRENT INPUT CONTENT (WILL BE RESTORED BY NEXT RELOAD)
    save_input();

    // TOGGLE OFF ANY CURRENT EDIT
    let editing_note_index  = get_editing_note_index();
    if( editing_note_index >= 0)
    {
        reset_input();

        if(index == editing_note_index)
            return;
    }

    // COMMIT INPUT CONTENT AS A [NEW] OR [EDITED] NOTE
    notes.note_1_onclick_save ( e );

    // CLEAR TEXTAREA EDIT PROMPT
    reset_input_placeholder();

    let  node_row;
    for( node_row =   e.target
       ; node_row && !node_row.classList.contains("node_row")
       ; node_row =   node_row.parentElement
       );

    input.value = node_row.getAttribute("title");

    // EDITING A [checked] NOTE (OR NOT)
    if( get_checked(index)) input.classList.add   ("checked");
    else                    input.classList.remove("checked");

    // ADD [index] INNTO [save_note_BUTTON] ATTRIBUTES
    set_editing_note_index( index );

    // MAKE FIRST SYNCHRONOUS CALL TO START TRACKING CHANGES
    note_1_onclick_save( { type: "auto_save" } );
};
//}}}
/*_ set_editing_note_index {{{*/
let set_editing_note_index = function(index)
{
    // SET   SAVE BUTTON ATTRIBUTE [EDITING_NOTE_NUM]
    if(index >= 0) {
        save_note_BUTTON.innerText= "Save Note #"+     (index+1);
        save_note_BUTTON.setAttribute(EDITING_NOTE_NUM, index+1);
//      save_note_BUTTON.style.backgroundColor = BG[index % 10];
//      save_note_BUTTON.style.    borderColor = BG[index % 10];

        // EDITING NOTE LIST ITEM START
        saved_notes_TABLE.querySelectorAll(".editing").forEach((el) => el.classList.remove("editing"));
        saved_notes_TABLE.firstElementChild.children[index].classList.add("editing");
    }
    // CLEAR SAVE BUTTON ATTRIBUTE EDITING_NOTE_NUM
    else {
        // EDITING NOTE LIST ITEM DONE
        saved_notes_TABLE.querySelectorAll(".editing").forEach((el) => el.classList.remove("editing"));

        save_note_BUTTON.innerText = "Save Note";
        save_note_BUTTON.removeAttribute( EDITING_NOTE_NUM );
//      save_note_BUTTON.style.backgroundColor = "";
        save_note_BUTTON.setAttribute("disabled","");
    }
    // standout edited note
    standout_note_at_index( index );
};
/*}}}*/
/*_ get_editing_note_index {{{*/
let get_editing_note_index = function()
{
    let    attr  = save_note_BUTTON.getAttribute( EDITING_NOTE_NUM );
    let    index = (attr != null) ? parseInt(attr-1) : -1;
    return index;
};
/*}}}*/
/*_ save_note_auto {{{*/
let save_note_auto = function(e)
{
if(log_this) console.log("%c save_note_auto", "color: #F00");
    let text    = input.value.trim();
    // SAME AS ORIGINAL ● save_note_BUTTON disabled {{{
    if(!text || is_input_same_as_original())
    {
        save_note_BUTTON.setAttribute("disabled","");
        if(   (e.type == "auto_save")
           && is_last_note_auto_save()
          ) {
if(tag_this) console.log("🔴 AUTO_SAVE DELETE NOTE");

            note_6_onclick_delete(e, nArray.length-1);
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
        else                      nArray[index].text = text;
        layout_notes("save_note_auto", index);
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
   if(!nArray.length )
       return false;

   if(!nArray[nArray.length-1].text.startsWith(AUTO_SAVE_TAG) )
       return false;

if(log_this) console.log("🟣 AUTO_SAVE: LAST SAVED");
   return true;
};
/*}}}*/
//┌────────────────────────────────────┐
//│ 🔵 DELETE                          │
//└────────────────────────────────────┘
//● note_6_onclick_delete ● onclick ● delete_button {{{
let note_6_onclick_delete = function(e,index)
{
if(tag_this) console.log("%c note_6_onclick_delete: "+ e.type, "color: #F00");

    // cancelBubble ● cancel container's click delegation {{{
    e.cancelBubble = true;

    //}}}

    let deleting_editing_note   = (index == get_editing_note_index());
    let deleting_auto_save_note = (index == nArray.length) && is_last_note_auto_save();
    if( deleting_editing_note || deleting_auto_save_note)
        reset_input();

    // REMOVE NOTE
    nArray.splice(index, 1);

    // UPDATE STORAGE
    if(nArray.length)
        localStorage.setItem(get_notes_storage_key(), JSON.stringify( nArray ));
    else
        localStorage.removeItem(get_notes_storage_key());

    request_server_upload("Note #"+index+" DELETED");

    // LAYOUT GUI
    layout_notes("note_6_onclick_delete", index);

    // SHIFT EDITING NOTE DIV
    let editing_note_index  = get_editing_note_index();
    if( editing_note_index >= 0)
    {
        if(index < editing_note_index)
            set_editing_note_index(editing_note_index -1 );
        else
            set_editing_note_index(editing_note_index    );
    }
};
//}}}

//┌────────────────────────────────────────────────────────────────────────────┐
//│ standout_note_at_index ● make the working note standout, i.e. BIGGER       │
//└────────────────────────────────────────────────────────────────────────────┘
/*_ standout_note_at_index {{{*/
/*{{{*/
let standout_note_index;
/*}}}*/
let standout_note_at_index = function(index)
{
    if(index < 0)
        index = standout_note_index;

    // clip at last note
    if( index >= nArray.length)
        index  = nArray.length - 1;

    // fallback to last standout_note_index
    let is_last_note
        =  (index >= 0)
        && (index == (nArray.length -1));

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
/*_ note_scrollIntoView ● (-1 for last) {{{*/
let note_scrollIntoView = function(index=-1)
{
    if( !nArray.length ) return;

    if(   (index <  0            )
       || (index >= nArray.length)
      )
        index  = nArray.length - 1;

    let tr = saved_notes_TABLE.firstElementChild.children[ index ];
    if( tr )
        tr.classList.add("standout");

    let urdl = get_tr_vis_URDL(tr);
if(log_this) console.log(((urdl.dy==0) ? "✓" : (urdl.dy>0) ? "▲":"▼") +" urdl.visible: "+urdl.visible+"\t dy=["+urdl.dy+"]");//FIXME

    if(!urdl.visible )
        tr.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" }); // 'start center center nearest'
};
/*}}}*/
/*_ get_tr_vis_URDL {{{*/
let get_tr_vis_URDL = function(tr)
{
    let   p_rect =  saved_notes_DIV.getBoundingClientRect();
    let     rect =  tr.getBoundingClientRect();

    let        U = (rect.top    <=  p_rect.top                    ); // partially off top
    let        R = (rect.right  <   p_rect.left                   );
    let        D = (rect.bottom >= (p_rect.top    + p_rect.height)); // partially off bot
    let        L = (rect.left   >  (p_rect.left   + p_rect.width ));

    let visible = !(U || R || D || L);
    let dy = U       ? (rect.bottom                  )
        :    D       ? (rect.top - window.innerHeight)
        :               0;

    return { visible, dy };
};
/*}}}*/
//┌────────────────────────────────────────────────────────────────────────────┐
//│ update_summary ● FILE NAME ● NUMBER OF NOTE ● FROM SERVER OR CLIENT        │
//└────────────────────────────────────────────────────────────────────────────┘
/*_ update_summary {{{*/
let update_summary = function()
{
    let summary = note_DETAILS.firstElementChild;

    summary.childNodes[0].textContent = ""
        +     get_page_fileName()
        +" ("+ notes.get_nArray().length +" notes)"
        +" " + notes_loaded_from
        ;
};
/*}}}*/

return { name: "notes" //{{{
    // GUI
    ,    layout_notes
    ,    standout_note_at_index
    ,    update_summary
    ,    note_scrollIntoView

    // STORAGE
    ,    get_nArray             : () => nArray
    ,    load_notes
    ,    upload_notes_to_server
    ,    request_server_upload
    ,    request_server_upload_pending
    ,    get_notes_loaded_from  : () => notes_loaded_from

    // SAVE
    ,    note_1_onclick_save //..........................onclick

    // EDIT
    ,    note_5_onclick_edit //..........................onclick
    ,    set_editing_note_index
    ,    get_editing_note_index
    ,    save_note_auto
    ,    is_input_same_as_original
    ,    is_input_same_as_last_auto_save
    ,    is_last_note_auto_save

    // DELETE
    ,    note_6_onclick_delete //........................onclick

    // CHECK
    ,    note_4_onclick_check  //........................onclick
    ,    get_checked

    // IMPORT-EXPORT
    ,    note_2_onclick_import //.......................onclick
    ,    note_3_onclick_export //.......................onclick
    ,    center_input_placeholder
    ,    reset_input_placeholder

};
//}}}
})();
//}}}

//┌────────────────────────────────────────────────────────────────────────────┐
//│ INPUT                                                                   🔴 │
//└────────────────────────────────────────────────────────────────────────────┘
/* input {{{*/
/*  input_listener {{{*/
let input_listener = function(e)
{
if(log_this) console.log("input_listener: "+ e.type);

console.log(`Value changed: "${e.detail.oldValue}" → "${e.detail.newValue}"`);

    if( input.value.trim() )
    {
        notes.reset_input_placeholder();
        notes.save_note_auto( e );
        note_DETAILS.classList.remove("empty");
    }
    else {
        notes.note_1_onclick_save( { type: "auto_save" } ); // text cleared ...worth a synchronized update
        reset_input();
        note_DETAILS.classList.add   ("empty");
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
        let target = document.getElementById( id_wh.id        );
        target.style.width                  = id_wh.width +"px";
        target.style.height                 = id_wh.height+"px";

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
if(log_this) console.log("load_input");

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ NO SAVED INPUT CONTENT FROM PREVIOUS SESSION DID                       │
    //└────────────────────────────────────────────────────────────────────────┘
    let input_storage_key = get_input_storage_key();

    let text = localStorage.getItem( input_storage_key )
        ||      "";

    // DEFAULT TO SCROLL LAST NOTE INTO VIEW
    if(!text) {
        notes.note_scrollIntoView();
        return;
    }

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
            notes.note_5_onclick_edit({ target: node_row }, index);
// TODO: TRYING INPUT.FOCUS() TO RESUME NOTE EDIT {{{
//          input.addEventListener("mouseenter", (event) => event.target.focus());
//          input.addEventListener("mouseenter", ()      =>        input.focus());
//}}}
            return;
        }
    }
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ DISPLAY UNCOMMITED INPUT CONTENT WHEN PREVIOUS SESSION ENDED           │
    //└────────────────────────────────────────────────────────────────────────┘
    input.value = text;

    // SCROLL LAST NOTE INTO VIEW
    notes.note_scrollIntoView();

if(log_this) console.log( text );
};
/*}}}*/
/*  save_input {{{*/
let save_input = function()
{
    // STORE CURRENT INPUT CONTENT (WILL BE RESTORED BY NEXT RELOAD)
    let input_storage_key = get_input_storage_key();

    let text = input.value.trim();
    if( text ) {
        let stored  = localStorage.getItem( input_storage_key ) || "";
        if( stored != text)
            localStorage.setItem   ( input_storage_key , text);
    }
    // — TAKE THIS OPPORTUNITY TO CLEAR STORAGE FROM A STALE STORED NOTE
    else {
        localStorage.removeItem( input_storage_key );
    }
};
/*}}}*/
/*  reset_input {{{*/
let reset_input = function()
{
    // CLEAR TEXTAREA CONTENT
    input.value = "";

    // UPDATE STANDOUT IN [saved_notes_DIV]
    notes.set_editing_note_index(-1);
};
/*}}}*/
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ TextAreaAPI                                                             🔴 │
//└────────────────────────────────────────────────────────────────────────────┘
//{{{
let TextAreaAPI = (function()
{
//┌──────────────────────────────────────────────────────────────────────────┐
//│ CUSTOM EVENT
//└──────────────────────────────────────────────────────────────────────────┘
  //┌────────────────────────────────────────────────────────────────────────┐
  //│ INITILIZE
  //└────────────────────────────────────────────────────────────────────────┘
//  //{{{
//  let textarea = document.getElementById("myTextarea");
//  if(!textarea)
//      throw new Error("TextAreaAPI: Element #myTextarea not found");

//  let listeners = new Set();

//  //}}}
    let textarea;

  //┌────────────────────────────────────────────────────────────────────────┐
  //│ UNIFIED DISPATCH FUNCTION
  //└────────────────────────────────────────────────────────────────────────┘
  //{{{

  let notifyChange = function(oldValue, newValue)
  {
    let event = new CustomEvent("ta_ev", {
      bubbles: true,
      detail: { oldValue, newValue }
    });
    textarea.dispatchEvent( event );
  };
  //}}}

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ 1. HANDLE USER INPUT (NATIVE)
    //└────────────────────────────────────────────────────────────────────────┘
    /*_ ta_evListener {{{*/
    let ta_evListener = function(e) /* eslint-disable-line no-unused-vars */
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
  //│ 3. Public API
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
                      textarea.addEventListener   ("ta_ev", fn);
                      textarea.addEventListener   ("input", ta_evListener);
      return () =>    textarea.removeEventListener("ta_ev", fn);
    }
  };
  //}}}

})();

//}}}
//" Usage example {{{

//    //┌────────────────────────────────────────────────────────────────────────┐
//    //│ Initialize listener
//    //└────────────────────────────────────────────────────────────────────────┘
//    let unsubscribe = TextAreaAPI.on(input, (e) => {
//      console.log(`Value changed: "${e.detail.oldValue}" → "${e.detail.newValue}"`);
//    });

//    //┌────────────────────────────────────────────────────────────────────────┐
//    //│ Change via code (Triggers listener)
//    //└────────────────────────────────────────────────────────────────────────┘
//    TextAreaAPI.value = "Hello World";

//    //┌────────────────────────────────────────────────────────────────────────┐
//    //│ User types in the box (Triggers listener)
//    //│ User types "Test" -> Listener fires: "Hello World" -> "Hello WorldTest"
//    //└────────────────────────────────────────────────────────────────────────┘

//    //┌────────────────────────────────────────────────────────────────────────┐
//    //│ Stop listening
//    //└────────────────────────────────────────────────────────────────────────┘
//    unsubscribe();

//    "}}}

//┌────────────────────────────────────────────────────────────────────────────┐
//│ UTIL                                                                       │
//└────────────────────────────────────────────────────────────────────────────┘
//{{{
/* ● copy_to_clipboard {{{*/
let copy_to_clipboard = function(buffer)
{
if(log_this) console.log("copy_to_clipboard:");
if(log_this) console.log( buffer );

    navigator.clipboard.writeText( buffer );
};
/*}}}*/
/* ● ellipsis {{{*/
/*let ellipsis = function(str, n)
/*{
/*    return str.length > n ? str.slice(0, n - 1) + "…" : str;
/*};
/*}}}*/
/* ● escapeHtml {{{*/
let escapeHtml = function(text)
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

//{{{
    return { name: "js_notes"
        ,    onload
        ,    notes
        ,    get_input : () => input

        //   onclick
        ,    wider
        ,    narrower
        ,    tune_status
        ,    note_1_onclick_save     : notes.note_1_onclick_save
        ,    note_2_onclick_import   : notes.note_2_onclick_import
        ,    note_3_onclick_export   : notes.note_3_onclick_export
        ,    note_4_onclick_check    : notes.note_4_onclick_check
        ,    note_5_onclick_edit     : notes.note_5_onclick_edit
        ,    note_6_onclick_delete   : notes.note_6_onclick_delete

        // DEBUG ONLY
        , layout_notes
        , save_input
        , escapeHtml
        , print_note  : (index) =>             notes.get_nArray()[index].text
        , escape_note : (index) => escapeHtml( notes.get_nArray()[index].text )
        , tail_status
        , tapi        : TextAreaAPI
};
//}}}
})();
document.addEventListener("DOMContentLoaded", js_notes.onload);
