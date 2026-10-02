//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_VIEW.js       ● $APROJECTS/LANServer/SERVER      ● _TAG (261002:04h:00) │
//└────────────────────────────────────────────────────────────────────────────┘
// IMPORT {{{

/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */

/* globals  js_log    */
                         //┌─────────────┐
/* -------- js_MODEL  */ //│ - Model     │
/* exported js_VIEW   */ //│ ● View      │
/* globals  js_CNTRL  */ //│ - Controler │
                         //└─────────────┘
/* globals    notes   */
/* globals js_details */
/* globals js_notes   */
/* globals js_input   */

import { js_CNTRL   } from "./js_CNTRL.js"
import { js_MODEL   } from "./js_MODEL.js"
//port { js_VIEW    } from "./js_VIEW.js"
//port { js_folds   } from "./js_folds.js"
import { js_input   } from "./js_input.js"
//port { js_linkify } from "./js_linkify.js"
import { js_log     } from "./js_log.js"
import { js_details } from "./js_details.js"
//port { js_store   } from "./js_store.js"
//port { js_ticker  } from "./js_ticker.js"
//port { js_xpath   } from "./js_xpath.js"
//port { notes      } from "./notes.js"

//}}}
//{{{
//│ Here is how `js_VIEW.js` can be structured
//│ using a clean IIFE pattern:
//│
//│ to wire up the event listeners to  `js_CNTRL.transition()`
//│ and handle reactive UI updates via `js_CNTRL.subscribe ()
//}}}
const js_VIEW    = (function () {

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

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PRIVATE
    //└────────────────────────────────────────────────────────────────────────┘
    // const      ➔ input ● button ● table {{{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ DOM References
    //└────────────────────────────────────────────────────────────────────────┘
    let noteInput  ; // defined by init() = document.getElementById( "note_input_TEXTAREA" );
    let saveBtn    ; // defined by init() = document.getElementById( "save_note_BUTTON"    );
    let notesTable ; // defined by init() = document.getElementById( "saved_notes_TABLE"   );
    //}}}
    //  bindEvents ➔ click ● input ● utton  ● able {{{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ 1. Wire up DOM events to send intents to the State Machine
    //│ Dispatch intent rather than business logic
    //└────────────────────────────────────────────────────────────────────────┘
    let bindEvents = function()
    {
        // log {{{
        let caller = "VIEW\t● bindEvents";
        if( is_logging() ) log("%c"+caller+":"                          , lf6 );
        //}}}

        //┌────────────────────────────────────────────────────────────────────┐
        //│ saveBtn ● SAVE_NOTE
        //└────────────────────────────────────────────────────────────────────┘
        saveBtn.addEventListener("click", () => { //{{{
          //const content = noteInput.value;
            const content = noteInput.dataset.content;  // as set by js_input.reset_input()
            js_CNTRL.transition("SAVE_NOTE", { content });
        }); //}}}

        //┌────────────────────────────────────────────────────────────────────┐
        //│ notesTable ● SELECT_NOTE
        //│ notesTable ● DELETE_NOTE
        //└────────────────────────────────────────────────────────────────────┘
        notesTable.addEventListener("click", (e) => { //{{{
            const row = e.target.closest("tr");
            if(  !row ) return;

            //┌────────────────────────────────────────────────────────────────┐
            //│ ID      **nArray[index)**
            //└────────────────────────────────────────────────────────────────┘
            const noteId = row.dataset.id;

            //┌────────────────────────────────────────────────────────────────┐
            //│ DELETE  **delete-btn**
            //└────────────────────────────────────────────────────────────────┘
            if(e.target.classList.contains("delete_button")) {
                js_CNTRL.transition("DELETE_NOTE", noteId);
            }
            //┌────────────────────────────────────────────────────────────────┐
            //│ EDIT    **default**
            //└────────────────────────────────────────────────────────────────┘
            else {
                //┌────────────────────────────────────────────────────────────┐
                //│ CONTENT **nArray[index].text**
                //└────────────────────────────────────────────────────────────┘
                const   content = row.dataset.content;//FIXME
                //nst   content = row.getAttribute("title");
//              noteInput.value = content;
//              noteInput.title = 'VIEW\n🔵 notesTable.addEventListener("click")'; /* eslint-disable-line quotes */
                js_CNTRL.transition("SELECT_NOTE", { id: noteId, content });
            }
        }); //}}}

    }; //}}}

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PUBLIC
    //└────────────────────────────────────────────────────────────────────────┘
    //  render     ➔ content ● input  ●utton  ●able {{{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Render view changes based on state notifications
    //└────────────────────────────────────────────────────────────────────────┘
    let render = function(currentState, payload)
    {
        // log {{{
        let caller = "VIEW\t● render";
        if( is_logging() )
        {
            log("%c"+caller                                                     , lf6      );
            log("%c● called_by...:\t%c" + get_src_link()                        , lf6 , lb0);
            log("%c● currentState:\t%c["+ currentState                      +"]", lf6 , lb1);
            log("%c● payload.....:\t%c["+ ellipsis(JSON.stringify(payload)) +"]", lf6 , lb3);
        }
        //}}}
        switch (currentState)
        {
        //    IDLE {{{
        case "IDLE":
        saveBtn   .disabled    = false;
        saveBtn   .textContent = "Save Note";
        // log {{{
//      noteInput .value       = ""; // Reset input after operation
//      noteInput .title =        "VIEW\n🔵 Reset input after operation";
        log("%c● VIEW CALLING js_input.reset_input"  , lf6 +lbB);
        //}}}
                              js_input.reset_input();
        break;

        //}}}
        //    EDITING {{{
        case "EDITING":
        // log {{{
//{{{
//      saveBtn   .disabled    = false;
//      saveBtn   .textContent = "Update Note #"+ (parseInt(payload.id)+1);
//}}}
        log("%c● VIEW CALLING js_details.note_5_onclick_edit"  , lf6 +lbB);
        //}}}
                              js_details.note_5_onclick_edit({}, parseInt(payload.id) );
        break;

        //}}}
        //    SAVING | DELETING {{{
        case "SAVING":
        case "DELETING":
        saveBtn   .disabled    = true;
        saveBtn   .textContent = currentState === "SAVING" ? "Saving..." : "Deleting...";
        break;
        //}}}
        }
    }; //}}}
    // js_VIEW bindEvents ● SM subscribe {{{
    let init = function(e)
    {
        // log {{{
        let caller = "VIEW\t● init";
        if( is_logging() )
        {
            console_clear(caller);
            log("%c"+caller+":"                                         , lf6      );
            log("%c................e.type %c["+ e.type              +"]", lf6 , lb1);
            log("%c...document.readyState %c["+ document.readyState +"]", lf6 , lb2);
            log("%c.............noteInput %c["+ noteInput?.tagName  +"]", lf6 , lb1);
        }
        //}}}
        if( noteInput ) return;
        noteInput  = document.getElementById( "note_input_TEXTAREA" ); if(!noteInput  ) return;
        saveBtn    = document.getElementById( "save_note_BUTTON"    ); if(!saveBtn    ) return;
        notesTable = document.getElementById( "saved_notes_TABLE"   ); if(!notesTable ) return;
        // log {{{
        if( is_logging() ) {
            log("%c● noteInput :\t"+ (noteInput  && noteInput .tagName), lf6 );
            log("%c● saveBtn   :\t"+ (saveBtn    && saveBtn   .tagName), lf6 );
            log("%c● notesTable:\t"+ (notesTable && notesTable.tagName), lf6 );
        }
        //}}}

        //┌────────────────────────────────────────────────────────────────┐
        //│ 1. Wire up DOM events to send intents to the State Machine
        //└────────────────────────────────────────────────────────────────┘
        bindEvents();

        //┌────────────────────────────────────────────────────────────────┐
        //│ 2. Subscribe to the State Machine to receive state updates
        //└────────────────────────────────────────────────────────────────┘
        js_CNTRL.subscribe( render );
    };
    //}}}
    // init {{{
    return {
        init
    };
    //}}}

})();
//┌────────────────────────────────────────────────────────────────────────────┐
//│ Application Bootstrap
//└────────────────────────────────────────────────────────────────────────────┘
//{{{
document.addEventListener("DOMContentLoaded", js_VIEW.init);
document.addEventListener("readystatechange", js_VIEW.init);
//}}}

//┌────────────────────────────────────────────────────────────────────────────┐
//│ ### How They Work Together
//├────────────────────────────────────────────────────────────────────────────┤
//│{{{
//│ 1. **User Action $\rightarrow$ Intent (`transition`)**:
//│ When the user clicks `save_note`, the js_VIEW doesn"t care
//│ *how* saving works or whether it"s an update or creation.
//│ It simply fires `js_CNTRL.transition("SAVE_NOTE",
//│ payload)`.
//│
//│ 2. **State Machine $\rightarrow$ Side Effect (`DATA`)**:
//│ The state machine intercepts this, updates its internal
//│ state to `SAVING`, and triggers the appropriate `DATA`
//│ module method.
//│
//│ 3. **State Machine $\rightarrow$ Notification (`subscribe`)**:
//│ Once the async operation completes, the state machine
//│ shifts back to `IDLE` and broadcasts the new state to
//│ all listeners, triggering `js_VIEW.render()` automatically.
//│
//│ Would you like to see how error handling (such as a network
//│ failure during `DATA.save`) can be seamlessly integrated
//│ into the state machine transitions?
//│}}}
//└────────────────────────────────────────────────────────────────────────────┘
export { js_VIEW }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
