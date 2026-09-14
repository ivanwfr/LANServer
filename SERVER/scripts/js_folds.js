//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_folds.js      ● $APROJECTS/LANServer/SERVER      ● _TAG (260914:17h:50) │
//├────────────────────────────────────────────────────────────────────────────┤
//│ ● save and load DETAILS open state                                         │
//│ ● save and load CONTAINERS scrollTop                                       │
//└────────────────────────────────────────────────────────────────────────────┘
/* jshint esversion: 9, laxbreak:true, laxcomma:true, boss:true {{{*/

/* globals js_store */
/* globals js_xpath */
/*}}}*/
let js_fold = (function() {
//"use strict";
let log_this = false;
let tag_this = false || log_this;

// ┌───────────────────────────────────────────────────────────────────────────┐
// │ LOAD ● UNLOAD                                                             │
// └───────────────────────────────────────────────────────────────────────────┘
/*● onload {{{*/
let onload = function(e) /* eslint-disable-line no-unused-vars */
{
if(tag_this) console.log("⚫ %c js_fold.onload:", lbB);

//{{{
/* eslint-disable no-undef */
//if(log_this) console.log("… js_folds:");
//if(log_this) console.log("… js_store   \t● "+ typeof js_store   );
//if(log_this) console.log("… js_xpath   \t● "+ typeof js_xpath   );
//if(log_this) console.log("… js_linkify \t● "+ typeof js_linkify );
//if(log_this) console.log("… js_notes   \t● "+ typeof js_notes   );
//if(log_this) console.log("… js_notes   \t● "+ typeof js_XXX     );
/* eslint-enable  no-undef */
//}}}

    setTimeout(details_update_click_listeners,  250);
    setTimeout(load_details_open_state       , 1500);
    setTimeout(load_containers_scrollTop     , 2000);

    window  .addEventListener("beforeunload" , save_containers_scrollTop);
};
/*}}}*/

// ┌───────────────────────────────────────────────────────────────────────────┐
// │ DETAILS OPEN STATE             ● SAVED WHEN TOGGLED ● LOADED BACK ON LOAD │
// ├───────────────────────────────────────────────────────────────────────────┤
// │ NOTE: each time any single DETAILS open state is toggled,                 │
// │ all the PAGE DETAILS state will be saved here into localStorage.          │
// │                                                                           │
// │ This means that, even when the DOM structure is reconfigured              │
// │ by STORAGE_formatter, a single DETAILS toggle will keep all in sync.      │
// └───────────────────────────────────────────────────────────────────────────┘
/*○ load_details_open_state {{{*/
let load_details_open_state = function()
{
if(tag_this) console.log("\t%c...load_details_open_state()", lb0);

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PREVENT CLOSING DETAILS ● so we can open more than one                 │
    //└────────────────────────────────────────────────────────────────────────┘
    js_fold.set_shiftLatched(  true );

    let details_array   = document.querySelectorAll("DETAILS");
    for(let details_idx = 0; details_idx < details_array.length; ++details_idx)
    {
//if(log_this) console.log("load_details_open_state: "+ details_idx);

        let storage_key = "details_"+ details_idx +"_is_open";

        if(js_store.localStorage_getItem( storage_key ))
        {
if(log_this) console.log("✓ "+storage_key);

            details_array[details_idx].open = true;
//{{{
//            let    el  = details_array[details_idx].parentElement;
//            while( el ) {
//                if(el.tagName == "DETAILS") el.open = true;
//                el = el.parentElement;
//            }
//}}}
        }
    }
    // SOME DETAILS OPENED ● CODE.textContent now populated
    // ┌───────────────────────────────────────────────────────────────────────┐
    // │ CustomEvent to STORAGE_formatter     ● CODE.textContent now populated │
    // └───────────────────────────────────────────────────────────────────────┘
//  setTimeout(() => {
if(tag_this) console.log("\t%c...sending custom event to STORAGE_formatter", lb0);
    document.dispatchEvent(new CustomEvent("details:restored"));
//  }, 2000);

};
/*}}}*/
/*○ save_details_open_state {{{*/
//{{{
const SAVE_DETAILS_OPEN_STATE_DELAY = 1000;

let   save_details_open_state_timeout;
//}}}
let save_details_open_state = function()
{
if(log_this) console.log("⚫ %c js_fold.save_details_open_state:", lbB);

    if( save_details_open_state_timeout ) clearTimeout( save_details_open_state_timeout );
    /**/save_details_open_state_timeout =   setTimeout(() => {
        save_details_open_state_timeout = null;

        let     details_array = document.querySelectorAll("DETAILS");
        for(let details_idx   = 0; details_idx < details_array.length; ++details_idx)
        {
            let     details   = details_array[details_idx];
            let storage_key   = "details_"+ details_idx +"_is_open";
            if( details.open  ) js_store.localStorage_setItem( storage_key, true );
            else                js_store.localStorage_delItem( storage_key       );
        }
    }, SAVE_DETAILS_OPEN_STATE_DELAY);
};
/*}}}*/
/*_ clear_details_open_state {{{*/
let clear_details_open_state = function()
{
if(log_this) console.log("⚫ %c js_fold.clear_details_open_state:", lbB);

    let     details_array = document.querySelectorAll("DETAILS");
    for(let details_idx   = 0; details_idx < details_array.length; ++details_idx)
    {
        let storage_key = "details_"+ details_idx +"_is_open";
        js_store.localStorage_delItem( storage_key );
    }
};
/*}}}*/

// ┌───────────────────────────────────────────────────────────────────────────┐
// │ CONTAINERS SCROLL TOP                                                     │
// └───────────────────────────────────────────────────────────────────────────┘
/*○ save_containers_scrollTop {{{*/
let save_containers_scrollTop = function()
{
if(log_this) console.log("⚫ %c js_fold.save_containers_scrollTop:", lbB);

    //┌───────────────────────────────────────────────────────────────┐
    //│ SAVE    ● scrollable-containers-scrollTop into [localStorage] │
    //└───────────────────────────────────────────────────────────────┘
    /* Build an array of { XPath , scrollTop } {{{*/
    let xpath_scrollTop_array = [];
    document.querySelectorAll("DETAILS,DIV").forEach((el) => {
        if( el.scrollTop )
        {
            xpath_scrollTop_array
                .push({     xpath: js_xpath.get_nodeXPath( el )
                      , scrollTop:                         el.scrollTop
                });
        }
    });
    /*}}}*/
    /* set localStorage {{{*/
    let key =                "xpath_scrollTop_array";
    let val = JSON.stringify( xpath_scrollTop_array );
    js_store.localStorage_setItem(key, val);
    /*}}}*/
};
/*}}}*/
/*○ load_containers_scrollTop {{{*/
let load_containers_scrollTop = function()
{
if(log_this) console.log("⚫ %c js_fold.load_containers_scrollTop:", lbB);

    //┌───────────────────────────────────────────────────────────────┐
    //│ RESTORE ● scrollable-containers-scrollTop from [localStorage] │
    //└───────────────────────────────────────────────────────────────┘
    let key = "xpath_scrollTop_array";
    let val = js_store.localStorage_getItem( key );
    if(!val) return;

    let xpath_scrollTop_array = JSON.parse( val );

    xpath_scrollTop_array.forEach((             xpath_scrollTop          ) => {
        let el = js_xpath.get_nodeXPath_target( xpath_scrollTop.xpath    );
        if( el )
            el.scrollTo({ top:                  xpath_scrollTop.scrollTop , behavior: "smooth" }); // show the adjustment
        else {
console.log("js_fold: localStorage_delItem("+key+")");
            js_store.localStorage_delItem( key );
        }
    });
};
/*}}}*/

// ┌───────────────────────────────────────────────────────────────────────────┐
// │ CLICK EVENT                                                               │
// └───────────────────────────────────────────────────────────────────────────┘
/*○ details_update_click_listeners {{{*/
let details_update_click_listeners = function()
{
if(log_this) console.log("⚫ %c js_fold.details_update_click_listeners:", lbB);

    // CLOSE DETAILS ● click container left margin

    // DETAILS having no nested DETAILS

    let some_listener_added = "";

  //document.querySelectorAll("DETAILS:not(:has(DETAILS))").forEach((el) => {
    document.querySelectorAll("DETAILS"                   ).forEach((el) => {
        if(!el.click_listener_added)
        {
            some_listener_added += "● "+ el.firstElementChild.textContent.replace(/ *\n */g," \u21B2 ")+"\n";

            el.click_listener_added = true;

            el.addEventListener("click", details_click_listener);

            el.addEventListener("toggle", (event) => {
                toggle_details_open_state (event);
                save_details_open_state();
            });

            // SUMMARY CLICK SHIFT TRACKER
            el = el.firstElementChild;
            el.addEventListener("click"     , track_pendingShift, true             ); // capture, so it"s recorded even if something stops propagation later
            el.addEventListener("touchstart", track_pendingShift, { passive: true });
        }
    });
    if( some_listener_added.length )
    {
/*{{{*/
if(tag_this) console.log("⚫ %c js_fold: "+ some_listener_added.split("\n").length +" CLICK LISTENERS ADDED", lbB);
//if(log_this) console.log(some_listener_added);
/*}}}*/

        load_details_open_state();
    }
};
/*}}}*/
/*_ details_click_listener {{{*/
let details_click_listener = function(e)
{
if(log_this) console.log("⚫ %c js_fold.details_update_click_listeners:", lbB);

    if(e.target.onclick) return; // skip tooling elements

    let details
        = (e.target              .tagName == "DETAILS") ? e.target
        : (e.target.parentElement.tagName == "DETAILS") ? e.target.parentElement
        :                                                 null;

    if( details ) {
        let            summary = details.firstElementChild;
        let      nextContainer = _get_nextContainer( summary );             // container under DETAILS SUMMARY
        if(   (e.x < (nextContainer.offsetLeft     ))                       // clicked in container's left margin
           && (e.x > (nextContainer.offsetLeft - 30))                       // witin parent details .. @see STYLE/details.css
          ) {
            details.open       = !details.open;
            if( e.stopPropagation          ) e.stopPropagation         ();  // capturing and bubbling phases
            if( e.stopImmediatePropagation ) e.stopImmediatePropagation();  // other listeners of the same event
            if( e.preventDefault           ) e.preventDefault          ();  // browser agent default
        }
    }
};
/*}}}*/
/*○ _get_nextContainer {{{*/
let _get_nextContainer = function(el)
{
if(log_this) console.log("⚫ %c js_fold._get_nextContainer:", lbB);

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

//┌───────────────────────────────────────────────────────────────────────────┐
//│ TOGGLE EVENT                                                              │
//└───────────────────────────────────────────────────────────────────────────┘
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
        e.preventDefault();  // stop scrolling while multitouching
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
let set_shiftLatched = function(state, delay=500)
{
    shiftLatched  = state;
    if( shiftLatched )
        setTimeout(() => shiftLatched = false, delay);
};
/*}}}*/
/*_ toggle_details_open_state {{{*/
let toggle_details_open_state = function(e)
{
//if(log_this) console.log("⚫ %c js_fold.toggle_details_open_state:", lbB);

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ the `details` whose state changed
    //└────────────────────────────────────────────────────────────────────────┘
    let  target = e.target;
    if(!(target instanceof HTMLDetailsElement)) return;

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ SHIFT TO KEEP OTHER DETAILS OPEN    ● (toggle event has no e.shiftKey) │
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
if(log_this) console.log("🔴 %c js_fold.toggle_details_open_state: OPENING: "+target.firstElementChild.childNodes[0].textContent, lbB+lb2);

    let    open_set = new Set([target, ...get_ancestors_with_tag(target, "DETAILS")]);

    let doc_details = Array.from(document.querySelectorAll("details"));

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ DO NOT CLOSE OTHERS
    //└────────────────────────────────────────────────────────────────────────┘
    if( shiftKey )
    {
        for(let d of open_set)
            if(!d.open)
                d.open = true;
    }
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ DO ... CLOSE OTHERS
    //└────────────────────────────────────────────────────────────────────────┘
    else {
        for(let d of doc_details)
        {
            let           open_or_close = open_set.has( d );
            if( d.open != open_or_close)
                d.open  = open_or_close;
        }

    }
};
/*}}}*/
/*_ get_ancestors_with_tag {{{*/
let get_ancestors_with_tag = function(el, tag)
{
if(log_this) console.log("⚫ %c js_fold.get_ancestors_with_tag:", lbB);

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

// ┌─────┐
// │ LOG │
// └─────┘
//{{{
/* eslint-disable no-unused-vars */

const lb1  = "background:#964B00; color:black; padding:0 0.5em;";
const lb2  = "background:#FF0000; color:black; padding:0 0.5em;";
const lb3  = "background:#FFA500; color:black; padding:0 0.5em;";
const lb4  = "background:#FFFF00; color:black; padding:0 0.5em;";
const lb5  = "background:#9ACD32; color:black; padding:0 0.5em;";
const lb6  = "background:#6495ED; color:black; padding:0 0.5em;";
const lb7  = "background:#EE82EE; color:black; padding:0 0.5em;";
const lb8  = "background:#A0A0A0; color:black; padding:0 0.5em;";
const lb9  = "background:#FFFFFF; color:black; padding:0 0.5em;";
const lb0  = "background:#000000; color:gray ; padding:0 0.5em;";
const lbX  = [ lb0 ,lb1 ,lb2 ,lb3 ,lb4 ,lb5 ,lb6 ,lb7 ,lb8 ,lb9 ];
const lbB  = lb0 +"font-size: 150%; border-radius: 1em; padding: 0 1em; border: 1px solid red;";

/* eslint-enable  no-unused-vars */
//}}}

/* EXPORT {{{*/
return { name : "js_fold"
        , onload
        , set_shiftLatched
    // DEBUG
    , load_details_open_state
    , save_details_open_state
    , clear_details_open_state
    , get_ancestors_with_tag

};

/*}}}*/
}());
document.addEventListener("DOMContentLoaded", js_fold.onload);
