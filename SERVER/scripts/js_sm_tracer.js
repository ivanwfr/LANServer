//┌────────────────────────────────────────────────────────────────────────────┐
//│ sm_tracer.js ● $APROJECTS/LANServer/SERVER          ● _TAG (260919:17h:09) │
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
//│ Builder logging
//└────────────────────────────────────────────────────────────────────────────┘
let log_this = true; //TODO ● CHOOSE DEFAULT LOGGING STATE
    // log DATA {{{
/*{{{*/
//nst LOG_PREFIX   =  "[%cSM-TRACE%c]";

const LOG_PREFIX   =  "%c SM-TRACE %c ";

const BG_FG_TRACE  = [ "background: #61dafb; color: #000; font-weight: bold;", "color: #888;" ];
const BG_FG_ERROR  = [ "background: #ff4444; color: #fff; font-weight: bold;", ""             ];

/*}}}*/
/*{{{*/

//┌────────────────────────────────────────────────────────────────────────────┐
//| 1    LOADING
//│     "^onLoad"
const RGEXP_1 = new RegExp( "^onLoad"
                           +"");

//├────────────────────────────────────────────────────────────────────────────┤
//| 2    READY — WAITING FOR USER INPUT
//│     "^onReady"
//│     "|highlightRow"
//│     "|showPlaceholder"
const RGEXP_2 = new RegExp( "^onReady"
                           +    "|highlightRow"
                           +    "|showPlaceholder"
                           +"");

//├────────────────────────────────────────────────────────────────────────────┤
//| 3    TRACKING USER INPUT
//│     "^onRowSelect"
//│     "|loadDraft"
//│     "|setSaveButton"
//│     "|showAutoSave"
//│     "|onDraftInput"
const RGEXP_3 = new RegExp( "^onRowSelect"
                           +    "|loadDraft"
                           +    "|setSaveButton"
                           +    "|showAutoSave"
                           +    "|onDraftInput"
                           +"");

//├────────────────────────────────────────────────────────────────────────────┤
//| 4    USER SAVE OR CANCEL
//│     "^onCancel"
//│     "|onSaveClick"
//│     "|clearAutoSave"
const RGEXP_4 = new RegExp( "^onCancel"
                           +"|onSaveClick"
                           +    "|clearAutoSave"
                           +"");

//├────────────────────────────────────────────────────────────────────────────┤
//| 5    AUTO_SAVE INTO localStorage
//│     "^saveDraft"
const RGEXP_5 = new RegExp( "^saveDraft"
                           +"");

//└────────────────────────────────────────────────────────────────────────────┘

/*}}}*/
// PHASE_0_COLOR.. PHASE_5_COLOR {{{
const PHASE_0_COLOR =   "padding: 0 1em; border-radius: 1em; border: 4px dashsed  red;";
const PHASE_1_COLOR =   "padding: 0 1em; border-radius: 1em; border: 1px solid  brown;";
const PHASE_2_COLOR =   "padding: 0 1em; border-radius: 1em; border: 1px solid    red;";
const PHASE_3_COLOR =   "padding: 0 1em; border-radius: 1em; border: 1px solid orange;";
const PHASE_4_COLOR =   "padding: 0 1em; border-radius: 1em; border: 1px solid yellor;";
const PHASE_5_COLOR =   "padding: 0 1em; border-radius: 1em; border: 1px solid  green;";
//}}}
//}}}
/*  log   function {{{*/
let log = function(msg, type, caller)
{
if(!log_this) return;
    let caller_color
        = msg.match(RGEXP_1) ? PHASE_1_COLOR
        : msg.match(RGEXP_2) ? PHASE_2_COLOR
        : msg.match(RGEXP_3) ? PHASE_3_COLOR
        : msg.match(RGEXP_4) ? PHASE_4_COLOR
        : msg.match(RGEXP_5) ? PHASE_5_COLOR
        :                      PHASE_0_COLOR
    ;

    let colors = (type === "error") ?  BG_FG_ERROR:BG_FG_TRACE;
    msg = msg.padEnd(80) +"🢀 %c"+caller;
  //console.log(...colors, LOG_PREFIX, msg, ...colors.slice(1));
    console.log(           LOG_PREFIX+ msg, ...colors         , caller_color);
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ IDL CONTRACT: ViewPort Adapter Builder                      ● js_notes.js
//└────────────────────────────────────────────────────────────────────────────┘
/*  createViewAdapter {{{*/
let createViewAdapter = function( existingView )
{
//┌─────────────────────────────────────┐
//| #  │ MARGIN PROCESSING PHASE        |
//|----│--------------------------------|
//| 1  | LOADING                        |
//| 2  | READY — WAITING FOR USER INPUT |
//| 3  | TRACKING USER INPUT            |
//| 4  | USER SAVE OR CANCEL            |
//| 5  | AUTO_SAVE INTO localStorage    |
//└─────────────────────────────────────┘

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
/*?*/   setSaveButton   : (enabled, label, caller) =>   log(`VIEW: setSaveButton   ENABLED [${enabled}] LABEL [${label}]`        , "info"  , caller ),
/*3*/   highlightRow    : (id            , caller) =>   log(`VIEW: highlightRow    Highlight Row ID: ${id}`                      , "info"  , caller ),
/*4*/   showAutoSave    : (draft, id     , caller) =>   log(`VIEW: showAutoSave    Auto-Save Preview: ID=${id} Draft="${draft}"` , "info"  , caller ),
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

//┌────────────────────────────────────────────────────────────────────────────┐
//│ IDL CONTRACT: DataPort Adapter Builder                      ● note.js
//└────────────────────────────────────────────────────────────────────────────┘
/*_   createDataAdapter {{{*/
let createDataAdapter = function(existingData)
{
    return {
        list              : async (        caller) => { log("DATA: Requested List"                                                     , "action", caller);
            return await existingData.list ? await existingData.list() : [];
        },
        get               : async (id,     caller) => { log(`DATA: Request Note ID: ${id}`                                                       , caller);
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

//┌────────────────────────────────────────────────────────────────────────────┐
//│ Builder API
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/
    return { log
        ,    createViewAdapter
        ,    createDataAdapter
    };
/*}}}*/
};

// Export for IIFE pattern
globalThis.smTracer = createSMTracer;

