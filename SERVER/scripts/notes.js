//┌────────────────────────────────────────────────────────────────────────────┐
//│ notes.js     ● $APROJECTS/LANServer/SERVER          ● _TAG (260923:22h:12) │
//├────────────────────────────────────────────────────────────────────────────┤
//│ 🔴 Create, save, load and delete Notes in a section at the end of the body │
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/

/* globals js_notes */

/*}}}*/
let notes = (function()
{
let log_this = false;
let tag_this = false || log_this;

//┌────────────────────────────────────────────────────────────────────────────┐
//│ DATA                                                                      🔴
//├────────────────────────────────────────────────────────────────────────────┤
/* ●  INPUT PLACEHOLDER {{{*/

const PLACEHOLDER_CREATE_PROMPT = "Type your note here...";
const PLACEHOLDER_IMPORT_PROMPT = "\n" + "Paste all Notes to import here...";
const PLACEHOLDER_EXPORT_REPORT = "\n" + "{count}Notes\n" + "have been exported\n" + "into the clipboard";
const PLACEHOLDER_IMPORT_REPORT = "\n" + "{count}Notes\n" + "have been imported\n" + "from the clipboard";

/*}}}*/
// ●  AUTO_SAVE_TAG {{{
const AUTO_SAVE_TAG         = "(auto_save)\n";

//}}}
//└────────────────────────────────────────────────────────────────────────────┘

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🟤 GUI (js_notes)  GUI LEAK ● DATA ➔ VIEW                               🖥 │
//└────────────────────────────────────────────────────────────────────────────┘
/*_ add_notes_GUI {{{*/
/*{{{*/
let input;
let note_DETAILS;
let save_note_BUTTON;
let saved_notes_TABLE;
let wasted_note_BUTTON;
/*}}}*/
let add_notes_GUI = function(args)
{
    input              = args.input;
    note_DETAILS       = args.note_DETAILS;
    save_note_BUTTON   = args.save_note_BUTTON;
    saved_notes_TABLE  = args.saved_notes_TABLE;
    wasted_note_BUTTON = args.wasted_note_BUTTON;

    save_note_BUTTON.setAttribute("disabled",""); // 2 arguments required
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🟤 STORAGE                                                             🡮🡮  │
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/
//{{{
let nArray          = [];
let nArray_wasted   = [];

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
    let          notes_storage_key = js_notes.get_notes_storage_key();
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
        save_note_BUTTON.classList.remove("notes_uploaded");    // green ➔ red  border
        //┌─────────────────────────────┐
        //│ CONTOLER NOT INVOLVED (YET) │
        //└─────────────────────────────┘

        js_notes.show_status("🚧 UPLOAD to server still pending");
    }
    else {
        save_note_BUTTON.classList.add   ("notes_uploaded");    // red ➔ green  border
        //┌─────────────────────────────┐
        //│ CONTOLER NOT INVOLVED (YET) │
        //└─────────────────────────────┘

        js_notes.show_status("✅ IN-SYNC with server notes");   //TODO [HANDLE SHOWING SYNC FAILURE]
    }

    //┌────────────────────────────────────────────────────────────────────┐
    //│ START THE FIRST ASYNC UPDATE (it will re-arm itself on each call)  │
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
let load_notes = function()
{
    let notes_storage_key = js_notes.get_notes_storage_key();
if(tag_this) console.log("🟡%c load_notes\t\t  ["+ notes_storage_key +"]", "color: #FF0");

    fetch("/fetch_notes?notes_storage_key="+notes_storage_key)
        .then (( res  ) => res.json())
        .then (( data ) => load_server_notes(data))
        .catch(( err  ) => {
            // No notes yet
               console.log ("Could not retrieve notes from server", err);

            load_client_notes();

            js_notes.layout_notes    ("load_notes: "+ notes_loaded_from);
            js_notes.load_input();
        });
};
/*}}}*/
/*_ load_server_notes {{{*/
let load_server_notes = function(data)
{
if(tag_this) console.log("🟡%c load_server_notes(data: "+ (typeof data) +")", "color: #FF0");
//console.log("data=["+data+"]");

    // SERVER-SIDE NOTES ARRAY
    if(Array.isArray(data) && data.length)
    {
        notes_loaded_from = "✅ from server";
        nArray = data;

        // BACKUP SERVER-SIDE NOTES INTO localStorage
        if(nArray.length)
            localStorage.setItem(   js_notes.get_notes_storage_key(), JSON.stringify(nArray));
        else
            localStorage.removeItem(js_notes.get_notes_storage_key());
    }
    // LOAD CLIENT-SIDE NOTES AS A FALLBACK
    else {
        throw new Error("load_server_notes: server response was not an Note array");
//      notes_loaded_from = "❌ from device";
//      load_client_notes();
    }
    js_notes.layout_notes("load_notes: "+ notes_loaded_from);

    // input may contain one of the saved note .. resume editing
    js_notes.load_input();
};
/*}}}*/
/*_ load_client_notes {{{*/
let load_client_notes = function()
{
if(tag_this) console.log("%c load_client_notes", "color: #F00");

    let notes_storage_key = js_notes.get_notes_storage_key();
    try {
        nArray = JSON.parse(localStorage.getItem( notes_storage_key ) || "[]");
    }
    catch( ex ) {
        console.warn("load_client_notes("+notes_storage_key+")", ex);
    }
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Found some on device ● while none were fetched from server             │
    //└────────────────────────────────────────────────────────────────────────┘
    if( nArray.length )
    {
        if(!notes_loaded_from)
            notes_loaded_from   = "❌ missing on server!";
    }
    else {
        if(!notes_loaded_from)
            notes_loaded_from   = "…nothing yet for this file";
    }
};
/*}}}*/
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🟤 SAVE   ● note_1_onclick_save                                         🡮  │
//└────────────────────────────────────────────────────────────────────────────┘
//● note_1_onclick_save {{{
let note_1_onclick_save = function(e={})
{
if(tag_this) console.log("🟤 note_1_onclick_save");

    /* input text {{{*/
    let  text = input.value.trim();

    //}}}
    // if js_notes.save_note_auto ...return {{{
    if(e.type == "auto_save")
    {
        js_notes.save_note_auto( e );

        return;
    }
    //}}}
    // or delete auto_save ... {{{
    else if( js_notes.is_last_note_auto_save()  )
    {
        nArray.splice(nArray.length-1, 1);
    }
    //}}}
    // if input empty ...return {{{
    if( !text )
        return;

    //}}}
    // REPLACE NOTE {{{
    let index  = js_notes.get_editing_note_index();
    if( index >= 0)
    {
        //┌────────────────────────────────────────────────────────────────────┐
        //│ PRESERVE old checked stated and timestamp                          │
        //└────────────────────────────────────────────────────────────────────┘
      //nArray.splice(index, 1, {                                 text, timestamp: Date.now()              });
        nArray.splice(index, 1, { checked: nArray[index].checked, text, timestamp: nArray[index].timestamp });

        request_server_upload("Note #"+(index            )+" EDITED");
    }
    //}}}
    // ADD NEW NOTE {{{
    else {
        nArray.push(            { text, timestamp: Date.now() });

        request_server_upload("Note #"+(nArray.length + 1)+" ADDED");
    }
    //}}}
    // ... 🟢 STORE NOTES IN localStorage {{{
    localStorage.setItem(js_notes.get_notes_storage_key(), JSON.stringify( nArray ));

    //}}}
    // ... 🟢 SYNCHRONOUSLY UPLOAD NOTES TO SERVER {{{
    upload_notes_to_server();

    //}}}
    // ... 🔵 CLEAR USER INPUT ONCE SAVED {{{
    js_notes.reset_input("note_1_onclick_save");

    //}}}
    js_notes.layout_notes("note_1_onclick_save", index);
};
//}}}

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🔴 IMPORT ● note_2_onclick_import                                     🢀    │
//└────────────────────────────────────────────────────────────────────────────┘
/*● note_2_onclick_import ● onclick ● cb_BUTTON {{{*/
let note_2_onclick_import = function(e)
{
if(tag_this) console.log("🔴 "+e.target.innerText +"note_2_onclick_import");
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
    js_notes.reset_input("note_2_onclick_import");

    //}}}
    //{{{
    //┌──────────────────────────────────────────────────┐
    //│ 🔴 Note #1                                       │
    //│ 2/4 AUTO-SAVE LOOP DONE DELETE TEMPORARY NOTE    │
    //│ if(nArray.length && not...)                      │
    //│ replace with js_notes.is_last_note_auto_save              │
    //└──────────────────────────────────────────────────┘
    //}}}
    // cancel pending auto_save message {{{
    if( js_notes.is_last_note_auto_save())
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
        let matches = line.match(/Note +#?(\d)/i);
        if( matches )
        {
            // 🔴 FLUSH PREVIOUS
            if( text ) {
                note_2_onclick_import_push_note( { text , timestamp: Date.now() } );
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
        note_2_onclick_import_push_note( { text , timestamp: Date.now() } );
        count += 1;
    }

    request_server_upload("Note (x"+ nArray.length +") " +" IMPORTED");

    // ... 🟢 SYNCHRONOUSLY UPLOAD NOTES TO SERVER
    upload_notes_to_server();

    //}}}
    center_input_placeholder(PLACEHOLDER_IMPORT_REPORT .replace("{count}", count+" "), 10000);
    // update message list {{{
    js_notes.layout_notes("note_2_onclick_import");
    //}}}
};
/*}}}*/
/*_ note_2_onclick_import_push_note {{{*/
let note_2_onclick_import_push_note = function(note_args)
{
    // ADD A NEW NOTE
    nArray.push( note_args );

    // WHEN RESTORING A DELETED NOTE, REMOVE IT FROM THE DELETED NOTES ARRAY
    nArray_wasted_del_imported_note( note_args );
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🟠 EXPORT ● note_3_onclick_export                                       🢂  │
//└────────────────────────────────────────────────────────────────────────────┘
/*● note_3_onclick_export ● onclick ● cb_BUTTON {{{*/
const FOLD_OPEN = "{{{";
const FOLD_CLOSE= "}}}"; /* eslint-disable-line no-unused-vars */
const NOTE_H_SEP = " ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●"+FOLD_OPEN+"1";
let note_3_onclick_export = function(e)
{
if(tag_this) console.log("🟠 "+e.target.innerText +"note_3_onclick_export");
    if(!nArray.length) return;

    let buffer = "";
    let index  =  1;
    nArray.forEach((note) => buffer += (note.checked ? "✓":"□")             +" "
                   +                   "Note "+ String(index++).padStart(3) +" "
                   +                   formatDate( note.timestamp )         +" "
                   +                   NOTE_H_SEP                           +"\n"
                   +                   note.text                            +"\n\n"
                  );

    js_notes.copy_to_clipboard( buffer.trim() );

    center_input_placeholder(PLACEHOLDER_EXPORT_REPORT.replace("{count}", nArray.length+" "), 10000);
};
/*}}}*/
/*{{{*/
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
if(tag_this) console.log("⚫ reset_input_placeholder");

    input.setAttribute(    "placeholder", PLACEHOLDER_CREATE_PROMPT);

    input.classList.remove("center_input_placeholder");
};
/*}}}*/
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🟡 CHECK  ● note_4_onclick_check                                    [ ] ✅ │
//└────────────────────────────────────────────────────────────────────────────┘
//● note_4_onclick_check {{{
let note_4_onclick_check = function(e,index)
{
if(tag_this) console.log("🟡 note_4_onclick_check: "+ e.type);

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
    localStorage.setItem(js_notes.get_notes_storage_key(), JSON.stringify( nArray ));

    // UPDATE GUI LAYOUT
//  layout_notes("note_4_onclick_check", index);

    // SYNC INPUT ● while editing checked note
    if(js_notes.get_editing_note_index() == index)
    {
        if( get_checked(index)) input  .classList.add   ("checked");
        else                    input  .classList.remove("checked");
    }

    // PROPAGATE STATE CHANGE TO STORAGE HANDLERS
    request_server_upload("Note #"+index+" CHECKED");

    // ... 🟢 SYNCHRONOUSLY UPLOAD NOTES TO SERVER
    upload_notes_to_server();

};
//}}}
/*_ get_checked {{{*/
let get_checked = function(index)
{
    return nArray[index].checked ? "checked" : "";
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🟢 EDIT   ● note_5_onclick_edit                                         ✎  │
//└────────────────────────────────────────────────────────────────────────────┘



//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🔵 DELETE ● note_6_onclick_delete                                       ✕  │
//└────────────────────────────────────────────────────────────────────────────┘
//● note_6_onclick_delete {{{
let note_6_onclick_delete = function(e,index)
{
if(tag_this) console.log("🔵 note_6_onclick_delete: "+ e.type);

    // cancelBubble ● cancel container's click delegation {{{
    e.cancelBubble = true;

    //}}}

    let deleting_editing_note   = (index == js_notes.get_editing_note_index());
    let deleting_auto_save_note = (index == nArray.length) && js_notes.is_last_note_auto_save();
    if( deleting_editing_note || deleting_auto_save_note)
        js_notes.reset_input("note_6_onclick_delete");

    //┌───────────────────────────────────────────────────────────────────────┐
    //│ REMOVE NOTE ● add to the nArray_wasted array
    //└───────────────────────────────────────────────────────────────────────┘
    let  deleted_note = nArray.splice(index, 1)[0];

    if( !deleted_note.text.startsWith(AUTO_SAVE_TAG) )
        nArray_wasted_add_deleted_note( deleted_note );

    // UPDATE STORAGE
    if(nArray.length)
        localStorage.setItem(js_notes.get_notes_storage_key(), JSON.stringify( nArray ));
    else
        localStorage.removeItem(js_notes.get_notes_storage_key());

    request_server_upload("Note #"+index+" DELETED");

    // ... 🟢 SYNCHRONOUSLY UPLOAD NOTES TO SERVER
    upload_notes_to_server();

    // LAYOUT GUI
    js_notes.layout_notes("note_6_onclick_delete", index);

    // SHIFT EDITING NOTE DIV
    let editing_note_index  = js_notes.get_editing_note_index();
    if( editing_note_index >= 0)
    {
        if(index < editing_note_index)
            js_notes.set_editing_note_index(editing_note_index -1 );
        else
            js_notes.set_editing_note_index(editing_note_index    );
    }
};
//}}}

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🟠 WASTED ● note_7_onclick_wasted                                     🢀 🗑 │
//└────────────────────────────────────────────────────────────────────────────┘
/*● note_7_onclick_wasted ● onclick ● cb_BUTTON {{{*/
//{{{
const CLEAR_DELETED_NOTES = "Clear deleted notes";

//}}}
let note_7_onclick_wasted = function(e)
{
if(tag_this) console.log("🟠 "+e.target.innerText +"note_7_onclick_wasted");

    if(!nArray_wasted.length) return;

    reset_input_placeholder();

    // DISPLAY DELETED NOTE AS A BUFFER TO IMPORT
    if( wasted_note_BUTTON.innerText != CLEAR_DELETED_NOTES)
    {
        input.value = note_7_onclick_wasted_get_buffer() +"\n";

        // SHOW HOW TO CLEAR DELETED NOTES
        wasted_note_BUTTON    .classList.add("clear_deleted_notes");    // SERVER/style/notes.css
        wasted_note_BUTTON    .innerText
            =       CLEAR_DELETED_NOTES;

        setTimeout(() => {
            wasted_note_BUTTON.classList.remove("clear_deleted_notes");
            wasted_note_BUTTON.innerText
                = nArray_wasted.length +" deleted note"+ ((nArray_wasted.length > 1) ? "s":"");
        }, 2000);

    }
    // NEXT CLICK WILL PURGE DELETED NOTE ARRAY
    else {
        input.value = "";
        nArray_wasted_del_note_index(-1);
    }
};
/*}}}*/
/*_ nArray_wasted_add_deleted_note {{{*/
let nArray_wasted_add_deleted_note = function( deleted_note )
{
    nArray_wasted.push( deleted_note );

    wasted_note_BUTTON
        .removeAttribute("disabled");

    wasted_note_BUTTON.innerText
        = nArray_wasted.length +" deleted note"+ ((nArray_wasted.length > 1) ? "s":"");

    wasted_note_BUTTON.title
        = note_7_onclick_wasted_get_buffer()
        . replace(/\n\n+/g,"\n");
};
/*}}}*/
/*_ nArray_wasted_del_imported_note {{{*/
let nArray_wasted_del_imported_note = function(imported_note_args)
{
    let imported_text
        = imported_note_args.text.trim();

    for(let index = 0; index < nArray_wasted.length; ++index)
    {
        if( nArray_wasted[index].text.includes( imported_text ))
        {
            nArray_wasted_del_note_index( index );
            return;
        }
    }
};
/*}}}*/
/*_ nArray_wasted_del_note_index {{{*/
let nArray_wasted_del_note_index = function(index)
{
    // REMOVE a note or CLEAR nArray_wasted
    if(index < 0) nArray_wasted = [];
    else          nArray_wasted.splice(index, 1);

    // [disabled]
    if(nArray_wasted.length < 1) wasted_note_BUTTON.   setAttribute("disabled","");
    else                         wasted_note_BUTTON.removeAttribute("disabled"   );

    // NUMBER OF DELTED NOTES
    wasted_note_BUTTON.innerText
        =  nArray_wasted.length
        ? (nArray_wasted.length +" deleted note"+ ((nArray_wasted.length > 1) ? "s":""))
        :                     ("No deleted Notes");

    // ALL DELETED NOTES TEXT IN BUTTON TITLE TOOLTIP
    wasted_note_BUTTON.title
        = note_7_onclick_wasted_get_buffer()
        . replace(/\n\n+/g,"\n");
};
/*}}}*/
/*_ note_7_onclick_wasted_get_buffer {{{*/
let note_7_onclick_wasted_get_buffer = function()
{
    let buffer = "";
    let index  =  1;
    nArray_wasted
        .forEach(  (note) => buffer += ""
                 + (note.checked ? "✓":"□")             +" "
                 + "Note "+ String(index++).padStart(3) +" "
                 + formatDate( note.timestamp )         +" "
                 + NOTE_H_SEP                           +"\n"
                 + note.text                            +"\n\n"
                );

    return buffer.trim();
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🟣 STANDOUT                                                             💡 │
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

    if( is_last_note && js_notes.is_last_note_auto_save() )
        index = standout_note_index;

    document.querySelectorAll(".standout").forEach((el) => el.classList.remove("standout"));

    if(index >= 0)
    {
        standout_note_index = index;

        note_scrollIntoView( index );
    }
};
/*}}}*/
/*_ note_scrollIntoView {{{*/
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

    scroll_TR_intoView(tr);
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ ⚫ TR SCROLL INTO VIEW                                                  ▲▼ │
//└────────────────────────────────────────────────────────────────────────────┘
/*_ scroll_TR_intoView {{{*/
/* debounce timeout {{{*/
let SCROLL_TR_INTOVIEW_DELAY = 500;
let scroll_TR_intoView_timeout;
let scroll_TR_intoView = function(tr)
{
    if(scroll_TR_intoView_timeout) clearTimeout( scroll_TR_intoView_timeout );
       scroll_TR_intoView_timeout =  setTimeout( scroll_TR_intoView_handler , SCROLL_TR_INTOVIEW_DELAY, tr);
};
/*}}}*/
let scroll_TR_intoView_handler = function(tr)
{
/*{{{*/
if(tag_this) console.log("🟣%c scroll_TR_intoView_handler: %c"+js_notes.ellipsis(tr.innerText.trim(),50), "color: magenta", "background-color:black");

    scroll_TR_intoView_timeout = null;
/*}}}*/
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Get the nearest scrollable ancestor (vertical only, predictable DOM)   │
    //└────────────────────────────────────────────────────────────────────────┘
    /*{{{*/
    let        box = getClosestScrollableAncestor( tr );
    if(       !box ) return;

    let   row_rect =  tr.getBoundingClientRect();
    let   box_rect = box.getBoundingClientRect();
    /*}}}*/

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Scroll [parent top] near [row top]                                     │
    //└────────────────────────────────────────────────────────────────────────┘
    /*{{{*/
    let offset_old  = parseInt(row_rect.top - box_rect.top     );
    let offset_new  = parseInt(  offset_old - box_rect.height/2);

    // [tr] is already fully visible, no scroll required
    if(   (row_rect.top    > box_rect.top)
       && (row_rect.bottom < box_rect.bottom)
    )
        return;
    let box_scrollY = box.scrollTop + offset_new;

/*{{{
console.log(".offset_old=["+ offset_old  +"]");
console.log(".offset_new=["+ offset_new  +"]");
console.log("box_scrollY=["+ box_scrollY +"]");
}}}*/
    /*}}}*/

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ requestAnimationFrame to make sure the DOM has updated                 │
    //│ when this is triggered by a dynamic event                              │
    //└────────────────────────────────────────────────────────────────────────┘
    /*{{{*/
    requestAnimationFrame(() => {
        box.scrollTo({ top: box_scrollY, behavior: "smooth" });
    });
    /*}}}*/
};
/*}}}*/
/*_ getClosestScrollableAncestor {{{*/
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

//┌────────────────────────────────────────────────────────────────────────────┐
//│ ⚪️ SUMMARY                                                                 │
//└────────────────────────────────────────────────────────────────────────────┘
/*_ update_summary {{{*/
let update_summary = function()
{
    let summary = note_DETAILS.firstElementChild;

    summary.childNodes[0].textContent = ""
        +     js_notes.get_page_fileName()
        +" ("+   notes.get_nArray().length +" notes)"
        +" " +   notes_loaded_from
        ;
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ PUBLIC                                                                     │
//└────────────────────────────────────────────────────────────────────────────┘
//{{{
    return { name: "notes"
        // GUI
        ,    add_notes_GUI
        ,    note_scrollIntoView
        ,    standout_note_at_index
        ,    update_summary
        ,    PLACEHOLDER_CREATE_PROMPT

        // STORAGE
        ,    get_nArray             : () => nArray
        ,    load_notes
        ,    upload_notes_to_server
        ,    request_server_upload
        ,    request_server_upload_pending
        ,    get_notes_loaded_from  : () => notes_loaded_from

        // SAVE
        ,    note_1_onclick_save            //...onclick

    // EDIT ● MOVED in SERVER/scripts/js_notes.js
  //,    note_5_onclick_edit            //...onclick
  //,    set_editing_note_index
  //,    get_editing_note_index
  //,    save_note_auto
  //,    is_input_same_as_original
  //,    is_input_same_as_last_auto_save
  //,    is_last_note_auto_save

        // DELETE
        ,    note_6_onclick_delete          //...onclick

        // WASTED
        ,    note_7_onclick_wasted          //...onclick

        // CHECK
        ,    note_4_onclick_check           //...onclick
        ,    get_checked

        // IMPORT-EXPORT
        ,    note_2_onclick_import          //...onclick
        ,    note_3_onclick_export          //...onclick
        ,    center_input_placeholder
        ,    reset_input_placeholder
        // DEBUG
        , scroll_TR_intoView
        , note_7_onclick_wasted_get_buffer

    };
//}}}
})();
