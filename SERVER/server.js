//┌────────────────────────────────────────────────────────────────────────────┐
/*│ server.js                 */ const SERVER_JS_TAG = "server (261001:02h:35)";
//└────────────────────────────────────────────────────────────────────────────┘

let server = (function() {
"use strict";

//┌────────────────────────────────────────────────────────────────────────────┐
//│ REQUIRE
//└────────────────────────────────────────────────────────────────────────────┘
//● Node.js Modules:    ● fsu http https {{{
let   fs                        = require("fs"   );
let   http                      = require("http" );
let   https                     = require("https");
//}}}
//● Server  Modules:    ● log header listener network notes qtext {{{
let server0_log      = require("./server0_log.js");
let server1_network  = require("./server1_network.js");
let server2_listener = require("./server2_listener.js");
let server3_header   = require("./server3_header.js");
let server4_file     = require("./server4_file.js");
let server5_content  = require("./server5_content.js");
let server6_notes    = require("./server6_notes.js");
//}}}
//● Server   Config:    ● HTTPS_CERT PORT LAN_FOLDER {{{
// default values {{{
let   config =
{     LOAD_STATUS               : ""

    , PORT_HTTP                 :  81
    , PORT_HTTPS                : 444
};
const CONFIG_JSON               = "config.json" ;
const CONFIG_DEV_JSON           = "config_dev.json" ;
//}}}
// logging {{{
let config_LOAD_STATUS_log = function( msg )
{
    config       .LOAD_STATUS
        = (config.LOAD_STATUS ? LF:"")
        +  msg;
};
//}}}
// onload fuzzy config load ● (DEV VERSION HAS PRIORITY) {{{

let config_json
    = "../"
    + (fs.existsSync(CONFIG_DEV_JSON)
       ?             CONFIG_DEV_JSON
       :             CONFIG_JSON     );

try {
    config                = require(   config_json );
    config_LOAD_STATUS_log( `CONFIG [${config_json}]`);
}
catch(ex) {
    let cwd = process.cwd().replace(/\\/g,"/");
    config_LOAD_STATUS_log(       "****************************************"         + LF
                                + "*** ERROR WHILE LOADING FILE ["+ config_json  +"]"+ LF
                                + "*** IN FOLDER ["+                cwd          +"]"+ LF
                                + "*** "+ ex.message.replace(/\n/g,"\n*** ")         + LF
                                + "****************************************"             );
}
/*}}}*/
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ INLINING
//└────────────────────────────────────────────────────────────────────────────┘
//{{{
/* eslint-disable no-unused-vars */
let { log
    ,    toggle
    ,    is_logging
    ,    is_tagging
    ,    ellipsis

    ,    N

    ,    R
    ,    G
    ,    B

    ,    M
    ,    C
    ,    Y

    ,    log_N

    ,    log_R
    ,    log_G
    ,    log_B

    ,    log_C
    ,    log_M
    ,    log_Y

    ,    log_X

    ,    LF
    ,    ESC

    ,    TRACE_OPEN
    ,    TRACE_CLOSE

} = server0_log;
/* eslint-enable  no-unused-vars */
//}}}

//┌────────────────────────────────────────────────────────────────────────────┐
//│ SERVER
//└────────────────────────────────────────────────────────────────────────────┘
/*➔ createServer .. [http__server] [https_server] {{{*/
/*{{{*/
let http__server;
let https_server;
/*}}}*/
let createServer = function()
{

    /* [HTTP ] {{{*/
    try {
        http__server = http .createServer();
      //server1_network.set_http__server( http__server );
    }
    catch(ex) { log_R(ex); }

    /*}}}*/
    /* [HTTPS] {{{*/
    try {
        let ssl_options
            = {    key: fs.readFileSync(config.KEY_PEM )
                , cert: fs.readFileSync(config.CERT_PEM)
            };

        https_server    = https.createServer( ssl_options );
      //server1_network.set_https_server( https_server );
    }
    catch(ex) { log_R(ex);
        config.LOAD_STATUS
            = `ERROR    : https(ssl_options) ➔ ${ex.code}\n`
            + config.LOAD_STATUS;
    }
    /*}}}*/

    /* [PORT] {{{*/
    if(http__server) http__server.listen ( config.PORT_HTTP  ||  84);
    if(https_server) https_server.listen ( config.PORT_HTTPS || 447);

    /*}}}*/
    /* LISTEN {{{*/
    server2_listener.onload({ config });
    if(http__server) http__server.addListener("request", server2_listener.dispatch);
    if(https_server) https_server.addListener("request", server2_listener.dispatch);

    /*}}}*/

    let modules
        = [ server
        ,   server0_log
        ,   server1_network
        ,   server2_listener
        ,   server3_header
        ,   server4_file
        ,   server5_content
        ,   server6_notes
        ];

    server4_file   .onload({ config });
    server5_content.onload({ config });
    server1_network.onload({ config , config_json , https_server , http__server , modules });

    /* STATUS {{{*/
    server1_network.log_STATUS();

    /*}}}*/
};
/*}}}*/

// return ● createServer {{{
return { name: SERVER_JS_TAG
    ,    createServer
};
//}}}
})();
// module.exports ● createServer {{{
try { module.exports = server; server.createServer();   } catch(ex) { console.log(ex.message); console.trace(); }
//}}}
