//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_folds.js      ● $APROJECTS/LANServer/SERVER      ● _TAG (261002:02h:17) │
//├────────────────────────────────────────────────────────────────────────────┤
//│ ● save and load DETAILS open state                                         │
//│ ● save and load CONTAINERS scrollTop                                       │
//└────────────────────────────────────────────────────────────────────────────┘
/* IMPORT {{{*/

/* globals js_log   */
/* globals js_store */
/* globals js_xpath */

//port { js_CNTRL   } from "./js_CNTRL.js"
//port { js_MODEL   } from "./js_MODEL.js"
//port { js_VIEW    } from "./js_VIEW.js"
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
let js_folds = (function() {
"use strict";
let log_this = false;
let tag_this = false || log_this;

//┌────────────────────────────────────────────────────────────────────────────┐
//│ ◯  INLINING ● SERVER/scripts/js_log.js
//└────────────────────────────────────────────────────────────────────────────┘
// log {{{
/* eslint-disable no-unused-vars */
let                               lbB         = js_log.lbB;
let                               lbX         = js_log.lbX;
let [lb1,lb2,lb3,lb4,lb5,lb6,lb7,lb8,lb9,lb0] =  js_log.lbX;
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
// log {{{
if(tag_this) console.log("⚫ %c js_folds.onload:", lbB+lb1);

    if( initialized ) return; // ...don't run twice
    /**/initialized = true;
//}}}

    setTimeout(details_update_click_listeners,  250);
    setTimeout(load_details_open_state       , 1500);
    setTimeout(load_containers_scrollTop     , 2000);

    window.addEventListener("pagehide", save_containers_scrollTop_handler);
    window.addEventListener("pagehide", save_details_open_state_handler  );
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ NOTE ABOUT USING XPATH AS A UNIQ ELEMENT IDENTIFIER                        │
//└────────────────────────────────────────────────────────────────────────────┘
/* ✔ will be synchronized by first DETAILS toggle listener call {{{
//┌────────────────────────────────────────────────────────────────────────────┐
//│ The DETAILS toggle listener will call this storage updater function        │
//│ that will save all open state into localStorage.                           │
//│ This means that, even when the DOM structure changes between two sessions  │
//│ the next details toggle will synchronize open states.                      │
//└────────────────────────────────────────────────────────────────────────────┘
}}}*/

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
if(tag_this) console.log("⚫ %c js_folds.save_details_open_state_handler:", lbB+lb3);

    save_details_open_state_timeout = null;
/*}}}*/
    /* Build an array of details XPath {{{*/
    let val_array = [];
    document.querySelectorAll("DETAILS[open]").forEach((el) => {
        if( el.open )
        {
            let xpath = js_xpath.get_nodeXPath( el );
            val_array.push({ xpath , open: el.open });

if(tag_this) console.log(" 🟠 %c"+xpath, "background-color:black");
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
if(tag_this) console.log("⚫ %c js_folds.load_details_open_state:", lbB+lb3);

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
if(tag_this) console.log(" 🟠 %c"+item.xpath, "background-color:black");
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
if(tag_this) console.log("⚫ %c js_folds.save_containers_scrollTop_handler:", lbB+lb4);

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

if(tag_this) console.log(" 🟡 %c"+xpath, "background-color:black");
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
if(tag_this) console.log("⚫ %c js_folds.load_containers_scrollTop:", lbB+lb4);

    //┌───────────────────────────────────────────────────────────────┐
    //│ RESTORE ● scrollable-containers-scrollTop from [localStorage] │
    //└───────────────────────────────────────────────────────────────┘
    let arr = js_store.localStorage_getArray("xpath_scrollTop_array");
    /**/arr.forEach((item) => {
        let el = js_xpath.get_nodeXPath_target( item.xpath    );
        if( el ) {
            el.scrollTo({ top: item.scrollTop, behavior: "smooth" }); // show the adjustment

if(tag_this) console.log(" 🟡 %c"+item.xpath, "background-color:black");
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
if(log_this) console.log("⚫ %c js_folds.details_update_click_listeners:", lbB);

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
if(tag_this) console.log("⚫ %c js_folds: "+ some_listener_added.split("\n").length +" CLICK LISTENERS ADDED", lbB+lb2);
//if(log_this) console.log(some_listener_added);
/*}}}*/

      //load_details_open_state(); // NOT REQUIRED: as no details has been added
    }
};
/*}}}*/
/*_ details_click_listener {{{*/
let details_click_listener = function(e)
{
if(log_this) console.log("⚫ %c js_folds.details_click_listener:", lbB);

    if(e.target.onclick) return; // skip tooling elements

    let details
        = (e.target              .tagName == "DETAILS") ? e.target
        : (e.target.parentElement.tagName == "DETAILS") ? e.target.parentElement
        :                                                 null;

    // CLICKED IN CONTAINER'S LEFT MARGIN
    if( details )
    {
        let            summary = details.firstElementChild;
        let      nextContainer = _get_nextContainer( summary );                 // container under DETAILS SUMMARY

        //┌───────────────────────────────────────────────────────────────────────┐
        //│if(   (e.x < (nextContainer.offsetLeft     ))                        // clicked in container's left margin
        //│   && (e.x > (nextContainer.offsetLeft - 30))                        // within parent details .. @see STYLE/details.css
        //│  ) {
        //│    details.open       = !details.open;
        //│    if( e.stopPropagation          ) e.stopPropagation         ();   // capturing and bubbling phases
        //│    if( e.stopImmediatePropagation ) e.stopImmediatePropagation();   // other listeners of the same event
        //│    if( e.preventDefault           ) e.preventDefault          ();   // browser agent default
        //│}
        //└───────────────────────────────────────────────────────────────────────┘

        //┌───────────────────────────────────────────────────────────────────────┐
        //│ Copilot recommendation
        //│ ● e.x is viewport-relative, while offsetLeft is relative to the offset
        //└───────────────────────────────────────────────────────────────────────┘
        let rect        = nextContainer.getBoundingClientRect();
        let marginStart = rect.left - 30;
        if((e.clientX  >= marginStart) && (e.clientX < rect.left))
        {
            details.open = !details.open;
            e.preventDefault ();
            e.stopPropagation();
        }

    }
};
/*}}}*/
/*○ _get_nextContainer {{{*/
let _get_nextContainer = function(el)
{
if(log_this) console.log("⚫ %c js_folds._get_nextContainer:", lbB);

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
if(log_this) console.log("⚫ %c js_folds.toggle_details_open_state:", lbB);

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
if(log_this) console.log("🔴 %c js_folds.toggle_details_open_state: OPENING: "+target.firstElementChild.childNodes[0].textContent, lbB+lb2);

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

    document        .body.classList.add   ("unfold_cooldown"); // see %:h/../style/qtext.css

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
if(log_this) console.log("⚫ %c js_folds.get_ancestors_with_tag:", lbB);

    let arr = [];
    let     p = el.parentElement;
    while(  p ) {
        if( p.tagName === tag)
            arr.push(p);
        p = p.parentElement;
    }
if(log_this) console.log("...arr.length: "+ arr.length);
    return arr;
};
/*}}}*/

/* return {{{*/
return { name : "js_folds"
        , onload
        , set_shiftLatched
    // DEBUG
    , load_details_open_state
    , save_details_open_state
    , get_ancestors_with_tag
    , save_containers_scrollTop
    , load_containers_scrollTop
    , log : () => { log_this = !log_this; console.log("log_this=["+log_this+"]"); }
    , tag : () => { tag_this = !tag_this; console.tag("tag_this=["+tag_this+"]"); }

};

/*}}}*/
}());
export { js_folds }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_folds = js_folds;
document.addEventListener("DOMContentLoaded", js_folds.onload);
