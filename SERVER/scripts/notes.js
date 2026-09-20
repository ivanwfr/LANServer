//┌────────────────────────────────────────────────────────────────────────────┐
//│ notes.js     ● $APROJECTS/LANServer/SERVER          ● _TAG (260920:15h:42) │
//├────────────────────────────────────────────────────────────────────────────┤
//│ 🔴 Create, save, load and delete Notes in a section at the end of the body │
//└────────────────────────────────────────────────────────────────────────────┘
/* jshint{{{*/

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
let note_DETAILS;
let saved_notes_TABLE;
let input;
let save_note_BUTTON;
/*}}}*/
let add_notes_GUI = function(args)
{
    note_DETAILS      = args.note_DETAILS;
    input             = args.input;
    save_note_BUTTON  = args.save_note_BUTTON;
    saved_notes_TABLE = args.saved_notes_TABLE;

    save_note_BUTTON.setAttribute("disabled",""); // 2 arguments required
//┌────────────────────────────────────────────────────────────────────────────┐
//│ CONTOLER
js_notes.smTracerViewPort.setSaveButton(/*enabled*/ !save_note_BUTTON.disabled, /*label*/save_note_BUTTON.textContent, "add_notes_GUI");
//└────────────────────────────────────────────────────────────────────────────┘
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🟤 STORAGE                                                             🡮🡮  │
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/
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
        save_note_BUTTON.classList.remove("notes_uploaded");    // green ➔ red
        //┌─────────────────────────────┐
        //│ CONTOLER NOT INVOLVED (YET) │
        //└─────────────────────────────┘

        js_notes.show_status("🚧 UPLOAD to server still pending");
    }
    else {
        save_note_BUTTON.classList.add   ("notes_uploaded");    // red ➔ green
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
let load_notes = function() /* eslint-disable-line no-unused-vars */
{
    let notes_storage_key = js_notes.get_notes_storage_key();
if(tag_this) console.log("🟡%c load_notes\t\t  ["+ notes_storage_key +"]", "color: #FF0");

    fetch("/fetch_notes?notes_storage_key="+notes_storage_key)
        .then (( res  ) => res.json())
        .then (( data ) => load_server_notes(data))
        .catch(( err  ) => {
            console.warn("Could not retrieve notes from server", err);

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
//│ 🟤 SAVE                                                                 🡮  │
//└────────────────────────────────────────────────────────────────────────────┘
//● note_1_onclick_save {{{
let note_1_onclick_save = function(e)
{
if(tag_this) console.log("🟤 note_1_onclick_save");

    /* input text {{{*/
    let  text = input.value.trim();
js_notes.smTracerViewPort.viewSaveDraft   ("input length: "+ text.length +"ch", "note_1_onclick_save");

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
//│ 🔴 IMPORT                                                             🢀    │
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
js_notes.smTracerViewPort.viewSaveDraft   ("input length: "+ buffer.length +"ch ← note_2_onclick_import", "note_2_onclick_import");
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

    // ... 🟢 SYNCHRONOUSLY UPLOAD NOTES TO SERVER
    upload_notes_to_server();

    //}}}
    center_input_placeholder(PLACEHOLDER_IMPORT_REPORT .replace("{count}", count+" "), 10000);
    // update message list {{{
    js_notes.layout_notes("note_2_onclick_import");
    //}}}
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🟠 EXPORT                                                               🢂  │
//└────────────────────────────────────────────────────────────────────────────┘
/*● note_3_onclick_export ● onclick ● cb_BUTTON {{{*/
const FOLD_OPEN = "{{{"; /* eslint-disable-line no-unused-vars */
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
//┌────────────────────────────────────────────────────────────────────────────┐
//│ CONTOLER
js_notes.smTracerViewPort.showPlaceholder(/*text*/ input.getAttribute("placeholder"), "center_input_placeholder");
//└────────────────────────────────────────────────────────────────────────────┘

    input.classList.add("center_input_placeholder");

    setTimeout(reset_input_placeholder, delay);
};
let reset_input_placeholder = function()
{
if(tag_this) console.log("⚫ reset_input_placeholder");

    input.setAttribute(    "placeholder", PLACEHOLDER_CREATE_PROMPT);
//┌────────────────────────────────────────────────────────────────────────────┐
//│ CONTOLER
js_notes.smTracerViewPort.showPlaceholder(/*text*/ input.getAttribute("placeholder"), "reset_input_placeholder");
//└────────────────────────────────────────────────────────────────────────────┘

    input.classList.remove("center_input_placeholder");
};
/*}}}*/
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🟡 CHECK                                                            [ ] ✅ │
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
    if(get_editing_note_index() == index)
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
//│ 🟢 EDIT                                                                 ✎  │
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
    reset_input_placeholder();

    let  node_row;
    for( node_row =   e.target
       ; node_row && !node_row.classList.contains("node_row")
       ; node_row =   node_row.parentElement
       );

    input.value = node_row.getAttribute("title") +"\n";

    // EDITING A [checked] NOTE (OR NOT)
    if( get_checked(index)) input.classList.add   ("checked");
    else                    input.classList.remove("checked");

    // ADD [index] INNTO [save_note_BUTTON] ATTRIBUTES
    set_editing_note_index( index );

    // MAKE FIRST SYNCHRONOUS CALL TO START TRACKING CHANGES
    note_1_onclick_save( { type: "auto_save" } );
};
//}}}
/*{{{*/
/*_ set_editing_note_index {{{*/
/*{{{*/
const EDITING_NOTE_NUM       = "editing_note_num";
/*}}}*/
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
//┌────────────────────────────────────────────────────────────────────────────┐
//│ CONTOLER
js_notes.smTracerViewPort.setSaveButton(/*enabled*/ !save_note_BUTTON.disabled, /*label*/save_note_BUTTON.textContent, "set_editing_note_index");
//└────────────────────────────────────────────────────────────────────────────┘
    // standout edited note
    standout_note_at_index( index );
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
//┌────────────────────────────────────────────────────────────────────────────┐
//│ CONTOLER
js_notes.smTracerViewPort.setSaveButton(/*enabled*/ !save_note_BUTTON.disabled, /*label*/save_note_BUTTON.textContent, "save_note_auto");
//└────────────────────────────────────────────────────────────────────────────┘
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
//┌────────────────────────────────────────────────────────────────────────────┐
//│ CONTOLER
js_notes.smTracerViewPort.setSaveButton(/*enabled*/ !save_note_BUTTON.disabled, /*label*/save_note_BUTTON.textContent, "save_note_auto");
//└────────────────────────────────────────────────────────────────────────────┘
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
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🔵 DELETE                                                               ✕  │
//└────────────────────────────────────────────────────────────────────────────┘
//● note_6_onclick_delete {{{
let note_6_onclick_delete = function(e,index)
{
if(tag_this) console.log("🔵 note_6_onclick_delete: "+ e.type);

    // cancelBubble ● cancel container's click delegation {{{
    e.cancelBubble = true;

    //}}}

    let deleting_editing_note   = (index == get_editing_note_index());
    let deleting_auto_save_note = (index == nArray.length) && is_last_note_auto_save();
    if( deleting_editing_note || deleting_auto_save_note)
        js_notes.reset_input("note_6_onclick_delete");

    // REMOVE NOTE
    nArray.splice(index, 1);

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

        // EDIT
        ,    note_5_onclick_edit            //...onclick
        ,    set_editing_note_index
        ,    get_editing_note_index
        ,    save_note_auto
        ,    is_input_same_as_original
        ,    is_input_same_as_last_auto_save
        ,    is_last_note_auto_save

        // DELETE
        ,    note_6_onclick_delete          //...onclick

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

    };
//}}}
})();

