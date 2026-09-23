//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_MODEL.js      ● $APROJECTS/LANServer/SERVER       ● _TAG (260923:02h:31) │
//├────────────────────────────────────────────────────────────────────────────┤
//| SKELTON FOR SERVER/scripts/notes.js
//└────────────────────────────────────────────────────────────────────────────┘
// eslint {{{

/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */

/* globals  js_log   */
                        //┌─────────────┐
/* exported js_MODEL */ //│ ● Model     │
/* -------- js_VIEW  */ //│ - View      │
/* globals  js_CNTRL */ //│ - Controler │
                        //└─────────────┘
/* globals  notes    */

//}}}
const js_MODEL   = (function () {

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ● INLINING                                  ● SERVER/scripts/js_log.js │
    //└────────────────────────────────────────────────────────────────────────┘
    // ...log-items {{{
    /* eslint-disable no-unused-vars */
    let log                                       = js_log.log;
    let ellipsis                                  = js_log.ellipsis;
    let is_logging                                = js_log.is_logging;

    let [lb0,lb1,lb2,lb3,lb4,lb5,lb6,lb7,lb8,lb9] = js_log.lbX;
    let lbB                                       = js_log.lbB;
    let lbX                                       = js_log.lbX;
    /* eslint-enable  no-unused-vars */
    //}}}

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PRIVATE
    //└────────────────────────────────────────────────────────────────────────┘



    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PUBLIC
    //└────────────────────────────────────────────────────────────────────────┘
    /*  save   ● note_1_onclick_save {{{*/
    let save   = function( payload )
    {
        //{{{
        let caller = "MODEL\t● save";
        if( is_logging() )
        {
            log("%c"+caller                                             , lb1     );
            log("%c● payload.....:\t%c["+ JSON.stringify(payload) +"]"  , lb1, lb7);
        }
        //}}}
        log("%c● SM CALLING notes.note_1_onclick_save"    , lb1+lbB);
                            notes.note_1_onclick_save({},payload   );
    };
    /*}}}*/
    /*  remove ● note_6_onclick_delete {{{*/
    let remove = function( noteId )
    {
        //{{{
        let caller = "MODEL\t● remove";
        if( is_logging() )
        {
            log("%c"+caller                                             , lb1     );
            log("%c● noteId......:\t%c["+ noteId                        , lb1, lb7);
        }
        //}}}
        log("%c● SM CALLING notes.note_6_onclick_delete"  , lb1+lbB);
                            notes.note_6_onclick_delete({}, noteId );
    };
    /*}}}*/
    // return ● save ● remove {{{
    return { save
        ,    remove
    };
    //}}}


})();







//┌────────────────────────────────────────────────────────────────────────┐
//│ notes API                                      SERVER/scripts/notes.js │
//├────────────────────────────────────────────────────────────────────────┤
//│{{{
//│ return { name: "notes"
//│     // GUI
//│     ,    add_notes_GUI
//│     ,    note_scrollIntoView
//│     ,    standout_note_at_index
//│     ,    update_summary
//│     ,    PLACEHOLDER_CREATE_PROMPT
//│
//│     // STORAGE
//│     ,    get_nArray             : () => nArray
//│     ,    load_notes
//│     ,    upload_notes_to_server
//│     ,    request_server_upload
//│     ,    request_server_upload_pending
//│     ,    get_notes_loaded_from  : () => notes_loaded_from
//│
//│     // SAVE
//│ ✔   ,    note_1_onclick_save            //...onclick
//│
//│     // EDIT
//│ ✔   ,    note_5_onclick_edit            //...onclick
//│     ,    set_editing_note_index
//│     ,    get_editing_note_index
//│     ,    save_note_auto
//│     ,    is_input_same_as_original
//│     ,    is_input_same_as_last_auto_save
//│     ,    is_last_note_auto_save
//│
//│     // DELETE
//│ ✔   ,    note_6_onclick_delete          //...onclick
//│
//│     // WASTED
//│ ✔   ,    note_7_onclick_wasted          //...onclick
//│
//│     // CHECK
//│ ✔   ,    note_4_onclick_check           //...onclick
//│     ,    get_checked
//│
//│     // IMPORT-EXPORT
//│ ✔   ,    note_2_onclick_import          //...onclick
//│ ✔   ,    note_3_onclick_export          //...onclick
//│     ,    center_input_placeholder
//│     ,    reset_input_placeholder
//│     // DEBUG
//│     , scroll_TR_intoView
//│     , note_7_onclick_wasted_get_buffer
//│ };
//│}}}
//└────────────────────────────────────────────────────────────────────────┘
