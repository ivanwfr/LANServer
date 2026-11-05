//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_folds.js      ● $APROJECTS/LANServer/SERVER      ● _TAG (261104:18h:50) │
//├────────────────────────────────────────────────────────────────────────────┤
//{{{ SAVE → LOAD ● [DETAILS open state] ● [CONTAINERS scrollTop]
//┌────────────────────────────────────────────────────────────────────────────┐
//│ ● save and load DETAILS open state                                         │
//│ ● save and load DETAILS open state                                         │
//│ ● save and load CONTAINERS scrollTop                                       │
//├────────────────────────────────────────────────────────────────────────────┤
//│ ● Note about using DETAILS XPath ID's:                                     │
//│   The DETAILS toggle listener will call save_details_open_state_handler    │
//│   that will save all DETAILS open state into localStorage.                 │
//│   It means that, even when the DOM structure changes between two           │
//│   sessions, any DETAILS toggle will synchronize stored open states.        │
//└────────────────────────────────────────────────────────────────────────────┘
//}}}
//└────────────────────────────────────────────────────────────────────────────┘
/* IMPORT {{{*/

/* globals js_log   */
/* globals js_store */
/* globals js_xpath */

//port { js_CNTRL   } from "./js_CNTRL.js"
//port { js_MODEL   } from "./js_MODEL.js"
//port { js_VIEW    } from "./js_VIEW.js"
//port { js_boxing  } from "./js_boxing.js"
//port { js_folds   } from "./js_folds.js"
//port { js_input   } from "./js_input.js"
//port { js_linkify } from "./js_linkify.js"
import { js_log     } from "./js_log.js"
//port { js_notes   } from "./js_notes.js"
import { js_store   } from "./js_store.js"
//port { js_ticker  } from "./js_ticker.js"
import { js_xpath   } from "./js_xpath.js"
//port { notes      } from "./notes.js"

