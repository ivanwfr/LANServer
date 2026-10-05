//┌────────────────────────────────────────────────────────────────[...]
//│ notes_refactored.js ● $APROJECTS/LANServer/SERVER ● Data Model  │
//├────────────────────────────────────────────────────────────────[...]
//│ 🔵 Data Layer: Manages note array, validation, persistence      │
//│    No DOM access, no UI state, no event handling               │
//│    Pure functions + internal state                             │
//└────────────────────────────────────────────────────────────────[...]
/* IMPORT {{{*/

/* globals js_store */
/* globals js_log   */

import { js_log     } from "./js_log.js"
import { js_store   } from "./js_store.js"

/*}}}*/
let notes = (function()
{
"use strict";

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

// ● Configuration {{{
let log_this = false;
let tag_this = false || log_this;
//}}}

//┌─────────────────────────────────────────────────────────────────[...]
//│ CONSTANTS ● PLACEHOLDERS ● AUTO-SAVE TAG                         │
//└─────────────────────────────────────────────────────────────────[...]

const PLACEHOLDER_CREATE_PROMPT = "Type your note here...";
const PLACEHOLDER_IMPORT_PROMPT = "\n" + "Paste all Notes to import here...";
const PLACEHOLDER_EXPORT_REPORT = "\n" + "{count}Notes\n" + "have been exported\n" + "into the clipboard";
const PLACEHOLDER_IMPORT_REPORT = "\n" + "{count}Notes\n" + "have been imported\n" + "from the clipboard";

const AUTO_SAVE_TAG         = "(auto_save)\n";
const AUTO_SAVE_IDLE_INTERVAL_MS = 5000;
const AUTO_SAVE_EDIT_INTERVAL_MS = 1000;

const UPLOAD_NOTES_INTERVAL_MS = 5000;

//┌─────────────────────────────────────────────────────────────────[...]
//│ INTERNAL STATE ● MODEL DATA                                      │
//└─────────────────────────────────────────────────────────────────[...]

/*{{{*/
let nArray          = [];
let nArray_wasted   = [];
let notes_loaded_from;
let notes_has_changed_reason;
let upload_notes_to_server_timeout;
/*}}}*/

//┌─────────────────────────────────────────────────────────────────[...]
//│ STORAGE HELPERS                                                  │
//└─────────────────────────────────────────────────────────────────[...]

/*_ get_notes_storage_key {{{*/
let get_notes_storage_key = function()
{
    return "notes__"+ js_store.get_page_storage_key();
};
/*}}}*/

//┌─────────────────────────────────────────────────────────────────[...]
//│ PUBLIC ● READ ACCESSORS (no side effects)                        │
//└─────────────────────────────────────────────────────────────────[...]

/*_ get_nArray ● Return notes array (caller must not mutate) {{{*/
let get_nArray = function()
{
    // log {{{
    let caller = "notes ● get_nArray";
    if( is_logging() ) {
        log("%c"+caller, lf1);
        log("%c● length..:\t%c["+ nArray.length +"]", lf1, lb0);
    }
    //}}}
    return nArray;
};
/*}}}*/

/*_ get_notes_loaded_from ● Return load source message {{{*/
let get_notes_loaded_from = function()
{
    return notes_loaded_from;
};
/*}}}*/

/*_ get_checked ● Return checked state string for note at index {{{*/
let get_checked = function(index)
{
    // log {{{
    let caller = "notes ● get_checked";
    if( is_logging() ) {
        log("%c"+caller                                   , lf1);
        log("%c● index...:\t%c["+ index                 +"]", lf1, lb0);
        log("%c● checked.:\t%c["+ nArray[index].checked +"]", lf1, lb1);
    }
    //}}}
    return nArray[index].checked ? "checked" : "";
};
/*}}}*/

//┌─────────────────────────────────────────────────────────────────[...]
//│ PUBLIC ● LOAD OPERATIONS (async)                                 │
//└─────────────────────────────────────────────────────────────────[...]

/*_ load_notes ● Fetch from server, fallback to localStorage {{{*/
let load_notes = function()
{
    // log {{{
    let caller = "notes ● load_notes";
    if( is_logging() ) console_clear(caller);
    //}}}

    let notes_storage_key = get_notes_storage_key();
    if(tag_this) console.log("🟡%c load_notes\t["+ notes_storage_key +"]", "color: #FF0");

    fetch("/fetch_notes?notes_storage_key="+notes_storage_key)
        .then (( res  ) => res.json())
        .then (( data ) => load_server_notes(data))
        .catch(( err  ) => {
            // No notes yet
            if(tag_this) console.log ("Could not retrieve notes from server", err);

            load_client_notes();

            if( is_logging() ) {
                log("%c● Fallback to localStorage", lb1);
            }
        });
};
/*}}}*/

/*_ load_server_notes {{{*/
let load_server_notes = function(data)
{
    // log {{{
    let caller = "notes ● load_server_notes";
    if( is_logging() ) {
        log("%c"+caller, lf1);
        log("%c● data_type:\t%c["+ (typeof data) +"]", lf1, lb0);
    }
    //}}}

    if(tag_this) console.log("🟡%c load_server_notes(data: "+ (typeof data) +")", "color: #FF0");

    // SERVER-SIDE NOTES ARRAY
    if(Array.isArray(data) && data.length)
    {
        notes_loaded_from = "✅ from server";
        nArray = data;

        // BACKUP SERVER-SIDE NOTES INTO localStorage
        if(nArray.length)
            localStorage.setItem(   get_notes_storage_key(), JSON.stringify(nArray));
        else
            localStorage.removeItem(get_notes_storage_key());

        if( is_logging() ) {
            log("%c● Loaded from server", lb2);
            log("%c● notes count:\t%c["+ nArray.length +"]", lb2, lb3);
        }
    }
    // LOAD CLIENT-SIDE NOTES AS A FALLBACK
    else {
        if(tag_this) console.warn("load_server_notes: server response was not a Note array");
        load_client_notes();
    }
};
/*}}}*/

/*_ load_client_notes {{{*/
let load_client_notes = function()
{
    // log {{{
    let caller = "notes ● load_client_notes";
    if( is_logging() ) {
        log("%c"+caller, lf1);
    }
    //}}}

    if(tag_this) console.log("%c load_client_notes", "color: #F00");

    let notes_storage_key = get_notes_storage_key();
    try {
        nArray = JSON.parse(localStorage.getItem( notes_storage_key ) || "[]");
    }
    catch( ex ) {
        console.warn("load_client_notes("+notes_storage_key+")", ex);
    }

    //┌──────────────────────────────────────────────────────────────[...]
    //│ Found some on device ● while none were fetched from server
    //└──────────────────────────────────────────────────────────────[...]
    if( nArray.length )
    {
        if(!notes_loaded_from)
            notes_loaded_from   = "❌ missing on server!";
    }
    else {
        if(!notes_loaded_from)
            notes_loaded_from   = "…nothing yet for this file";
    }

    if( is_logging() ) {
        log("%c● Loaded from localStorage", lb1);
        log("%c● notes count:\t%c["+ nArray.length +"]", lb1, lb0);
        log("%c● loaded_from.:\t%c["+ notes_loaded_from +"]", lb1, lb2);
    }
};
/*}}}*/

//┌─────────────────────────────────────────────────────────────────[...]
//│ PUBLIC ● SAVE OPERATIONS (Note CRUD)                             │
//└─────────────────────────────────────────────────────────────────[...]

/*_ saveNote ● Add new or update existing note {{{*/
let saveNote = function(payload={})
{
    // log {{{
    let caller = "notes ● saveNote";
    if( is_logging() ) {
        log("%c"+caller, lf1);
        log("%c● payload.:\t%c["+ ellipsis(JSON.stringify(payload)) +"]", lf1, lb0);
    }
    //}}}

    if(tag_this) console.log("🟤 saveNote");

    // GUARD: No payload
    if(!payload || !payload.content)
        return null;

    /* input text {{{*/
    let  text = payload.content.trim();
    //}}}

    // GUARD: No content
    if( !text )
        return null;

    //}}}

    // DELETE any pending auto_save {{{
    if( isLastNoteAutoSave() )
    {
        nArray.splice(nArray.length-1, 1);
    }
    //}}}

    // REPLACE NOTE if editing {{{
    let editingIndex  = payload.editingIndex || -1;
    if( editingIndex >= 0)
    {
        //┌────────────────────────────────────────────────────────────[...]
        //│ PRESERVE old checked state and timestamp
        //└────────────────────────────────────────────────────────────[...]
        nArray.splice(editingIndex, 1, {
            checked: nArray[editingIndex].checked,
            text,
            timestamp: nArray[editingIndex].timestamp
        });

        request_server_upload("Note #"+(editingIndex + 1)+" EDITED");

        if( is_logging() ) {
            log("%c● Note updated at index", lb1);
            log("%c● editingIndex:\t%c["+ editingIndex +"]", lb1, lb0);
        }
    }
    //}}}
    // ADD NEW NOTE {{{
    else {
        nArray.push({ text, timestamp: Date.now() });

        request_server_upload("Note #"+(nArray.length)+" ADDED");

        if( is_logging() ) {
            log("%c● New note added", lb2);
            log("%c● total notes:\t%c["+ nArray.length +"]", lb2, lb0);
        }
    }
    //}}}

    // ... 🟢 STORE NOTES IN localStorage {{{
    localStorage.setItem(get_notes_storage_key(), JSON.stringify( nArray ));
    //}}}

    // ... 🟢 QUEUE SERVER UPLOAD {{{
    upload_notes_to_server();
    //}}}

    // Return saved note for state machine
    return { id: editingIndex >= 0 ? editingIndex : nArray.length - 1, text };
};
/*}}}*/

/*_ deleteNote ● Remove note at index {{{*/
let deleteNote = function(noteIndex)
{
    // log {{{
    let caller = "notes ● deleteNote";
    if( is_logging() ) {
        log("%c"+caller, lf1);
        log("%c● index...:\t%c["+ noteIndex +"]", lf1, lb0);
    }
    //}}}

    if(tag_this) console.log("🔵 deleteNote: "+ noteIndex);

    let nArray_len = nArray.length;

    // GUARD
    if( noteIndex < 0 || noteIndex >= nArray_len )
        return null;

    //┌──────────────────────────────────────────────────────────────[...]
    //│ REMOVE NOTE ● add to the nArray_wasted array
    //└──────────────────────────────────────────────────────────────[...]
    let  deleted_note = nArray.splice(noteIndex, 1)[0];

    if( !deleted_note.text.startsWith(AUTO_SAVE_TAG) )
        nArray_wasted_add_deleted_note( deleted_note );

    // UPDATE STORAGE
    if(nArray.length)
        localStorage.setItem(get_notes_storage_key(), JSON.stringify( nArray ));
    else
        localStorage.removeItem(get_notes_storage_key());

    request_server_upload("Note #"+noteIndex+" DELETED");

    // ... 🟢 SYNCHRONOUSLY UPLOAD NOTES TO SERVER
    upload_notes_to_server();

    if( is_logging() ) {
        log("%c● Note deleted", lb1);
        log("%c● remaining..:\t%c["+ nArray.length +"]", lb1, lb0);
    }

    return deleted_note;
};
/*}}}*/

/*_ checkNote ● Toggle checked state {{{*/
let checkNote = function(noteIndex)
{
    // log {{{
    let caller = "notes ● checkNote";
    if( is_logging() ) {
        log("%c"+caller, lf1);
        log("%c● index...:\t%c["+ noteIndex +"]", lf1, lb0);
    }
    //}}}

    if(tag_this) console.log("🟡 checkNote: "+ noteIndex);

    // GUARD
    if( noteIndex < 0 || noteIndex >= nArray.length )
        return null;

    // TOGGLE NOTE CHECKED STATE
    nArray[noteIndex].checked = !nArray[noteIndex].checked;

    // UPDATE CLIENT-SIDE STORAGE
    localStorage.setItem(get_notes_storage_key(), JSON.stringify( nArray ));

    // PROPAGATE STATE CHANGE TO STORAGE HANDLERS
    request_server_upload("Note #"+noteIndex+" CHECKED");

    // ... 🟢 SYNCHRONOUSLY UPLOAD NOTES TO SERVER
    upload_notes_to_server();

    if( is_logging() ) {
        log("%c● Note toggled", lb1);
        log("%c● checked now.:\t%c["+ nArray[noteIndex].checked +"]", lb1, lb0);
    }

    return nArray[noteIndex];
};
/*}}}*/

//┌─────────────────────────────────────────────────────────────────[...]
//│ PUBLIC ● IMPORT/EXPORT OPERATIONS                                │
//└─────────────────────────────────────────────────────────────────[...]

/*_ importNotes ● Parse buffer and add multiple notes {{{*/
let importNotes = function(buffer="")
{
    // log {{{
    let caller = "notes ● importNotes";
    if( is_logging() ) {
        log("%c"+caller, lf1);
        log("%c● buffer..:\t%c["+ ellipsis(buffer, 50) +"]", lf1, lb0);
    }
    //}}}

    if(tag_this) console.log("🔴 importNotes");

    // GUARD
    if(!buffer || !buffer.trim())
        return { count: 0, message: PLACEHOLDER_IMPORT_PROMPT };

    // ... 🟢 DELETE any pending auto_save note {{{
    if( isLastNoteAutoSave())
        deleteNote(nArray.length-1);
    //}}}

    // parse pasted lines {{{
    let lines = buffer.split("\n");
    let text  = "";
    let count = 0;
    const NOTE_H_SEP = " ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●";

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
                nArray.push({ text , timestamp: Date.now() });
                count += 1;
            }
            // 🟠 SKIP "Node #..." LINE
            text = "";
        }
        // next line of text
        else if( !line.includes( NOTE_H_SEP ) )
        {
            //┌───────────────────────────────────────────────────────────[...]
            //│ FIRST LINE: Import should **auto-number** added notes
            //│ [ ] ...but not those starting with a number marker
            //│       !match(/^\d+\s/)
            //└───────────────────────────────────────────────────────────[...]
            if(!text && !line.match(/^ *\d+\. /))
            {
                text = (nArray.length + 1) +". ";
            }
            text    += line+"\n";
        }
    }
    // 🟡 FLUSH LAST
    if( text ) {
        nArray.push({ text , timestamp: Date.now() });
        count += 1;
    }
    //}}}

    request_server_upload("Note (x"+ nArray.length +") " +" IMPORTED");

    // ... 🟢 SYNCHRONOUSLY UPLOAD NOTES TO SERVER
    upload_notes_to_server();

    if( is_logging() ) {
        log("%c● Import completed", lb2);
        log("%c● imported count:\t%c["+ count +"]", lb2, lb0);
        log("%c● total notes..:\t%c["+ nArray.length +"]", lb2, lb1);
    }

    return {
        count,
        message: PLACEHOLDER_IMPORT_REPORT.replace("{count}", count+" ")
    };
};
/*}}}*/

