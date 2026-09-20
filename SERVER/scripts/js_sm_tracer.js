//┌────────────────────────────────────────────────────────────────────────────┐
//│ sm_tracer.js ● $APROJECTS/LANServer/SERVER          ● _TAG (260920:02h:03) │
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
let log_this = false; // ● default logging state

//┌────────────────────────────────────────────────────────────────────────────┐
//│ LOGGING TRACE STYLE ● f(error, phase, caller)               ● js_sm_tracer │
//├────────────────────────────────────────────────────────────────────────────┤
//│ CTRL PHASE  ● f(msg)                                                       │
//│ DATA EVENT  ● f(caller)                                                    │
//│ VIEW EVENT  ● f(caller)                                                    │
//└────────────────────────────────────────────────────────────────────────────┘
/*  log {{{*/
/*{{{*/
const TRACE_STYLE   = "background: #61dafb; color: #000; font-weight: bold;";
const ERROR_STYLE   = "background: #ff4444; color: #fff; font-weight: bold;";
const   MSG_STYLE   = "background: #000000; color: #4FA; font-weight: bold;";
/*}}}*/
let log = function(msg, type, caller)
{
if(!log_this) return;

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
    let MVC         = get_data_fn   ( caller ) ? "🟢 M":""
        +             get_view_fn   ( caller ) ? "🟡 V":""
        +             get_ctrl_fn   ( caller ) ? "⚫ C":""
    ;


    msg    = msg   .padEnd(80);
    phase  = phase .padEnd(10);
    caller = caller.padEnd(25);

    console.log("%c SM-TRACE %c "+ msg +"%c"+ phase +" 🢀 "+ caller + MVC
                ,head_style ,MSG_STYLE  ,phase_style                    );
};
/*}}}*/
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
        , "onDraftInput"
    ];

