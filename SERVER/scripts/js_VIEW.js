//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_VIEW.js       ● $APROJECTS/LANServer/SERVER       ● _TAG (260923:02h:25) │
//├────────────────────────────────────────────────────────────────────────────┤
//{{{
//│ Here is how `js_VIEW.js` can be structured
//│ using a clean IIFE pattern:
//│
//│ to wire up the event listeners to  `js_CNTRL.transition()`
//│ and handle reactive UI updates via `js_CNTRL.subscribe ()
//}}}
//└────────────────────────────────────────────────────────────────────────────┘
// eslint {{{

/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */

/* globals  js_log  */
                        //┌─────────────┐
/* -------- js_MODEL */ //│ - Model     │
/* exported js_VIEW  */ //│ ● View      │
/* globals  js_CNTRL */ //│ - Controler │
                        //└─────────────┘

//}}}
const js_VIEW    = (function () {

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ● INLINING                                  ● SERVER/scripts/js_log.js │
    //└────────────────────────────────────────────────────────────────────────┘
    // ...log-items {{{
    /* eslint-disable no-unused-vars */
    let log                                       = js_log.log;
    let ellipsis                                  = js_log.ellipsis;
    let is_logging                                = js_log.is_logging;
    let get_src_link                              = js_log.get_src_link;
    let console_clear                             = js_log.console_clear;

    let [lb0,lb1,lb2,lb3,lb4,lb5,lb6,lb7,lb8,lb9] = js_log.lbX;
    let lbB                                       = js_log.lbB;
    let lbX                                       = js_log.lbX;
    /* eslint-enable  no-unused-vars */
    //}}}

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PRIVATE
    //└────────────────────────────────────────────────────────────────────────┘
    // const      ➔ input ● button ● table {{{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ DOM References
    //└────────────────────────────────────────────────────────────────────────┘
    let noteInput  = document.querySelector( "#note_input_TEXTAREA" );
    let saveBtn    = document.querySelector( "#save_note_BUTTON"    );
    let notesTable = document.querySelector( "#saved_notes_TABLE"   );
    //}}}
    //  bindEvents ➔ click ● input ● utton  ● able {{{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ 1. Wire up DOM events to send intents to the State Machine
    //│ Dispatch intent rather than business logic
    //└────────────────────────────────────────────────────────────────────────┘
    let bindEvents = function()
    {
        //{{{
        let caller = "VIEW\t● bindEvents";
        if( is_logging() ) log("%c"+caller+":"                          , lb6);
        //}}}

        //┌────────────────────────────────────────────────────────────────────┐
        //│ saveBtn ● SAVE_NOTE
        //└────────────────────────────────────────────────────────────────────┘
        saveBtn.addEventListener("click", () => { //{{{
          //const content = noteInput.value;
            const content = noteInput.dataset.content;  // as set by js_notes.reset_input()
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
                noteInput.value = content;
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
        //{{{
        let caller = "VIEW\t● render";
        if( is_logging() )
        {
            log("%c"+caller                                             , lb6     );
            log("%c● called_by...:\t%c" + get_src_link()                , lb6, lb0);
            log("%c● currentState:\t%c["+ currentState            +"]"  , lb6, lb1);
            log("%c● payload.....:\t%c["+ JSON.stringify(payload) +"]"  , lb6, lb3);
        }
        //}}}

        switch (currentState)
        {
        case "IDLE":
        saveBtn   .disabled    = false;
        saveBtn   .textContent = "Save Note";
        noteInput .value       = ""; // Reset input after operation
        break;

        case "EDITING":
        saveBtn   .disabled    = false;
        saveBtn   .textContent = "Update Note";
        break;

        case "SAVING":
        case "DELETING":
        saveBtn   .disabled    = true;
        saveBtn   .textContent = currentState === "SAVING" ? "Saving..." : "Deleting...";
        break;
        }
    }; //}}}
    // js_VIEW bindEvents ● SM subscribe {{{
    let init = function(e)
    {
        //{{{
        let caller = "VIEW\t● init";
        console_clear(caller);

        if( is_logging() )
        {
            log("%c"+caller+":"                                         , lb6     );
            log("%c................e.type %c"+ e.type               +"]", lb6, lb1);
            log("%c...document.readyState %c"+ document.readyState  +"]", lb6, lb2);
        }
        //}}}
        if( noteInput ) return;

        noteInput  = document.querySelector( "#note_input_TEXTAREA" ); if(!noteInput  ) return;
        saveBtn    = document.querySelector( "#save_note_BUTTON"    ); if(!saveBtn    ) return;
        notesTable = document.querySelector( "#saved_notes_TABLE"   ); if(!notesTable ) return;

        if( is_logging() ) log("%c● noteInput :\t"+ (noteInput  && noteInput .tagName), lb6);
        if( is_logging() ) log("%c● saveBtn   :\t"+ (saveBtn    && saveBtn   .tagName), lb6);
        if( is_logging() ) log("%c● notesTable:\t"+ (notesTable && notesTable.tagName), lb6);

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