/*_ exportNotes ● Format all notes as text {{{*/
let exportNotes = function()
{
    // log {{{
    let caller = "notes ● exportNotes";
    if( is_logging() ) {
        log("%c"+caller, lf1);
        log("%c● count...:\t%c["+ nArray.length +"]", lf1, lb0);
    }
    //}}}

    if(tag_this) console.log("🟠 exportNotes");

    if(!nArray.length)
        return { buffer: "", message: "No notes to export" };

    const NOTE_H_SEP = " ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●";
    let buffer = "";
    let index  =  1;

    nArray.forEach((note) =>
        buffer += (note.checked ? "✓":"□")             +" "
               +  "Note "+ String(index++).padStart(3) +" "
               +  formatDate( note.timestamp )         +" "
               +  NOTE_H_SEP                           +"\n"
               +  note.text                            +"\n\n"
    );

    if( is_logging() ) {
        log("%c● Export formatted", lb1);
        log("%c● buffer size.:\t%c["+ buffer.length +"]", lb1, lb0);
    }

    return {
        buffer: buffer.trim(),
        message: PLACEHOLDER_EXPORT_REPORT.replace("{count}", nArray.length+" ")
    };
};
/*}}}*/

//┌─────────────────────────────────────────────────────────────────[...]
//│ PUBLIC ● WASTED NOTES (Deleted/Recovery)                         │
//└─────────────────────────────────────────────────────────────────[...]

