javascript:(js_paste_notes = function() { /* eslint-disable-line no-unused-labels */ /* eslint-disable-line no-labels */ /* eslint-disable-line no-undef */
/* paste_notes_bookmarklet.js _TAG (260907:20h:21) */
/* 1. "CONTEXT DEFINITION" {{{*/
const CONTEXT = `
NOTE #0\n
XXX ⚪️\n
\n
NOTE #1 🟤\n
XXX 🟤\n
\n
NOTE #2 🟠\n
XXX 🔴\n
\n
Node.js:\n
    "Cannot write headers after they are sent to the client"\n
\n
Note #2\n
2.\n
🔴 AUTO-SAVE LOOP DONE DELETE TEMPORARY NOTE\n
if(notes.length && not...\n
replace with is_auto_save\n
\n
Note #3\n
3.\n
INPUT CONTENT\n
on 🟤 beforeunload\n
or 🔴 visibilitychange\n
\n

Note #4\n
4.\n
TODO: add keyword cb buttons\n
TODO: copy input-content onclick\n
TODO: copy selection onclick\n
TODO: paste onclick AND colorize when same as input content\n
TODO: clear when same as input content\n
\n

Note #5\n
5.\n
rename load_notes to display_notes\n
\n

Note #6\n
6.\n
TODO: a click on a note to edit should save input content before replacement\n
\n

Note #7\n
7.\n
TODO: add TODO: and FIXME: to Twiddler mapping\n
\n

Note #8\n
8.\n
TODO: make a bookmarklet from js_notes.js\n
\n

Note #9\n
9.\n
sync_auto_save_note\n
remove NO INPUT TEXT        if( !text ) return\n
use !is_input_same_as_last_auto_save_note()\n
index = () ? :\n
\n

Note #10\n
10.\n
delete_note\n
use is_last_note_auto_save\n
rename edit_done to input_reset\n
\n

Note #11\n
11.\n
delete_note\n
remove:\n
        // clear user text when deleting auto_save note\n
        if(   notes.length\n
           && notes[notes.length-1].text.startsWith(AUTO_SAVE_TAG)\n
           && (e.type != "auto_save")\n
          )\n
            edit_done();\n
`;
/*}}}*/
let onload = function()
{
    /* 3. LOCATE TEXTAREA {{{*/
    let ta = document.querySelector("textarea");
    if(!ta ) {
        alert("⚠️ textarea not found"); /* eslint-disable-line no-alert */
    }
    /*}}}*/
    /* 5. SESSION CONTEXT FEED INTO CHAT INPUT {{{ */
    /* Call native setter + input event so the app state updates */
    Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")
        .set.call(ta, CONTEXT);

    ta.dispatchEvent(new Event("input", { bubbles: true }));
    /*}}}*/
    /* 6. ADJUST TEXTAREA LAYOUT {{{*/
    ta.style.display   = "block";
    ta.style.resize    = "both";

    ta.focus();
    /*}}}*/
};
return { onload };
});
js_paste_notes().onload(); /* eslint-disable-line no-undef */

