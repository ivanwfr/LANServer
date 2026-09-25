//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_input.js     ● $APROJECTS/LANServer/SERVER       ● _TAG (260925:03h:06) │
//├────────────────────────────────────────────────────────────────────────────┤
/*{{{*/

/* globals  js_store */
/* globals  js_notes */
/* globals     notes */

/* exported js_input */

/*}}}*/
let js_input = (function() //{{{
{
let log_this = false;
let tag_this = false || log_this;

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🟤 GUI (js_notes)  GUI LEAK ● DATA ➔ VIEW                               🖥 │
//└────────────────────────────────────────────────────────────────────────────┘
/*  add_notes_GUI {{{*/
/*{{{*/
let input;
let note_DETAILS;
let saved_notes_DIV;
let saved_notes_TABLE;

/*}}}*/
let add_notes_GUI = function(args)
{
    input              = args.input;
    note_DETAILS       = args.note_DETAILS;
    saved_notes_DIV    = args.saved_notes_DIV;
    saved_notes_TABLE  = args.saved_notes_TABLE;

    js_input_IO.on( input , input_listener);

    layout_look( input );
};
/*}}}*/
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
        if( !e.detail.oldValue
          || js_notes.is_input_auto_insert_prefix()
          ) {
            notes.reset_input_placeholder();
            js_notes.save_note_auto( e );
            note_DETAILS.classList.remove("empty");
        }
        // SERVER/style/notes.css
        // SERVER/style/qtext.css

        // USER MAY HAVE UNDONE
        if( js_notes.is_input_auto_insert_prefix() )
        {
            if(!input.classList.contains("auto_insert_prefix"))
            {
                input.classList.add(     "auto_insert_prefix");
                js_notes.save_note_auto( e );
                return;
            }
        }

        // USER DID INPUT SOMETHING
        if(input.classList.contains(     "auto_insert_prefix"))
        {
            input.classList.remove(      "auto_insert_prefix");
            js_notes.save_note_auto( e );
                return;
        }

        // INPUT
        if(    js_notes.is_input_auto_insert_prefix()
           && !input.classList.contains("auto_insert_prefix")
          ) {
            input.classList.add(        "auto_insert_prefix");
            js_notes.save_note_auto( e );
            return;
        }

    }
    else {
           notes.note_1_onclick_save( { type: "auto_save" } ); // text cleared ...worth a synchronized update
        note_DETAILS.classList.add   ("empty");

        reset_input("input_listener: ❌input empty");
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
    js_notes.set_editing_note_index(-1);
};
/*}}}*/
/*  input_save {{{*/
let input_save = function(_caller)
{
if(tag_this) console.log("🟣 input_save"+ (_caller ? (" ← "+_caller) : ""));

    if( js_notes.is_input_auto_insert_prefix() ) return;

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
/*  input_load {{{*/
let input_load = function()
{
if(tag_this) console.log("🟣 input_load");

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ NO SAVED INPUT CONTENT FROM PREVIOUS SESSION DID                       │
    //└────────────────────────────────────────────────────────────────────────┘
    let input_storage_key = get_input_storage_key();

    let text = localStorage.getItem( input_storage_key )
        ||      "";

    // DEFAULT TO SCROLL LAST NOTE INTO VIEW
    if(!text) {
        notes.note_scrollIntoView();

        reset_input("input_load: !text");
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
            let note_row = saved_notes_TABLE.firstElementChild.children[index];
            js_notes.note_5_onclick_edit({ target: note_row }, index);
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
/*_ layout_look {{{*/
/*{{{*/
const ID_WH_SAVE_COOLDOWN = 2000;
let   id_wh_save_timeout;
let   resizeObserver;
/*}}}*/
let layout_look = function(element)
{
//{{{
if(log_this) console.log("🟤 layout_look:", (element.id || element.tagName));
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
                    id_wh_save_timeout = setTimeout(layout_save, ID_WH_SAVE_COOLDOWN);
            }
        });
    }
    /*}}}*/
    /* add element to observe {{{*/
    resizeObserver.observe( element );

    /*}}}*/
};
/*}}}*/
/*_ layout_save {{{*/
let layout_save = function()
{

if(log_this) console.log("🟤 layout_save()");

    let id_wh_array
        = [ layout_eval( input           )
          , layout_eval( saved_notes_DIV ) ];

    localStorage.setItem(get_id_wh_storage_key(), JSON.stringify( id_wh_array ));

    id_wh_save_timeout = null;
};
/*}}}*/
/*_ layout_eval {{{*/
let layout_eval = function(el)
{
    let  rect =           el.getBoundingClientRect();
    let id_wh = { id    : el.id
                , width : parseInt( rect.width  )
                , height: parseInt( rect.height ) };
if(log_this) console.log(`🟤 layout_eval: ${id_wh.id} size: ${id_wh.width} x ${id_wh.height}`);
    return id_wh;
};
/*}}}*/
/*  layout_load {{{*/
let layout_load = function()
{
if(log_this) console.log("🟤 layout_load:");

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

    //note_DETAILS.open = true; // let load_details_open_state do this
};
/*}}}*/

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PUBLIC
    //└────────────────────────────────────────────────────────────────────────┘
