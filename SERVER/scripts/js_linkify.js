//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_linkify.js   ● $APROJECTS/LANServer/SERVER       ● _TAG (260914:03h:57) │
//├────────────────────────────────────────────────────────────────────────────┤
//│ 🟤 ecc colorize details>summary                                            │
//│ 🟤 linkify relative source-file-path in comments                           │
//└────────────────────────────────────────────────────────────────────────────┘
/* jshint esversion: 9, laxbreak:true, laxcomma:true, boss:true */ /*{{{*/

/* global js_fold */

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
const BG = [
  "#00000080"
, "#964B00A0"
, "#FF0000A0"
, "#FFA500A0"
, "#FFFF00A0"
, "#9ACD32A0"
, "#6495EDA0"
, "#EE82EEA0"
, "#A0A0A0A0"
, "#FFFFFFA0"
, "#F0F0F0F0"
];
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
      //el.firstElementChild.style.backgroundColor = BG[color_num]; //BG[depth+1];
        el.firstElementChild.style.fontWeight      = 900;
        el.firstElementChild.style.fontSize        = "120%";
    }
};
/*}}}*/
/*_ format_summary_comments {{{*/
let format_summary_comments = function()
{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ trimming, summary copy button, fold button                             │
    //└────────────────────────────────────────────────────────────────────────┘
    for(let el of document.querySelectorAll("summary")) {
        // COMMENTS TRIMMING {{{
        el.textContent
            = el.textContent
                .replace(/\/\//, "")
                .replace(/\/\*/, "")
                .replace(/\*\//, "")
              ;

        //}}}
        // COPY TO CLIPBOARD AND FOLDING BUTTONS {{{
//      if( el.innerHTML.trim() ) // FOLD_OPEN comments with no text may have DETAILS children
            el.innerHTML
                = el.innerHTML
                + "<em "
                + "   style = 'float:right; opacity:0.5; margin-left: 2em;'"
                + " onclick = 'js_linkify.fold_open_012(event, 2);'"
                + ">▶◀</em>"
                + "&nbsp;"
                + "<em "
                + "   style = 'float:right; opacity:0.5; margin-left: 2em;'"
                + " onclick = 'js_linkify.copy_summary_text(event); return false;'" // i.e. cancelBubble
                + ">📝</em>"
            ;
        //}}}
    }
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ HIDE FOLD BUTTON FOR DETAILS WITH NO EMBEDDED FOLDS TO OPEN            │
    //└────────────────────────────────────────────────────────────────────────┘
    //{{{
    document.querySelectorAll("DETAILS:not(:has(DETAILS))").forEach((el) => {
        let child =    el.firstElementChild;
        child     = child && child.firstElementChild;
        if( child ) child.style.visibility = "hidden"; // fold EM
    });
    //}}}
};
/*}}}*/
/*➔ copy_summary_text {{{*/
/*{{{*/
let note_input_TEXTAREA;
/*}}}*/
let copy_summary_text = function(e)
{
    e.cancelBubble = true;
    // SUMMARY
/*{{{
    let text
        = e.target.parentElement
        .   childNodes[0].textContent
        .   substr(1).trim();  // skip button name
}}}*/
    let summary = e.target.closest("SUMMARY");
    let details = summary.parentElement;
    if(!note_input_TEXTAREA)  note_input_TEXTAREA = document.getElementById("note_input_TEXTAREA");

    // TEXT SOURCE
    let text
        =  (details.id == "note_DETAILS")
        &&  note_input_TEXTAREA
        ?   note_input_TEXTAREA.value   // [NOTE    TEXT TO CLIPBOARD]
        :   summary.textContent;        // [SUMMARY TEXT TO CLIPBOARD]

    // COPY TO RELEVANT TEXT AREA
    let ta = note_input_TEXTAREA || details.querySelector("TEXTAREA");

    // APPEND TEXT TO TEXTAREA
    if( ta && (details.id != "note_DETAILS"))
        ta.value += (ta.value ? "\n":"") + text;

    // COPY TO CLIPBOARD
    navigator.clipboard.writeText( text );

};
/*}}}*/
/*_ linkify_file_pathes {{{*/
let linkify_file_pathes = function()
{
//console.log("LINKIFY:");

    let href          = document.location.href;
//  let href          = "https://192.168.1.14:447/LAN/AHK/HIDCONTROL/AHK/HID/DEV_VID_PID_AXIS.ahk";

    let root          = href  .replace(/^(.*\/\/[^\/]*)\/.*/, "$1"); // up to first /
    let file          = href  .replace(/^.*\/(.*)$/           , "$1"); // after last  /
    let folder        = href  .substr(root.length);                     // after first /
        folder        = folder.substr(0, folder.length -file.length);   // before file
    let folders       = folder.split("/").filter(Boolean);              // remove falsy items
//{{{
//console.log("➔ href   = ["+href+"]");
//console.log("➔ root   = ["+root+"]");
//console.log("➔ file   = ["+file+"]");
//console.log("%c folder = ["+ folder+"]", "color: yellow");
//console.log("%c folders: "+ String(folders).padStart(47) ,"background-color: #000; color: #F0F");
//console.log("🟤🔴🟠🟡🟢🔵🟣⚫⚪️");
//}}}

    let innerHTML = "";
    let pre   = document.querySelector("PRE");
    let lines = pre.innerHTML.split("\n");
    lines.forEach((line) => {
        if(line.includes(".ahk"))
        {
            let path     = line.replace(/^.*\s(\S+\.ahk).*$/g, "$1");
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
                if(folders[f] != parents[p]) {
                    up_count  += 1;
                    sub_fold   = parents[p] +"/"+ sub_fold;
                }
            }
            let a_href  = root +"/";
            for(     f  = 0; f < (folders.length - up_count); ++f)
                a_href += folders[f] +"/";

            a_href     += sub_fold + fileName;

//{{{
//console.log("%c "          +        path     .padEnd(48)
//           +"%c "          + String(parents ).padEnd(24)
//           +"%c "          +        up_count
//           +"%c "          +        a_href
//           ,"background-color: #000; color: #F00"
//           ,"background-color: #000; color: #F0F"
//           ,"background-color: #222; color: #0FF"
//           ,"background-color: #00F; color: #FF0"
//           );
//}}}
//{{{
//console.log(                       line         );
//console.log(".......path=["+       path     +"]");
//console.log("....parents=["+String(parents) +"]");
//console.log("...up_count=["+       up_count +"]");
//console.log(".....a_href=["+       a_href   +"]");
//}}}

            let a = "<a href='"+ a_href +"'>"+path+"</a>";
            innerHTML += line.replace(path, a) +"\n";
        }
        else if(line.includes("http") && !line.includes("href"))
        {
            innerHTML += line.replace(/(https?:\/\/\S*)/, "<a href='$1'> $1 </a>") +"\n";
        }
        else {
            innerHTML += line +"\n";
        }
    });
    pre.innerHTML = innerHTML;
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ FOLDING                                                                    │
//└────────────────────────────────────────────────────────────────────────────┘
/*➔ fold_open_012 {{{*/
let fold_open_012 = function(e,state)
{
    let   container = e.target;

    if(  !container )   container =           document;
    while(container && (container.tagName !=  "DETAILS")) container = container.parentElement;
    if(  !container || (container.tagName !=  "DETAILS")) return false; // may bubble up

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PREVENT CLOSING DETAILS                                                │
    //└────────────────────────────────────────────────────────────────────────┘
    js_fold.set_shiftLatched(  true );

    container.open = true;
    let el_array = container.querySelectorAll("DETAILS");
    let    count = 0;
    for(let el of el_array)
    {
//console.log("%c"+ el.firstElementChild.textContent, "color: "+BG[level%10]); // i.e. SUMMARY
        el.open = (state==0) ? false
            :     (state==1) ? true
            :                 !el.open;
        count += 1;
    }
    if( count ) {
            e.cancelBubble             = true;
        if( e.stopPropagation          ) event.stopPropagation         ();
        if( e.stopImmediatePropagation ) event.stopImmediatePropagation();
        if( e.preventDefault           ) event.preventDefault          ();
    }
console.log("%c "+ (count ? count:"NO") +" fold"+ (count>1 ? "s":"") +" "+ ((state==0) ? "closed" : ((state==1) ? "opened":"toggled") +" "), "background-color: "+BG[count]);

    return count;
};
/*}}}*/
// js_xpath {{{
let js_xpath  = (function() {
/*➔ get_nodeXPath {{{*/
let get_nodeXPath = function(node)
{
    if(node instanceof Document) return "/";

    let  node_type_pos_array;
    for( node_type_pos_array = []
    ;    node && !(node instanceof Document)
    ;    node =   (node.nodeType == Node.ATTRIBUTE_NODE)
              ?    node.ownerElement
              :    node.parentNode
    ) {
        let node_type_pos = {};

        /* TYPE */
        switch( node.nodeType ) {
            case Node.TEXT_NODE                   : node_type_pos.name =                   "text()" ; break;
            case Node.ATTRIBUTE_NODE              : node_type_pos.name =       "@" + node.nodeName  ; break;
            case Node.PROCESSING_INSTRUCTION_NODE : node_type_pos.name = "processing-instruction()" ; break;
            case Node.COMMENT_NODE                : node_type_pos.name =                "comment()" ; break;
            case Node.ELEMENT_NODE                : node_type_pos.name =             node.nodeName  ; break;
        }

        /* POS */
        node_type_pos.position = get_sibling_rank( node );

        node_type_pos_array.push( node_type_pos );
    }

    let nodeXPath = "";
    for(let i=node_type_pos_array.length-1; i >= 0; i -= 1)
    {
        let node_type_pos   = node_type_pos_array[i];
        nodeXPath += node_type_pos.name ? ("/"+node_type_pos.name) : ".";
        if((node_type_pos.position != null) && (node_type_pos.position != "1"))
            nodeXPath += "["+ node_type_pos.position+"]";
    }

    return nodeXPath.toLowerCase();
};
/*}}}*/
/*➔ get_nodeXPath_target {{{*/
let get_nodeXPath_target = function(nodeXPath)
{
    let first_node;
    try {

        let evaluator  = new XPathEvaluator();
        let expression = evaluator.createExpression(nodeXPath);

        let result     = expression.evaluate(document, XPathResult.ORDERED_NODE_ITERATOR_TYPE);

        let node;
        while(node = result.iterateNext())
        {
            if(!first_node)
                first_node = node;
        }

    }
    catch(ex) {
        console.log(ex);
    }
    return first_node;
};
/*}}}*/
/*_ get_sibling_rank ● siblings of same type (i.e. DIV, DETAILS, ...) {{{*/
let get_sibling_rank = function(node)
{
    if(node.nodeType == Node.ATTRIBUTE_NODE) return null;

    let rank = 1;
    for(let prev_node =      node.previousElementSibling
    ;       prev_node
    ;       prev_node = prev_node.previousElementSibling
    ) {
        if(prev_node.nodeName == node.nodeName)
            rank += 1;
    }
    return rank;
 };
/*}}}*/
/*_ get_parent_rank ● parent of same type (i.e. DIV, DETAILS, ...) {{{*/
let get_parent_rank = function(parent,node)
{
    if(node.nodeType == Node.ATTRIBUTE_NODE) return null;

    let rank = 0;
    for(let prev_node =        node.parentElement
    ;       prev_node && (prev_node != parent)
    ;       prev_node =   prev_node.parentElement
    ) {
        if(prev_node.nodeName == node.nodeName)
            rank += 1;
    }
    return rank;
 };
/*}}}*/
//{{{
return { get_nodeXPath
    ,    get_nodeXPath_target
    ,    get_sibling_rank
    ,    get_parent_rank
};

/*}}}*/
})();
//}}}

// PUBLIC {{{
    return { onload
        ,    copy_summary_text
        ,    fold_open_012
        // DEBUG
        , js_xpath
    };

/*}}}*/
})();

document.addEventListener("DOMContentLoaded", js_linkify.onload);
