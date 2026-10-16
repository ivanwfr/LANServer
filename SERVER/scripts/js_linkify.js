//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_linkify.js   ● $APROJECTS/LANServer/SERVER        ● _TAG (261014:18h:00)
//├────────────────────────────────────────────────────────────────────────────┤
//│ 🟤 ecc colorize details>summary
//│ 🟤 linkify relative source-file-path in comments
//│ @see SERVER/style/qtext.css
//│ @see SERVER/style/notes.css
//└────────────────────────────────────────────────────────────────────────────┘
/* IMPORT {{{*/

/* global js_folds */
/* global js_input */

//port { js_CNTRL   } from "./js_CNTRL.js"
//port { js_MODEL   } from "./js_MODEL.js"
//port { js_VIEW    } from "./js_VIEW.js"
//port { js_boxing  } from "./js_boxing.js"
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
    for(let summary of document.querySelectorAll("summary")) {
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
                + "<em onclick='js_linkify.fold_close_open_toggle(event, 2);'"
                + "      class='em_fold'"
                + "      style='float:right; margin-left: 2em;'"
                + ">▶◀</em>&nbsp;"

                + "<em onclick='js_linkify.copy_container_text(event); return false;'" // i.e. cancelBubble
                + "      title='● copy TITLE into NOTE INPUT below\n&\n● copy TEXT to CLIPBOARD'"
                + "      class='em_copy'"
                + "      style='float:right; margin-left: 2em;'"
                + ">⬜</em>&nbsp;"

                + "<em onclick='js_linkify.toggle_check(event); return false;'"
                + "      title='✓\n check\n this section'"
                + "      style='float:left; margin-left: 1em;'"
                + "    class='em_check'"
                + ">✓</em>&nbsp;"

                + "<em onclick='js_linkify.toggle_wrap(event); return false;'"
                + "      title='▶◀\nnarrow\ncols-\wrap'"
                + "      style='float:left; margin-left: 3em;'"
                + "    class='em_wrap'"
                + ">↷</em>&nbsp;"

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
//│ REBASE FULLY QUALIFIED HREF
//└────────────────────────────────────────────────────────────────────────────┘
/* USE-CASE {{{

 | CURRENT FOLDER PATH    | https://192.168.1.14:447/SERVER/scripts/js_linkify.js
 | ---------------------- | ----------------------------------------------------- |
 | LOCATION / FILE_PATH   | OVERLAPPING SUB-FOLDERS PARSING                       |
 |                        |                                                       |
 | ● *CURRENT FOLDER PATH | https://192.168.1.14:447/SERVER/scripts               |
 |                        |                                                       |
 | + *RELATIVE FILE PATH* |                          SERVER/scripts/js_linkify.js |
 |                        |                                                       |
 | =                    ➔ | https://192.168.1.14:447/SERVER/scripts/js_linkify.js |

 🖐 URI may contain SPACES to encode:
 "https://192.168.1.14:447/Z_LOCAL/W10/Users/ivan/Documents/Elder Scrolls Online"

}}}*/
/*_ linkify_file_pathes {{{*/
let linkify_file_pathes = function()
{
// log {{{
//  let href          = "https://192.168.1.14:447/LAN/AHK/HIDCONTROL/AHK/HID/DEV_VID_PID_AXIS.ahk";

    let href          = document.location.href;
    let root          = href  .replace(/^(.*\/\/[^\/]*)\/.*/, "$1");  // up to first '/'
    let file          = href  .replace(/^.*\/(.*)$/         , "$1");  // after last  '/'
    let folder        = href  .substr(root.length);                   // after first '/'
        folder        = folder.substr(0, folder.length -file.length); // before file
    let folders       = folder.split("/").filter(Boolean);            // remove falsy items

// log {{{
//console.log("➔ href   = ["+href+"]");
//console.log("➔ root   = ["+root+"]");
//console.log("➔ file   = ["+file+"]");
//console.log("%c folder = ["+ folder+"]", "color: yellow");
//console.log("%c folders: "+ String(folders).padStart(47) ,"background-color: #000; color: #F0F");
//console.log("🟤🔴🟠🟡🟢🔵🟣⚫⚪️");
//}}}
    //}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PRE CONTAINING [BARE FILE OR FOLDER PATH] TO [HTML ANCHOR]
    //└────────────────────────────────────────────────────────────────────────┘
    let innerHTML = "";
    let       pre = document.querySelector("PRE");
    let     lines = pre.innerHTML.split("\n");
    lines.forEach((line) => {
        // 1/2. http (no href) ➔ MAKE A *<a href='url'>url</a>* {{{
        if(line.includes("http") && !line.includes("href"))
        {
            // URL IN A markdown table ● requires some syntax sanitation {{{
            //.........................(111111)(222222)(33333333)
            let matches = line.match(/^( *<td>)(http.*)(<\/td> *)$/);  // @see /SERVER/server5_content.js markdown table to html
            if( matches ) {
                let url = matches[2];
                let   a = "<a href='"+ encodeURI(url) +"'>"+url+"</a>";
                line    = matches[1]+ a + matches[3]+"\n";
            }
            //}}}
            // well recognized URL {{{
            else {
                //┌────────────────────────────────────────────────────────────┐
                //│ When there is a BLANK or EOL at the end of an http URL
                //│ ●
                //│ matches[000000000000000000000000000000000000000]
                //│ matches[11][222222222222222222222][33333333][44]
                //│ ..... head  SCHEME_____URL_______  ___bound  tail
                //│ .....   ▼▼  ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼  ▼▼▼▼▼▼▼▼  ▼▼
                //│ ....(/^(.*)(https?:\/\/[^>|<|\s]+)(>|<|\s|$)(.*)
                //│ ●
                //└────────────────────────────────────────────────────────────┘
                matches = line.match(/^(.*["'`])(https?:\/\/[^>|<]+)(["'`].*)/)
                ||        line.match(/^(.*)(https?:\/\/[^>|<|\s]+)(>|<|\s|$)(.*)/)
                ;
                if( matches ) {
                    let  head  = matches[1];
                    let   url  = matches[2];
                    let bound  = matches[3];
                    let tail   = matches[4] || "";

                    line       = head
                        +       "<a href='"+ encodeURI(url) +"'>"
                        +        url
                        +       "</a>"
                        +        bound
                        +        tail
                        +       "\n";
                }
            }
            //}}}
        }
        //}}}
        // 2/2 - FILE WITH SUPPORTED EXTENSION FILES: ahk, css, js, md... {{{
        else if(   line.match(/\/\w+\.ahk/)
                || line.match(/\/\w+\.asp/)
                || line.match(/\/\w+\.awk/)
                || line.match(/\/\w+\.css/)
                || line.match(/\/\w+\.js/ )
                || line.match(/\/\w+\.lua/)
                || line.match(/\/\w+\.md/ )
                || line.match(/\/\w+\.tmc/)
                || line.match(/\/\w+\.vim/)
                || line.match(/\/\w+\.log/)
          ) {
            /* [path] {{{*/
            // PICK:
            // - FROM AFTER A MANDATORY ( SPACE       )
            // - ...................ALL [ NON-SPACES  ]
            // - .................UP TO [ MIME-SUFFIX ]
            let path
                = line
            //..................[111111111111111111111111111111111111]
            //........................[22222222222222222222222222222]
                . replace(/^.*\s(\S+\.(ahk|asp|awk|css|js|log|lua|md|tmc|vim)).*$/g, "$1")
                . replace(                                      /.*[\"'`]/ ,   "")
                . replace(                                       /<\/?td>/g,   "")
                ;
            /*}}}*/
            //┌────────────────────────────────────────────────────────────────┐
            //│ 1/2 [path] A ROOTED NAME
            //└────────────────────────────────────────────────────────────────┘
            //{{{
            let a_href;
            if( path.startsWith("/") )
            {
                a_href = root + path;
            }
            //}}}
            //┌────────────────────────────────────────────────────────────────┐
            //│ 2/2 [path] SUB FOLDERS TO PARSE
            //└────────────────────────────────────────────────────────────────┘
            //{{{
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
                    // going deeper... {{{
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
            //┌────────────────────────────────────────────────────────────────┐
            //│ [a_href] ... encodeURI
            //└────────────────────────────────────────────────────────────────┘
            //{{{
            let a = "<a href='"+ encodeURI(a_href) +"'>"+path+"</a>";
            line  = line.replace(path, a) +"\n";
            //}}}
        }
        //}}}
        innerHTML  += line +"\n";
    });
    pre.innerHTML = innerHTML;
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
        ,    toggle_check           // exposed to onclick
        ,    toggle_wrap            // exposed to onclick
    };

/*}}}*/
})();
export { js_linkify }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_linkify = js_linkify; // exposed to onclick
document.addEventListener("DOMContentLoaded", js_linkify.onload);
