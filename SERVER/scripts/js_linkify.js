//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_linkify.js   ● $APROJECTS/LANServer/SERVER        ● _TAG (261020:01h:09)
//├────────────────────────────────────────────────────────────────────────────┤
//│ 🟤 ecc colorize details>summary
//│ 🟤 linkify relative source-file-path in comments
//│ @see SERVER/style/to_html.css
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
//port { url_to_href} from "./url_to_href.js"

/*}}}*/
let js_linkify  = (function() {
/*➔ onload {{{*/
let onload  = function()
{
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

//┌────────────────────────────────────────────────────────────────────────────┐
//│ REBASE FULLY QUALIFIED HREF
//└────────────────────────────────────────────────────────────────────────────┘
/*_ linkify_file_pathes {{{*/
let linkify_file_pathes = function()
{
    //FIXME COMMENT
    url_to_href.basename_clear();

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PRE CONTAINING [BARE FILE OR FOLDER PATH] TO [HTML ANCHOR]
    //└────────────────────────────────────────────────────────────────────────┘
    let innerHTML = "";
    let       pre = document.querySelector("PRE");
    let     lines = pre.innerHTML.split("\n");
    lines.forEach((line) => {
        line = url_to_href.line_url_to_href( line );
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
//│ url_to_href.js                                       ● _TAG (261019:19h:43)
//└────────────────────────────────────────────────────────────────────────────┘
let url_to_href = (function() {
// RGX_EXT_ARRAY ● RGX_EXT ● basename {{{
const RGX_EXT_ARRAY
    = [ "ahk"
      , "asp"
      , "awk"
      , "css"
      , "js"
      , "json"
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
/*_ line_url_to_href {{{*/
let line_url_to_href = function(line, href_arg)
{
//if(href_arg) console.log("url_to_href.line_url_to_href("+href_arg+")");
// log {{{
    let href
        = (typeof document != "undefined")
        ?         document.location.href
        : href_arg;
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
        let s = "";
        RGX_EXT_ARRAY.forEach((ext) => s += "|"+ext);
        s = s.substr(1);
        RGX_EXT = new RegExp("([\/\\a-z_A-Z0-9]+\\.("+s+"))","g");
//console.log("RGX_EXT:", RGX_EXT);
    }
    //}}}

    // set or clear basename
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ .......................11...............22222222..33...................
    //└────────────────────────▼▼───────────────▼▼▼▼▼▼▼▼──▼▼───────────────────┘
    let matches = line.match(/(.*)basename *= *([^\s<>]*)(.*)/);
    if( matches ) {
//console.log("\n"+line);
//console.log("matches[1]=["+matches[1]+"]");
//console.log("matches[2]=["+matches[2]+"]");
//console.log("matches[3]=["+matches[3]+"]");
        basename = matches[2];

        let ttl = "URL basename: "+ (basename ? "Folder ["+basename+"]"  : "Cleared");
        let tag =                   (basename ?       "🟢 in "+basename : "⚫"     );
        return matches[1]
            +  "<span class='basename' title='"+ttl+"'>"+tag+"</span>"
            +  matches[3]
        ;
    }

    let l_trim = line  .trim();
        l_trim = l_trim.replace(  /<[^>]*>/g,"").trim();
        l_trim = l_trim.replace(/\?to_html/ ,"").trim();
//console.log("l_trim=["+l_trim+"]");//FIXME

    //┌────────────────────────────────────────────────────────────────────────────┐
    //│ 1/2. http (no href) ➔ MAKE A *<a href='url'>url</a>*
    //└────────────────────────────────────────────────────────────────────────────┘
    let matched;
    if(line.includes("http") && !line.includes("href"))
    {
        line = line_a_from_http_no_href( line );
    }
    //┌────────────────────────────────────────────────────────────────────────────┐
    //│ 2/2 - FILE WITH SUPPORTED EXTENSION FILES: ahk, css, js, md...
    //└────────────────────────────────────────────────────────────────────────────┘
    else if(matched = line_match_supported_extension( l_trim ))
    {
//console.log("\n%c"+ line, "background-color: #400");

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
//console.log("%c● path=["+path+"]", "color: #0F0");

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
//console.log("p=["+p+"]");//FIXME
                a_href = parse_sub_folders(href, root, basename, p);
            }
            else {
                a_href = parse_sub_folders(href, root, folder, path);
            }
//console.log("%c● a_href=["+a_href+"]", "color: #F06");
        }
        //}}}

        //┌────────────────────────────────────────────────────────────────┐
        //│ [a_href] ... encodeURI
        //└────────────────────────────────────────────────────────────────┘
        //{{{
        let  q = (line.includes("?to_html") || a_href_to_html_array.includes( a_href )) ? "?to_html":"";

        if(  q && !a_href_to_html_array.includes( a_href ))
                   a_href_to_html_array.push    ( a_href );

        let  a = "<a href='"+ encodeURI(a_href) + q +"'>"+path+"</a>";
//console.log("- a=["+a+"]");

        let  p = line.includes(q) ? (path + q) : path;
//console.log("- p=["+p+"]");

        line   = line.replace(p, a);
//console.log(  "...p=["+p+"]");
//console.log(  "line=["+line+"]\n@@@\n");
//console.log("%c"+ a_href, "background-color: #040");
//console.log("%c"+ line  , "background-color: #040");
//console.log("%c"+ line  , "background-color: #822");
        //}}}
    }
    return line;
};
/*}}}*/
/*_ parse_sub_folders {{{*/
let parse_sub_folders = function(href, root, folder, path)
{
    let folders       = folder.split("/").filter(Boolean);            // remove falsy items
    //console.log("%c folders: "+ String(folders).padStart(47) ,"background-color: #000; color: #F0F");

    let parents  = path.split("/").filter(Boolean);  // remove falsy items

    let fileName = parents.pop();
//console.log("%c● fileName=["+fileName+"]", "background-color: #066");

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
//console.log("%c● sub_fold\=["+sub_fold+"]", "background-color: #660");

    let a_href  = root +"/";
    for(     f  = 0; f < (folders.length - up_count); ++f)
        a_href += folders[f] +"/";
    a_href     += sub_fold + fileName;

    return a_href;
};
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
        =  l_trim.match(/\/\w+\/$/) // FOLDER
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
        ,    linkify_file_pathes

        ,    copy_container_text    // exposed to onclick
        ,    fold_close_open_toggle // exposed to onclick
        ,    toggle_check           // exposed to onclick
        ,    toggle_wrap            // exposed to onclick
    };
//}}}
/*}}}*/
})();
export { js_linkify }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_linkify = js_linkify; // exposed to onclick
document.addEventListener("DOMContentLoaded", js_linkify.onload);
