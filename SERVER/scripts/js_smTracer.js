//┌────────────────────────────────────────────────────────────────────────────┐
//│ smTracer.js ● $APROJECTS/LANServer/SERVER          ● _TAG (260921:01h:32) │
//└────────────────────────────────────────────────────────────────────────────┘
//{{{
//┌────────────────────────────────────────────────────────────────────────────┐
//│ Passive State Machine Tracer (PoC)                                         │
//├────────────────────────────────────────────────────────────────────────────┤
//│ Usage:                                                                     │
//│ ● const tracer = createSMTracer();                                         │
//│                                                                            │
//│ ● In js_notes.js:                                                          │
//│   const view = tracer.createViewAdapter(/* your existing DOM methods */);  │
//│                                                                            │
//│ ● In note.js:                                                              │
//│   const data = tracer.createDataAdapter(/* your existing CRUD methods */); │
//│   const   sm = createStateMachine(view, data); // You will wire this later │
//│                                                                            │
//└────────────────────────────────────────────────────────────────────────────┘
/* jshint {{{*/

/* eslint-disable no-return-await */

/*}}}*/
//}}}

let createSMTracer = function()
{
//┌────────────────────────────────────────────────────────────────────────────┐
//│ UTIL                                                                       │
//└────────────────────────────────────────────────────────────────────────────┘
let log_this = true; // ● load-time logging state
//{{{
let logging = () => { log_this = !log_this; console.log( get_src_link("log_this: "+ log_this, 3) ); return log_this; };
let get_src_link = function(label,lvl=2) { return label +": "+ new Error().stack.split("\n")[lvl].replace(/.*\((.*)\)/,"$1"); };
//}}}

//┌────────────────────────────────────────────────────────────────────────────┐
//│ LOGGING TRACE STYLE ● f(error, phase, caller)                ● js_smTracer │
//├────────────────────────────────────────────────────────────────────────────┤
//│ CTRL PHASE  ● f(msg)                                                       │
//│ DATA EVENT  ● f(caller)                                                    │
//│ VIEW EVENT  ● f(caller)                                                    │
//└────────────────────────────────────────────────────────────────────────────┘
/*  log {{{*/
/*{{{*/
const TRACE_STYLE   = "background: #DAA; color: #000; font-weight: bold;";
const ERROR_STYLE   = "background: #F44; color: #FFF; font-weight: bold;";
const   MSG_STYLE   = "background: #000; color: #DAA; font-weight: bold;";
/*}}}*/
let log = function(msg="", type="", caller="")
{
if(!log_this) return   false   ; // not served
if(!msg     ) return !!log_this; // log_this getter

    // CONTROL HEAD .. f(type error)
    let head_style
        = (type === "error")
        ?  ERROR_STYLE
        :  TRACE_STYLE;

    // CONTROL STEP
    let fn          = get_ctrl_fn   ( msg    );
    let phase       = get_ctrl_phase( fn     );
    let phase_style = get_ctrl_style( phase  );

    // MODEL-VIEW-CONTROLER INVOLVEMENT
    let MVC         = (get_data_fn   ( caller ) ? "🟢 M":"")
        +             (get_view_fn   ( caller ) ? "🟡 V":"")
        +             (get_ctrl_fn   ( caller ) ? "⚫ C":"")
    ;

    log_animate_sm_badge( phase );

    msg    = msg   .padEnd(80);
    phase  = phase .padEnd(10);
    caller = caller.padEnd(25);

    console.log("%c SM-TRACE %c "+ msg +"%c"+ phase +" 🢀 "+ caller + MVC
                ,head_style ,MSG_STYLE  ,phase_style                    );
    return true; // served
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ LOG-BADGE CONTROLER PHASE ANIMATION 🟤🔴🟠🟡                               │
//│ MVC 🄼 🅅 🄲   🅼🆅🅲
//└────────────────────────────────────────────────────────────────────────────┘
/* log_animate_sm_badge {{{*/
//{{{
let SM_BADGE_COOLDOWN_MS = 300;
let sm_badge_cooldown;
let sm_badge;
let sm_badge_nudge_stack = [];
//}}}
let log_animate_sm_badge = function(phase)
{
    // on cooldown {{{
    if( sm_badge_cooldown ) return;

    //}}}
    // badge HTML {{{
    if( sm_badge == undefined) {
        sm_badge = typeof document !== "undefined"
            ? document.querySelector( "#smTracer" )
            : null;
    }
    if( sm_badge == null) return;
    //}}}
    // stack phase {{{
    sm_badge_nudge_stack.push( phase );

    //}}}
    // animate  step {{{
    log_animate_sm_badge_tick();

    //}}}
};
let log_animate_sm_badge_tick = function()
{
    // animate stack {{{
    if( sm_badge_nudge_stack.length )
    {
        sm_badge_update();
        sm_badge_cooldown   = setTimeout(log_animate_sm_badge_tick, SM_BADGE_COOLDOWN_MS);
    }
    //}}}
    // ...done{{{
    else {
        sm_badge_cooldown   = null;

    }
    //}}}
    // pop top of stack {{{
    if( sm_badge_nudge_stack.length )
        sm_badge_nudge_stack = sm_badge_nudge_stack.slice(0,-1);
    //}}}
};
let sm_badge_update = function()
{
  //sm_badge.textContent = "";
  //sm_badge_nudge_stack.forEach((phase) => sm_badge.textContent += phase+"\n");

    sm_badge.className = log() ? "logging" : "";
    sm_badge_nudge_stack.forEach((phase) => sm_badge.classList.add( phase ));

//if(sm_badge.className) console.log("sm_badge_update: sm_badge.className %c "+ sm_badge.className +" ", "background-color: #A00");
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ CONTROLER PHASE ● LOADING READY INPUT UPDATE                               │
//└────────────────────────────────────────────────────────────────────────────┘
// CONTROLER {{{

//┌─────────────────────────────────────┐
//│ #  │ MARGIN PROCESS PHASE           │
//│----│--------------------------------│
//│ 1  │ LOADING                        │
//│ 2  │ READY — WAITING FOR USER INPUT │
//│ 3  │ TRACKING USER INPUT            │
//│ 4  │ USER SAVE OR CANCEL            │
//└─────────────────────────────────────┘

const CONTROLER_1_LOADING
    = [   "onLoad" ];

const CONTROLER_2_READY
    = [   "onReady"
        , "showPlaceholder" ];

const CONTROLER_3_INPUT
    = [   "onRowSelect"
        , "loadDraft"
        , "highlightRow"
        , "setSaveButton"
        , "showAutoSave"
        , "dataLoadDraft"
    ];

const CONTROLER_4_UPDATE
    = [   "onCancel"
        , "onSaveClick"
        , "viewSaveDraft"
        , "clearAutoSave"
    ];

const CONTROL_PHASE_FN_ARRAY
    = [   { phase: "LOADING", fn_array: CONTROLER_1_LOADING }
        , { phase: "READY"  , fn_array: CONTROLER_2_READY   }
        , { phase: "INPUT"  , fn_array: CONTROLER_3_INPUT   }
        , { phase: "UPDATE" , fn_array: CONTROLER_4_UPDATE  }
    ];
//}}}
/*_ get_ctrl_fn  {{{*/
let get_ctrl_fn = function( msg )
{
    if(!msg) return "";

        for(    let             {         fn_array } of CONTROL_PHASE_FN_ARRAY)
            for(let               fn   of fn_array )
                if( msg.includes( fn ) )
                    return        fn;
    return "";
};
/*}}}*/
/*_ get_ctrl_phase  {{{*/
let get_ctrl_phase = function(fn_arg)
{
    if(!fn_arg) return "";

    for(    let     { phase , fn_array } of CONTROL_PHASE_FN_ARRAY)
        for(let               fn   of fn_array )
            if(     fn_arg == fn )
                return     phase;

    return "";
};
/*}}}*/
/*_ get_view_fn {{{*/
const VIEW_FUNCTION_NAMES = [ /*{{{*/
      "add_notes_DETAILS"
    , "input_listener"
    , "layout_notes"
    , "load_input"
    , "reset_input"
    , "save_input"
    , "smTracerViewPort"
];
/*}}}*/
let get_view_fn = function( caller )
{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ VIEW PHASE [caller]
    //└────────────────────────────────────────────────────────────────────────┘
    for(let i=0; i < VIEW_FUNCTION_NAMES.length; ++i)
    {
        if(          VIEW_FUNCTION_NAMES[i].includes( caller ))
            return   VIEW_FUNCTION_NAMES[i];
    }
    return "";
};
/*}}}*/
/*_ get_data_fn {{{*/
const DATA_FUNCTION_NAMES = [ /*{{{*/
      "add_notes_GUI"
    , "ch ← note_2_onclick_import"
    , "note_1_onclick_save"
    , "placeholder"
    , "reset_input_placeholder"
    , "save_note_auto"
    , "set_editing_note_index"
];
/*}}}*/
let get_data_fn = function( caller )
{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ DATA PHASE [caller]
    //└────────────────────────────────────────────────────────────────────────┘
    for(let i=0; i < DATA_FUNCTION_NAMES.length; ++i)
    {
        if(          DATA_FUNCTION_NAMES[i].includes( caller ))
            return   DATA_FUNCTION_NAMES[i];
    }
    return "";
};
/*}}}*/
/*_ get_ctrl_style {{{*/
/*{{{*/
const PHASE_0_STYLE =   "padding: 0 1em; border-radius: 1em; border: 4px dashed   red;";
const PHASE_1_STYLE =   "padding: 0 1em; border-radius: 1em; border: 1px solid  brown;";
const PHASE_2_STYLE =   "padding: 0 1em; border-radius: 1em; border: 1px solid    red;";
const PHASE_3_STYLE =   "padding: 0 1em; border-radius: 1em; border: 1px solid orange;";
const PHASE_4_STYLE =   "padding: 0 1em; border-radius: 1em; border: 1px solid yellow;";
/*}}}*/
let get_ctrl_style = function(phase)
{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ [msg]   ● CTRL STATE
    //└────────────────────────────────────────────────────────────────────────┘
    return (phase == CONTROL_PHASE_FN_ARRAY[0].phase) ? PHASE_1_STYLE
        :  (phase == CONTROL_PHASE_FN_ARRAY[1].phase) ? PHASE_2_STYLE
        :  (phase == CONTROL_PHASE_FN_ARRAY[2].phase) ? PHASE_3_STYLE
        :  (phase == CONTROL_PHASE_FN_ARRAY[3].phase) ? PHASE_4_STYLE
        :                                               PHASE_0_STYLE
    ;
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ IDL CONTRACT: ViewPort Adapter Builder                      ● js_notes     │
//├────────────────────────────────────────────────────────────────────────────┤
/*  createViewAdapter {{{*/
let createViewAdapter = function(view = {})
{

    let new_instance;
//try {
    new_instance = {

        //┌────────────────────────────────────────────────────────────────────┐
        //│ LOADING                                                            │
        //└────────────────────────────────────────────────────────────────────┘
/*1*/   onLoad          : (                caller) =>   log("VIEW: onLoad          LOADED (Injecting Note App GUI)"              , "init"  , caller ),

        //┌────────────────────────────────────────────────────────────────────┐
        //│ READY                                                              │
        //└────────────────────────────────────────────────────────────────────┘
/*2*/   onReady         : (                caller) =>   log("VIEW: onReady         DOM Ready (Entering idle_state)"              , "start" , caller ),
/*2*/   showPlaceholder : (txt           , caller) =>   log(`VIEW: showPlaceholder Set Placeholder: "${txt}"`                    , "info"  , caller ),

        //┌────────────────────────────────────────────────────────────────────┐
        //│ INPUT                                                              │
        //└────────────────────────────────────────────────────────────────────┘
/*3*/   onRowSelect     : (id            , caller) =>   log(`VIEW: onRowSelect     Row Selected (ID: ${id})`                     , "info"  , caller ),
/*3*/   highlightRow    : (id            , caller) =>   log(`VIEW: highlightRow    Highlight Row ID: ${id}`                      , "info"  , caller ),
/*3*/   loadDraft       : (txt           , caller) =>   log(`VIEW: loadDraft       Uncommited Draft "${txt}"`                    , "info"  , caller ),
/*3*/   setSaveButton   : (enabled, label, caller) =>   log(`VIEW: setSaveButton   ENABLED [${enabled}] LABEL [${label}]`        , "info"  , caller ),
/*3*/   showAutoSave    : (draft  , id   , caller) =>   log(`VIEW: showAutoSave    Auto-Save Preview: ID=${id} Draft="${draft}"` , "info"  , caller ),
/*3*/   dataLoadDraft   : (val           , caller) => { log(`VIEW: dataLoadDraft   DATA → VIEW ["${val}"]`                       , "info"  , caller );
            /******/                               return    view .dataLoadDraft
                /**/                                       ? view .dataLoadDraft( val)
                /**/                                       :       undefined;
        },

        //┌────────────────────────────────────────────────────────────────────┐
        //│ UPDATE                                                             │
        //└────────────────────────────────────────────────────────────────────┘
/*4*/   onCancel        : (                caller) =>   log("VIEW: onCancel        Cancel Triggered"                             , "info"  , caller ),
/*4*/   onSaveClick     : (                caller) =>   log("VIEW: onSaveClick     Save Button Clicked"                          , "action", caller ),
/*5*/   viewSaveDraft   : (txt           , caller) => {
            /******/                               let val = view .viewSaveDraft
                /**/                                       ? view .viewSaveDraft(txt)
                /**/                                       :       "";
            /******/                                    log(`VIEW: viewSaveDraft   VIEW → DATA ["${txt}"]`                       , "info"  , caller );
            /******/                               return val;
        },
/*2*/   clearAutoSave   : (                caller) =>   log("VIEW: clearAutoSave   Clear Auto-Save Row"                          , "info"  , caller )
    };
    return new_instance;
//}
};
/*}}}*/
//└────────────────────────────────────────────────────────────────────────────┘

//┌────────────────────────────────────────────────────────────────────────────┐
//│ IDL CONTRACT: DataPort Adapter Builder                      ● notes        │
//├────────────────────────────────────────────────────────────────────────────┤
/*_   createDataAdapter {{{*/
let createDataAdapter = function(model={})
{
    return {
        list            : async (     caller) => { log("DATA: Requested List"                                 , "action", caller ); return typeof model.list   == "function" ? await model.list  (     ) :   []; },
        get             : async (id,  caller) => { log(`DATA: Request Note ID: ${id}`                         , "action", caller ); return typeof model.get    == "function" ? await model.get   ( id  ) : null; },
        create          : async (rec, caller) => { log(`DATA: Create Note: "${rec.text.substring(0, 20)}..."` , "action", caller ); return typeof model.create == "function" ? await model.create( rec ) : null; },
        update          : async (rec, caller) => { log(`DATA: Update Note ID: ${rec.id}`                      , "action", caller ); return typeof model.update == "function" ? await model.update( rec ) : null; },
        remove          : async (id,  caller) => { log(`DATA: Delete Note ID: ${id}`                          , "action", caller ); return typeof model.remove == "function" ? await model.remove( id  ) : null; },
        syncToServer    :       (rec, caller) =>   log(`DATA: Sync to Server: ID=${rec.id}`                   , "info"  , caller ),
        fetchFromServer :       (     caller) =>   log("DATA: Fetch from Server"                              , "action", caller )
    };
};
  /*}}}*/
//└────────────────────────────────────────────────────────────────────────────┘

//┌────────────────────────────────────────────────────────────────────────────┐
//│ Builder API                                                                │
//├────────────────────────────────────────────────────────────────────────────┤
/*{{{*/
    return { log, logging
        ,    createViewAdapter
        ,    createDataAdapter
        // DEBUG
        , get_ctrl_fn
        , get_ctrl_phase
        , get_ctrl_style
        , get_data_fn
        , get_view_fn
    };
/*}}}*/
//└────────────────────────────────────────────────────────────────────────────┘

};
globalThis.smTracer = createSMTracer();

//┌────────────────────────────────────────────────────────────────────────────┐
//│ Devtools console snippets:                                                 │
//├────────────────────────────────────────────────────────────────────────────┤
//{{{
/*

● TEST HELPERS:
j0"*yi]
[
    console.log( smTracer().get_ctrl_fn   ( "VIEW: onSaveClick" ))

    console.log( smTracer().get_ctrl_phase( "onLoad"            ))
    console.log( smTracer().get_ctrl_phase( "onSaveClick"       ))

    console.log( smTracer().get_ctrl_style( "LOADING"           ))
    console.log( smTracer().get_ctrl_style( "READY"             ))
    console.log( smTracer().get_ctrl_style( "INPUT"             ))
    console.log( smTracer().get_ctrl_style( "UPDATE"            ))

    console.log( smTracer().get_view_fn   ( "save_input"        ))
]
*/
//}}}
//└────────────────────────────────────────────────────────────────────────────┘
