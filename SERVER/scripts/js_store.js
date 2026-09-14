//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_store.js      ● $APROJECTS/LANServer/SERVER      ● _TAG (260913:23h:22) │
//└────────────────────────────────────────────────────────────────────────────┘
let js_store = (function() { /* eslint-disable-line no-unused-vars */
/* jshint esversion: 9, laxbreak:true, laxcomma:true, boss:true {{{*/

/* eslint-disable no-unused-vars */

/*}}}*/

/* ● set ● get ● del {{{*/
let setItem = function(key, val) {          try { if(val)  localStorage.setItem   (key,val); else localStorage.removeItem(key); } catch(ex) {} return val; }; /* eslint-disable-line no-empty */
let getItem = function(key     ) { let val; try {    val = localStorage.getItem   (key    );                                    } catch(ex) {} return val; }; /* eslint-disable-line no-empty */
let delItem = function(key     ) {          try { /*...*/  localStorage.removeItem(key    );                                    } catch(ex) {}             }; /* eslint-disable-line no-empty */
/*}}}*/

// ┌───────────────────────────────────────────────────────────────────────────┐
// │ Page title or URL signature                                               │
// └───────────────────────────────────────────────────────────────────────────┘
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

/* EXPORT {{{*/
return {  name : "js_store"
    ,            localStorage_setItem : (key, val) => setItem(get_page_prefix() +"."+ key, val)
    ,            localStorage_getItem : (key     ) => getItem(get_page_prefix() +"."+ key     )
    ,            localStorage_delItem : (key     ) => delItem(get_page_prefix() +"."+ key     )
    // DEBUG
    , get_page_prefix
};
/*}}}*/
})();