//{{{
return { add_notes_GUI

    //┌────────────────────────────────────────────────────────────────────────────┐
    ,    reset_input
    //│ ● called by
    //│   js_notes.note_5_onclick_edit
    //│    notes.note_1_onclick_save
    //│    notes.note_2_onclick_import
    //│    notes.note_6_onclick_delete
    //└────────────────────────────────────────────────────────────────────────────┘

    //┌────────────────────────────────────────────────────────────────────────────┐
    , input_save
    //│ ● called by
    //│   js_notes.onload ➔ visibilitychange listener
    //│   js_notes.note_5_onclick_edit
    //└────────────────────────────────────────────────────────────────────────────┘

    //┌────────────────────────────────────────────────────────────────────────────┐
    , input_load
    //│ ● called by
    //│      notes.load_notes
    //│      notes.load_server_notes
    //└────────────────────────────────────────────────────────────────────────────┘

    //┌────────────────────────────────────────────────────────────────────────────┐
    , layout_load
    //│ ● called by
    //│      js_notes.onload
    //└────────────────────────────────────────────────────────────────────────────┘

    //┌────────────────────────────────────────────────────────────────────────────┐
    //│ PRIVATE:
    //├────────────────────────────────────────────────────────────────────────────┤
    //│ ● layout_look
    //│ ● layout_save
    //│ ● layout_eval
    //└────────────────────────────────────────────────────────────────────────────┘

};
//}}}
})();
/*}}}*/
//└────────────────────────────────────────────────────────────────────────────┘

let get_input_storage_key = function() { return "input__"+ js_store.get_page_storage_key(); };
let get_id_wh_storage_key = function() { return "id_wh__"+ js_store.get_page_storage_key(); };

//┌────────────────────────────────────────────────────────────────────────────┐
//│ INPUT EVENTS                                                              🔴
//├────────────────────────────────────────────────────────────────────────────┤
//" Usage example {{{

//    //┌────────────────────────────────────────────────────────────────────────┐
//    //│ Initialize listener
//    //└────────────────────────────────────────────────────────────────────────┘
//    let unsubscribe = js_input_IO.on(input, (e) => {
//      console.log(`Value changed: "${e.detail.oldValue}" → "${e.detail.newValue}"`);
//    });

//    //┌────────────────────────────────────────────────────────────────────────┐
//    //│ Change via code (Triggers listener)
//    //└────────────────────────────────────────────────────────────────────────┘
//    js_input_IO.value = "Hello World";

//    //┌────────────────────────────────────────────────────────────────────────┐
//    //│ User types in the box (Triggers listener)
//    //│ User types "Test" -> Listener fires: "Hello World" -> "Hello WorldTest"
//    //└────────────────────────────────────────────────────────────────────────┘

//    //┌────────────────────────────────────────────────────────────────────────┐
//    //│ Stop listening
//    //└────────────────────────────────────────────────────────────────────────┘
//    unsubscribe();

//    "}}}
//├────────────────────────────────────────────────────────────────────────────┤
let js_input_IO = (function() //{{{
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

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PUBLIC
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
        textarea              .addEventListener   ("input", text_inputListener); // centralize
        textarea              .addEventListener   ("text_input:event"     , fn); // redispatch
        return () =>  textarea.removeEventListener("text_input:event"     , fn); // redispatch
    }
};
//}}}
})();
//}}}
//└────────────────────────────────────────────────────────────────────────────┘

globalThis.js_input = js_input;