/*_ getWastedNotes ● Return deleted notes array {{{*/
let getWastedNotes = function()
{
    return nArray_wasted;
};
/*}}}*/

/*_ restoreNote ● Display deleted notes for recovery {{{*/
let restoreNote = function()
{
    // log {{{
    let caller = "notes ● restoreNote";
    if( is_logging() ) {
        log("%c"+caller, lf1);
        log("%c● wasted cnt:\t%c["+ nArray_wasted.length +"]", lf1, lb0);
    }
    //}}}

    if(tag_this) console.log("🟠 restoreNote");

    if(!nArray_wasted.length)
        return {
            buffer: "",
            message: "No deleted notes"
        };

    const NOTE_H_SEP = " ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●";
    let buffer = "";
    let index  =  1;

    nArray_wasted.forEach((note) =>
        buffer += (note.checked ? "✓":"□")             +" "
               +  "Note "+ String(index++).padStart(3) +" "
               +  formatDate( note.timestamp )         +" "
               +  NOTE_H_SEP                           +"\n"
               +  note.text                            +"\n\n"
    );

    if( is_logging() ) {
        log("%c● Wasted notes formatted", lb1);
        log("%c● buffer size.:\t%c["+ buffer.length +"]", lb1, lb0);
    }

    return {
        buffer: buffer.trim(),
        message: nArray_wasted.length +" deleted note"+ ((nArray_wasted.length > 1) ? "s":"")
    };
};
/*}}}*/