/*}}}*/
let js_folds = (function()
{
//┌────────────────────────────────────────────────────────────────────────────┐
//│ ◯  INTERNING ● SERVER/scripts/js_log.js
//└────────────────────────────────────────────────────────────────────────────┘
const MODULE = "%c★🟢 js_folds\t\t● ";
let log_this = false;
let tag_this = false || log_this;
// ●log-items inlining ● SERVER/scripts/js_log.js {{{
/* eslint-disable no-unused-vars */

js_log.register( { module_name : "js_folds"
                 , module_num  : 0
                 , log_this_fn : (state) => log_this = state
                 , tag_this_fn : (state) => tag_this = state } );

let log                                        = js_log.log;
let console_clear                              = js_log.console_clear;

let ellipsis                                   = js_log.ellipsis;
let get_src_link                               = js_log.get_src_link;

let lbB                                        = js_log.lbB;

let b_X                                        = js_log.b_X;
let lbX                                        = js_log.lbX;
let lfX                                        = js_log.lfX;
let [b_0,b_1,b_2,b_3,b_4,b_5,b_6 ,b_7,b_8,b_9] = js_log.b_X;
let [lb0,lb1,lb2,lb3,lb4,lb5,lb6 ,lb7,lb8,lb9] = js_log.lbX;
let [lf0,lf1,lf2,lf3,lf4,lf5,lf6 ,lf7,lf8,lf9] = js_log.lfX;

/* eslint-enable  no-unused-vars */
//}}}

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🟤 LOAD ● UNLOAD                                                           │
//└────────────────────────────────────────────────────────────────────────────┘
/*● onload {{{*/
//{{{
let initialized = false;
//}}}
let onload = function(e) /* eslint-disable-line no-unused-vars */
{
let caller = "onload";
if(tag_this) log(MODULE+caller+"5 js_folds   \t🟢 onload:");
// log {{{
    if( initialized ) return; // ...don't run twice
    /**/initialized = true;
//}}}
//{{{
    setTimeout(details_update_click_listeners,  250);
    setTimeout(load_details_open_state       ,  500);
    setTimeout(load_details_checked_state    , 1500);
    setTimeout(load_containers_scrollTop     , 2000);
//}}}
//{{{
//    setTimeout(load_details_open_state       , 0);
//    setTimeout(load_containers_scrollTop     , 0);
//    setTimeout(load_details_checked_state    , 0);
//    setTimeout(details_update_click_listeners, 0);
//}}}
//{{{
//    requestAnimationFrame(() => details_update_click_listeners());
//    requestAnimationFrame(() => load_details_open_state       ());
//    requestAnimationFrame(() => load_details_checked_state    ());
//    requestAnimationFrame(() => load_containers_scrollTop     ());
//}}}

    window.addEventListener("pagehide", save_containers_scrollTop_handler );
    window.addEventListener("pagehide", save_details_open_state_handler   );
    window.addEventListener("pagehide", save_details_checked_state_handler);
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🔴 DETAILS OPEN STATE          ● SAVED WHEN TOGGLED ● LOADED BACK ON LOAD  │
//└────────────────────────────────────────────────────────────────────────────┘
/*○ save_details_open_state {{{*/

/* debounce timeout {{{*/
let SAVE_DETAILS_OPEN_STATE_DELAY = 500;
let save_details_open_state_timeout;
let save_details_open_state = function()
{
    if(save_details_open_state_timeout) clearTimeout( save_details_open_state_timeout );
       save_details_open_state_timeout =  setTimeout( save_details_open_state_handler , SAVE_DETAILS_OPEN_STATE_DELAY);
};
/*}}}*/

let save_details_open_state_handler = function()
{
/*{{{*/
let caller = "save_details_open_state_handler";
if(tag_this) log(MODULE+caller+"🟢 %c js_folds.save_details_open_state_handler:", lbB+lf5);

    save_details_open_state_timeout = null;
/*}}}*/
    /* Build an array of details XPath {{{*/
    let val_array = [];
    document.querySelectorAll("DETAILS[open]").forEach((el) => {
        if( el.open )
        {
            let xpath = js_xpath.get_nodeXPath( el );
            val_array.push({ xpath , open: el.open });

if(log_this) log(" 🟠 %c"+xpath, "background-color:black");
if(log_this) console.dir(el);
        }
    });
    /*}}}*/
    /* set localStorage {{{*/
    let key = "xpath_details_open_array";
    if(     val_array.length )
    {
        let val = JSON.stringify( val_array );
        js_store.localStorage_setItem( key, val);
    }
    else {
        js_store.localStorage_delItem( key );
    }
    /*}}}*/
};
/*}}}*/
/*○ load_details_open_state {{{*/
let load_details_open_state = function()
{
let caller = "load_details_open_state";
if(tag_this) log(MODULE+caller+"🟢 %c js_folds.load_details_open_state:", lbB+lf5);

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PREVENT CLOSING DETAILS ● so we can open more than one                 │
    //└────────────────────────────────────────────────────────────────────────┘
    set_shiftLatched(  true );

    //┌───────────────────────────────────────────────────────────────────────┐
    //│ RESTORE                ● store details open state from [localStorage] │
    //└───────────────────────────────────────────────────────────────────────┘
    let el_open_array = [];
    let arr = js_store.localStorage_getArray("xpath_details_open_array");
    /**/arr.forEach((item) => {
        let el = js_xpath.get_nodeXPath_target( item.xpath );
        if( el ) {
            el.open = item.open;    // DO NOT OPEN YET
            el_open_array.push( el );
if(log_this) log(" 🟠 %c"+item.xpath, "background-color:black");
        }
    });

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Close parents DETAILS that were not opened, once initial layout done
    //└────────────────────────────────────────────────────────────────────────┘
    setTimeout(() => {
        document.querySelectorAll("DETAILS:not([id])") // DETAILS having no #id
            .forEach((el) => {
                if( !el_open_array.includes(el) ) el.open = false;
            });
    }, 0);

};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🔴 DETAILS CHECK STATE          ● SAVED WHEN TOGGLED ● LOADED BACK ON LOAD │
//└────────────────────────────────────────────────────────────────────────────┘
/*○ save_details_checked_state {{{*/
let SAVE_DETAILS_CHECK_STATE_DELAY = 500;
let save_details_checked_state_timeout;

let save_details_checked_state = function()
{
    if(save_details_checked_state_timeout) clearTimeout( save_details_checked_state_timeout );
       save_details_checked_state_timeout =  setTimeout( save_details_checked_state_handler , SAVE_DETAILS_CHECK_STATE_DELAY);
};
let save_details_checked_state_handler = function()
{
/*{{{*/
let caller = "save_details_checked_state_handler";
if(tag_this) log(MODULE+caller+"⚫ %c js_folds.save_details_checked_state_handler:", lbB+lf3);

    save_details_checked_state_timeout = null;
/*}}}*/
    /* Build an array of details XPath {{{*/
    let val_array = [];
    document.querySelectorAll("DETAILS.checked").forEach((el) => {
        let xpath = js_xpath.get_nodeXPath( el );
      //val_array.push({ xpath , checked: el.checked });
        val_array.push({ xpath                       });

if(log_this) log(" 🟠 %c"+xpath, "background-color:black");
if(log_this) console.dir(el);
    });
    /*}}}*/
    /* set localStorage {{{*/
    let key = "xpath_details_checked_array";
    if(     val_array.length )
    {
        let val = JSON.stringify( val_array );
        js_store.localStorage_setItem( key, val);
    }
    else {
        js_store.localStorage_delItem( key );
    }
    /*}}}*/
};
/*}}}*/
/*○ load_details_checked_state {{{*/
let load_details_checked_state = function()
{
let caller = "load_details_checked_state";
if(tag_this) log(MODULE+caller+"🟢 %c js_folds.load_details_checked_state:", lbB+lf5);

    //┌───────────────────────────────────────────────────────────────────────┐
    //│ RESTORE             ● store details checked state from [localStorage] │
    //└───────────────────────────────────────────────────────────────────────┘
    let el_checked_array = [];
    let key = "xpath_details_checked_array";
    let arr = js_store.localStorage_getArray( key );
    /**/arr.forEach((item) => {
        let el = js_xpath.get_nodeXPath_target( item.xpath );
        if( el ) {
          //el.classList.add("checked", item.checked);
            el.classList.add("checked"              );
            el_checked_array.push( el );
if(log_this) log(" 🟠 %c"+item.xpath, "background-color:black");
        }
    });

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Close parents DETAILS that were not checked, once initial layout done
    //└────────────────────────────────────────────────────────────────────────┘
    setTimeout(() => {
        document.querySelectorAll("DETAILS:not([id])") // DETAILS having no #id
            .forEach((el) => {
                if( !el_checked_array.includes(el) ) el.checked = false;
            });
    }, 0);

};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🟠 CONTAINERS SCROLL TOP                                                   │
//└────────────────────────────────────────────────────────────────────────────┘
/*○ save_containers_scrollTop {{{*/

/* debounce timeout {{{*/
let SAVE_CONTAINERS_SCROLLTOP_DELAY = 500;
let save_containers_scrollTop_timeout;
let save_containers_scrollTop = function()
{
    if(save_containers_scrollTop_timeout) clearTimeout( save_containers_scrollTop_timeout );
       save_containers_scrollTop_timeout =  setTimeout( save_containers_scrollTop_handler , SAVE_CONTAINERS_SCROLLTOP_DELAY);
};
/*}}}*/

let save_containers_scrollTop_handler = function()
{
let caller = "save_containers_scrollTop_handler";
if(tag_this) log(MODULE+caller+"⚫ %c js_folds.save_containers_scrollTop_handler:", lbB+lb4);

    //┌───────────────────────────────────────────────────────────────┐
    //│ SAVE    ● scrollable-containers-scrollTop into [localStorage] │
    //└───────────────────────────────────────────────────────────────┘
    /* Build an array of { XPath , scrollTop } {{{*/
    let xpath_scrollTop_array = [];
    document.querySelectorAll("BODY,DETAILS,DIV").forEach((el) => {
        if( el.scrollTop )
        {
            let xpath = js_xpath.get_nodeXPath( el );
            xpath_scrollTop_array.push({ xpath , scrollTop: el.scrollTop });

if(log_this) log(" 🟡 %c"+xpath, "background-color:black");
        }
    });
    /*}}}*/
    /* set localStorage {{{*/
    let key = "xpath_scrollTop_array";
    if(        xpath_scrollTop_array.length )
    {
        let val = JSON.stringify( xpath_scrollTop_array );
        js_store.localStorage_setItem( key, val);
    }
    else {
        js_store.localStorage_delItem( key );
    }
    /*}}}*/
};
/*}}}*/
/*○ load_containers_scrollTop {{{*/
let load_containers_scrollTop = function()
{
let caller = "load_containers_scrollTop";
if(tag_this) log(MODULE+caller+"🟢 %c js_folds.load_containers_scrollTop:", lbB+lf5);

    //┌───────────────────────────────────────────────────────────────┐
    //│ RESTORE ● scrollable-containers-scrollTop from [localStorage] │
    //└───────────────────────────────────────────────────────────────┘
    let arr = js_store.localStorage_getArray("xpath_scrollTop_array");
    /**/arr.forEach((item) => {
        let el = js_xpath.get_nodeXPath_target( item.xpath    );
        if( el ) {
            el.scrollTo({ top: item.scrollTop, behavior: "smooth" }); // show the adjustment

if(log_this) log(" 🟡 %c"+item.xpath, "background-color:black");
        }
    });
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🟡 CLICK EVENT                                                             │
//└────────────────────────────────────────────────────────────────────────────┘
/*○ details_update_click_listeners {{{*/
let details_update_click_listeners = function()
{
let caller = "details_update_click_listeners";
if(tag_this) log(MODULE+caller+"🟢 %c js_folds.details_update_click_listeners:", lbB+lf5);

    // CLOSE DETAILS ● click container left margin
    let some_listener_added = "";

  //document.querySelectorAll("DETAILS")                    // DETAILS any
  //document.querySelectorAll("DETAILS:not(:has(DETAILS))") // DETAILS having no nested DETAILS
    document.querySelectorAll("DETAILS:not([id])")          // DETAILS having no #id
    .forEach((el) => {
        if(!el.click_listener_added)
        {
          //el.style.paddingLeft = "0.2em";

            some_listener_added += "● "+ el.firstElementChild.textContent.replace(/ *\n */g," \u21B2 ")+"\n";

            el.click_listener_added = true;

            el.addEventListener("click", details_click_listener);
            el.classList.add   (        "close_on_margin_click");

            el.addEventListener("toggle", (event) => {
                toggle_details_open_state (event);
                save_details_open_state();
            });

            // SUMMARY CLICK SHIFT TRACKER
            el = el.firstElementChild;
            el.addEventListener("click"     , track_pendingShift, true              ); // capture, so it"s recorded even if something stops propagation later

//            // Copilot: passive must be false to calle preventDefault in the handler {{{
//            let isTouchDevice
//                =  window.matchMedia("(pointer : coarse)").matches
//                || window.matchMedia("(hover   : none  )").matches
//            ;
//            el.addEventListener("touchstart", track_pendingShift, { passive: !isTouchDevice });
//            //}}}
            el.addEventListener("touchstart", track_pendingShift, { passive: false          });
        }
    });
    if( some_listener_added.length )
    {
/*{{{*/
if(log_this) log("⚫ %c js_folds: "+ some_listener_added.split("\n").length +" CLICK LISTENERS ADDED", lbB+lb2);
//if(log_this) log(some_listener_added);
/*}}}*/

      //load_details_open_state(); // NOT REQUIRED: as no details has been added
    }
};
/*}}}*/
/*_ details_click_listener {{{*/
let details_click_listener = function(e)
{
let caller = "details_click_listener";
if(tag_this) log(MODULE+caller+"⚫ %c js_folds.details_click_listener:", lbB);

    if(e.target.onclick) return; // skip tooling elements

    let details
        = (e.target              .tagName == "DETAILS") ? e.target
        : (e.target.parentElement.tagName == "DETAILS") ? e.target.parentElement
        :                                                 null;

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ CLICKED IN DETAILS'S LEFT MARGIN (NOT IN A VISIBLE SUMMARY)
    //└────────────────────────────────────────────────────────────────────────┘
    if( details )
    {
        //┌────────────────────────────────────────────────────────────────────┐
        //│ Outline this last opened details
        //└────────────────────────────────────────────────────────────────────┘
        if(!details.open )
            set_DETAILS_last_toggled( details );

        //┌────────────────────────────────────────────────────────────────────┐
        //│ LEFT MARGIN CLICK → Scroll SUMMARY into view
        //└────────────────────────────────────────────────────────────────────┘
        let       summary = details.firstElementChild;
        let nextContainer = get_nextContainer( summary );
        let rect          = nextContainer.getBoundingClientRect();
        let marginStart   = rect.left - 30;
        if((e.clientX    >= marginStart) && (e.clientX < rect.left))
        {
            e.preventDefault ();
            e.stopPropagation();

            let big_scroll = move_summary_into_view( details );

            //┌────────────────────────────────────────────────────────────────┐
            //│ Close DETAILS once CLOSED
            //└────────────────────────────────────────────────────────────────┘
            let delay
                = big_scroll ? 2000 : 0;
            setTimeout(() => details.open = !details.open, delay);

            //┌────────────────────────────────────────────────────────────────┐
            //│ Scroll PREVIOUS OPEN DETAILS into view
            //└────────────────────────────────────────────────────────────────┘
            let prev_details = details.previousElementSibling;
            if( prev_details && prev_details.open)
                setTimeout(() => move_summary_into_view( prev_details ), 1000);
        }
    }
};
/*}}}*/
/*_ move_summary_into_view {{{*/
let move_summary_into_view = function( details )
{
    //┌────────────────────────────────────────────────────────────────┐
    //│ Move SUMMARY INTO VIEW (for a visible CLOSE ANIMATION)
    //└────────────────────────────────────────────────────────────────┘
    let details_rect
        = details.getBoundingClientRect();

    let needs_scrolling
        = (details_rect.top < 0);

    //┌────────────────────────────────────────────────────────────────┐
    //│ VERTICAL MARGIN ➔ SUMMARY and part of previous CONTAINER BOTTOM
    //└────────────────────────────────────────────────────────────────┘
    let delta;
    let big_scroll = false;
    if( needs_scrolling)
    {
        let    summary = details.firstElementChild;
        let top_margin = 3 * summary.getBoundingClientRect().height;
        delta          = parseInt(details_rect.top - top_margin);
        big_scroll     = Math.abs(delta) >= 1 * window.innerHeight;

        window.scrollBy( { top: delta, behavior: "smooth" } );
    }
    return big_scroll;
};
/*}}}*/
/*_ set_DETAILS_last_toggled {{{*/
//{{{
let set_DETAILS_last_toggled_cooldown;
let set_DETAILS_last_toggled_num = 0;
//}}}
let set_DETAILS_last_toggled = function(details)
{
    if( details.className.includes("last_toggled") ) return;
    if( set_DETAILS_last_toggled_cooldown ) clearTimeout( set_DETAILS_last_toggled_cooldown );
    /**/set_DETAILS_last_toggled_cooldown =   setTimeout( set_DETAILS_last_toggled_handler, 100, details);
};
let set_DETAILS_last_toggled_handler = function(details)
{
    set_DETAILS_last_toggled_cooldown = null;

    details. classList.add("last_toggled"+(++set_DETAILS_last_toggled_num % 10));

    let     parent_details = details.closest("DETAILS");
    while(  parent_details ) {
        if(!parent_details.className.includes("last_toggled") )
            parent_details.classList.add     ("last_toggled"+(  set_DETAILS_last_toggled_num % 10));
        /**/parent_details = parent_details.parentElement.closest("DETAILS");
    }
};
/*}}}*/
/*_ clear_DETAILS_last_toggled {{{*/
let clear_DETAILS_last_toggled = function(e)
{

    let details = e.target.closest("DETAILS");
    if(!details ) return;

    for(let i=0; i<=9; ++i)
    {
        let                                   className = "last_toggled"+i;
        details.querySelectorAll(         "."+className )
        .forEach((el) => el.classList.remove( className ));
        // container's
        details            .classList.remove( className );
    }
};
/*}}}*/
/*○ get_nextContainer {{{*/
let get_nextContainer = function(el)
{
let caller = "get_nextContainer";
if(tag_this) log(MODULE+caller+"⚫ %c js_folds.get_nextContainer:", lbB);

    // RETURN NEXT CONTAINER SIBLING ELEMENT
    while(   (el.tagName != "DIV"  )
          && (el.tagName != "TABLE")
          && (el.tagName != "PRE"  )
          && (el.tagName != "P"    )
          && (el.nextElementSibling)
    )
        el  = el.nextElementSibling;

    return    el;
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ 🟢 FOLD TOGGLE                                                             │
//└────────────────────────────────────────────────────────────────────────────┘
/*_ track_pendingShift {{{*/
/*{{{*/
let       pendingShift;
let       shiftLatched;
let       lastTouchCount = 0;
/*}}}*/
let track_pendingShift = function(e)
{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ TRACK WHETHER THE SHIFT KEY IS PRESSED ON SUMMARY CLICK                │
    //└────────────────────────────────────────────────────────────────────────┘
    let summary = e.target.closest("summary");
    if(!summary ) return;

    let details = summary.parentElement;
    if(!details || details.tagName !== "DETAILS")
        return;

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Capture the number of fingers                                          │
    //└────────────────────────────────────────────────────────────────────────┘
    if(e.type == "touchstart")
    {
        lastTouchCount = e.touches.length;
      //e.preventDefault();  // cant in passive mode to stop scrolling while multitouching
    }
    else if (e.type == "click")
    {
        if((e.pointerType == "touch") || (lastTouchCount > 0))
        {
            pendingShift = lastTouchCount >= 2;
            lastTouchCount = 0;
        }
        else {
            pendingShift = e.shiftKey;
        }
    }
};
/*}}}*/
/*_ latch_pendingShift {{{*/
let set_shiftLatched = function(state, delay=1000)
{
    shiftLatched  = state;
    if( shiftLatched )
        setTimeout(() => shiftLatched = false, delay);
};
/*}}}*/
/*_ toggle_details_open_state {{{*/
let   toggle_details_open_state = function(e)
{
let caller = "toggle_details_open_state";
if(tag_this) log(MODULE+caller+"⚫ %c js_folds.toggle_details_open_state:", lbB);

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ the `details` whose state changed
    //└────────────────────────────────────────────────────────────────────────┘
    let  target = e.target;
    if(!(target instanceof HTMLDetailsElement)) return;

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ SHIFTKEY KEEPS OTHER DETAILS OPEN   ● (toggle event has no e.shiftKey) │
    //└────────────────────────────────────────────────────────────────────────┘
    let shiftKey = pendingShift || shiftLatched;
    pendingShift = false; // consume it

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Only enforce the invariant when something is being OPENED.
    //│ Closing events are just consequences; ignore them.
    //└────────────────────────────────────────────────────────────────────────┘

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ this is the key "guard"
    //└────────────────────────────────────────────────────────────────────────┘
    if(!target.open ) return;

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ details hierarchy to open
    //└────────────────────────────────────────────────────────────────────────┘
if(log_this) log("🔴 %c OPENING: "+target.firstElementChild.childNodes[0].textContent, lbB+lb2);

    let ancestors_set = new Set([target, ...get_ancestors_with_tag(target, "DETAILS")]);

    let doc_details = Array.from(document.querySelectorAll("details"));

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ DO NOT CLOSE OTHERS f(unfold_cooldown) or f(shiftKey)
    //└────────────────────────────────────────────────────────────────────────┘
    if(unfold_cooldown || shiftKey)
    {
        for(let d of ancestors_set)
            if(!d.open)
                d.open = true;
    }
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ DO ... CLOSE OTHERS, (that are not part of the target ancestors)
    //└────────────────────────────────────────────────────────────────────────┘
    else {
        for(let d of doc_details)
        {
            if( ancestors_set.has(       d   )) d.open =  true;
            else if(                    !d.id                   // SKIP ID
                    && !target.contains( d   )) d.open = false; // SKIP CHILD
        }
    }
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ START A NEW COOLDOWN TO UNFOLD MORE THAN ONE DETAILS
    //└────────────────────────────────────────────────────────────────────────┘
    toggle_unfold_cooldown();

};
/*_ toggle_unfold_cooldown {{{*/
//{{{
const UNFOLD_COOLDOWN_MS = 1000;
let   unfold_cooldown;
//}}}
let toggle_unfold_cooldown = function()
{
  //let next_ms = UNFOLD_COOLDOWN_MS * (unfold_cooldown ? 2:1);
    let next_ms = UNFOLD_COOLDOWN_MS;

    if( unfold_cooldown ) clearTimeout(     unfold_cooldown );

    document.body.classList.add("unfold_cooldown"); // see %:h/../style/to_html.css

    /**/unfold_cooldown
        =  setTimeout( () => {
            unfold_cooldown = null;
            document.body.classList.remove("unfold_cooldown");
        }, next_ms);

};
/*}}}*/
/*}}}*/
/*_ get_ancestors_with_tag {{{*/
let get_ancestors_with_tag = function(el, tag)
{
let caller = "get_ancestors_with_tag";
if(tag_this) log(MODULE+caller+"⚫ %c js_folds.get_ancestors_with_tag:", lbB);

    let arr = [];
    let     p = el.parentElement;
    while(  p ) {
        if( p.tagName === tag)
            arr.push(p);
        p = p.parentElement;
    }
if(log_this) log("...arr.length: "+ arr.length);
    return arr;
};
/*}}}*/

/* return {{{*/
return { name : "js_folds"
        , onload
        , set_shiftLatched
        , clear_DETAILS_last_toggled // exposed to onclick @see format_summary_comments in SERVER/scripts/js_linkify.js
        , set_DETAILS_last_toggled
    // DEBUG
    , load_details_open_state
    , save_details_open_state
    , load_details_checked_state
    , save_details_checked_state
    , get_ancestors_with_tag
    , save_containers_scrollTop
    , load_containers_scrollTop

};

/*}}}*/
}());
export { js_folds }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_folds = js_folds;
