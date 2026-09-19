//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_log.js        ● $APROJECTS/LANServer/SERVER      ● _TAG (260919:11h:03) │
//└────────────────────────────────────────────────────────────────────────────┘
/* dom_log_js */
/* jshint esversion: 9, laxbreak:true, laxcomma:true, boss:true {{{*/
/* eslint-disable no-redeclare              */
/* globals console, setTimeout, clearTimeout */
/* globals document, window, HTMLElement */
/* globals dom_data   */
/* globals dom_select */ /* OPTIONAL */
/* globals dom_store  */ /* OPTIONAL */
/* globals dom_tools  */ /* OPTIONAL */
/* globals dom_util   */
/* globals dom_grid   */

// exported DOM_LOG_JS_TAG */

/* eslint-disable no-warning-comments */
/* eslint-disable prefer-spread */
/* eslint-disable prefer-rest-params */
/* eslint-enable  no-redeclare              */

/*nst DOM_LOG_JS_ID         = "dom_log_js";
/*nst DOM_LOG_JS_TAG        = DOM_LOG_JS_ID  +" (240602:02h:12)";
/*}}}*/
let dom_log     = (function() {
//"use strict";
let   DOM_LOG_LOG           = false;
let   DOM_LOG_TAG           = false;
/* IMPORT */
/*{{{*/
/* eslint-disable no-unused-vars */
/*➔ t_log_IMPORT {{{*/
/* t_data t_util {{{*/
/*....................................*/
let t_data     = {}        ;    /* 05 */
/*  t_log      = {}        ; */ /* 06 */
let t_util     = {}        ;    /* 07 */
/*  t_i18n     = {}        ; */ /* 08 */
/*  t_prop     = {}        ; */ /* 09 */
let t_store    = {}        ;    /* 10 */
/*  t_fly      = {}        ; */ /* 11 */
/* ...................................*/
/*  t_wording  = {}        ; */ /* 12 */
/*  t_select   = {}        ; */ /* 13 */
/*  t_slot     = {}        ; */ /* 14 */
/* ...................................*/
/*  t_hide     = {}        ; */ /* 15 */
/*  t_view     = {}        ; */ /* 16 */
/*  t_sticky   = {}        ; */ /* 17 */
/*  t_seek     = {}        ; */ /* 18 */
/*  t_share    = {}        ; */ /* 19 */
/* ...................................*/
/*  t_grid     = {}        ; */ /* 20 */
/*  t_gutter   = {}        ; */ /* 21 */
/* ...................................*/
/*  t_ipc      = {}        ; */ /* 22 */
/*  t_tools    = {}        ; */ /* 23 */
/*....................................*/
/*}}}*/
let t_log_IMPORT  = function(log_this)
{
/* t_data t_util {{{*/
/* ...................................*/
    t_data    = dom_data   ;    /* 05 */
/*  t_log     = dom_log    ; */ /* 06 */
    t_util    = dom_util   ;    /* 07 */
/*  t_i18n    = dom_i18n   ; */ /* 08 */
/*  t_prop    = dom_prop   ; */ /* 09 */
    t_store   = dom_store  ;    /* 10 */
/*  t_fly     = dom_fly    ; */ /* 11 */
/* ...................................*/
/*  t_wording = dom_wording; */ /* 12 */
/*  t_select  = dom_select ; */ /* 13 */
/*  t_wot     = dom_wot    ; */ /* 13 */
/*  t_slot    = dom_slot   ; */ /* 14 */
/* ...................................*/
/*  t_hide    = dom_hide   ; */ /* 15 */
/*  t_view    = dom_view   ; */ /* 16 */
/*  t_sticky  = dom_sticky ; */ /* 17 */
/*  t_seek    = dom_seek   ; */ /* 18 */
/*  t_share   = dom_share  ; */ /* 19 */
/* ...................................*/
/*  t_grid    = dom_grid   ; */ /* 20 */
/*  t_gutter  = dom_gutter ; */ /* 21 */
/* ...................................*/
/*  t_ipc     = dom_ipc    ; */ /* 22 */
/*  t_tools   = dom_tools  ; */ /* 23 */
/* ...................................*/
/*}}}*/
    log_INTERN();
    /* MODULE LOGGING TAGGING {{{*/
    DOM_LOG_LOG = DOM_LOG_LOG || dom_store.t_store_getItem("DOM_LOG_LOG");
    DOM_LOG_TAG = DOM_LOG_TAG || dom_store.t_store_getItem("DOM_LOG_TAG");

    /*}}}*/
if(log_this) log("%c 06 log", lbH+lf6);
};
/*}}}*/
/*_   log_INTERN {{{*/
/* t_data t_util {{{*/

/* t_data */
let   L_CHK  =         "✔ "; /* EXPORTED */
let   L_NEW  =         "☀ "; /* EXPORTED */

let   L_ARD  =         "↓ ";
let   L_ARL  = "        ← "; /* EXPORTED */ /* eslint-disable-line no-tabs */
let   L_ARR  =         "→ "; /* EXPORTED */
let   L_ARU  =         "↑ ";

let   L_CLR  =         "✘ ";
let   L_FNC  =         "f ";
let   L_WRN  =         "‼ ";

/* t_util stubs */
let add_el_class                = function(   ) {  };
let csv_add                     = function(c,v) { return (c ? (c+","+v) : v); };
let del_el_class                = function(   ) {  };
let ellipsis                    = function(t  ) { return t; };
let get_id_or_tag               = function(p  ) { return p; };
let get_id_or_tag_and_className = function(v  ) { return v; };
let get_n_lbl                   = function(n  ) { return (n ? n.tagName : "null_node"); }; /* eslint-disable-line no-unused-vars */
let get_node_path               = function(s  ) { return s; };
let get_node_path_tail          = function(t  ) { return t; };
let mPadEnd                     = function(s  ) { return s; };
let mPadStart                   = function(s  ) { return s; };
let not_an_anchor_target        = function(s  ) { return s; };
let strip_CR_LF                 = function(t  ) { return t; };
let strip_HTML                  = function(t  ) { return t; };
let strip_console_formatting    = function(t  ) { return t; };
let strip_pat                   = function(t  ) { return t; };

/*}}}*/
let   log_INTERN = function()
{
    /* t_data {{{*/

    L_ARD =                       dom_data.SYMBOL_DOWN_ARROW   +" ";
    L_ARL =         dom_data.TAB+ dom_data.SYMBOL_LEFT_ARROW   +" ";
    L_ARR =                       dom_data.SYMBOL_RIGHT_ARROW  +" ";
    L_ARU =                       dom_data.SYMBOL_UP_ARROW     +" ";

    L_CHK =                       dom_data.SYMBOL_CHECK_MARK   +" ";
    L_CLR =                       dom_data.SYMBOL_HEAVY_BALLOT +" ";
    L_FNC =                       dom_data.SYMBOL_FUNCTION     +" ";
    L_NEW =                       dom_data.SYMBOL_BLACK_SUN    +" ";
    L_WRN =                       dom_data.SYMBOL_WARNING      +" ";

    /*}}}*/
    /* t_util {{{*/

    /* DOM-UTIL */
    add_el_class                = t_util.add_el_class;
    del_el_class                = t_util.del_el_class;
    ellipsis                    = t_util.ellipsis;
    get_n_lbl                   = t_util.get_n_lbl;
    get_id_or_tag               = t_util.get_id_or_tag;
    get_id_or_tag_and_className = t_util.get_id_or_tag_and_className;
    get_node_path_tail          = t_util.get_node_path_tail;

    /* STRINGS-UTIL */
    mPadStart                   = t_util.mPadStart;
    mPadEnd                     = t_util.mPadEnd;
    strip_CR_LF                 = t_util.strip_CR_LF;
    strip_HTML                  = t_util.strip_HTML;
    strip_console_formatting    = t_util.strip_console_formatting;
    strip_pat                   = t_util.strip_pat;

    /*}}}*/
};
/*}}}*/
/* eslint-enable no-unused-vars */
/*}}}*/
/*➔ log_IMPORT {{{*/
let log_IMPORT = function() /* eslint-disable-line complexity */
{
    /*............................................................................*/ let d = "  defined";
    let  s;                                    let l;        let n;          let r;  let u = "undefined";

/* 05 */ s = (typeof dom_data    !== "undefined");  n="DATA   ";  l=s ? 5:2;  r=s ? d:u;  log("%c 05 %c"+n+"%c"+r, lfX[5], lbH+lfX[5], lfX[l]);
/* 06 */ s = (typeof dom_log     !== "undefined");  n="LOG    ";  l=s ? 5:2;  r=s ? d:u;  log("%c 06 %c"+n+"%c"+r, lfX[6], lbH+lfX[6], lfX[l]);
/* 07 */ s = (typeof dom_util    !== "undefined");  n="UTIL   ";  l=s ? 5:2;  r=s ? d:u;  log("%c 07 %c"+n+"%c"+r, lfX[7], lbH+lfX[7], lfX[l]);
/* 08 */ s = (typeof dom_prop    !== "undefined");  n="PROP   ";  l=s ? 5:2;  r=s ? d:u;  log("%c 08 %c"+n+"%c"+r, lfX[8], lbH+lfX[8], lfX[l]);
/* 09 */ s = (typeof dom_store   !== "undefined");  n="STORE  ";  l=s ? 5:2;  r=s ? d:u;  log("%c 09 %c"+n+"%c"+r, lfX[9], lbH+lfX[9], lfX[l]);
/* 10 */ s = (typeof dom_fly     !== "undefined");  n="FLY    ";  l=s ? 5:2;  r=s ? d:u;  log("%c 10 %c"+n+"%c"+r, lfX[0], lbH+lfX[0], lfX[l]);

/* 11 */ s = (typeof dom_wording !== "undefined");  n="WORDING";  l=s ? 5:2;  r=s ? d:u;  log("%c 11 %c"+n+"%c"+r, lfX[1], lbH+lfX[1], lfX[l]);
/* 12 */ s = (typeof dom_select  !== "undefined");  n="SELECT ";  l=s ? 5:2;  r=s ? d:u;  log("%c 12 %c"+n+"%c"+r, lfX[2], lbH+lfX[2], lfX[l]);
/* 12 */ s = (typeof dom_wot     !== "undefined");  n="WOT    ";  l=s ? 5:2;  r=s ? d:u;  log("%c 12 %c"+n+"%c"+r, lfX[2], lbH+lfX[2], lfX[l]);
/* 13 */ s = (typeof dom_slot    !== "undefined");  n="SLOT   ";  l=s ? 5:2;  r=s ? d:u;  log("%c 13 %c"+n+"%c"+r, lfX[3], lbH+lfX[3], lfX[l]);

/* 14 */ s = (typeof dom_hide    !== "undefined");  n="HIDE   ";  l=s ? 5:2;  r=s ? d:u;  log("%c 14 %c"+n+"%c"+r, lfX[4], lbH+lfX[4], lfX[l]);
/* 15 */ s = (typeof dom_view    !== "undefined");  n="VIEW   ";  l=s ? 5:2;  r=s ? d:u;  log("%c 15 %c"+n+"%c"+r, lfX[5], lbH+lfX[5], lfX[l]);
/* 16 */ s = (typeof dom_sticky  !== "undefined");  n="STICKY ";  l=s ? 5:2;  r=s ? d:u;  log("%c 16 %c"+n+"%c"+r, lfX[6], lbH+lfX[6], lfX[l]);
/* 17 */ s = (typeof dom_seek    !== "undefined");  n="SEEK   ";  l=s ? 5:2;  r=s ? d:u;  log("%c 17 %c"+n+"%c"+r, lfX[7], lbH+lfX[7], lfX[l]);
/* 18 */ s = (typeof dom_share   !== "undefined");  n="SHARE  ";  l=s ? 5:2;  r=s ? d:u;  log("%c 18 %c"+n+"%c"+r, lfX[8], lbH+lfX[8], lfX[l]);

/* 19 */ s = (typeof dom_grid    !== "undefined");  n="GRID   ";  l=s ? 5:2;  r=s ? d:u;  log("%c 19 %c"+n+"%c"+r, lfX[9], lbH+lfX[9], lfX[l]);
/* 20 */ s = (typeof dom_gutter  !== "undefined");  n="GUTTER ";  l=s ? 5:2;  r=s ? d:u;  log("%c 20 %c"+n+"%c"+r, lfX[0], lbH+lfX[0], lfX[l]);

/* 21 */ s = (typeof dom_ipc     !== "undefined");  n="IPC    ";  l=s ? 5:2;  r=s ? d:u;  log("%c 21 %c"+n+"%c"+r, lfX[1], lbH+lfX[1], lfX[l]);
/* 22 */ s = (typeof dom_tools   !== "undefined");  n="TOOLS  ";  l=s ? 5:2;  r=s ? d:u;  log("%c 22 %c"+n+"%c"+r, lfX[2], lbH+lfX[2], lfX[l]);

};
/*}}}*/

/* ┌────────────────────────────────────────────────────────────────────────┐ */
/* │ LOG DATA                                                               │ */
/* └────────────────────────────────────────────────────────────────────────┘ */
/*➔ dom_log_STRING {{{*/
const dom_log_STRING
    = {   L_ARL
        , L_ARR
        , L_CHK
        , L_NEW
    };

/*}}}*/
/*➔ dom_log_CSS {{{*/
const lbA  = "background-color:inherit;   color:inherit;";

const lbF  = "font-size:120%; font-weight:500; border:2px solid white;";
const lbb  = "font-size:150%; font-weight:100; margin:0 0 0 0;";
const lbB  = "font-size:300%; font-weight:100; margin:0 0 0 0;";
const lbS  = "font-size:500%; font-weight:100; margin:0 0 0 0;";

const lbH  = "font-weight:900; line-height:1.5em; border:1px solid gray; margin:   0 1ex 1ex   0; padding:0 .5em 0 .5em; border-radius:1em 1em 1em 1em; background:linear-gradient(to bottom, #555 0%, #223 80%, #454 100%);";
const lbL  = "font-weight:900; line-height:1.5em; border:1px solid gray; margin:   0   0   0 1ex; padding:0 .5em 0 .5em; border-radius:1em   0   0 1em; background:linear-gradient(to   left, #333 0%           ,#445 100%);";
const lbR  = "font-weight:900; line-height:1.5em; border:1px solid gray; margin:   0 1ex   0   0; padding:0 .5em 0 .5em; border-radius:  0 1em 1em   0; background:linear-gradient(to  right, #333 0%           ,#544 100%);";
const lbC  = "font-weight:900; line-height:1.5em; border:1px solid gray; margin:   0   0   0   0; padding:0 .5em 0 .5em; border-radius:  0   0   0   0;";

/*const lmL  =  "margin-left: 5em;";*/ /* TODO: patch with $APROJECTS/Chrome_Web_Store/RTabsExtension/javascript/log.js */

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
const lbX = [ lb0 ,lb1 ,lb2 ,lb3 ,lb4 ,lb5 ,lb6 ,lb7 ,lb8 ,lb9 ];

const lf1  = "color:#964B00;";
const lf2  = "color:#FF0000;";
const lf3  = "color:#FFA500;";
const lf4  = "color:#FFFF00;";
const lf5  = "color:#9ACD32;";
const lf6  = "color:#6495ED;";
const lf7  = "color:#EE82EE;";
const lf8  = "color:#A0A0A0;";
const lf9  = "color:#FFFFFF;";
const lf0  = "color:#707070; text-shadow:#000 2px 2px 1px;"; /* offset-x offset-y blur-radius */
const lfX  = [ lf0 ,lf1 ,lf2 ,lf3 ,lf4 ,lf5 ,lf6 ,lf7 ,lf8 ,lf9 ];

const dom_log_CSS
    = {   LOG_BG_CSS : { lb0, lb1, lb2, lb3, lb4, lb5, lb6, lb7, lb8, lb9, lbX }
        , LOG_FG_CSS : { lf0, lf1, lf2, lf3, lf4, lf5, lf6, lf7, lf8, lf9, lfX }
        , LOG_XX_CSS : { lbA, lbB, lbC, lbF, lbH, lbL, lbR, lbS, lbb           }
/*{{{
/\vlbA|lbB|lbC|lbF|lbH|lbL|lbR|lbS|lbb/
:grep -l '(lbA\|lbB\|lbC\|lbF\|lbH\|lbL\|lbR\|lbS\|lbb).*LOG_'
:grep -l '\.lbH'
}}}*/
    };
/*}}}*/
/*➔ dom_log_CHAR {{{*/
const BACKSLASH = String.fromCharCode(92);
const FORESLASH = String.fromCharCode(47);
const LF        = String.fromCharCode(10);
const CS        = "font-size:200%; color: gray; background:black; border:3px solid gray; border-radius:1em; padding:0 1em; font-style:oblique;";
const SHV       = "\u26A1"; /* HIGH VOLTAGE SIGN ⚡*/

const dom_log_CHAR
    = {   BACKSLASH
        , FORESLASH
        , LF
        , CS
    };

/*}}}*/

/* ┌────────────────────────────────────────────────────────────────────────┐ */
/* │ LOG ACTIVATION                                                         │ */
/* └────────────────────────────────────────────────────────────────────────┘ */
/*➔ dom_LOG_MAP {{{*/
/* LOG_MAP {{{*/
const LOG_MAP = {

    EV0_LISTEN     : false,
    EV1_DOWN       : false,
    EV2_MOVE       : false,
    EV3_UP         : false,
    EV4_LONG_PRESS : false,
    EV5_TOOL_CB    : false,
    EV6_CHANGED    : false,
    EV7_DISPATCH   : false,
    EV8_FLOATLOG   : false,

    S0_PATTERN     : false,
    S1_RANGE       : false,
    S2_SELECT      : false,
    S3_SLOT        : false,
    T0_STORE       : false,

    T1_DOM_LOAD    : false,
    T2_GRID        : false,
    T3_LAYOUT      : false,
    T4_PIVOT       : false,
    T5_SPREAD      : false,
    T6_SLOT        : false,
    T7_SHARE       : false,
    T8_TOOLBAR     : false,

    IPC_LOG        : false

   };
/* }}} */
/*➔ logging_load_LOG_MAP .. f(dom_store) {{{*/
let logging_load_LOG_MAP = function()
{
    if(typeof dom_store   === "undefined") return;

    /*.................*/let get = dom_store.t_store_getBool;

    LOG_MAP.EV0_LISTEN     = get( "EV0_LISTEN"     );
    LOG_MAP.EV1_DOWN       = get( "EV1_DOWN"       );
    LOG_MAP.EV2_MOVE       = get( "EV2_MOVE"       );
    LOG_MAP.EV3_UP         = get( "EV3_UP"         );
    LOG_MAP.EV4_LONG_PRESS = get( "EV4_LONG_PRESS" );
    LOG_MAP.EV5_TOOL_CB    = get( "EV5_TOOL_CB"    );
    LOG_MAP.EV6_CHANGED    = get( "EV6_CHANGED"    );
    LOG_MAP.EV7_DISPATCH   = get( "EV7_DISPATCH"   );
    LOG_MAP.EV8_FLOATLOG   = get( "EV8_FLOATLOG"   );

    LOG_MAP.S0_PATTERN     = get( "S0_PATTERN"     );
    LOG_MAP.S1_RANGE       = get( "S1_RANGE"       );
    LOG_MAP.S2_SELECT      = get( "S2_SELECT"      );
    LOG_MAP.S3_SLOT        = get( "S3_SLOT"        );

    LOG_MAP.T0_STORE       = get( "T0_STORE"       );
    LOG_MAP.T1_DOM_LOAD    = get( "T1_DOM_LOAD"    );
    LOG_MAP.T2_GRID        = get( "T2_GRID"        );
    LOG_MAP.T3_LAYOUT      = get( "T3_LAYOUT"      );
    LOG_MAP.T4_PIVOT       = get( "T4_PIVOT"       );
    LOG_MAP.T5_SPREAD      = get( "T5_SPREAD"      );
    LOG_MAP.T6_SLOT        = get( "T6_SLOT"        );
    LOG_MAP.T7_SHARE       = get( "T7_SHARE"       );
    LOG_MAP.T8_TOOLBAR     = get( "T8_TOOLBAR"     );

    LOG_MAP.IPC_LOG        = get( "IPC_LOG"        );
};
/*}}}*/
/*➔ logging_toggle .. f(dom_store) {{{ */
let logging_toggle = function(keyword) /* eslint-disable-line complexity */
{
let caller = "logging_toggle("+keyword+")";
log(caller);

    if(typeof dom_store  === "undefined") return false;

    let changed = ""; /*.....................................................*/ let set = dom_store.t_store_set_state;

    switch( keyword ) {
    /* EVENT */
        case "EV0_LISTEN"      : LOG_MAP.EV0_LISTEN     = !LOG_MAP.EV0_LISTEN     ; set("EV0_LISTEN"         , LOG_MAP.EV0_LISTEN     ); changed = keyword+"="+LOG_MAP.EV0_LISTEN    ; break;
        case "EV1_DOWN"        : LOG_MAP.EV1_DOWN       = !LOG_MAP.EV1_DOWN       ; set("EV1_DOWN"           , LOG_MAP.EV1_DOWN       ); changed = keyword+"="+LOG_MAP.EV1_DOWN      ; break;
        case "EV2_MOVE"        : LOG_MAP.EV2_MOVE       = !LOG_MAP.EV2_MOVE       ; set("EV2_MOVE"           , LOG_MAP.EV2_MOVE       ); changed = keyword+"="+LOG_MAP.EV2_MOVE      ; break;
        case "EV3_UP"          : LOG_MAP.EV3_UP         = !LOG_MAP.EV3_UP         ; set("EV3_UP"             , LOG_MAP.EV3_UP         ); changed = keyword+"="+LOG_MAP.EV3_UP        ; break;
        case "EV4_LONG_PRESS"  : LOG_MAP.EV4_LONG_PRESS = !LOG_MAP.EV4_LONG_PRESS ; set("EV4_LONG_PRESS"     , LOG_MAP.EV4_LONG_PRESS ); changed = keyword+"="+LOG_MAP.EV4_LONG_PRESS; break;
        case "EV5_TOOL_CB"     : LOG_MAP.EV5_TOOL_CB    = !LOG_MAP.EV5_TOOL_CB    ; set("EV5_TOOL_CB"        , LOG_MAP.EV5_TOOL_CB    ); changed = keyword+"="+LOG_MAP.EV5_TOOL_CB   ; break;
        case "EV6_CHANGED"     : LOG_MAP.EV6_CHANGED    = !LOG_MAP.EV6_CHANGED    ; set("EV6_CHANGED"        , LOG_MAP.EV6_CHANGED    ); changed = keyword+"="+LOG_MAP.EV6_CHANGED   ; break;
        case "EV7_DISPATCH"    : LOG_MAP.EV7_DISPATCH   = !LOG_MAP.EV7_DISPATCH   ; set("EV7_DISPATCH"       , LOG_MAP.EV7_DISPATCH   ); changed = keyword+"="+LOG_MAP.EV7_DISPATCH  ; break;
        case "EV8_FLOATLOG"    : LOG_MAP.EV8_FLOATLOG   = !LOG_MAP.EV8_FLOATLOG   ; set("EV8_FLOATLOG"       , LOG_MAP.EV8_FLOATLOG   ); changed = keyword+"="+LOG_MAP.EV8_FLOATLOG  ; break;

    /* SELECT */
        case "S0_PATTERN"      : LOG_MAP.S0_PATTERN     = !LOG_MAP.S0_PATTERN     ; set("S0_PATTERN"         , LOG_MAP.S0_PATTERN     ); changed = keyword+"="+LOG_MAP.S0_PATTERN    ; break;
        case "S1_RANGE"        : LOG_MAP.S1_RANGE       = !LOG_MAP.S1_RANGE       ; set("S1_RANGE"           , LOG_MAP.S1_RANGE       ); changed = keyword+"="+LOG_MAP.S1_RANGE      ; break;
        case "S2_SELECT"       : LOG_MAP.S2_SELECT      = !LOG_MAP.S2_SELECT      ; set("S2_SELECT"          , LOG_MAP.S2_SELECT      ); changed = keyword+"="+LOG_MAP.S2_SELECT     ; break;
        case "S3_SLOT"         : LOG_MAP.S3_SLOT        = !LOG_MAP.S3_SLOT        ; set("S3_SLOT"            , LOG_MAP.S3_SLOT        ); changed = keyword+"="+LOG_MAP.S3_SLOT       ; break;

    /* TOOL */
        case "T0_STORE"        : LOG_MAP.T0_STORE       = !LOG_MAP.T0_STORE       ; set("T0_STORE"           , LOG_MAP.T0_STORE       ); changed = keyword+"="+LOG_MAP.T0_STORE      ; break;
        case "T1_DOM_LOAD"     : LOG_MAP.T1_DOM_LOAD    = !LOG_MAP.T1_DOM_LOAD    ; set("T1_DOM_LOAD"        , LOG_MAP.T1_DOM_LOAD    ); changed = keyword+"="+LOG_MAP.T1_DOM_LOAD   ; break;
        case "T2_GRID"         : LOG_MAP.T2_GRID        = !LOG_MAP.T2_GRID        ; set("T2_GRID"            , LOG_MAP.T2_GRID        ); changed = keyword+"="+LOG_MAP.T2_GRID       ; break;
        case "T3_LAYOUT"       : LOG_MAP.T3_LAYOUT      = !LOG_MAP.T3_LAYOUT      ; set("T3_LAYOUT"          , LOG_MAP.T3_LAYOUT      ); changed = keyword+"="+LOG_MAP.T3_LAYOUT     ; break;
        case "T4_PIVOT"        : LOG_MAP.T4_PIVOT       = !LOG_MAP.T4_PIVOT       ; set("T4_PIVOT"           , LOG_MAP.T4_PIVOT       ); changed = keyword+"="+LOG_MAP.T4_PIVOT      ; break;
        case "T5_SPREAD"       : LOG_MAP.T5_SPREAD      = !LOG_MAP.T5_SPREAD      ; set("T5_SPREAD"          , LOG_MAP.T5_SPREAD      ); changed = keyword+"="+LOG_MAP.T5_SPREAD     ; break;
        case "T6_SLOT"         : LOG_MAP.T6_SLOT        = !LOG_MAP.T6_SLOT        ; set("T6_SLOT"            , LOG_MAP.T6_SLOT        ); changed = keyword+"="+LOG_MAP.T6_SLOT       ; break;
        case "T7_SHARE"        : LOG_MAP.T7_SHARE       = !LOG_MAP.T7_SHARE       ; set("T7_SHARE"           , LOG_MAP.T7_SHARE       ); changed = keyword+"="+LOG_MAP.T7_SHARE      ; break;
        case "T8_TOOLBAR"      : LOG_MAP.T8_TOOLBAR     = !LOG_MAP.T8_TOOLBAR     ; set("T8_TOOLBAR"         , LOG_MAP.T8_TOOLBAR     ); changed = keyword+"="+LOG_MAP.T8_TOOLBAR    ; break;

    /* IPC */
        case "IPC_LOG"         : LOG_MAP.IPC_LOG        = !LOG_MAP.IPC_LOG        ; set("IPC_LOG"            , LOG_MAP.IPC_LOG        ); changed = keyword+"="+LOG_MAP.IPC_LOG       ; break;
    }

log_TR_LAYOUT_add("<em class='big'>TOGGLE LOGGING ["+ keyword +"] changed=["+changed+"]</em>");
    return changed;
};
/* }}} */
/*➔ logging_something {{{*/
let logging_something = function()
{
/*{{{
    if(onDown_SHIFT) return false;
}}}*/

    return  LOG_MAP.EV0_LISTEN
        ||  LOG_MAP.EV1_DOWN
        ||  LOG_MAP.EV2_MOVE
        ||  LOG_MAP.EV3_UP
        ||  LOG_MAP.EV4_LONG_PRESS
        ||  LOG_MAP.EV5_TOOL_CB
        ||  LOG_MAP.EV6_CHANGED
        ||  LOG_MAP.EV7_DISPATCH

/*{{{
        ||  LOG_MAP.EV8_FLOATLOG
}}}*/

/*{{{
        ||  LOG_MAP.S0_PATTERN
}}}*/
        ||  LOG_MAP.S1_RANGE
        ||  LOG_MAP.S2_SELECT
        ||  LOG_MAP.S3_SLOT

/*{{{
        ||  LOG_MAP.T0_STORE
}}}*/

        ||  LOG_MAP.T1_DOM_LOAD
        ||  LOG_MAP.T2_GRID
        ||  LOG_MAP.T3_LAYOUT
        ||  LOG_MAP.T4_PIVOT
        ||  LOG_MAP.T5_SPREAD
        ||  LOG_MAP.T6_SLOT
        ||  LOG_MAP.T7_SHARE
        ||  LOG_MAP.T8_TOOLBAR

        ||  LOG_MAP.IPC_LOG
    ;
};
/*}}}*/

const dom_LOG_MAP
    = {   LOG_MAP
        , logging_load_LOG_MAP
        , logging_toggle
        , logging_something
    };
/*}}}*/

/* ┌────────────────────────────────────────────────────────────────────────┐ */
/* │ CONSOLE                                                                │ */
/* └────────────────────────────────────────────────────────────────────────┘ */
/*➔ dom_log_console {{{*/

const console_clear = function(  msg=null) { console_clear_post(msg); };
/*_ console_clear_post {{{*/
/*{{{*/
const CONSOLE_CLEAR_COOLDOWN_DELAY = 1000;

let console_clear_cooldown_timeout;
/*}}}*/
let console_clear_post = function(msg=null)
{
    if( console_clear_cooldown_timeout )
    {
        if( msg )
            console.log("%c cleared by "+SHV+msg+SHV+" %c LOG PRESERVED FOR "+CONSOLE_CLEAR_COOLDOWN_DELAY+"ms", CS, lbH+lf8);
    }
    else {
        console.clear();
        if( msg )
            console.log("%c cleared by "+SHV+msg+SHV, CS);

        console_clear_cooldown_timeout
            = setTimeout( function() { console_clear_cooldown_timeout = null; }
                        , CONSOLE_CLEAR_COOLDOWN_DELAY);
    }
};
/*}}}*/

const console_table = function(o,msg=null) {                  if(msg) console.log ("%c"+msg+":"  ,CS); console.table(o); };
const console_log   = function(  msg     ) {                          console.log (     msg         );                   };
const console_warn  = function(  msg=null) {                          console.warn(     msg         );                   };
const console_dir   = function(a1,a2=null) {
    let o   = (a2) ? a2 : a1;
    let msg = (a2) ? a1 : null;
    if( msg )
        console.log ("%c"+msg+":",CS);
    console.dir  (o);
};

const dom_log_console
    = {   console_clear
        , console_clear_post
        , console_dir
        , console_log
        , console_table
        , console_warn
    };
/*}}}*/

/* ┌────────────────────────────────────────────────────────────────────────┐ */
/* │ LOG FORMATTING                                                         │ */
/* └────────────────────────────────────────────────────────────────────────┘ */
/*➔ dom_log_SYM_DIGIT {{{*/

let logSD0 = function(          format, ...args) { _logSD(dom_data.SD0, lf0, format, ...args); };
let logSD1 = function(          format, ...args) { _logSD(dom_data.SD1, lf1, format, ...args); };
let logSD2 = function(          format, ...args) { _logSD(dom_data.SD2, lf2, format, ...args); };
let logSD3 = function(          format, ...args) { _logSD(dom_data.SD3, lf3, format, ...args); };
let logSD4 = function(          format, ...args) { _logSD(dom_data.SD4, lf4, format, ...args); };
let logSD5 = function(          format, ...args) { _logSD(dom_data.SD5, lf5, format, ...args); };
let logSD6 = function(          format, ...args) { _logSD(dom_data.SD6, lf6, format, ...args); };
let logSD7 = function(          format, ...args) { _logSD(dom_data.SD7, lf7, format, ...args); };
let logSD8 = function(          format, ...args) { _logSD(dom_data.SD8, lf8, format, ...args); };
let logSD9 = function(          format, ...args) { _logSD(dom_data.SD9, lf9, format, ...args); };
let _logSD = function(sym, lfx, format, ...args) { console.log("%c "+sym+"%c"+format, lbS+lfx, lbA, ...args); };

const dom_log_SYM_DIGIT
    = {   logSD0
        , logSD1
        , logSD2
        , logSD3
        , logSD4
        , logSD5
        , logSD6
        , logSD7
        , logSD8
        , logSD9
    };

/*}}}*/

/* ┌────────────────────────────────────────────────────────────────────────┐ */
/* │ LOG DATA TYPES                                                         │ */
/* └────────────────────────────────────────────────────────────────────────┘ */
/*{{{*/

/* LOG TRACE */
/*➔ dom_log_log {{{*/
/*{{{*/

const STYLE_TOP = "font-weight:900; border:0px #000 solid; border-radius:2em 2em .1em .1em; padding:  0 1em 1em 2em; overflow:visible;";
const STYLE_BOT = "color:#FFF;      border:0px #000 solid; border-radius:.1em .1em 2em 2em; padding:1em 1em 0em 2em; overflow:visible;";
const STYLE_ERR = "color:#F00; font-size:200%; font-weight:900; background-color:#400; border:1px #F00 solid; border-radius:1em; padding:.1em; overflow:visible;";

const STYLE_BG_TOP=[];
      STYLE_BG_TOP [1] = " background:linear-gradient(to bottom, #964B0080 0%, #2222 100%);";
      STYLE_BG_TOP [2] = " background:linear-gradient(to bottom, #FF000080 0%, #2222 100%);";
      STYLE_BG_TOP [3] = " background:linear-gradient(to bottom, #FFA50080 0%, #2222 100%);";
      STYLE_BG_TOP [4] = " background:linear-gradient(to bottom, #FFFF0080 0%, #2222 100%);";
      STYLE_BG_TOP [5] = " background:linear-gradient(to bottom, #9ACD3280 0%, #2222 100%);";
      STYLE_BG_TOP [6] = " background:linear-gradient(to bottom, #6495ED80 0%, #2222 100%);";
      STYLE_BG_TOP [7] = " background:linear-gradient(to bottom, #EE82EE80 0%, #2222 100%);";
      STYLE_BG_TOP [8] = " background:linear-gradient(to bottom, #A0A0A080 0%, #2222 100%);";
      STYLE_BG_TOP [9] = " background:linear-gradient(to bottom, #FFFFFF80 0%, #2222 100%);";
      STYLE_BG_TOP [0] = " background:linear-gradient(to bottom, #00000080 0%, #2222 100%);";

const STYLE_BG_BOT=[];
      STYLE_BG_BOT [1] = " background:linear-gradient(to    top, #964B0080 0%, #2222 100%);";
      STYLE_BG_BOT [2] = " background:linear-gradient(to    top, #FF000080 0%, #2222 100%);";
      STYLE_BG_BOT [3] = " background:linear-gradient(to    top, #FFA50080 0%, #2222 100%);";
      STYLE_BG_BOT [4] = " background:linear-gradient(to    top, #FFFF0080 0%, #2222 100%);";
      STYLE_BG_BOT [5] = " background:linear-gradient(to    top, #9ACD3280 0%, #2222 100%);";
      STYLE_BG_BOT [6] = " background:linear-gradient(to    top, #6495ED80 0%, #2222 100%);";
      STYLE_BG_BOT [7] = " background:linear-gradient(to    top, #EE82EE80 0%, #2222 100%);";
      STYLE_BG_BOT [8] = " background:linear-gradient(to    top, #A0A0A080 0%, #2222 100%);";
      STYLE_BG_BOT [9] = " background:linear-gradient(to    top, #FFFFFF80 0%, #2222 100%);";
      STYLE_BG_BOT [0] = " background:linear-gradient(to    top, #00000080 0%, #2222 100%);";


const SLC = "\u2B55"; /* HEAVY */
const SDO = [
 SLC
,SLC
,SLC+SLC
,SLC+SLC+SLC
,SLC+SLC+SLC+SLC
,SLC+SLC+SLC+SLC+SLC
,SLC+SLC+SLC+SLC+SLC+SLC
,SLC+SLC+SLC+SLC+SLC+SLC+SLC
,SLC+SLC+SLC+SLC+SLC+SLC+SLC+SLC
,SLC+SLC+SLC+SLC+SLC+SLC+SLC+SLC+SLC
];

let log_NUM = 0;

/*}}}*/
/*➔ log {{{ */
/*{{{*/
const LOG_MAX     = 50000;
const CLEAR       = "DEFAULT_TO_CLEAR";

let   log_HTML    =  "";
let   log_is_full = false;
/*}}}*/
let log = function(first_arg, ...args) /* eslint-disable-line complexity */
{
/*{{{
[Exception:
    TypeError: 'caller', 'callee', and 'arguments' properties
    may not be accessed on strict mode functions
    or the arguments objects
    for calls to them at Function.invokeGetter (<anonymous>:3:28)
]
console.log("log.prototype.caller=["+log.prototype.caller+"]");
console.dir(log);
}}}*/
if(DOM_LOG_LOG || DOM_LOG_TAG) log_caller();
    /* CLEAR {{{*/
    if     (!first_arg                        ) first_arg = CLEAR;
    /*}}}*/
    /* HTMLElement {{{*/
    else if( first_arg instanceof HTMLElement ) {
        console.log("%c"+get_id_or_tag_and_className(first_arg),lbH+lf9);
        return;
    }
    /*}}}*/
/* DEBUG TRACE TRAP {{{*/
/*{{{
if(first_arg.includes("RESIZING")) console.trace();
}}}*/
/*}}}*/
    /* [log_msg] {{{*/
    let log_msg = !first_arg ? CLEAR : String(first_arg).trim();

    /*}}}*/
/* [args] {{{
console.log("@@@")
console.log("@@@ log_msg=["+log_msg+"]")
for(let i=0; i < args.length; ++i) console.log("@@@ args["+i+"]=["+args[i]+"]");
console.log("@@@")
}}}*/
    /* [log_level] {{{*/
    let log_level
        =   log_is_full              ? "warn"
        : (!log_HTML && args.length) ? args[0]
/*{{{
        : (!log_HTML               ) ? "time"
        : (!log_HTML               ) ? "groupCollapsed"
        : (log_msg == CLEAR        ) ? "timeEnd"
        : (log_msg == CLEAR        ) ? "groupEnd"
}}}*/
        :                              "log"
    ;

/*{{{
console.log("@@@ log_level=["+log_level+"]")
}}}*/
    /*}}}*/
    /* console .. [log error warn info time group] {{{*/
    if(    (log_msg != CLEAR)
        && ((typeof console) != "undefined")
    ) {
        /* if(arguments[0]) arguments[0] = strip_HTML(arguments[0]);*/
/*{{{
console.log("@@@")
console.log("@@@ arguments[0]=["+arguments[0]+"]")
console.log("@@@")
}}}*/
        switch(log_level) {
            default              : console.log            .apply(console, Array.prototype.slice.call(arguments)); /*console.trace();*/ break;

            case "error"         : console.error          .apply(console, Array.prototype.slice.call(arguments)); break;
            case "warn"          : console.warn           .apply(console, Array.prototype.slice.call(arguments)); break;
            case "info"          : console.info           .apply(console, Array.prototype.slice.call(arguments)); break;

            case "time"          : console.time           .apply(console, "selection"                          ); break;
            case "timeEnd"       : console.timeEnd        .apply(console, "selection"                          ); break;
            case "groupEnd"      : console.groupEnd       .apply(console                                       ); break;
            case "group"         : console.group          .apply(console, Array.prototype.slice.call(arguments)); break;
            case "groupCollapsed": console.groupCollapsed .apply(console, Array.prototype.slice.call(arguments)); break;

        }
    }
    /*}}}*/
    /* CLEAR .. [log_is_full] {{{*/
    if(log_msg == CLEAR) {
        if(log_is_full) {
            if((typeof console) != "undefined") console.warn("log_is_full");
            log_is_full = false;
        }
        log_HTML = "";
    }
    /*}}}*/
    /* log_HTML ADD {{{*/
    else {
        log_HTML += LF+ strip_pat(log_msg,"%c\\log_msg*");
    }
    /*}}}*/
    /* log_is_full {{{*/
    if(log_HTML.length > LOG_MAX)
    {
        /* WARN ONCE .. (until next init)*/
        if(!log_is_full ) {
            log_is_full = true;
            if((typeof console) != "undefined") console.error("log_is_full: ...LOG_MAX=["+LOG_MAX+"]");
            if(DOM_LOG_LOG) debugger; /* eslint-disable-line no-debugger */
        }
        return;
    }
    /*}}}*/
};
/*}}}*/
/*➔ log_warn {{{*/
/*{{{*/
const LOG_WARN_COOLDOWN_DELAY = 2000;
const LOG_WARN_DIV            = "log_warn_div";
let   log_warn_timer;
let   log_warn_div;

/*}}}*/
let log_warn = function(caller, msg)
{
    console.warn("log_warn from %c"+caller+"%c .. %c"+strip_HTML(msg), lbH+lf5, lbA, lbH+lbb+lf4);
    /* [log_warn_div] {{{*/
    if(!log_warn_div) {
        let parent = document.body;
        if(!parent ) return;

        log_warn_div                          = document.createElement("DIV");
        log_warn_div.id                       = LOG_WARN_DIV;
        log_warn_div.className                = "big box_panel";
        log_warn_div.style.position           = "absolute";
        log_warn_div.style.background         = "rgba(191,191,191,0.9)";
        log_warn_div.style.transitionDuration = "250ms";
        parent.insertBefore(log_warn_div, parent.firstChild);
    }
    /*}}}*/
    /* SHOW {{{*/
    log_warn_div.innerHTML                    = msg;
    log_warn_div.style.top                    = "0px";
    log_warn_div.style.left                   = "0px";

    /*}}}*/
    /* HIDE {{{*/
    if(log_warn_timer) clearTimeout(log_warn_timer);
    log_warn_timer   =   setTimeout(log_warn_handler, LOG_WARN_COOLDOWN_DELAY);

    /*}}}*/
};

let log_warn_handler = function()
{
    log_warn_timer = null;
    log_warn_div.style.top  = (-2 * log_warn_div.offsetHeight)+"px"  ;
};
/*}}}*/
/*➔ logBIG {{{*/
let logBIG = function(msg, lfx=lf7)
{
    let lxx = (typeof lfx == "number")
        ?         lbb+lbH+lfX[lfx]              /* just the index   */
        :                     lfx;              /* or a color style */

    console.log("%c "+L_NEW+" %c "+msg, lbb+lbH+lf9, lxx);
};
/*}}}*/
/*➔ logXXX {{{*/
/*{{{*/
let logXXX_start_MS;

/*}}}*/
let logXXX = function()
{
/*{{{
    arguments[0] = "XXX "+arguments[0];
}}}*/
    /* onDown_MS .. f(dom_tools) {{{*/
    if((typeof dom_tools) != "undefined")
    {
        let onDown_MS = dom_tools.t_get_onDown_MS();
        let start_MS
            = (logXXX_start_MS > onDown_MS)
            ?  logXXX_start_MS
            :  onDown_MS;

        logXXX_start_MS = new Date().getTime();

        let elapsed_MS
            = start_MS
            ? (logXXX_start_MS - start_MS)
            : 0;

        /*{{{
        if(elapsed_MS && (elapsed_MS < 50)) {
            console.log("%c XXX ",lb4);
            console.trace();
        }
        }}}*/

        arguments[0] = "XXX ["+elapsed_MS+"] "+arguments[0];
    }
    else {
        arguments[0] = "XXX "                 +arguments[0];
    }
    /*}}}*/
    console.log.apply(console, Array.prototype.slice.call(arguments));
};
/*}}}*/

/*➔ log_TOP {{{*/
let log_TOP = function(arg_line, lfx)
{
    /* get color-num from color-array index */
    if(!arg_line) arg_line = "";
    let num = (lfx  != undefined) ? lfX.indexOf(lfx) : -1;

    /* auto-increment next fold color-num */
    if( num < 0)
    {
        log_NUM  = (log_NUM+1) % 10;
        num          = log_NUM;
    }


    let l_1 =       lbB +          lfX[num];
    let l_2 = STYLE_TOP + STYLE_BG_TOP[num];
    let sym =                      SDO[num];
    let txt =               strip_HTML(arg_line);

    console.groupCollapsed( "%c"+sym +"%c "+txt,l_1,l_2);
};
/*}}}*/
/*➔ log_BOT {{{*/
let log_BOT = function(arg_line, lfx)
{
    if(!arg_line) arg_line = "";
    let num = (lfx  != undefined) ? lfX.indexOf(lfx) : -1;
    if( num < 0) {
        num          = log_NUM;
    }

    let l_1 =       lbB +          lfX[num];
    let l_2 = STYLE_BOT + STYLE_BG_BOT[num];
    let sym =                      SDO[num];
    let txt =               strip_HTML(arg_line);

    console.groupEnd();
    console.log(            "%c"+sym +"%c "+txt,l_1 ,l_2);

    log_NUM = (log_NUM <= 0) ? 0 : ((log_NUM-1) % 10);
};
/*}}}*/
/*➔ log_CLR {{{*/
let log_CLR = function()
{
    while(log_NUM > 0) log_BOT( L_CLR );

    log( CLEAR );
};
/*}}}*/
/*➔ log_ERR {{{*/
let log_ERR = function(arg_line="")
{
    if(log_NUM > 0) log_CLR();

    console.groupEnd();
    console.groupEnd();
    console.groupEnd();
    console.groupEnd();
    console.groupEnd();

    let l_1 = lbB + lfX[2];
    let sym = L_WRN;
    let txt = strip_HTML(arg_line);
    console.log("%c"+sym+" %c "+txt+" ",l_1,STYLE_ERR);
};
/*}}}*/

/*➔ log_clear .. f(dom_tools) {{{*/
let log_clear = function(caller)
{
    if((typeof dom_tools) !== "undefined")
        dom_tools.t_clear("log_clear(caller=["+caller+"])");
};
/*}}}*/
/*➔ get_log_is_full {{{*/
let get_log_is_full = function()
{
    return log_is_full;
};
/*}}}*/
/*➔ get_log_HTML {{{*/
let get_log_HTML    = function()
{
    return strip_console_formatting( log_HTML );
};
/*}}}*/

const dom_log_log
    = {   log
        , log_warn
        , logBIG
        , logXXX

        , log_TOP
        , log_BOT
        , log_CLR
        , log_ERR

        , log_clear
        , get_log_is_full
        , get_log_HTML
    };
/*}}}*/

/* LOG PROCESS */
/*➔ log_caller {{{*/
let log_caller = function(level_max)
{
    let stack_trace = get_callers( level_max );

    if( stack_trace.includes(LF) ) console.log("%c"+stack_trace.replace(LF,"%c"+LF), lbH+lf6, lf8);
    else                         { console.log("%c"+stack_trace                    , lf6+lbF     ); console.trace(); }
};
let get_callers = function(level_max)
{
    let xx, ex_stack; /* eslint-disable-line no-unassigned-vars */
    try {   xx.raise(); } catch(ex) { ex_stack = parse_ex_stack_FUNC_FILE_LINE_COL(ex.stack, level_max); }
    return  ex_stack.trim();
};
/*}}}*/
/*_ parse_ex_stack_FUNC_FILE_LINE_COL {{{*/
/*{{{
ReferenceError: exception is not defined
    at XXX1 (file:///.../XXX5.js:12558:38)
    at XXX2 (file:///.../XXX5.js:12497:5)
    at XXX3 (file:///.../XXX5.js:13273:5)
    at XXX4 (file:///.../XXX5.js:2697:5)

/\v\s*at\s*(\S+)\s+\((.+):(\d+):(\d+)
/\v\s*at\s*\zs(\S+)\ze\s+\((.+):(\d+):(\d+)
/\v\s*at\s*(\S+)\s+\(\zs(.+)\ze:(\d+):(\d+)
/\v\s*at\s*(\S+)\s+\((.+):\zs(\d+)\ze:(\d+)
/\v\s*at\s*(\S+)\s+\((.+):(\d+):\zs(\d+)\ze
}}}*/
/*.....................................................func.........file...............line....col..........*/

let parse_ex_stack_FUNC_FILE_LINE_COL = function(text, level_max=10)
{
    let  result = "";
    let   lines = text.split(LF);
    let     sym = L_ARL;
    let line_match;
    for(let i=2; i<=(2+level_max); ++i)
    {
        if( String(lines[i]).includes("at log_caller") ) continue;
        if( String(lines[i]).includes("log.js"       ) ) continue;

        if( line_match = get_ex_stack_line_match(lines[i]) )
            result    += (result ? LF : "") + sym+" "+line_match;
        sym = L_ARU; /* past first line arrow */
    }
/*{{{
    if( !result.includes(LF) ) result += LF + sym +" ... (async)";
}}}*/
    return result;
};
/*}}}*/
/*_ get_ex_stack_line_match {{{*/
/*................................................at    (FILE__).....\( FILE_PATH____).(\......(LINE ).(COL  )*/
const regexp_FUNC_FILE_LINE_COL = new RegExp("\\s*at\\s*([^\\(]+)\\s+\\((?:[^\\/]*\\/)*(\..+?):(\\d+?):(\\d+?)");
/*{{{
const regexp_FUNC_FILE_LINE_COL = new RegExp("\\s*at\\s*([^\\(]+)\\s+\\(([^\\/]*\\/)*(\\w+\\.\\w*):(\\d+):(\\d+)");
}}}*/

let get_ex_stack_line_match = function(ex_stack_line)
{
    let matches = regexp_FUNC_FILE_LINE_COL.exec(ex_stack_line);

    if(!matches ) return "";

    let func = matches[1].replace("Object.","");
    let file = matches[2];
    let line = matches[3];
    let col  = matches[4];
    let match= mPadStart(func, 48)+".. "+file+" "+line+":"+col;

/*{{{
log(ex_stack_line);
log("...... matches[1]=["+matches[1]+"]");
log("...... matches[2]=["+matches[2]+"]");
log("...... matches[3]=["+matches[3]+"]");
log("...... matches[4]=["+matches[4]+"]");
log("...... matches[5]=["+matches[5]+"]");
log("...... matches[6]=["+matches[6]+"]");
log("..match..........=["+match     +"]");
}}}*/
    return match;
};
/*}}}*/

/* LOG OBJECTS */
/*➔ log_key_val {{{*/
/*{{{*/
const LF_TAB = LF+"    ";
const NL     = "\u21B5";

/*}}}*/
let log_key_val       = function(name, o, lxx       ) { return log_key_val_group(name, o, lxx, true); };
let log_key_val_group = function(name, o, lfx=7, group=true)
{
    let lxx = (typeof lfx == "number")
        ?         lfX[lfx]              /* just the index */
        :             lfx;              /* or an fg color */

    if(!o) {
        console.log(name+": %c null object ", (lxx || lb0));
        return "";
    }

/*{{{                  log("%c"+name, lbH+(lxx || lb0)); }}}*/

    name = mPadEnd(name, 60);
    if(group) console.groupCollapsed("  %c"+ name+" ...", ((lbH+lxx) || lb0));
    else      console.log           ("  %c"+ name       , ((lbH+lxx) || lb0));

    let result = "";

    if( Array.isArray(o) )
    {
        console.table(o);
/*{{{
        console.log(result);
        console.dir(o);
}}}*/
        Array.from(o).forEach(
                              (value,index) => {
                                  result += (index ? LF:"")
                                      +      index +" .. "
                                      +((value.key && value.val)
                                        ?    "{ key:"+mPadEnd(value.key,32)
                                        +    ", val:"+value.val
                                        +    "}"
                                        :    value.toString()
                                       );
                              });
    }
    else {

        let n = 1;
        Object.keys(o)
            .forEach( /*..................... [OWN PROPERTY] NAMES */
                      function(key) {
                          let   val = o[key];
                          let   l_v = lf2; /* eslint-disable-line no-useless-assignment */
                          try { l_v =      (val          ==  null        ) ?     lb0 /* NULL      */
                                  :        (val          ==  undefined   ) ?     lb0 /* UNDEFINED */
                                  :        (val          ==  "null_node" ) ?     lb0 /* NULL_NODE */
                                  :        (val          ==  "NO"        ) ?     lf3 /* NOTHING   */
                                  :        (val          ==  "[]"        ) ?     lf3 /* NOTHING   */
                                  :        (val          ==  false       ) ?     lf3 /* FALSE     */
                                  :        (val          ==  true        ) ?     lb5 /* TRUE      */
                                  :        (typeof val   == "object"     ) ?     lb7 /* OBJECT    */
                                  :  String(val).startsWith( L_NEW       ) ? lbH+lf9 /* CHANGED   */
                                  :  String(val).startsWith( L_CHK       ) ?     lf8 /* CHECKED   */
                                  :  String(val).includes  ( LF          ) ? lbF+lf5 /* SUBSTANCE */
                                  :  String(val).includes  ( " "         ) ? lbH+lf5 /* ONE_LINER */
                                  :                                              lf4 /* SOMETHING */
                              ;
                          } catch(ex) { val = LF+ex.message; l_v = lbb+lb2; }

                          let ovf = log_object_val_format(val, lxx);

                          let l_O = ovf.includes("%c") ? lxx : ""; /* f(log_object_val_format .. parse_ex_stack_FUNC_FILE_LINE_COL) */ /* [" "] prevents Firefox [empty string] */
/*{{{
                          if((typeof val == "object") && (ovf != "[]"))
                              ovf = LF_TAB+"┌───────────────────────────────────┐"
                                  + LF_TAB+ ovf
                                  + LF_TAB+"└───────────────────────────────────┘";
}}}*/
                          console.log(" %c|||%c "+mPadStart(   key, 36) +" %c"+ovf
                                      , lb0 ,(lxx || lb0)                 ,l_v,l_O);

                          result +=   "||| "  +             key      +" <em class='cc"+(++n)+"'>"+ ovf   +"</em><br>"+LF       ;
                      }
                    );
    }
    if(group) console.groupEnd();
    return result;
};
/*}}}*/
/*➔ log_object_val_format {{{*/
/*{{{*/
const TEXT_LENGTH_MAX = 96;

/*}}}*/
let log_object_val_format = function(val,lxx)
{
    let text;
    try    {                                            text = String(val); } catch(ex) { text = LF+ex.message; }
    if     (                                   !text )  text = "[]";

    if(       text.includes(        L_ARU           ))  text = text.replace(L_ARU, " %c"); /* f(parse_ex_stack_FUNC_FILE_LINE_COL) */
    if(      !text.includes(        LF              )
         &&   text.length > TEXT_LENGTH_MAX          )  text = ellipsis(text, TEXT_LENGTH_MAX);

    if     (               val instanceof HTMLElement)  text = get_id_or_tag_and_className(val);
    else if( Array.isArray(val)                      )  text = "ARRAY["+val.length+"] "+  ellipsis(val.toString().replace(/,/g," _ "), TEXT_LENGTH_MAX);
    else if(        typeof val   == "object"         )  text = log_json(val,lxx);
    else if(        typeof val   == "function"       ) {
        if(String(val).indexOf("=>") >= 0)              text = L_FNC +" "+ (val.name || "anonymous")+" "+val;
        else                                            text = L_FNC +" "+ (val.name || "anonymous");
    }

    return    text;
};
/*}}}*/

/* LOG JSON */
/*➔ log_json {{{*/
/*{{{*/
const CALLERS_HEAD  = LF+"                                          ";

const regexp_XBRACE = new RegExp("^{|}$"                    , "g");
const regexp_NEWLIN = new RegExp("\\\\n"                    , "g");
const regexp_BSLASH = new RegExp("\\\\"                     , "g");
const regexp_URL_64 = new RegExp('"url":"([^"]{1,64})[^"]*"', "g"); /* eslint-disable-line quotes */

const regexp_BRACES = new RegExp("^{|}$"                    , "g");
const regexp_COMMA  = new RegExp(" *, *"                    , "g");
const regexp_QUOTE  = new RegExp("[\\u0022\\u0027]"         , "g"); /* "' */
/*}}}*/
let log_json = function(o,lxx)
{
    if(             o == null     ) return "null";
    if(             o == undefined) return "undefined";
    if(!Object.keys(o).length     ) return "empty";
    if(         typeof HTMLElement != "undefined"
       && o instanceof HTMLElement)
    {
        if(         o.id          ) return "#"+o.id+(o.className ? ("."+o.className.replace(/ /g,".")) : "");
        if(         o.tagName     ) return     o.tagName;
    }

    /* ONLY KEEP ATTRIBUTES WITH VALUES {{{*/
    let         o_with_values = {};
    Object.keys(o).filter((key) => {
        let    val  = o[key];
        if(   key.match(/[^a-z]/i) /* some non-alpha bullet item .. [ ● ✔ ↓ ] */
           || (val != null)
           && (val !=    0)
           && (val !=   "")
          )
            o_with_values[key]
                = (typeof val == "function") ? val.name
                : (typeof val != "object"  ) ? val
                : LF_TAB+" "+JSON.stringify(val)
                .             replace   (regexp_XBRACE,         "")
                .             replace   (regexp_COMMA , LF_TAB+" ")
                .             replaceAll(          ":",       ": ")
        ;
    });
    /*}}}*/
    let result = ""; /* eslint-disable-line no-useless-assignment */
    try {
        let o_with_values_json = JSON.stringify(o_with_values);
        result
            = o_with_values_json
            .  replace(regexp_URL_64, '"url":"$1..."') /* eslint-disable-line quotes */
            .  replace(regexp_XBRACE, "")
            .  replace(regexp_QUOTE , "")
            .  replace(regexp_NEWLIN, NL)
            .  replace(regexp_BSLASH, "")
            .  trim()
            .  replace(regexp_COMMA ," , ")
        ;

        if( result.length > 64)
            result
                = result
                .   replace(regexp_URL_64, '"url":"$1..."') /* eslint-disable-line quotes */
        ;

        result
            = result
            .  replace(regexp_XBRACE, "")
            .  replace(regexp_QUOTE , "")
            .  replace(regexp_NEWLIN, NL)
            .  replace(regexp_BSLASH, "")
            .  trim()
        ;

        result
            = (". "+result)
            .  replace(regexp_COMMA , LF_TAB+". ")
        ;

        result
            = result
            .  replace(/\. *([^:]*):{/g, ".$1:"+LF_TAB +". ")
            .  replace(/}/g            , ""                 )
            .  replace(/n↑/g           ,   CALLERS_HEAD+"↑" )
            .  replace(/n←/g           ,   CALLERS_HEAD+"←" )
        ;

        result
            =(LF_TAB+ result)
            .  replace(/^( *\. *)([^:]*):(.*)$/gm, mpad)
        ;

        result
            = LF_TAB+"┌───────────────────────────────────┐"
            +          result
            + LF_TAB+"└───────────────────────────────────┘"
        ;

    } catch(ex) { result = LF+ex.message; }

    if( lxx )
        result = "%c"+ result;

    return result;
};

let mpad = function(match, p1, p2, p3, offset, string) /* eslint-disable-line no-unused-vars */
{
    return mPadStart(p1+p2,39) +" : "+ p3;
};

/*}}}*/
/*➔ log_json_one_liner {{{*/
let log_json_one_liner = function(val)
{
    if(val == null     ) return "null";
    if(val == undefined) return "undefined";
    if(val.id          ) return "#"+val.id;
    if(val.tagName     ) return     val.tagName;

    let result = JSON.stringify(val)
        .        replace(regexp_URL_64 , '"url":"$1..."') /* eslint-disable-line quotes */
        .        replace(regexp_BRACES , "")
        .        replace(regexp_QUOTE  , "")
        .        replace(regexp_BSLASH , "")
        .        trim();

    result = result.replace(regexp_COMMA, " .. ");

    return result;
};
/*}}}*/

/* LOG ANCHOR */
/*➔ log_label_URDL {{{*/
let log_label_URDL = function(label, urdl)
{
    let { panel, u,r,d,l, x,y, w,h, near_x_min,near_y_min , near_x_max,near_y_max } = (urdl || {});

    let l_u = u ? lb2 : lf8;
    let l_r = r ? lb3 : lf8;
    let l_d = d ? lb4 : lf8;
    let l_l = l ? lb5 : lf8;

    if(!panel) {
        log("%c"+label+"%c U %c R %c D %c L"
            ,lbH       ,l_u ,l_r ,l_d ,l_l  );
    }
    else {
        let  l_x
            = (x <= near_x_min) ? lbR
            : (x >= near_x_max) ? lbL
            :                     lbH;

        let  l_y
            = (y <= near_y_min) ? lbR
            : (y >= near_y_max) ? lbL
            :                     lbH;

/*{{{
        let pid = get_n_lbl(panel);
}}}*/
        let pid = get_id_or_tag(panel);

        log(  "%c"+label+"%c"+pid+"%c u %c r %c d %c l"
              +                                    "%c WH=%c"+w+".."+h
              +                                                       "%c  X=%c"+near_x_min+" < "+x+" < "+near_x_max
              +                                                       "%c  Y=%c"+near_y_min+" < "+y+" < "+near_y_max
              ,lbH       ,lbH+lf0 ,l_u ,l_r ,l_d ,l_l
              ,                                     lbA  ,lbH+lf8
              ,                                                        lbA  ,l_x+lf6
              ,                                                        lbA  ,l_y+lf7
           );
    }
};
/*}}}*/
/*➔ log_anchor_step {{{*/
let log_anchor_step = function(sticky, step, msg, anchor_from, anchor_to)
{

    let from =         get_node_path_tail( anchor_from);
    let   to = (anchor_to && (anchor_to != anchor_from))
        ?              get_node_path_tail( anchor_to  )
        :       null;

    let sdx     = t_data.SDX[ step    % 10];
    let lf_step =        lfX[ step    % 10];       /* this step            */
    let lf_msg  = to   ?            lf_step : lf8; /* this step .. no-step */
    let lf_to   = to   ? lfX[(step+1) % 10] : lf8; /* next step .. no-step */

    if(to) {
        log(   "%c"+sdx
               +        "%c"+ msg
               +                  "%c"+ from
               +                             "%c ➔ %c"+ (to ? to : "...")
               , lbB+lf_step
               ,         lbH+lf_msg
               ,                   lbL+lf_step
               ,                              lbC+lbA
               ,                                   lbR+lf_to
           );
    }
    else {
        log(   "%c"+sdx
               +        "%c"+ msg
               +                  "%c"+ from
               , lbB+lf_step
               ,         lbH+lf_msg
               ,                   lbH+lf_step
           );
    }

    let new_path
        = !sticky.skipped_csv
        ?  (     " .. "+(to || from)    ) /* show first anchor */
        :  (to ? " .. "+(to        ): "") /* ...hide unchanged */
    ;

    let s = /*step +" "+*/ msg + new_path;

    sticky.skipped_csv = csv_add(sticky.skipped_csv, s);

};
/*}}}*/
/*➔ log_not_an_anchor_target {{{*/
let log_not_an_anchor_target = function(node)
{
    let result = not_an_anchor_target(node);
    if( result )
        log("%c"+get_node_path(node)+" %c"+result+" .. NOT AN ANCHOR TARGET"
           ,lf8                              ,lbb+lbH                              );
};
/*}}}*/

/* LOG TRANSCRIPT */
/*➔ dom_log_transcript {{{*/
/*{{{*/
let log_tr1;
let log_tr2;

let log_TR_set_count = 0;
/*}}}*/
/*➔ log_TR_set_transcripts {{{*/
let log_TR_set_transcripts = function(transcript1, transcript2)
{
    log_tr1 = transcript1;
    log_tr2 = transcript2;
};

let _log_TR_set1       = function(msg, ...args) { if(log_tr1) _log_TR_set(log_tr1, (msg || ""), ...args); };
let _log_TR_add1       = function(msg, ...args) { if(log_tr1) _log_TR_add(log_tr1, (msg || ""), ...args); };

let _log_TR_set2       = function(msg, ...args) { if(log_tr2) _log_TR_set(log_tr2, (msg || ""), ...args); };
let _log_TR_add2       = function(msg, ...args) { if(log_tr2) _log_TR_add(log_tr2, (msg || ""), ...args); };

/*}}}*/
/*➔ log_TR_layout {{{*/
const TR_MARGIN = 24;
let log_TR_layout = function(tr)
{
    let x_min =          TR_MARGIN - tr.offsetWidth ; if(tr.offsetLeft < x_min) tr.style.left = x_min+"px";
    let x_max = window.innerWidth  - TR_MARGIN     ; if(tr.offsetLeft > x_max) tr.style.left = x_max+"px";

    let y_min =          TR_MARGIN - tr.offsetHeight; if(tr.offsetTop  < y_min) tr.style.top  = y_min+"px";
    let y_max = window.innerHeight - TR_MARGIN     ; if(tr.offsetTop  > y_max) tr.style.top  = y_max+"px";
};
/*}}}*/
/*➔ log_TR_RESULT_set {{{ */
let log_TR_RESULT_set = function(html=log_HTML)
{
    if(!html.trim()) return;

    /* DEFAULT [PRE] CONTAINER */
    if(   !html.startsWith("<div")
       && !html.startsWith("<pre")
       && !html.startsWith("<p")
      )
        html = "<pre id='html'>"+ html +"</pre>";

    _log_TR_set2("<hr><table>"
            +   " <tr><td>"+ html +"</td></tr>"
            +   "</table>"
    );

    log_HTML = ""; /* NOTE: log() should be called first to clear results to be reported here */
};
/*}}}*/
/*…_log_TR_set {{{*/
let _log_TR_set  = function(tr,msg, ...args)
{
    if(!msg) msg = "";
log(tr.id+": "+strip_HTML(msg));

    /* SET STEP-STAMP */
    if(tr) {
        tr.innerHTML  = "<em class='em_log'>"
            + "<span class='cc"+(++log_TR_set_count % 10)+"'>"
            +  log_TR_set_count
            + "</span>"
            + "</em>"
        ;
    }

    /* SET .. ADD */
    if(msg) { del_el_class(tr, "empty"); _log_TR_add(tr, msg, args); }
    /* SET .. CLR */
    else    { add_el_class(tr, "empty");                            }

    /* duplicate to console */
    log();
};
/*}}}*/
/*…_log_TR_add {{{*/
let _log_TR_add  = function(tr, msg, ...args) /* eslint-disable-line no-unused-vars */
{
    if(!msg) msg = "";
log(tr.id+": "+strip_HTML(msg));
/*{{{
if(msg) console.log("%c _log_TR_add%c"+strip_HTML(msg), lbH+lf8, String(args[0]));
}}}*/
    /* DEAL WITH EMPTY MESSAGE {{{*/
    if(!tr           ) return;
    if( msg          ) del_el_class(tr, "empty");
    if(!tr.innerHTML ) _log_TR_set(tr,"");

    if(msg.trim() == "") msg = "empty msg";

    let s = "<table>";

    /*}}}*/
    if(typeof dom_select  !== "undefined") {
        /* mStartRange {{{*/
        let mStartRange     =  dom_select.get_mStartRange();
        let mStartRange_str = (mStartRange) ? dom_select.rangeToString(mStartRange, "Start Range") : "";
        if(mStartRange) s += ""
            +" <tr><th                       >        mStartRange             </th></tr>"
            +" <tr><td                       ><pre>"+ mStartRange_str +"</pre></td></tr>"
        ;

        /*}}}*/
        /* mEndRange {{{*/
        let mEndRange       =  dom_select.get_mEndRange();
        let mEndRange_str   = (mEndRange  ) ? dom_select.rangeToString(mEndRange  , "End Range"  ) : "";
        if( mEndRange )  s += ""
            +" <tr><th                       >        mEndRange               </th></tr>"
            +" <tr><td                       ><pre>"+ mEndRange_str   +"</pre></td></tr>"
        ;

        /*}}}*/
    }
    if(msg) {
        if(msg.indexOf("subject=") < 0)
            msg = strip_console_formatting(msg);

/*{{{
console_dir("_log_TR_add(msg)",msg);
}}}*/
        s += ""
            +" <tr><td class='transcript_msg'>"+ msg +"</td></tr>"
            +"</table>"
        ;
    }

    s += "<table>";

    tr.insertAdjacentHTML("beforeend", s);

/* send_onchange_event_to( tr ); */
};
/*}}}*/
/*➔ EVENT LAYOUT SELECT {{{*/

let log_TR_EVENT_add   = _log_TR_add1;

let log_TR_LAYOUT_set  = _log_TR_set1;
let log_TR_LAYOUT_add  = _log_TR_add2;

let log_TR_SELECT_set  = _log_TR_set1;
let log_TR_SELECT_add  = _log_TR_add1;

/*}}}*/

const dom_log_transcript
    = {   log_TR_set_transcripts
        , log_TR_layout

        , log_TR_EVENT_add
        , log_TR_LAYOUT_set
        , log_TR_LAYOUT_add
        , log_TR_SELECT_set
        , log_TR_SELECT_add

        , log_TR_RESULT_set
    };
/*}}}*/

/*}}} */

/*┌─────────────────────────────────────────────────────────────────────────┐ */
/*│ js_timer.js                                        _TAG=(240000:00h:00) │ */
/*└─────────────────────────────────────────────────────────────────────────┘ */
/*{{{*/
/* globals  localStorage */ /* eslint-disable-line no-redeclare */
/* globals  Map          */ /* eslint-disable-line no-redeclare */
/* exported js_timer */
/*{{{*/
const LOG_IMG = "<img class='topic_img' src='/eRoomData/icons/smfolder7.gif'>";
const JS_TIMER_JS_ID    = "js_timer_js";
const JS_TIMER_JS_TAG   = JS_TIMER_JS_ID+" (240000:00h:00)"; /* eslint-disable-line no-unused-vars */

/*}}}*/
let JS_TIMER_LOG        = (localStorage.getItem("JS_TIMER_LOG") == "true");
let JS_TIMER_TAG        = (localStorage.getItem("JS_TIMER_TAG") == "true");
let js_timer = (function() {
"use strict"; /* eslint-disable-line no-unused-vars */ /* eslint-disable-line strict */


/*{{{*/

const MS_PER_DAY            = 86400000;

let   timer_dict;
let   timer_TBODY_innerHTML;
let   pending_timers = 0;
/*}}}*/
/*➔ clearTimers {{{*/
let clearTimers = function()
{
/*{{{*/
let   caller = "clearTimers";
let log_this = JS_TIMER_LOG;
let tag_this = JS_TIMER_TAG || log_this;

if( tag_this) log(caller);
/*}}}*/
    timer_dict              = new Map();
    timer_TBODY_innerHTML   = "";
    pending_timers          = 0;
};
/*}}}*/
/*➔ startTimer {{{*/
let startTimer = function(name)
{
/*{{{*/
let   caller = "startTimer";
let log_this = JS_TIMER_LOG;

if( log_this) log(caller+"("+ name +"):");
/*}}}*/
    /*  timer_dict init {{{*/
    if(!timer_dict) clearTimers();

    /*}}}*/
    /* named timer init {{{*/
if( log_this) log("...named timer init:");
    if( timer_dict.get(name) == undefined)
    {
        let timer
            = {   name
                , order : 1+timer_dict.size /* call order        */
                , level : 0
                , calls : 0                 /* # [start  + stop] */
                , total : 0                 /* ∑ [start to stop] */
                , start : 0                 /* last start        */
                , stop  : 0                 /* last stop         */
            };
        timer_dict.set(name, timer);

if( log_this) log("%c"+caller+"%c"+timer.order+"%c"+name, lbL,lbC+lfX[timer.order%10],lbR+lbX[timer.order%10]);
    }

    let timer       = timer_dict.get(name);
    timer.start     = new Date().getTime() % MS_PER_DAY;        /* since midnight                            */
    timer.level     = Math.max(timer.level, pending_timers);    /* how many started (not yet stopped) timers */
    pending_timers += 1;

    /*}}}*/
if( log_this) log( "...startTimer("+ name +")=["+ timer_dict.get(name).start +"]");
};
/*}}}*/
/*➔ stopTimer {{{*/
let stopTimer = function(name)
{
/*{{{*/
let   caller = "stopTimer";
let log_this = JS_TIMER_LOG;

if( log_this) log(caller+"("+ name +"):");
/*}}}*/
    /* timer not started {{{*/
    if(   !timer_dict
       || (timer_dict.get(name) == undefined)
    ) {
        log(caller+": timer ["+ name +"] not started");

        return;
    }

    /*}}}*/
    /* calls stop total level {{{*/
    let timer      = timer_dict.get(name);
    let start_time = timer.start;
    let stop_time  = new Date().getTime() % MS_PER_DAY; /* since midnight */


    timer.calls   += 1;
    timer.stop     =  stop_time;
    timer.total   += (stop_time - start_time);
    pending_timers -= 1;
    timer.level = Math.max(timer.level, pending_timers); /* how many started (not yet stopped) timers */

    /*}}}*/
if( log_this && (timer.calls<2)) dom_log.log_key_val(caller+"("+name+")", timer);
};
/*}}}*/
/*➔ logTimers {{{*/
let logTimers = function(title,l_x) /* alias logSession in asp */
{
/*{{{*/
let   caller = "logTimers";
let log_this = JS_TIMER_LOG;
let tag_this = JS_TIMER_TAG || log_this;

/*}}}*/
if( tag_this) dom_log.log_TOP(caller+" "+strip_CR_LF(title), l_x);
if( log_this) log("timer_TBODY_innerHTML=["+ timer_TBODY_innerHTML +"]");
    /* populate timer_TBODY_innerHTML {{{*/
    if(!timer_dict) clearTimers();
    let timer_names = [];
    timer_dict.forEach((timer) => timer_names.push( timer.name ));

    timer_names.forEach((name) => logTimer( name ));
    /*}}}*/
    /* Update PAGE JS_TIMER_DIV .. f(timer_TBODY_innerHTML) {{{*/
    let notify_innerHTML      = ""; /* eslint-disable-line no-useless-assignment */
    if(timer_TBODY_innerHTML != "")
    {

        let div_timers_style
            = title.includes(    "NodeIterator")
            ?  "background-color: orange;"
            :  "background-color: lightBlue;"
        ;

        notify_innerHTML = ""
            +"<span class='topic_span'>"         + LOG_IMG
            +" <em class='cc"+l_x+"'>JS_TIMERS: "+ title.replaceAll(LF,"<br>&nbsp;") +"</em>"
            +"</span>"
            +"<div     id='div_timers' style='"  + div_timers_style                  +"'>"
            +" <div class='info_log'>"
            +"  <table id='table_timers'> "      + timer_TBODY_innerHTML             +" </table>"
            +" </div>"
            +"</div>"
        ;

/* [JS_TIMER_DIV] {{{*/
if( tag_this && (typeof js_details == "undefined")) {

    let JS_TIMER_DIV       = document.getElementById("JS_TIMER_DIV");
    if( JS_TIMER_DIV )        JS_TIMER_DIV.parentElement.removeChild( JS_TIMER_DIV );

    JS_TIMER_DIV           = document.createElement("DIV");
    JS_TIMER_DIV.id        = "JS_TIMER_DIV";
    JS_TIMER_DIV.title     = "";

    let close_listener = "this.parentElement.style.display='none';";
    JS_TIMER_DIV.innerHTML = ""
        +"<div"
        +" style='cursor     : help;"
        +"  padding          : 0 0 0em 0;"
        +"  border           : solid 4px #222;"
        +"  border-radius    : 1em;"
        +"  background-color : rgba(192,192,192,0.9);"
        +"  padding          : 0.5em;"
        +"  position         : fixed; left: 0.5em; bottom: 0.5em;"
        +" '>"
        +" <button style='float:right;' onclick="+close_listener+">X</button>"
        +  notify_innerHTML
        +"</div>"
    ;

    document.body.insertBefore(JS_TIMER_DIV, null);
}
/*}}}*/
/* transcript2 {{{
//      let transcript2 = dom_util.get_tool("transcript2");
//      transcript2.insertBefore(JS_TIMER_DIV, null);
//      dom_grid.t_grid_TOOLS_SELECT_panel(transcript2, true);
//      dom_tools.t_sync_tools_tier2(caller);
}}}*/
    }
    /*}}}*/
    clearTimers();
    /* [notify_innerHTML] {{{*/
/*{{{
    let fragment_input = document.getElementById("fragment_input");
    if( fragment_input )
        fragment_input.setAttribute("data-notifyHTML", notify_innerHTML);

if( tag_this) js_details.notify( notify_innerHTML );
}}}*/
    /*}}}*/
if( tag_this) dom_log.log_BOT(caller+" "+strip_CR_LF(title), l_x);
};
/*}}}*/
/*_ logTimer {{{*/
let logTimer = function(name) /* alias traceTimer in asp */
{
/*{{{*/
let   caller = "logTimer";
let log_this = JS_TIMER_LOG;
let tag_this = JS_TIMER_TAG || log_this;

if( log_this) log(caller+"( "+ name +" ):");
/*}}}*/
    /* not started {{{*/
    if(   !timer_dict
       || (timer_dict.get(name) == undefined)
      ) {
        log(caller+": timer ["+ name +"] not started");

        return;
    }
    /*}}}*/
    /* log timer into [timer_TBODY_innerHTML] {{{*/
    let timer    = timer_dict.get   (name);
if( log_this && (timer.calls<2)) dom_log.log_key_val(caller+"("+name+")", timer);

    let timeHTML = get_duration_HTML(timer.total     );
    let CallHTML =                  (timer.calls == 1) ? "" : "(for "+timer.calls+" calls)";
    let tr_class
        = (timer.total > 500)
        ? ("tr_timer cc"+timer.level)
        : ("tr_timer fg"+timer.level)
    ;

    let orderHTML = ("__"+timer.order                                              ).slice(-2          );
    let levelHTML = ("\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF").slice(-timer.level);
    /**/levelHTML = (                              levelHTML+"....................").slice(0,12        );

    /*}}}*/
    /* timer_TBODY_innerHTML {{{*/
if( tag_this) {
    let total = mPadStart(timer.total ?                    timer.total+"ms" : "--", 6);
    let calls = mPadEnd  (dom_data.SYMBOL_CIRCLE_CLOCKWISE+" "+timer.calls        , 3);
    dom_log.log_key_val(orderHTML
                                  +" ● "+ total
                                  +  " "+ calls
                                  +" ● "+ name
                                  , timer, lbX[timer.order%10]);
}

    timer_TBODY_innerHTML
        +="<tr class='"+ tr_class  +"'>"
        +" <th> "      + orderHTML +" "+ levelHTML +" "+ name +"</th>"
        +" <td> "      + timeHTML  +"                           </td>"
        +" <td> "      + CallHTML  +"                           </td>"
        +"</tr>";
    /*}}}*/
if( log_this) log("..."+caller+"("+ name +")=["+ timer_dict.get(name) +"ms]");
};
/*}}}*/
/*_ get_duration_HTML {{{*/
let get_duration_HTML = function(ms)
{
    let   msg = get_duration( ms );

    if(   msg.includes(  "-")
       || msg.includes("0.0")
       || msg.includes("0.1")
       || msg.includes("0.2")
       || msg.includes("0.3")
       || msg.includes("0.4")
      ) {
        msg = "<span class='fg0' style='filter:opacity(0.5);'>"                + msg +"</span>";
    }
    else {
        msg = "<span style='font-weight:bolder;'>"+ msg +"</span>";
    }

    return msg;
};
/*}}}*/
/*_ get_duration {{{*/
let get_duration = function(ms)
{
    if(ms == 0) return "-";

    let duration = ""; /* eslint-disable-line no-useless-assignment */
    if(     ms <  1000) duration = " 0."+ (      "000"+ ms).slice(    -3) +"s";
    else if(ms < 60000) duration = " "  + parseInt    ( ms/1000         ) +"s";
    else                duration =        parseInt    ((ms/1000) / 60, 0) +"m "+ ((ms/1000) % 60) +"s";

    if((ms > 1000) && (ms < 100000)) {
        let tenth = parseInt(ms % 1000 / 100);
        if( tenth > 0)
            duration += tenth;
    }
    return duration;
};
/*}}}*/
/* EXPORT {{{*/
return { name : "js_timer"
    , logging : (state) => { if(state != undefined) { JS_TIMER_LOG = state; localStorage.setItem("JS_TIMER_LOG", JS_TIMER_LOG); } return JS_TIMER_LOG; }
    , tagging : (state) => { if(state != undefined) { JS_TIMER_TAG = state; localStorage.setItem("JS_TIMER_TAG", JS_TIMER_TAG); } return JS_TIMER_TAG; }

    , clearTimers
    , startTimer
    , stopTimer
    , logTimers /* alias logSession in asp */
    /* DEBUG */
    , get_duration
};

/*}}}*/
}());
/*}}}*/

/* EXPORT {{{*/

return { name : "dom_log"
    , logging : (state) => DOM_LOG_LOG = t_store.t_store_set_state("DOM_LOG_LOG",state)
    , tagging : (state) => DOM_LOG_TAG = t_store.t_store_set_state("DOM_LOG_TAG",state)
    , t_log_IMPORT

    /* MODULES */
    , ...dom_LOG_MAP
    , ...dom_log_CHAR
    , ...dom_log_CSS
    , ...dom_log_STRING
    , ...dom_log_SYM_DIGIT
    , ...dom_log_console
    , ...dom_log_transcript
    , ...dom_log_log

    , log_IMPORT

    , get_callers
    , log_caller


    , log_json
    , log_json_one_liner
    , log_key_val
    , log_key_val_group
    , log_label_URDL
    , log_not_an_anchor_target
    , log_object_val_format
    , log_anchor_step

    , js_timer
};

/*}}}*/

})();