/*_ clearWastedNotes ● Remove all deleted notes {{{*/
let clearWastedNotes = function()
{
    // log {{{
    let caller = "notes ● clearWastedNotes";
    if( is_logging() ) {
        log("%c"+caller, lf1);
    }
    //}}}

    if(tag_this) console.log("🟠 clearWastedNotes");

    nArray_wasted = [];

    if( is_logging() ) {
        log("%c● Wasted notes cleared", lb1);
    }

    return { count: 0 };
};
/*}}}*/

/*_ nArray_wasted_add_deleted_note {{{*/
let nArray_wasted_add_deleted_note = function( deleted_note )
{
    nArray_wasted.push( deleted_note );
};
/*}}}*/

/*_ nArray_wasted_del_imported_note ● Remove from wasted if re-imported {{{*/
let nArray_wasted_del_imported_note = function(imported_note_args)
{
    let imported_text
        = imported_note_args.text.trim();

    for(let index = 0; index < nArray_wasted.length; ++index)
    {
        if( nArray_wasted[index].text.includes( imported_text ))
        {
            nArray_wasted.splice(index, 1);
            return;
        }
    }
};
/*}}}*/

//┌─────────────────────────────────────────────────────────────────[...]
//│ PRIVATE ● SERVER SYNC                                             │
//└─────────────────────────────────────────────────────────────────[...]