const CONTROLER_4_UPDATE
    = [   "onCancel"
        , "onSaveClick"
        , "saveDraft"
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
    if(!msg) return null;

        for(    let             {         fn_array } of CONTROL_PHASE_FN_ARRAY)
            for(let               fn   of fn_array )
                if( msg.includes( fn ) )
                    return        fn;
    return null;
};
/*}}}*/
/*_ get_ctrl_phase  {{{*/
let get_ctrl_phase = function(fn_arg)
{
    if(!fn_arg) return null;

    for(    let     { phase , fn_array } of CONTROL_PHASE_FN_ARRAY)
        for(let               fn   of fn_array )
            if(     fn_arg == fn )
                return     phase;

    return null;
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
    , "sm_tracer_viewPort"
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
let createViewAdapter = function( existingView )
{

    let new_instance;
try {
    new_instance = {
/*1*/   onLoad          : (                caller) =>   log("VIEW: onLoad          LOADED (Injecting Note App GUI)"              , "init"  , caller ),
/*2*/   onReady         : (                caller) =>   log("VIEW: onReady         DOM Ready (Entering idle_state)"              , "start" , caller ),
        //┌────────────────────────────────────────────────────────────────────┐
        //│ *DraftInput* ➔ RENAME TO *UserInput*
        //└────────────────────────────────────────────────────────────────────┘
/*3*/   onDraftInput    : (value         , caller) => { log(`VIEW: onDraftInput    Draft Input: "${value}"`                      , "info"  , caller);
            /******/                                    return  existingView.onDraftInput
                /**/                                            ?   existingView.onDraftInput( value )
                /**/                                            :   undefined;
        },
/*3*/   onRowSelect     : (id            , caller) =>   log(`VIEW: onRowSelect     Row Selected (ID: ${id})`                     , "info"  , caller ),
/*4*/   onSaveClick     : (                caller) =>   log("VIEW: onSaveClick     Save Button Clicked"                          , "action", caller ),
/*4*/   onCancel        : (                caller) =>   log("VIEW: onCancel        Cancel Triggered"                             , "info"  , caller ),

        //┌────────────────────────────────────────────────────────────────────┐
        //│ Render methods (passive only)
        //└────────────────────────────────────────────────────────────────────┘
/*2*/   showPlaceholder : (text          , caller) =>   log(`VIEW: showPlaceholder Set Placeholder: "${text}"`                   , "info"  , caller ),
/*3*/   setSaveButton   : (enabled, label, caller) =>   log(`VIEW: setSaveButton   ENABLED [${enabled}] LABEL [${label}]`        , "info"  , caller ),
/*3*/   highlightRow    : (id            , caller) =>   log(`VIEW: highlightRow    Highlight Row ID: ${id}`                      , "info"  , caller ),
/*3*/   showAutoSave    : (draft  , id   , caller) =>   log(`VIEW: showAutoSave    Auto-Save Preview: ID=${id} Draft="${draft}"` , "info"  , caller ),
/*2*/   clearAutoSave   : (                caller) =>   log("VIEW: clearAutoSave   Clear Auto-Save Row"                          , "info"  , caller ),

        //┌────────────────────────────────────────────────────────────────────┐
        //│ RENAME [*readDraft*]  TO [*saveDraft*]   ● js_notes.save_input
        //└────────────────────────────────────────────────────────────────────┘
/*5*/   saveDraft       : (text          , caller) => {
            /******/                                    let v = existingView.saveDraft
                /**/                                            ?   existingView.saveDraft()
                /**/                                            :   "";
            /******/                                    log(`VIEW: saveDraft  [LOAD] Read Draft: "${v}"`                         , "info"  , caller);
            /******/                                    return v;
        },
        //┌────────────────────────────────────────────────────────────────────┐
        //│ RENAME [*writeDraft*] TO [*loadDraft*] ● js_notes.load_input
        //└────────────────────────────────────────────────────────────────────┘
/*4*/   loadDraft       : (text          , caller) => { log(`VIEW: loadDraft [SAVE] Write Draft: "${text}"`                      , "info"  , caller);
            /******/                                    return  existingView.loadDraft
                /**/                                            ?   existingView.loadDraft( text )
                /**/                                            :   undefined;
        },
        toggle : () => { log_this = !log_this; console.log("log_this: "+ log_this); }
    };
    return new_instance;
}
//┌────────────────────────────────────────────────────────────────────────────┐
//│ TRACK builder instanciations                                               │
//└────────────────────────────────────────────────────────────────────────────┘
finally {
    if(typeof globalThis.smTracer.instances == "undefined")
    {
        globalThis      .smTracer.instances = [];
        globalThis      .smTracer.instances.logging = () => log_this = !log_this;
    }

    if( new_instance )
        globalThis      .smTracer.instances.push( new_instance );

if( log_this )
 console.dir( globalThis.smTracer.instances );
}
};
/*}}}*/
//└────────────────────────────────────────────────────────────────────────────┘

//┌────────────────────────────────────────────────────────────────────────────┐
//│ IDL CONTRACT: DataPort Adapter Builder                      ● notes        │
//├────────────────────────────────────────────────────────────────────────────┤
/*_   createDataAdapter {{{*/
let createDataAdapter = function(existingData)
{
    return {
        list              : async (        caller) => { log("DATA: Requested List"                                                     , "action", caller);
            return await existingData.list ? await existingData.list() : [];
        },
        get               : async (id,     caller) => { log(`DATA: Request Note ID: ${id}`                                             , "action", caller);
            return await existingData.get ? await existingData.get(id) : null;
        },
        create            : async (rec,    caller) => { log(`DATA: Create Note: "${rec.text.substring(0, 20)}..."`                     , "action", caller);
            return await existingData.create ? await existingData.create(rec) : null;
        },
        update            : async (rec,    caller) => { log(`DATA: Update Note ID: ${rec.id}`                                          , "action", caller);
            return await existingData.update ? await existingData.update(rec) : null;
        },
        remove            : async (id,     caller) => { log(`DATA: Delete Note ID: ${id}`                                              , "action", caller);
            return await existingData.remove ? await existingData.remove(id) : null;
        },
        syncToServer      :       (rec,    caller) =>   log(`DATA: Sync to Server: ID=${rec.id}`                                       , "info"  , caller ),
        fetchFromServer   :       (        caller) =>   log("DATA: Fetch from Server"                                                  , "action", caller )
    };
};
  /*}}}*/
//└────────────────────────────────────────────────────────────────────────────┘

//┌────────────────────────────────────────────────────────────────────────────┐
//│ Builder API                                                                │
//├────────────────────────────────────────────────────────────────────────────┤
/*{{{*/
    return { log
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

// Export for IIFE pattern
globalThis.smTracer = createSMTracer;

//┌────────────────────────────────────────────────────────────────────────┐
//│ Devtools console snippets:                                             │
//├────────────────────────────────────────────────────────────────────────────┤
//{{{
/*
● TOGGLE LOGGING:
j0"*y$
smTracer.instances.logging()

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
//└────────────────────────────────────────────────────────────────────────┘
