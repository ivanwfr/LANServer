//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_MODEL.js      ● $APROJECTS/LANServer/SERVER       ● _TAG (260923:22h:29) │
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
/* globals    notes  */
/* globals js_notes  */

//}}}
const js_MODEL   = (function () {

    // ● log-items inlining ● SERVER/scripts/js_log.js {{{
    /* eslint-disable no-unused-vars */

    let log                                        = js_log.log;
    let is_logging                                 = js_log.is_logging;
    let console_clear                              = js_log.console_clear;

    let ellipsis                                   = js_log.ellipsis;
    let get_src_link                               = js_log.get_src_link;

    let [lf0,lf1,lf2,lf3,lf4,lf5,lf6 ,lf7,lf8,lf9] = js_log.lfX;
    let [lb0,lb1,lb2,lb3,lb4,lb5,lb6 ,lb7,lb8,lb9] = js_log.lbX;
    let lbB                                        = js_log.lbB;
    let lbX                                        = js_log.lbX;

    /* eslint-enable  no-unused-vars */
    //}}}

    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PRIVATE
    //└────────────────────────────────────────────────────────────────────────┘



    //┌────────────────────────────────────────────────────────────────────────┐
    //│ PUBLIC
    //└────────────────────────────────────────────────────────────────────────┘
    /*  save    ● note_1_onclick_save {{{*/
    let save    = function( payload )
    {
        // log {{{
        let caller = "MODEL\t● save";
        if( is_logging() )
        {
            log("%c"+caller                                             , lb1     );
            log("%c● payload.....:\t%c["+ JSON.stringify(payload) +"]"  , lf1, lb7);
        }
        log("%c● SM CALLING notes.note_1_onclick_save"    , lb1+lbB);
        //}}}
                            notes.note_1_onclick_save({},payload   );
    };
    /*}}}*/
    /*  edit    ● note_5_onclick_edit {{{*/
    let edit    = function( noteId )
    {
        //{{{
        let caller = "MODEL\t● edit";
        if( is_logging() )
        {
            log("%c"+caller                                             , lb1     );
            log("%c● noteId......:\t%c["+ noteId                        , lf1, lb7);
        }
        log("%c● SM CALLING js_notes.note_5_onclick_edit"  , lb1+lbB);
        //}}}
                            js_notes.note_5_onclick_edit({}, parseInt(noteId) );
    };
    /*}}}*/
    /*  remove  ● note_6_onclick_delete {{{*/
    let remove  = function( noteId )
    {
        //{{{
        let caller = "MODEL\t● remove";
        if( is_logging() )
        {
            log("%c"+caller                                             , lb1     );
            log("%c● noteId......:\t%c["+ noteId                        , lf1, lb7);
        }
        log("%c● SM CALLING notes.note_6_onclick_delete"  , lb1+lbB);
        //}}}
                            notes.note_6_onclick_delete({}, noteId );
    };
    /*}}}*/
    // return  ● edit ● save ● remove {{{
    let get_editing_note_index = function()
    {
        return js_notes.get_editing_note_index();
    };
    return { edit
        ,    save
        ,    remove
        ,    get_editing_note_index
    };
    //}}}


})();