/*_ upload_notes_to_server {{{*/
let upload_notes_to_server = function(_caller="timeout")
{
    // log {{{
    let caller = "notes ● upload_notes_to_server";
    if( is_logging() ) {
        log("%c"+caller, lf1);
        log("%c● caller_by:\t%c["+ _caller +"]", lf1, lb0);
    }
    //}}}

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
    //}}}

    if(tag_this) console.log("%c "+caller+ ":\n"
                         +" ▲ [ "+ _caller               +" ]\n"
                         +" ● [ "+ server_upload_pending +" ]\n"
                         +" ● nArray[ x"+nArray.length   +" ]\n"
                         +" ● time now ["+ change_time   +" ]\n"
                         , "color: #FF0");

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

/*_ request_server_upload {{{*/
let request_server_upload = function(upload_reason=undefined)
{
    // log {{{
    let caller = "notes ● request_server_upload";
    if( is_logging() ) {
        log("%c"+caller, lf1);
        log("%c● reason...:\t%c["+ (upload_reason || "false") +"]", lf1, lb0);
    }
    //}}}

    //┌──────────────────────────────────────────────────────────────[...]
    //│ SERVER UPDATE SYNC STATUS
    //└──────────────────────────────────────────────────────────────[...]
    if( upload_reason )
    {
        // red border ➔ red border (pending)
        // Sent to ui_VIEW for rendering
    }
    else {
        // red ➔ green border (synced)
        // Sent to ui_VIEW for rendering
    }

    //┌──────────────────────────────────────────────────────────────[...]
    //│ START THE FIRST ASYNC UPDATE
    //│ (it will re-arm itself on each call)
    //└──────────────────────────────────────────────────────────────[...]
    if(!upload_notes_to_server_timeout) upload_notes_to_server( upload_reason );

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

//┌─────────────────────────────────────────────────────────────────[...]
//│ PRIVATE ● UTILITY HELPERS                                         │
//└─────────────────────────────────────────────────────────────────[...]

/*_ isLastNoteAutoSave {{{*/
let isLastNoteAutoSave = function()
{
    if(!nArray.length )
       return false;

    if(!nArray[nArray.length-1].text.startsWith(AUTO_SAVE_TAG) )
       return false;

    if(log_this) console.log("🔵 IS_LAST_NOTE_AUTO_SAVE");
    return true;
};
/*}}}*/

/*_ formatDate ● Format timestamp as readable string {{{*/
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

// return {{{
    return { name: "notes"

        //┌──────────────────────────────────────────────────────────────[...]
        //│ CONSTANTS
        //└──────────────────────────────────────────────────────────────[...]
        ,    PLACEHOLDER_CREATE_PROMPT
        ,    PLACEHOLDER_IMPORT_PROMPT
        ,    PLACEHOLDER_EXPORT_REPORT
        ,    PLACEHOLDER_IMPORT_REPORT
        ,    AUTO_SAVE_TAG
        ,    AUTO_SAVE_IDLE_INTERVAL_MS
        ,    AUTO_SAVE_EDIT_INTERVAL_MS

        //┌──────────────────────────────────────────────────────────────[...]
        //│ READ ACCESSORS
        //├──────────────────────────────────────────────────────────────[...]
        //│ Get data without side effects
        //└──────────────────────────────────────────────────────────────[...]
        ,    get_nArray
        ,    get_notes_loaded_from
        ,    get_checked
        ,    getWastedNotes

        //┌──────────────────────────────────────────────────────────────[...]
        //│ LOAD OPERATIONS
        //├──────────────────────────────────────────────────────────────[...]
        //│ Async: fetch from server → parse → store locally
        //└──────────────────────────────────────────────────────────────[...]
        ,    load_notes

        //┌──────────────────────────────────────────────────────────────[...]
        //│ CRUD OPERATIONS
        //├──────────────────────────────────────────────────────────────[...]
        //│ Create/Read/Update/Delete notes
        //│ Return updated note or null on failure
        //└──────────────────────────────────────────────────────────────[...]
        ,    saveNote
        ,    deleteNote
        ,    checkNote

        //┌──────────────────────────────────────────────────────────────[...]
        //│ IMPORT/EXPORT OPERATIONS
        //├──────────────────────────────────────────────────────────────[...]
        //│ Bulk import/export with formatting
        //└──────────────────────────────────────────────────────────────[...]
        ,    importNotes
        ,    exportNotes

        //┌──────────────────────────────────────────────────────────────[...]
        //│ WASTED NOTES (Deleted/Recovery)
        //├──────────────────────────────────────────────────────────────[...]
        ,    restoreNote
        ,    clearWastedNotes

        // DEBUG ONLY
        , log         : () => { log_this = !log_this; console.log("log_this=["+log_this+"]"); }
        , tag         : () => { tag_this = !tag_this; console.log("tag_this=["+tag_this+"]"); }
    };
//}}}

})();
export { notes }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . notes = notes; // exposed to inline onclick handlers
