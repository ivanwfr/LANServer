//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_linkify.js   ● $APROJECTS/LANServer/SERVER        ● _TAG (261106:00h:03)
//├────────────────────────────────────────────────────────────────────────────┤
//│ 🟤 ecc colorize details>summary
//│ 🟤 linkify relative source-file-path in comments
//│ @see SERVER/style/to_html.css
//│ @see SERVER/style/notes.css
//└────────────────────────────────────────────────────────────────────────────┘
/* IMPORT {{{*/

/* global js_folds */
/* global js_input */
/* global js_log   */
/* global js_xpath */

//port { js_CNTRL   } from "./js_CNTRL.js"
//port { js_MODEL   } from "./js_MODEL.js"
//port { js_VIEW    } from "./js_VIEW.js"
//port { js_boxing  } from "./js_boxing.js"
import { js_folds   } from "./js_folds.js"
import { js_input   } from "./js_input.js"
//port { js_linkify } from "./js_linkify.js"
import { js_log     } from "./js_log.js"
//port { js_notes   } from "./js_notes.js"
//port { js_store   } from "./js_store.js"
//port { js_ticker  } from "./js_ticker.js"
import { js_xpath   } from "./js_xpath.js"
//port { notes      } from "./notes.js"
//port { url_to_href} from "./url_to_href.js"

