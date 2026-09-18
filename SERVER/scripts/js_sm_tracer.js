//┌────────────────────────────────────────────────────────────────────────────┐
//│ sm_tracer.js ● $APROJECTS/LANServer/SERVER          ● _TAG (260918:00h:39) │
//├────────────────────────────────────────────────────────────────────────────┤
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

let createSMTracer = function()
{

//┌────────────────────────────────────────────────────────────────────────┐
//│ log ● Helper to log with visual distinction
//└────────────────────────────────────────────────────────────────────────┘
/* log {{{*/
/*{{{*/
//nst LOG_PREFIX   =  "[%cSM-TRACE%c]";

const LOG_PREFIX   =  "%c SM-TRACE %c ";

const BG_FG_TRACE  = [ "background: #61dafb; color: #000; font-weight: bold;", "color: #888;" ];
const BG_FG_ERROR  = [ "background: #ff4444; color: #fff; font-weight: bold;", ""             ];

/*}}}*/
let log = function(msg, type = "info")
{
    let colors = (type === "error") ?  BG_FG_ERROR:BG_FG_TRACE;
  //console.log(...colors, LOG_PREFIX, msg, ...colors.slice(1));
    console.log(           LOG_PREFIX+ msg, ...colors         );
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────┐
//│ IDL CONTRACT: ViewPort Adapter Builder
//├────────────────────────────────────────────────────────────────────────┤
//│ ● Wraps existing [js_notes.js] methods
//└────────────────────────────────────────────────────────────────────────┘
/*  createViewAdapter {{{*/
let createViewAdapter = function( existingView )
{
/*┌────────────────────────────────────────────────────────────────────────┐*/
/*│ *…* MARGIN numbers 0=load 1=ready 2=input 3=save/cancel 4=auto_save    │*/
/*└────────────────────────────────────────────────────────────────────────┘*/

//┌─────────────────────────────────────┐
//| #  │ MARGIN PROCESSING PHASE        |
//|----│--------------------------------|
//| 0  | LOADING                        |
//| 1  | READY — WAITING FOR USER INPUT |
//| 2  | TRACKING USER INPUT            |
//| 3  | USER SAVE OR CANCEL            |
//| 4  | AUTO_SAVE INTO localStorage    |
//└─────────────────────────────────────┘


    return {
/*0*/   onLoad          : ()               =>   log("VIEW: onLoad          LOADED (Injecting Note App GUI)", "init"      ),
/*1*/   onReady         : ()               =>   log("VIEW: onReady         DOM Ready (Entering idle_state)", "start"     ),
/*2*/   onDraftInput    : (value)          => { log(`VIEW: onDraftInput    Draft Input: "${value}"`                      );
            /******/                            return    existingView.onDraftInput
                /**/                                    ?     existingView.onDraftInput( value )
                /**/                                    :     undefined;
        },
/*2*/   onRowSelect     : (id)             =>   log(`VIEW: onRowSelect     Row Selected (ID: ${id})`                     ),
/*3*/   onSaveClick     : ()               =>   log("VIEW: onSaveClick     Save Button Clicked", "action"                ),
/*3*/   onCancel        : ()               =>   log("VIEW: onCancel        Cancel Triggered"                             ),

        //┌────────────────────────────────────────────────────────────────────────┐
        //│ Render methods (passive only)
        //└────────────────────────────────────────────────────────────────────────┘
/*1*/   showPlaceholder : (text)           =>   log(`VIEW: showPlaceholder Set Placeholder: "${text}"`                   ),
/*?*/   setSaveButton   : (enabled, label) =>   log(`VIEW: setSaveButton   SaveButton [${enabled}] Label: ${label}`      ),
/*2*/   highlightRow    : (id)             =>   log(`VIEW: highlightRow    Highlight Row ID: ${id}`                      ),
/*3*/   showAutoSave    : (draft, id)      =>   log(`VIEW: showAutoSave    Auto-Save Preview: ID=${id}, Draft="${draft}"`),
/*1*/   clearAutoSave   : ()               =>   log("VIEW: clearAutoSave   Clear Auto-Save Row"),
/*4*/   readDraft       : ()               => {
            /******/                            let v = existingView.readDraft
                /**/                                    ?   existingView.readDraft()
                /**/                                    :   "";
            /******/                            log(`VIEW: readDraft       Read Draft: "${v}"`                           );
            /******/                            return v;
        },
/*4*/   writeDraft      : (text)           => { log(`VIEW: writeDraft      Write Draft: "${text}"`                       );
            /******/                            return  existingView.writeDraft
                /**/                                    ?   existingView.writeDraft( text )
                /**/                                    :   undefined;
        }
    };
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────┐
//│ IDL CONTRACT: DataPort Adapter Builder
//├────────────────────────────────────────────────────────────────────────┤
//│ ● Wraps existing [note.js] methods
//└────────────────────────────────────────────────────────────────────────┘
/*_   createDataAdapter {{{*/
let createDataAdapter = function(existingData)
{
    return {
        list              : async ()         => { log("DATA: Requested List", "action"                   );
            return await existingData.list ? await existingData.list() : [];
        },
        get               : async (id)       => { log(`DATA: Request Note ID: ${id}`                     );
            return await existingData.get ? await existingData.get(id) : null;
        },
        create            : async (rec)      => { log(`DATA: Create Note: "${rec.text.substring(0, 20)}..."`, "action");
            return await existingData.create ? await existingData.create(rec) : null;
        },
        update            : async (rec)      => { log(`DATA: Update Note ID: ${rec.id}`, "action"        );
            return await existingData.update ? await existingData.update(rec) : null;
        },
        remove            : async (id)       => { log(`DATA: Delete Note ID: ${id}`, "action"            );
            return await existingData.remove ? await existingData.remove(id) : null;
        },
        syncToServer      :       (rec)      =>   log(`DATA: Sync to Server: ID=${rec.id}`               ),
        fetchFromServer   :       ()         =>   log("DATA: Fetch from Server", "action"                )
    };
};
  /*}}}*/

  return { log
    ,      createViewAdapter
    ,      createDataAdapter
  };
};

// Export for IIFE pattern
if(typeof window !== "undefined")
{
    window.smTracer = createSMTracer;
}