/* @see $APROJECTS/Chrome_Web_Store/RTabsExtension/javascript/log.js */
/* @see {{{
"┌─────────────────────────────────────────────────────────────────────────────┐
"│                                                                             │
:e  $BROWSEEXT/RTabsSplitter/manifest.json
:r !echo $BROWSEEXT
C:/LOCAL/DATA/ANDROID/PROJECTS/Chrome_Web_Store

:e  $BROWSEEXT/RTabsSplitter/javascript/background.js
:e  $BROWSEEXT/RTabsSplitter/javascript/content.js
:e             $RPROFILES/script/dom_sentence.js
:e             $RPROFILES/script/stub/dom_tools.js
:e             $RPROFILES/script/stub/dom_scroll.js
:e             $RPROFILES/script/stub/dom_util.js
:e             $RPROFILES/script/stub/dom_log.js
:e             $RPROFILES/stylesheet/dom_host.css

:e             $RPROFILES/script/dom_select.js
:e             $RPROFILES/script/dom_util.js
"...           $RPROFILES/script/dom_log.js

:e             $RPROFILES/script/spliter.js splite
:e             $RPROFILES/script/dom_load.js
"│                                                                             │
"└─────────────────────────────────────────────────────────────────────────────┘
}}}*/
/* console-reference {{{
:!start explorer "https://developers.google.com/web/tools/chrome-devtools/console/console-reference"

}}}*/

/*{{{
// TODO refactoring ● see C:/LOCAL/DEV/DEVEL/EMC/Extensions/ExportCMT/script/js_select.js
// TODO refactoring ● see C:/LOCAL/DEV/DEVEL/EMC/Extensions/ExportCMT/script/js_log.js
// $RPROFILES/playground.html
}}}*/
