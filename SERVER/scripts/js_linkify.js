//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_linkify.js   ● $APROJECTS/LANServer/SERVER       ● _TAG (261005:18h:48) │
//├────────────────────────────────────────────────────────────────────────────┤
//│ 🟤 ecc colorize details>summary                                            │
//│ 🟤 linkify relative source-file-path in comments                           │
//└────────────────────────────────────────────────────────────────────────────┘
/* IMPORT {{{*/

/* global js_folds */
/* global js_input */

//port { js_CNTRL   } from "./js_CNTRL.js"
//port { js_MODEL   } from "./js_MODEL.js"
//port { js_VIEW    } from "./js_VIEW.js"
import { js_folds   } from "./js_folds.js"
import { js_input   } from "./js_input.js"
//port { js_linkify } from "./js_linkify.js"
//port { js_log     } from "./js_log.js"
//port { js_notes   } from "./js_notes.js"
//port { js_store   } from "./js_store.js"
//port { js_ticker  } from "./js_ticker.js"
//port { js_xpath   } from "./js_xpath.js"
//port { notes      } from "./notes.js"

/*}}}*/
let js_linkify  = (function() {
/*➔ onload {{{*/
let onload  = function()
{
                linkify_file_pathes();
    setTimeout( colorize_details        ,  500);
    setTimeout( format_summary_comments ,  500);
};
/*}}}*/
/*_ colorize_details {{{*/
// BG FG {{{
/* FG FFF {{{*/
//const FG = [
//  "#FFF6"
//, "#fffF"
//, "#fffF"
//, "#fffF"
//, "#fffF"
//, "#fffF"
//, "#fffF"
//, "#fffF"
//, "#fffF"
//, "#fffF"
//];
//}}}
/* FG 000 {{{*/
const FG = [
  "#BBBF"
, "#000F"
, "#000F"
, "#000F"
, "#000F"
, "#000F"
, "#000F"
, "#000F"
, "#000F"
, "#000F"
];
/*}}}*/
// BG rgba {{{
//const BG = [
//  "rgba( 32,  32,  32, .4)"
//, "rgba(150,  75,   0, .4)"
//, "rgba(255,   0,   0, .4)"
//, "rgba(255, 165,   0, .4)"
//, "rgba(255, 255,   0, .4)"
//, "rgba(154, 205,  50, .4)"
//, "rgba(100, 149, 237, .4)"
//, "rgba(238, 130, 238, .4)"
//, "rgba(160, 160, 160, .4)"
//, "rgba(255, 255, 255, .4)"
//];
//}}}
// BG hex {{{
//const BG = [
//  "#00000080"
//, "#964B00A0"
//, "#FF0000A0"
//, "#FFA500A0"
//, "#FFFF00A0"
//, "#9ACD32A0"
//, "#6495EDA0"
//, "#EE82EEA0"
//, "#A0A0A0A0"
//, "#FFFFFFA0"
//, "#F0F0F0F0"
//];
//}}}
//}}}
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

        // STYLE
        el.firstElementChild.style.          color = FG[color_num]; //FG[depth+1];
    }
};
/*}}}*/
/*_ format_summary_comments {{{*/
let format_summary_comments = function()
{
    for(let el of document.querySelectorAll("summary")) {
        // TRIM: / and * {{{
        el.textContent
            = el.textContent
                .replace(/\/\//, "")
                .replace(/\/\*/, "")
                .replace(/\*\//, "")
              ;

        //}}}
        // BUTTONS: cb_copy & fold_close_open_toggle {{{
//      if( el.innerHTML.trim() ) // FOLD_OPEN comments with no text may have DETAILS children
            el.innerHTML
                = el.innerHTML
                + "<em "
                + "   style = 'float:right; margin-left: 2em;'"
                + " onclick = 'js_linkify.fold_close_open_toggle(event, 2);'"
                + ">▶◀</em>"
                + "&nbsp;"

                + "<em class='cb_copy'"
                + "   style = 'float:right; margin-left: 2em;'"
                + " onclick = 'js_linkify.copy_container_text(event); return false;'" // i.e. cancelBubble
                + ">⬜</em>"
                + "&nbsp;"

                + "<em "
                + "   style = 'border       : 0px solid yellow;"
                + "            position     : absolute;"
                + "            color        : white;"
                + "            text-shadow  : 1px 1px 1px black;"
                + "            padding      : 0.5em;"
                + "            display      : inline-block;"
                + "            font-weight  : 900;"
                + "            font-size    : 16px;"
                + "            border-radius: 1em;"
                + "            border       : 1px solid #F0FA;"
                + "         background-color:           #202F;"
                + "            line-height  : 0.8em;"
                + "            transition   : all 200ms ease-out;"
                + "            margin-top: -0.5em;"
                + "            '"
                + " onclick = 'js_linkify.toggle_wrap(event); return false;'"
                + ">↷</em>"
                + "&nbsp;"
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
};
/*}}}*/
/*_ toggle_wrap {{{*/
let toggle_wrap = function(e)
{
    let container         = e.target.closest("SUMMARY").nextElementSibling;

    let wrapping          = container.classList.toggle("wrap");

    e.target.style.rotate = wrapping ? "90deg" : "";
    e.target.style.boxShadow = wrapping ? "2px 0px 0px 1px #F00" : "";

    e.cancelBubble        = true;
    e.stopPropagation         ();
    e.stopImmediatePropagation();
    e.preventDefault          ();
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
    let pre     = details.querySelector(":scope > PRE");

    //}}}
    // COPY-DESTINATION {{{
    if(!note_input_TEXTAREA)  note_input_TEXTAREA = document.querySelector("#note_input_TEXTAREA");

    //}}}
    // SOURCE-TEXT {{{
    let text
        =  (details.id == "note_DETAILS")
        &&  note_input_TEXTAREA
        ?   note_input_TEXTAREA.value   // [NOTE TEXT TO CLIPBOARD]
        :   pre    .textContent;        // [PRE  TEXT TO CLIPBOARD]

    //}}}
    // COPY TO RELEVANT TEXT AREA {{{
 // let ta = note_input_TEXTAREA || details.querySelector("TEXTAREA");
    let ta = js_input;

    //}}}
    // APPEND TEXT TO TEXTAREA {{{
    if( ta && (details.id != "note_DETAILS"))
        ta.value += (ta.value ? "\n":"") + text;

    //}}}
    // COPY TO CLIPBOARD {{{
    navigator.clipboard.writeText( text );

    //}}}
};
/*}}}*/
/*_ linkify_file_pathes {{{*/
let linkify_file_pathes = function()
{
    // location ● href ● folders {{{
// log {{{
//  let href          = "https://192.168.1.14:447/LAN/AHK/HIDCONTROL/AHK/HID/DEV_VID_PID_AXIS.ahk";
//}}}
    let href          = document.location.href;
    let root          = href  .replace(/^(.*\/\/[^\/]*)\/.*/, "$1");    // up to first /
    let file          = href  .replace(/^.*\/(.*)$/           , "$1");  // after last  /
    let folder        = href  .substr(root.length);                     // after first /
        folder        = folder.substr(0, folder.length -file.length);   // before file
    let folders       = folder.split("/").filter(Boolean);              // remove falsy items
// log href root file folder {{{
//console.log("➔ href   = ["+href+"]");
//console.log("➔ root   = ["+root+"]");
//console.log("➔ file   = ["+file+"]");
//console.log("%c folder = ["+ folder+"]", "color: yellow");
//console.log("%c folders: "+ String(folders).padStart(47) ,"background-color: #000; color: #F0F");
//console.log("🟤🔴🟠🟡🟢🔵🟣⚫⚪️");
//}}}
    //}}}
    // CONTENT PATH ➔ ANCHOR ELEMENT {{{
    let innerHTML = "";
    let       pre = document.querySelector("PRE");
    let     lines = pre.innerHTML.split("\n");
    lines.forEach((line) => {

//┌────────────────────────────────────────────────────────────────────────────┐
//│ REBASE FULLY QUALIFIED HREF
//└────────────────────────────────────────────────────────────────────────────┘
/* merging {{{

CURRENT FOLDER PATH:       https://192.168.1.14:447/SERVER/scripts/js_linkify.js

| location / file_path   | overlapping sub-folders parsing                       |
| - -------- - --------- | ----------------------------------------------------- |
| ● *CURRENT FOLDER PATH | https://192.168.1.14:447/SERVER/scripts               |
| + *RELATIVE FILE PATH* |                          SERVER/scripts/js_linkify.js |
| =                    ➔ | https://192.168.1.14:447/SERVER/scripts/js_linkify.js |

}}}*/
        // 1. RE-BASE FILES: ahk, md, css, js {{{
        if(   line.match(/\/\w+\.ahk/)
           || line.match(/\/\w+\.md/ )
           || line.match(/\/\w+\.css/)
           || line.match(/\/\w+\.js/ )
          ) {
            let path     = line
                .replace(/^.*\s(\S+\.(ahk|md|css|js)).*$/g, "$1")
                .replace(                          /.*\"/ ,   "") // i.e. [require("./server0_log.js]
                .replace(                       /<\/?td>/g,   "") // i.e. [require("./server0_log.js]
            ;

            // ROOTED FILE NAME {{{
            let a_href;
            if( path.startsWith("/") )
            {
                a_href = root + path;
            }
            //}}}
            // ... OR PARSE SUB FOLDER {{{
            else {
                let parents  = path.split("/").filter(Boolean);  // remove falsy items

                let fileName = parents.pop();

                let up_count =  0;
                let sub_fold = "";
                let      f;
                let      p;
                for(     f  = folders.length-1
                    ,    p  = parents.length-1
                    ;   (f >= 0) && (p >= 0)
                    ;  --f       , --p
                   ) {
                    // current dir is current parent {{{
                    if(parents[p] == ".")
                    {
                        sub_fold   = folders[f] +"/"+ sub_fold;
                        up_count  += 1;
                    }
                    //}}}
                    // ...going deeper {{{
                    else if(folders[f] != parents[p])
                    {
                        up_count  += 1;
                        sub_fold   = parents[p] +"/"+ sub_fold;
                    }
                    //}}}
                }
                a_href      = root +"/";

                for(     f  = 0; f < (folders.length - up_count); ++f)
                    a_href += folders[f] +"/";

                a_href     += sub_fold + fileName;
            }
            //}}}

            let a = "<a href='"+ a_href +"'>"+path+"</a>";
            innerHTML += line.replace(path, a) +"\n";
        }
        //}}}
        // 2. A HREF {{{
        else if(line.includes("http") && !line.includes("href"))
        {
            // URL IN A markdown table {{{
            //.........................(111111)(222222)(33333333)
            let matches = line.match(/^( *<td>)(http.*)(<\/td> *)$/);  // @see /SERVER/server5_content.js markdown table to html
            if( matches ) {
                let url = matches[2];
                let   a = "<a href='"+url+"'>"+url+"</a>";
                innerHTML += matches[1]+ a + matches[3]+"\n";
            }
            //}}}
            // or we have a blank or EOL at end of http url {{{
            else {
                innerHTML += line.replace(/(https?:\/\/[^>|<|\s]+)(>|<|\s|$)/, "<a href='$1'>$1</a>$2") +"\n";
                //.......................................................................▲▲..▲▲....▲▲
                ///////////////////////////(SCHEME_____URL_______)(BOUNDARY)....<aaaaaaaaaaaaaaaaa>BOUNDARY
            }
        }
        //}}}
        // 3. ALL OTHER LINES {{{
        else {
            innerHTML += line +"\n";
        }
        //}}}
    });
    pre.innerHTML = innerHTML;
    //}}}
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ FOLDING                                                                    │
//└────────────────────────────────────────────────────────────────────────────┘
/*➔ fold_close_open_toggle {{{*/
let fold_close_open_toggle = function(e,state)
{
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
//console.log("%c"+ el.firstElementChild.textContent, "color: "+BG[level%10]); // i.e. SUMMARY

        //┌────────────────────────────────────────────────────────────────────────┐
        //│ [state==2] => toggle first state ..and set siblings state likewise.    │
        //└────────────────────────────────────────────────────────────────────────┘
        if(state==2) state = !el.open;
        el.open            =  state;
        count += 1;
    }
    if( count ) {
            e.cancelBubble             = true;
        if( e.stopPropagation          ) event.stopPropagation         ();
        if( e.stopImmediatePropagation ) event.stopImmediatePropagation();
        if( e.preventDefault           ) event.preventDefault          ();
    }
//console.log("%c "+ (count ? count:"NO") +" fold"+ (count>1 ? "s":"") +" "+ ((state==0) ? "closed" : ((state==1) ? "opened":"toggled") +" "), "background-color: "+BG[count]);

    return count;
};
/*}}}*/

// PUBLIC {{{
    return { onload
        ,    copy_container_text    // exposed to onclick
        ,    fold_close_open_toggle // exposed to onclick
        ,    toggle_wrap            // exposed to onclick
    };

/*}}}*/
})();
export { js_linkify }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_linkify = js_linkify; // exposed to onclick
document.addEventListener("DOMContentLoaded", js_linkify.onload);
