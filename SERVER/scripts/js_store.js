//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_store.js      ● $APROJECTS/LANServer/SERVER      ● _TAG (260925:01h:31) │
//└────────────────────────────────────────────────────────────────────────────┘
/* jshint esversion: 9, laxbreak:true, laxcomma:true, boss:true {{{*/

/* eslint-disable no-unused-vars */

/*}}}*/
let js_store = (function() { /* eslint-disable-line no-unused-vars */
let log_this = false;

//┌────────────────────────────────────────────────────────────────────────────┐
//│ ● set ● get ● del
//└────────────────────────────────────────────────────────────────────────────┘
//{{{
let setItem = function(key, val) {          try { if(val)  localStorage.setItem   (key,val); else localStorage.removeItem(key); } catch(ex) {} return val; }; /* eslint-disable-line no-empty */
let getItem = function(key     ) { let val; try {    val = localStorage.getItem   (key    );                                    } catch(ex) {} return val; }; /* eslint-disable-line no-empty */
let delItem = function(key     ) {          try { /*...*/  localStorage.removeItem(key    );                                    } catch(ex) {}             }; /* eslint-disable-line no-empty */
//}}}

//┌────────────────────────────────────────────────────────────────────────────┐
//│ Page title or URL signature                                                │
//└────────────────────────────────────────────────────────────────────────────┘
/*  get_page_prefix {{{*/
let     page_prefix = "";
let get_page_prefix = function()
{
    if(!page_prefix )
    {
        /* FROM PAGE TITLE */
        let title = document.querySelector("TITLE");
        if( title ) {
            page_prefix
                = title.textContent
                .  replace(/.*● */g,  "")
                .  replace(/\s/g   , "_")
            ;
        }

        /* FROM LOCATION */
        else {
            page_prefix
                = document.URL.replace(/(.*\/)|(\..*)/g,"");
        }

    }
    return page_prefix;
};
/*}}}*/
/*_ get_page_storage_key ● get_page_fileName {{{*/
/*{{{*/
let parsed_location_href;
/*}}}*/
let get_page_storage_key = function()
{
    if(   !parsed_location_href ) parse_location_href();
    return parsed_location_href.page_storage_key;
};
let get_page_fileName = function()
{
    if(   !parsed_location_href ) parse_location_href();
    return parsed_location_href.fileName;
};

let parse_location_href = function()
{
if(log_this) console.log("◯ get_page_storage_key");

    let matches
        = location.href
        .  match(/(^.*\/\/[^\/]*)\/(.*)\/(.*)/ ,  "");
    //┌───────────▲────────────────▲─────▲─────────────────────────────────────┐
    //│           |                |     |                                     │
    //│           |                |     (js_notes.js)                         │
    //│           |                (APROJECTS_USR_SERVER_scripts/js_notes.js   │
    //│           (https://192.168.1.14:447)                                   │
    //└────────────────────────────────────────────────────────────────────────┘
    let baseName         = matches[1].replace(/\W+/g, "_");
    let pathName         = matches[2].replace(/\W+/g, "_");
    let fileName         = matches[3].replace(/\W+/g, "_");
    let page_storage_key = (pathName+"__"+fileName);

/*{{{*/
if(log_this) {
    console.log("◯ baseName         \t\t["+ baseName          +"]\n"
               +"◯ pathName         \t\t["+ pathName          +"]\n"
               +"◯ fileName         \t\t["+ fileName          +"]\n"
               +"◯ page_storage_key \t\t["+ page_storage_key  +"]\n");
}
/*}}}*/

    parsed_location_href = { baseName , pathName , fileName , page_storage_key };
};
/*}}}*/


/* EXPORT {{{*/
return {  name : "js_store"

    ,     localStorage_setItem : (key, val) => setItem(get_page_prefix() +"."+ key, val)
    ,     localStorage_getItem : (key     ) => getItem(get_page_prefix() +"."+ key     )
    ,     localStorage_delItem : (key     ) => delItem(get_page_prefix() +"."+ key     )

    ,     get_page_fileName
    ,     get_page_prefix
    ,     get_page_storage_key
    ,     parse_location_href

};
/*}}}*/
})();
