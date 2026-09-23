//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_CNTRL.js        ● $APROJECTS/LANServer/SERVER    ● _TAG (260923:02h:29) │
//├────────────────────────────────────────────────────────────────────────────┤
//{{{
//│ Here is a minimal, clutter-free implementation of
//│ a State Machine using an **IIFE** pattern:
//│
//│ It uses a finite state machine table where each
//│ state defines allowed transitions, target next states,
//│ and optional async side-effects (like calls to `js_MODEL` or `GUI`)
//}}}
//└────────────────────────────────────────────────────────────────────────────┘
// eslint {{{

/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */

/* globals  js_log  */
                        //┌─────────────┐
/* globals  js_MODEL */ //│ - Model     │
/*          js_VIEW  */ //│ - View      │
/* exported js_CNTRL */ //│ ● Controler │
                        //└─────────────┘

//}}}
const js_CNTRL     = (function () {

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ● INLINING                                  ● SERVER/scripts/js_log.js │
    //└────────────────────────────────────────────────────────────────────────┘
    // ...log-items {{{
    /* eslint-disable no-unused-vars */
    let log                                       = js_log.log;
    let ellipsis                                  = js_log.ellipsis;
    let is_logging                                = js_log.is_logging;
    let get_src_link                              = js_log.get_src_link;
    let console_clear                             = js_log.console_clear;

    let [lb0,lb1,lb2,lb3,lb4,lb5,lb6,lb7,lb8,lb9] = js_log.lbX;
    let lbB                                       = js_log.lbB;
    let lbX                                       = js_log.lbX;
    /* eslint-enable  no-unused-vars */
    //}}}

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PRIVATE
    //└────────────────────────────────────────────────────────────────────────┘
    //{{{

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ INTERNAL STATE
    //└────────────────────────────────────────────────────────────────────────┘
    //  currentState listeners {{{
    let currentState = "IDLE";
    let listeners = [];
    //}}}

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ TRANSITION TABLE
    //│ ●  Current State
    //│ ●  Action
    //│ ●  Next State / Action Handler
    //└────────────────────────────────────────────────────────────────────────┘
    //    transitions {{{
    const transitions = {
        IDLE: {
            // EDITING {{{
            SELECT_NOTE: (payload) => {
                //{{{
                if( is_logging() )
                {
                    let caller = "CNTRL\t● IDLE ● SELECT_NOTE";
                    log("%c"+caller                                             , lb3     );
                    log("%c● payload.....:\t%c["+ JSON.stringify(payload)   +"]", lb3, lb1);
                }
                //}}}
                changeState("EDITING", payload);
            },
            //}}}
            // SAVE_NOTE {{{
            SAVE_NOTE: async (payload) => {
                //{{{
                if( is_logging() )
                {
                    let caller = "CNTRL\t● IDLE ● SAVE_NOTE";
                    log("%c"+caller                                             , lb3     );
                    log("%c● payload.....:\t%c["+ JSON.stringify(payload)   +"]", lb3, lb1);
                }
                //}}}
                changeState("SAVING"  );
                const               savedNote = await js_MODEL.save(payload);
                changeState("IDLE", savedNote);
            },
            //}}}
            // DELETE_NOTE {{{
            DELETE_NOTE: async (noteId) => {
                //{{{
                if( is_logging() )
                {
                    let caller = "CNTRL\t● IDLE ● DELETE_NOTE";
                    log("%c"+caller                                             , lb3     );
                    log("%c● noteId......:\t%c["+ noteId                    +"]", lb3, lb1);
                }
                //}}}
                changeState("DELETING", noteId);
                await js_MODEL.remove( noteId );
                changeState("IDLE"    );
            }
            //}}}
        },
        EDITING: {
            // SAVE_NOTE {{{
            SAVE_NOTE: async (payload) => {
                //{{{
                if( is_logging() )
                {
                    let caller = "CNTRL\t● EDITING ● SAVE_NOTE";
                    log("%c"+caller                                             , lb3     );
                    log("%c● payload.....:\t%c["+ JSON.stringify(payload)   +"]", lb3, lb1);
                }
                //}}}
                changeState("SAVING", payload);
                const               savedNote = await js_MODEL.save( payload );
                changeState("IDLE", savedNote);
            },
            //}}}
            // DELETE_NOTE {{{
            DELETE_NOTE: async (noteId) => {
                //{{{
                if( is_logging() )
                {
                    let caller = "CNTRL\t● EDITING ● DELETE_NOTE";
                    log("%c"+caller                                             , lb3     );
                    log("%c● noteId......:\t%c["+ noteId                    +"]", lb3, lb1);
                }
                //}}}
                changeState("DELETING", noteId);
                await js_MODEL.remove( noteId );
                changeState("IDLE"    );
            },
            //}}}
            // CANCEL {{{
            CANCEL: () => {
                //{{{
                if( is_logging() )
                {
                    let caller = "CNTRL\t● EDITING ● CANCEL";
                    log("%c"+caller                                             , lb3     );
                }
                //}}}
                changeState("IDLE");
            }
            //}}}
        },
        SAVING: () => {   // Lock actions during network/persistence calls
            //{{{
            if( is_logging() )
            {
                let caller = "CNTRL\t● SAVING";
                log("%c"+caller                                             , lb3     );
            }
            //}}}
            changeState("IDLE");
        },
        DELETING: () => {  // Lock actions during network/persistence calls
            //{{{
            if( is_logging() )
            {
                let caller = "CNTRL\t● DELETING";
                log("%c"+caller                                             , lb3     );
            }
            //}}}
        }
    };
    //}}}

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ HELPER TO SAFELY TRANSITION AND NOTIFY SUBSCRIBERS
    //└────────────────────────────────────────────────────────────────────────┘
    let changeState = function(newState, data = null) { //{{{
        //{{{
        let caller = "CNTRL\t● changeState";
        if( is_logging() )
        {
            log("%c"+caller                                             , lb3     );
            log("%c● called_by.:\t%c" +   get_src_link()                , lb3, lb0);
            log("%c● currentState:\t%c["+ currentState              +"]", lb3, lb1);
            log("%c● newState....:\t%c["+ newState                  +"]", lb3, lb2);
            log("%c● data........:\t%c["+ JSON.stringify(data)      +"]", lb3, lb3);
        }
        //}}}
        currentState = newState;

        listeners.forEach((listener) => listener(currentState, data));
    };
    //}}}

    //}}}

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PUBLIC ADAPTER API
    //└────────────────────────────────────────────────────────────────────────┘
    // subscribe {{{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Registers a listener callback to be called whenever state changes
    //│
    //│ @param {Function} listenerFn - Callback: (state, payload) => void
    //└────────────────────────────────────────────────────────────────────────┘
    let subscribe = function( listenerFn )
    {
        //{{{
        let caller = "CNTRL\t● subscribe";
        if( is_logging() )
        {
            log("%c"+caller                                             , lb3     );
            log("%c● listenerFn.\t%c["+ listenerFn.name             +"]", lb3, lb1);
        }
        //}}}

        //┌────────────────────────────────────────────────────────────────────┐
        //│ REGISTER
        //└────────────────────────────────────────────────────────────────────┘
        listeners.push( listenerFn );

        //┌────────────────────────────────────────────────────────────────────┐
        //│ NOTIFY
        //│ Immediately notify listener of current state upon subscription
        //└────────────────────────────────────────────────────────────────────┘
        if( is_logging() ) log("%cnotifying listener"                   , lb3);
        listenerFn(currentState, null);

    };
    //}}}
    // transition {{{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Attempts to trigger a transition based on user intent/action
    //│
    //│ @param {string} actionName - e.g., "SAVE_NOTE", "SELECT_NOTE"
    //│ @param {any} payload - Optional payload (e.g., note content or ID)
    //└────────────────────────────────────────────────────────────────────────┘
    let transition = function(actionName, payload)
    {
        const stateRules    = transitions[ currentState ];
        const actionHandler = stateRules [ actionName   ];
        //{ {{
        let caller = "CNTRL\t● transition "+ actionName;
        if( is_logging() )
        {
            console_clear(caller);
            log("%c"+caller                                             , lb3);
            log("%c● called_by.:\t%c" +   get_src_link()                , lb3, lb0);
            log("%c● actionName:\t%c["+   actionName                +"]", lb3, lb1);
            log("%c● payload...:\t%c["+   JSON.stringify(payload)   +"]", lb3, lb3);
            log("%c"+("                  currentState  " ).padStart(32) +"%c"+              currentState        , lb7, lb8);
            log("%c"+(" transitions["+ currentState +"] ").padStart(32) +"%c"+ transitions[ currentState ]?.name, lb7, lb8);
            log("%c"+("  stateRules["+ actionName   +"] ").padStart(32) +"%c"+ stateRules [ actionName   ]?.name, lb7, lb8);
            log("%c"+("                 actionHandler  " ).padStart(32) +"%c"+              actionHandler ?.name, lb7, lb8);
        }
        //}} }

        if(typeof actionHandler === "function")
        {
            actionHandler( payload );
        }
        else {
            log(`%c Action "${actionName}" is invalid in state "${currentState}".`, lbB+lb3);
        }
    };
    //}}}
    // getState {{{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ Returns current state string
    //└────────────────────────────────────────────────────────────────────────┘
    let getState = function()
    {
        //{{{
        let caller = "CNTRL\t● getState";
        if( is_logging() )
        {
            log("%c"+caller                                             , lb3);
            log("%c● currentState.\t%c["+ currentState              +"]", lb3, lb1);
        }
        //}}}
        return currentState;
    };
    //}}}
    //{{{
    return { subscribe
        ,    transition
        ,    getState
        // DEBUG
        , transitions
    };
    //}}}

})();

//┌────────────────────────────────────────────────────────────────────────────┐
//│ ### KEY TAKEAWAYS FROM THIS IMPLEMENTATION:
//{{{
//│ 1. **State Isolation**: Actions in transient states
//│ (`SAVING`, `DELETING`) are omitted in the lookup
//│ table. Any user clicks arriving while in these states
//│ are automatically ignored
//│
//│ 2. **Predictable Flow**: The state machine directly
//│ manages the async boundary with `js_MODEL`, then cleanly
//│ transitions back to `IDLE` before updating listeners.
//}}}
//└────────────────────────────────────────────────────────────────────────────┘