/*}}}*/
let js_linkify  = (function()
{
//┌────────────────────────────────────────────────────────────────────────────┐
//│ ◯  INTERNING ● SERVER/scripts/js_log.js
//└────────────────────────────────────────────────────────────────────────────┘
const MODULE = "%c★🟣 js_linkify\t\t● ";
let   log_this;
let   tag_this;
//{{{
/* eslint-disable no-unused-vars */

js_log.register( { module_name : "js_linkify"
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

/*➔ onload {{{*/
let onload  = function()
{
let caller = "onload";
if(tag_this) log(MODULE+caller+"4 🟡 onload:");

    // TURN PATH INTO HTML ANCHOR
    linkify_file_pathes();

    // DETAILS COLORIZE
    let     el = document.querySelector("DETAILS");
    if(     el.parentElement
        && !el.parentElement.getAttribute("color_num"))
        setTimeout( colorize_details        ,  500);

    // SUMMARY TOOLING
    if( !document.querySelector("SUMMARY>.em_fold") )
        setTimeout( format_summary_comments ,  500);
};
/*}}}*/
/*_ colorize_details {{{*/
let colorize_details = function()
{
    for(let el of document.querySelectorAll("details"))
    {
        // PARENT [color_num] ATTRIBUTE FOR THIS CHILD
        let color_num
            = el.parentElement
                .getAttribute( "color_num");
        color_num
            = (color_num == null) ?   1                             // first under this parent
            : ((parseInt(color_num) + 1) % 10);                     // next  under this parent

        // PARENT ATTRIBUTE FOR NEXT CHILD [color_num]
        el.parentElement.setAttribute("color_num", color_num);      // update parent next attr
        el.classList.add(                     "bg"+color_num);
    }
};
/*}}}*/
/*_ format_summary_comments {{{*/
let format_summary_comments = function()
{
    let top_details;
    for(let summary of document.querySelectorAll("summary")) {
        // Identify *top_details* as a details hiding container {{{
        if(!top_details)
        {
            top_details    = summary.parentElement;
            top_details.id = "top_details";
        }
        //}}}
        // TRIM: / and * {{{
        summary.textContent
            = summary.textContent
                .replace(/\/\//, "")
                .replace(/\/\*/, "")
                .replace(/\*\//, "")
              ;

        //}}}
        // BUTTONS: em_copy & fold_close_open_toggle {{{
//      if( summary.innerHTML.trim() ) // FOLD_OPEN comments with no text may have DETAILS children
            summary.innerHTML += ""
                + "<em onclick='js_linkify.fold_close_open_toggle    ( event, 2);"
                + "             js_folds  .clear_DETAILS_last_toggled( event );"
                + "             return false;'"
                + "      title='● Open or Close all children\n&\n● Clear open history"
                + "      class='em_fold'"
                + "      style='float:right; margin-left: 2em;'"
                + ">▶◀</em>&nbsp;"

                + "<em onclick='js_linkify.copy_container_text( event );"
                + "             return false;'" // i.e. cancelBubble
                + "      title='● Copy TITLE into NOTE INPUT below\n&\n● Copy TEXT to CLIPBOARD'"
                + "      class='em_copy'"
                + "      style='float:right; margin-left: 2em;'"
                + ">⬜</em>&nbsp;"

                + "<em onclick='js_linkify.toggle_check( event );"
                + "             return false;'"
                + "      title='✓\n Check\n this section'"
                + "      style='float:left; margin-left: 1em;'"
                + "    class='em_check'"
                + ">✓</em>&nbsp;"

                + "<em onclick='js_linkify.toggle_wrap( event );"
                + "             return false;'"
                + "      title='▶◀\n Narrow\n Columns width'"
                + "      style='float:left; margin-left: 3em;'"
                + "    class='em_wrap'"
                + ">↷</em>&nbsp;"
            ;

            //┌────────────────────────────────────────────────────────────────────────────┐
            //│ HIDE TOP-LEVEL DETAILS ..........body/pre/details.....[#]...../summary
            //└───────────────────────────────────────▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼────▼▼▼▼▼▼───▼▼▼▼▼▼▼▼┘
            if(js_xpath.get_nodeXPath(summary).match(/body.pre.details(?:\[\d+\])?\/summary/))
               summary.innerHTML += ""
                + "<em onclick='js_linkify.toggle_hide( event );"
                + "             return false;'"
                + "      title='✘\n Hide\n this section'"
                + "      style='position:absolute; left: 0em;'"
                + "    class='em_hide'"
                + ">✘</em>&nbsp;"
            ;

        //}}}
    }
    // HIDE FOLD BUTTON FOR DETAILS WITH NO EMBEDDED FOLDS TO OPEN {{{
    document.querySelectorAll("DETAILS:not(:has(DETAILS))").forEach((el) => {
        let child =    el.firstElementChild;
        child     = child && child.firstElementChild;
        if( child ) child.style.visibility = "hidden"; // fold EM
    });
    //}}}
    // populate em_hide title
    let em_hide      = top_details.querySelector(".em_hide");
    if( em_hide )
        em_hide.title = ""
            +"⚫ … will hide all closed sections\n"
            +"🟡 … will unhide currently hidden";
};
/*}}}*/
/*_ toggle_wrap {{{*/
let toggle_wrap = function(e)
{
    // TOGGLE [wrap] AND CASCADE TO ALL DESCENDANTS {{{
    let  details    = e.target.closest("DETAILS");
    let wrapping    = details.classList.toggle("wrap");

    details.querySelectorAll("DETAILS")
        .forEach((el) => el.classList.toggle("wrap", wrapping));

    //}}}
    // cancel container event delegation {{{
    e.cancelBubble        = true;
    e.stopPropagation         ();
    e.stopImmediatePropagation();
    e.preventDefault          ();
    //}}}
};
/*}}}*/
/*_ clear_this_visited_url {{{*/
let clear_this_visited_url = function(e,url)
{
let caller = "clear_this_visited_url";

    let e_target = e.target;
    let body = { url };
    /**/body = JSON.stringify( body);
    fetch("/clear_this_visited_url"
          , {   method  :   "POST"
              , headers : { "Content-Type": "application/json; charset=utf-8" }
              , body })
        .then ((response) =>   response.json() )
        .then ((    data) => { /* eslint-disable-line no-unused-vars */
if(tag_this) log(MODULE+caller+":"+ JSON.stringify(data));
            e_target.style.opacity                    = "0.2";
            let a =   e_target.nextElementSibling
                   || e_target.parentElement.nextElementSibling
            ;
            if( a ) {
                do {
                    a.style.opacity = "0.5";
                } while(   (a = a.nextElementSibling)
                           && (a.tagName == "A"        ));
            }
        })
        .catch((err) => {
            console.error("clear_this_visited_url failed:",  err);
        });
};
/*}}}*/
/*_ toggle_check {{{*/
let toggle_check = function(e)
{
    // TOGGLE [checked] AND CASCADE TO ALL DESCENDANTS {{{
    let  details    = e.target.closest("DETAILS");
    let checking    = details.classList.toggle("checked");

    details.querySelectorAll("DETAILS")
        .forEach((el) => el.classList.toggle("checked", checking));

    //}}}
    // CHECK PARENT WHEN ALL CHILDREN ARE CHECKED {{{
    let d_parent    =      details.parentElement.closest("DETAILS"        );
    if( d_parent )
    {
        // CHILDREN
        let children         = d_parent.querySelectorAll("DETAILS"        );
        let children_checked = d_parent.querySelectorAll("DETAILS.checked");

        // ALL CHECKED
        let d_parent_checked = (children.length == children_checked.length);
        /**/d_parent.classList.toggle("checked", d_parent_checked);
    }
    //}}}
    // cancel container event delegation {{{
    e.cancelBubble        = true;
    e.stopPropagation         ();
    e.stopImmediatePropagation();
    e.preventDefault          ();
    //}}}
};
/*}}}*/
/*_ toggle_hide {{{*/
let toggle_hide = function(e)
{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ TODO: reparent hidden DETAILS into *Recently visited* container.
    //└────────────────────────────────────────────────────────────────────────┘
    let details     = e.target.closest      ("DETAILS");

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ● click *top DETAILS em_hide button*
    //│   1/2 NO   hidden DETAILS →   HIDE all CLOSED first level DETAILS
    //│   2/2 SOME hidden DETAILS → UNHIDE all HIDDEN first level DETAILS
    //│ ● click *visible* DETAILS → TOGGLE its HIDDEN state
    //└────────────────────────────────────────────────────────────────────────┘
    //{{{
    let top_details  = document.querySelector("#top_details");
    if( top_details == details)
    {
        let hidden_array = top_details.querySelectorAll(":scope >DETAILS");
        if( hidden_array.length > 0)
        {
            hidden_array
            .forEach((el) => {              toggle_hide_element(top_details, el, false); }); // UNHIDE
        }
        else {
            top_details. parentElement.querySelectorAll(":scope >DETAILS")
            .forEach((el) => { if(!el.open) toggle_hide_element(top_details, el,  true); }); // HIDE
        }
    }
    else {                                  toggle_hide_element(top_details, details  ); }   // TOGGLE
    //}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ colorize top_details em_hide button
    //└────────────────────────────────────────────────────────────────────────┘
    let hidden_array = top_details.querySelectorAll(":scope >DETAILS");
    top_details.classList.toggle("has_some_hidden", (hidden_array.length));

//    // TOGGLE [display] {{{
//    let hidden      = details.classList.toggle("hidden");
//    details.querySelectorAll("DETAILS")
//        .forEach((el) => el.classList.toggle("hidden", hidden));
//    //}}}
    // cancel container event delegation {{{
    e.cancelBubble        = true;
    e.stopPropagation         ();
    e.stopImmediatePropagation();
    e.preventDefault          ();
    //}}}
};
/*}}}*/
/*_ toggle_hide_element {{{*/
let place_holder_nb = 0;
let toggle_hide_element = function(top_details, details, hide_unhide_or_toggle)
{
    if(top_details == details) return;  // dodge element hinding in itself
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ 1/3 ● HIDE
    //│ 2/3 ● UNHIDE
    //│ 3/3 ● TOGGLE
    //└────────────────────────────────────────────────────────────────────────┘
    let hiding
        = (hide_unhide_or_toggle != undefined)
        ?  hide_unhide_or_toggle
        : (details.parentElement != top_details) // toggle
    ;

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ HIDE or UNHIDE DETAILS ELEMENT
    //└────────────────────────────────────────────────────────────────────────┘
    if( hiding )
    {
        // CLOSE MOVING ELEMENT
        details.open = false;

        // GOING_BACK_TO_ANCHOR [place_holder_id]
        let place_holder_id     = details.getAttribute("place_holder_id");
        if(!place_holder_id)
        {
            let place_holder    = document.createElement("DIV");
                place_holder.id = "place_holder_"+(++place_holder_nb);
            details.parentElement.insertBefore(place_holder, details);
            details.setAttribute("place_holder_id"   , place_holder.id   );
        }
        // HIDE
        details.classList.add   ("hidden");
        top_details              .insertBefore(details, null); // hide inside top_details
    }
    else {
        // MOVING BACK TO [place_holder_id] DOCUMENT ANCHOR
        let place_holder_id     = details .getAttribute("place_holder_id"   );
        let place_holder        = document.getElementById( place_holder_id );
        place_holder.parentElement.insertBefore(details, place_holder.nextElementSibling);

        // SHOW
        details.classList.remove("hidden");
    }
};
/*}}}*/
/*➔ copy_container_text {{{*/
let note_input_TEXTAREA;
let copy_container_text = function(e)
{
    // PREVENT SUMMARY FOLDE-EVENT {{{
    e.cancelBubble = true;

    //}}}
    // COPY-SOURCE {{{
    let details = e.target.closest("DETAILS");
    let summary = details.querySelector(":scope > SUMMARY");
    let pre     = details.querySelector(":scope > PRE"    ); // :scope pseudo-class to get a direct descendant

    //}}}
    // COPY-DESTINATION {{{
    if(!note_input_TEXTAREA)  note_input_TEXTAREA = document.querySelector("#note_input_TEXTAREA");

    //}}}
    // SOURCE-TEXT {{{
    let text
        =  (details.id == "note_DETAILS")
        &&  note_input_TEXTAREA
        ?   note_input_TEXTAREA.value                     // [NOTE TEXT TO CLIPBOARD]
        :   pre                .textContent
    ;
    //}}}
    // COPY TO RELEVANT TEXT AREA {{{
 // let ta = note_input_TEXTAREA || details.querySelector("TEXTAREA");
    let ta = js_input;

    //}}}
    // APPEND TITLE TO TEXTAREA ● USER MAY PASTE CLIPBOARD CONTENT {{{
    if( ta && (details.id != "note_DETAILS"))
        ta.value += (ta.value ? "\n":"")
            +       summary.firstChild.textContent.trim() +"\n";

    //}}}
    // COPY TO CLIPBOARD {{{
    navigator.clipboard.writeText( text );

    //}}}
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ FOLDING                                                                    │
//└────────────────────────────────────────────────────────────────────────────┘
/*➔ fold_close_open_toggle {{{*/
let fold_close_open_toggle = function(e,state)
{
let caller = "fold_close_open_toggle"; /* eslint-disable-line no-unused-vars */
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PREVENT CLOSING DETAILS                                                │
    //└────────────────────────────────────────────────────────────────────────┘
    js_folds.set_shiftLatched(  true );

    let  details = e.target.closest("DETAILS");
    details.open = true;
    let el_array = details.querySelectorAll("DETAILS");
    let    count = 0;
    for(let el of el_array)
    {
        //┌────────────────────────────────────────────────────────────────────────┐
        //│ [state==2] => toggle first state ..and set siblings state likewise.    │
        //└────────────────────────────────────────────────────────────────────────┘
        if(state==2) state = !el.open;
        el.open            =  state;
        if(state) js_folds.set_DETAILS_last_toggled( el );
        count += 1;
    }
    if( count ) {
            e.cancelBubble             = true;
        if( e.stopPropagation          ) event.stopPropagation         ();
        if( e.stopImmediatePropagation ) event.stopImmediatePropagation();
        if( e.preventDefault           ) event.preventDefault          ();
    }
//if(log_this) log(MODULE+caller+"%c "+ (count ? count:"NO") +" fold"+ (count>1 ? "s":"") +" "+ ((state==0) ? "closed" : ((state==1) ? "opened":"toggled") +" "), "background-color: "+BG[count]);

    return count;
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ REBASE FULLY QUALIFIED HREF
//└────────────────────────────────────────────────────────────────────────────┘
/*_ linkify_file_pathes {{{*/
//{{{
const VISITED_HISTORY_UNCHECK_SYMBOL = "❌";

let   RGX_CLR;
//}}}
let linkify_file_pathes = function()
{
let caller = "linkify_file_pathes";

    //FIXME COMMENT
    url_to_href.basename_clear();

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PRE CONTAINING [BARE FILE OR FOLDER PATH] TO [HTML ANCHOR]
    //└────────────────────────────────────────────────────────────────────────┘
    let innerHTML = "";
    let       pre = document.querySelector("PRE");
    let     lines = pre.innerHTML.split("\n");

    //  RGX_CLR {{{
    if(!RGX_CLR )
    {
        let x = VISITED_HISTORY_UNCHECK_SYMBOL;
        //....................()(lft)(last_href)(trailer..)
        let match1 = "(^.*)";
        let symbol =       "("+x+")";
        let match2 =        "(.*')";
        let e_href =             "(http[^']+)";
        let match3 =                          "('.*$)";

        RGX_CLR = new RegExp(`${match1}${symbol}${match2}${e_href}${match3}`, "");

if(log_this) log(MODULE+caller+"RGX_CLR:", RGX_CLR);
    }
    //}}}

    lines.forEach((line) => {
        line = url_to_href.line_url_to_href( line );
        // BUTTON to remove visited history {{{
        if(line && line.includes  (VISITED_HISTORY_UNCHECK_SYMBOL) )
        {
//{{{
if(log_this) {
    log("┌────────────────────────────────────────────────────────────────────┐\n"
       +"line=["+line+"]");
}
//}}}
          //let matches = line.match(/\>(.*)\<\/a\>/i);
            // last href
            let matches = line.match( RGX_CLR );
            if( matches ) {
                let m_1 = matches[1];
                let sym = matches[2];
                let m_3 = matches[3];
                let url = matches[4];
                let m_4 = matches[5];
//{{{
if(log_this) {
    log("m_1=["+m_1+"]\n"
       +"sym=["+sym+"]\n"
       +"m_3=["+m_3+"]\n"
       +"url=["+url+"]\n"
       +"m_4=["+m_4+"]");
}
//}}}
                line= m_1
                    + "<span onclick='js_linkify.clear_this_visited_url(event,\""+url+"\")'>"
                    +  sym
                    + "</span>"
                    + m_3
                    + url
                    + m_4
                ;
//{{{
if(log_this) {
    log("line=["+line+"]\n"
        +"└────────────────────────────────────────────────────────────────────┘");
}
//}}}

            }
        }
        //}}}
        if( line )
            innerHTML  += line +"\n";
    });

    pre.innerHTML = innerHTML.trim();
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ EMBED SERVER/url_to_href.js
//└────────────────────────────────────────────────────────────────────────────┘
/*
}:r !grep -v 'module.exports' %:h/../url_to_href.js
*/
//{{{

//┌────────────────────────────────────────────────────────────────────────────┐
//│ url_to_href.js                                       ● _TAG (261105:16h:39)
//└────────────────────────────────────────────────────────────────────────────┘
let url_to_href = (function() {
// RGX_EXT_ARRAY ● RGX_EXT ● basename {{{
const RGX_EXT_ARRAY
    = [ "ahk"
      , "asp"
      , "awk"
      , "css"
      , "json"
      , "js"
      , "log"
      , "lua"
      , "md"
      , "tmc"
      , "txt"
      , "vim"
    ];
let   RGX_EXT;
let   basename;
let   a_href_to_html_array = [];
//}}}
/*● line_url_to_href {{{*/
let line_url_to_href = function(line, dir_href)
{
//if(dir_href) console.log("url_to_href.line_url_to_href("+dir_href+")");
// log {{{
    let href
        = (typeof document != "undefined")
        ?         document.location.href
        :                       dir_href;
    let root          = href  .replace(/^(.*\/\/[^\/]*)\/.*/, "$1");  // up to first '/'
    let file          = href  .replace(/^.*\/(.*)$/         , "$1");  // after last  '/'
    let folder        = href  .substr(root.length);                   // after first '/'
        folder        = folder.substr(0, folder.length -file.length); // before file

// log {{{
//console.log("➔ href    = ["+href+"]");
//console.log("➔ root    = ["+root+"]");
//console.log("➔ file    = ["+file+"]");
//console.log("%c folder = ["+ folder+"]", "color: yellow");
//console.log("🟤🔴🟠🟡🟢🔵🟣⚫⚪️");
//}}}
    //}}}
    //  RGX_EXT {{{
    if(!RGX_EXT )
    {
        let s   = "";
        RGX_EXT_ARRAY.forEach((ext) => s += "|"+ext);
        s       = s.substr(1); // trim extra first pipe
        RGX_EXT = new RegExp("([\/\\a-z_A-Z0-9\.]+\\.("+s+"))","g");
//console.log("RGX_EXT:", RGX_EXT);
    }
    //}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ SET or CLEAR *Page relative URL* **basename** ● (runlenght)
    //└────────────────────────────────────────────────────────────────────────┘
    //{{{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ .......................11...............22222222..33...................
    //└────────────────────────▼▼───────────────▼▼▼▼▼▼▼▼──▼▼───────────────────┘
    let matches = line.match(/(.*)basename *= *([^\s<>]*)(.*)/);
    if( matches )
    {
//console.log("\n"+line);
//console.log("matches[1]=["+matches[1]+"]");
//console.log("matches[2]=["+matches[2]+"]");
//console.log("matches[3]=["+matches[3]+"]");

        let prev = basename;
        basename = matches[2];

        let ttl = "URL basename: "+ (basename ? "Folder ["+basename+"]" : "Cleared"    );
        let tag =                   (basename ? "🟢 >> "  +basename     : "⚫ << "+prev);
        return matches[1]
            +  "<span class='basename' title='"+ttl+"'>"+tag+"</span>"
            +  matches[3]
        ;
    }

    let l_trim = line  .trim();
        l_trim = l_trim.replace(  /<[^>]*>/g,"").trim();
        l_trim = l_trim.replace(/\?to_html/ ,"").trim();

//console.log("l_trim=["+l_trim+"]");
    //}}}
    //┌────────────────────────────────────────────────────────────────────────────┐
    //│ 1/2. *http* with no *href* ➔ MAKE A *<a href='url'>url</a>*
    //└────────────────────────────────────────────────────────────────────────────┘
    // match → a_href {{{
    let matched;
    if(line.includes("http") && !line.includes("href"))
    {
        line = line_a_from_http_no_href( line );
    }
    //}}}
    //┌────────────────────────────────────────────────────────────────────────────┐
    //│ 2/2 - File with Supported EXTENSION ● i.e. .txt .ahk .css .js .md ...
    //└────────────────────────────────────────────────────────────────────────────┘
    // match → a_href root + sub folders {{{
    else if(matched = line_match_supported_extension( l_trim ))
    {
        //┌────────────────────────────────────────────────────────────────┐
        //│ PATH:
        //│ ● FROM: AFTER A MANDATORY ( SPACE          )
        //│ ● ALL.................... [ NON-SPACES     ]
        //│ ● UP TO (INCLUDED)....... [ MIME-EXTENSION ]
        //└────────────────────────────────────────────────────────────────┘
        //{{{
        let path
            = matched
            .replace(/\s.*/ ,"").trim() // inner space
            .replace(/[\*\"'`](.*)[\*\"'`]*/ ,"$1").trim() // inner space
        ;
        /*}}}*/
        //┌────────────────────────────────────────────────────────────────┐
        //│ 1/2  [ SLASH ] TO [ROOTED_NAME]
        //│ i.e. [/SERVER] TO [http:192.168.1.114:447/SERVER]
        //└────────────────────────────────────────────────────────────────┘
        //{{{
        let a_href;
        if( path.startsWith("/") )
        {
            a_href = root + path;
//console.log("%c● a_href=["+a_href+"]", "color: #F06");
        }
        //}}}
        //┌────────────────────────────────────────────────────────────────┐
        //│ 2/2 [path] SUB FOLDERS TO PARSE
        //└────────────────────────────────────────────────────────────────┘
        //{{{
        else {
//console.log(  "\nline=["+line+"]");
//console.log(    "path=["+path+"]");
//console.log(    "basename=["+basename+"]");
            if( basename ) {
                let p
                    = (path.startsWith("./") ? path.substr(2) : path);
//console.log("p=["+p+"]");
                a_href = parse_sub_folders(href, root, basename+"/.", p);
            }
            else {
                a_href = parse_sub_folders(href, root, folder, path);
            }
        }
        //}}}
//console.log("┌────────────────────────────────────────────────────────────────────┐");
//console.log(a_href);

        //┌────────────────────────────────────────────────────────────────────┐
        //│ query
        //└────────────────────────────────────────────────────────────────────┘
        let  q = (line.includes("?to_html") || a_href_to_html_array.includes( a_href )) ? "?to_html":"";
        if(  q && !a_href_to_html_array.includes( a_href ))
                   a_href_to_html_array.push    ( a_href );
//console.log("● q ["+q+"]");

        //┌────────────────────────────────────────────────────────────────────┐
        //│ a
        //└────────────────────────────────────────────────────────────────────┘
        let  a = "<a href='"+ encodeURI(a_href) + q +"'>"+path+"</a>";
//console.log("● a ["+a+"]");

        let  a_list = get_a_list(a_href, q);

        //┌────────────────────────────────────────────────────────────────────┐
        //│ p ● THE PART TO BE REPLACED BY: <a href='https://...'> path </a>
        //└────────────────────────────────────────────────────────────────────┘
        let  p = line.includes(q) ? (path + q) : path;
//console.log("● p ["+ p      +"]");

        //┌────────────────────────────────────────────────────────────────────┐
        //│ line
        //└────────────────────────────────────────────────────────────────────┘
//console.log("├────────────────────────────────────────────────────────────────────┤");
//console.log(            line    );
        line   = line.replace(p, (a_list || a));

//console.log("%c"+       line   , "background-color: #040");
//console.log("└────────────────────────────────────────────────────────────────────┘");
    }
    //}}}

    return line;
};
/*}}}*/
/*_ get_a_list {{{*/
let get_a_list = function(a_href, q)
{
    //..........................(-----------------) /(pa))
    let matches = a_href.match(/(https?:\/\/[^\/]*)\/(.*)$/);
    if(!matches) return "";

    let root = matches[1].trim();
//console.log("root=["+root+"]");

    let path = matches[2].trim();
//console.log("path=["+path+"]");

    let is_dir = path.endsWith("/");
    if( is_dir ) path = path.slice(0,-1);
//console.log("is_dir=["+is_dir+"]");

    let a_list = "";
    let subs   = "";
    let dirs   = path.split("/");
    for(let i=0; i < dirs.length; ++i)
    {
        let d = dirs[i];
//console.log("...d=["+d+"]");
        subs +=  d;
        if(is_dir || (i  < (dirs.length - 1))) subs += "/";
        else if(     (i == (dirs.length - 1))) subs +=   q;
        a_list += ((i > 0) ? "∙":"")+"<a href='"+ root +"/"+ subs +"'>"+ (d || "Root") +"</a>";
    }
//console.log("%c"+ a_list.replace(/→/,"→\n"), "background-color:black;");

    return a_list;
};
/*}}}*/
/*_ parse_sub_folders ● remove an overlapping folder-path-segment {{{*/
let parse_sub_folders = function(href, root, folder, path)
{
//console.log("┌───────────────────────────────────────────────────────────────────────────┐");

    let D_NAMES  = folder.split("/").filter(Boolean);
//console.log("%c D_NAMES: "+ D_NAMES                 , "background-color: #000; color: #0F0");

    let f_names  = path  .split("/").filter(Boolean);
//console.log("%c f_names: "+ f_names                 , "background-color: #000; color: #F0F");

    let fileName = f_names.pop();
//console.log("%c● fileName=["+fileName+"]"           , "background-color: #000; color: #FF0");

    let up_count =  0;
    let sub_fold = "";
    let      d,          f;
    for(     d              =  D_NAMES.length-1
        ,                f  =  f_names.length-1
        ;   (d >= 0) && (f >= 0)
        ;  --d       , --f
       ) {
        // current dir is current parent
        if(      f_names[f] == ".")
        {
            sub_fold   =       D_NAMES[d] +"/"+ sub_fold;
            up_count  += 1;
        }
        // going deeper...
        else if( f_names[f] != D_NAMES[d])
        {
            up_count  += 1;
            sub_fold   = f_names[f] +"/"+ sub_fold;
        }
//console.log(up_count+" %c sub_fold\=["+sub_fold+"]" , "background-color: #000; color: #FF0");
    }

    let a_href  = root +  "/";
    for(     d  = 0; d < (D_NAMES.length - up_count); ++d)
        a_href +=         D_NAMES[d] +"/";
    a_href     +=         sub_fold
        +                 fileName;

//console.log("%c● a_href\=["+a_href+"]"              , "background-color: #000; color: #0FF");
//console.log("└───────────────────────────────────────────────────────────────────────────┘");
    return a_href;
};
/*{{{ SAMPLE LINKS

    basename =
                   js_linkify.js
           scripts/js_linkify.js
    SERVER/scripts/js_linkify.js
    /USR/ivan/VIM/mapKeys.func.vim
                  mapKeys.func.vim

    basename = /USR/ivan/VIM
                             MAP/mapKeys.func.vim

    basename = /USR/ivan/VIM/MAP
                                 mapKeys.func.vim

}}}*/
/*}}}*/
/*_ line_a_from_http_no_href {{{*/
let line_a_from_http_no_href = function( line_in )
{
    let line_out;
            // URL IN A markdown table ● requires some syntax sanitation {{{
            //............................(111111)(222222)(33333333)
            let matches = line_in.match(/^( *<td>)(http.*)(<\/td> *)$/);  // @see /SERVER/server5_content.js markdown table to html
            if( matches ) {
                let url = matches[2];
                let   a = "<a href='"+ encodeURI(url) +"'>"+url+"</a>";
                line_out    = matches[1]+ a + matches[3]+"\n";
            }
            //}}}
            // well recognized URL {{{
            else {
                //┌────────────────────────────────────────────────────────────┐
                //│ When there is a BLANK or EOL at the end of an http URL
                //│ ●
                //│ matches[000000000000000000000000000000000000000]
                //│ matches[11][222222222222222222222][33333333][44]
                //│ ..... head  SCHEME_____URL_______  boundary  tail
                //│ .....   ▼▼  ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼  ▼▼▼▼▼▼▼▼  ▼▼
                //│ ....(/^(.*)(https?:\/\/[^>|<|\s]+)(>|<|\s|$)(.*)
                //│ ●
                //└────────────────────────────────────────────────────────────┘
                matches = line_in.match(/^(.*["'`])(https?:\/\/[^>|<]+)(["'`].*)/)
                ||        line_in.match(/^(.*)(https?:\/\/[^>|<|\s]+)(>|<|\s|$)(.*)/)
                ;
                if( matches ) {
                    let  head  = matches[1];
                    let   url  = matches[2];
                    let bound  = matches[3];
                    let tail   = matches[4] || "";

                    line_out   = head
                        +       "<a href='"+ encodeURI(url) +"'>"
                        +        url
                        +       "</a>"
                        +        bound
                        +        tail
                        +       "\n";
                }
            }
            //}}}
    return line_out;
};
/*}}}*/
/*_ line_match_supported_extension {{{*/
let line_match_supported_extension = function(l_trim)
{
    if(l_trim == "/")
        return l_trim;

    let matches
        =  l_trim.match(/\/\w+.*\/$/) // FOLDER
        || l_trim.match( RGX_EXT  );

//if(matches) console.log( l_trim     );
//if(matches) console.log( matches[0] );

    return matches ? matches[0] : "";
    //    //{{{
    //    return l_trim.match(/\/\w+\/$/   ) // FOLDER
    //        || l_trim.match(/\/\w+\.ahk/)
    //        || l_trim.match(/\/\w+\.asp/)
    //        || l_trim.match(/\/\w+\.awk/)
    //        || l_trim.match(/\/\w+\.css/)
    //        || l_trim.match(/\/\w+\.js/ )
    //        || l_trim.match(/\/\w+\.json/)
    //        || l_trim.match(/\/\w+\.lua/)
    //        || l_trim.match(/\/\w+\.md/ )
    //        || l_trim.match(/\/\w+\.tmc/)
    //        || l_trim.match(/\/\w+\.txt/)
    //        || l_trim.match(/\/\w+\.vim/)
    //        || l_trim.match(/\/\w+\.log/)
    //    ;
    //    //}}}
};
/*}}}*/

    return { name: "url_to_href"
        ,    line_url_to_href
        ,    basename_clear: () => basename = ""
    };
})();
globalThis.url_to_href  = url_to_href;
//}}}

//┌────────────────────────────────────────────────────────────────────────────┐
//│ PUBLIC js_linkify
//└────────────────────────────────────────────────────────────────────────────┘
//{{{
    return { onload
        ,    copy_container_text    // exposed to onclick
        ,    fold_close_open_toggle // exposed to onclick
        ,    toggle_check           // exposed to onclick
        ,    toggle_hide            // exposed to onclick
        ,    toggle_wrap            // exposed to onclick
        ,    clear_this_visited_url // exposed to onclick
        // DEBUG ONLY
        ,    linkify_file_pathes
    };
//}}}
/*}}}*/
})();
export { js_linkify }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_linkify = js_linkify; // exposed to onclick
