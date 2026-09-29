//┌────────────────────────────────────────────────────────────────────────────┐
/*│ server_network.js           */ const SERVER_NETWORK_TAG = "(260929:04h:10)";
//└────────────────────────────────────────────────────────────────────────────┘
/*{{{*/

/*}}}*/
let server_network = (function() {
"use strict";

//  server_log {{{
/* eslint-disable no-unused-vars */
let server_log = require("../SERVER/server_log.js");
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

} = server_log;
/* eslint-enable  no-unused-vars */
//}}}
/*{{{*/
//● Node.js ● fs http https networkInterfaces {{{
let   fs                        = require("fs"   );
let { networkInterfaces }       = require("os"   );
//}}}
//➔ config ● PORT STATUS {{{
let   config =
{     LOAD_STATUS               : ""

    , PORT_HTTP                 :  81
    , PORT_HTTPS                : 444
};

let config_LOAD_STATUS_log = function(msg)
{
    if( config.LOAD_STATUS )
        config.LOAD_STATUS +=  LF;
    else
        config.LOAD_STATUS  =  "";
    config.LOAD_STATUS     += msg;
};
/*}}}*/
//➔ config.json / config_dev.json {{{
const CONFIG_JSON               = "config.json" ;
const CONFIG_DEV_JSON           = "config_dev.json" ;
let   config_json               = "../"+(fs.existsSync( CONFIG_DEV_JSON ) ? CONFIG_DEV_JSON : CONFIG_JSON);

try {
    config                      = require(      config_json );
    config_LOAD_STATUS_log(       `CONFIG    [${config_json}]`);




} catch(ex) {
    let cwd = process.cwd().replace(/\\/g,"/");
    config_LOAD_STATUS_log(       "****************************************"         + LF
                                + "*** ERROR WHILE LOADING FILE ["+ config_json  +"]"+ LF
                                + "*** IN FOLDER ["+                cwd          +"]"+ LF
                                + "*** "+ ex.message.replace(/\n/g,"\n*** ")         + LF
                                + "****************************************"             );
}
/*}}}*/
/*}}}*/

//  server_notes {{{
let server_notes = require("../SERVER/server_notes.js");

//}}}

let started_folder      = process.cwd().replace(/\\/g,"/");
let server_top_folder   = process.cwd().replace(/\\/g,"/")+"/LAN";
/*_ log_STATUS {{{*/
let log_STATUS = function(response, https_server, http__server, modules=[]) // eslint-disable-line complexity
{
    /* CLEAR TERMINAL {{{*/
//  log_CLEAR();

    /*}}}*/
    /* CONFIG {{{*/
    /* COLORS {{{*/
    let s;
    let log_color  = config.LOAD_STATUS.includes("ERROR") ? R : M;
/*  response CSS {{{*/
if( response )
    response.write(
`<style>
.info  { background-color: #222; color: #0F3; }
.error { background-color: #222; color: #F03; }
</style>`
                  );

/*}}}*/
    /*}}}*/
    /* [config dir_items] {{{*/
    s  = "┌───────────────────────────────────────────────────────────────────── CONFIG ─┐";

    s += LF+`
│ ${SERVER_NETWORK_TAG}
├
│ CONFIG            [${config_json        }]
│ CWD               [${process.cwd()      }]
├
│ PORT_HTTP         [${config.PORT_HTTP   }]
│ PORT_HTTPS        [${config.PORT_HTTPS  }]
│  KEY_PEM          [${config. KEY_PEM    }]
│ CERT_PEM          [${config.CERT_PEM    }]
├
    `.trim();

    modules.forEach((m) => { s += LF+
`│ ${m.name.padEnd(14)}   ${ ellipsis( JSON.stringify( Object.keys( m            ) ), 60) }`;
    });

    s += LF+"└──────────────────────────────────────────────────────────────────────────────┘";

    log_N(log_color+s);
    /*  response {{{*/
    if( response )
        response.write(
`<pre class='${config.LOAD_STATUS.includes("ERROR") ? "error" : "info"}'>${s}</pre>`
                      );

    /*}}}*/
    /*}}}*/
    /*}}}*/
    /* FOLDER {{{*/

    s = `
┌──────────────────────────────────────────────────────────────────────────────┐
│ SERVER STARTED IN ${   started_folder}
│ SERVER TOP FOLDER ${server_top_folder}
└──────────────────────────────────────────────────────────────────────────────┘`;

    log_G(s);
/*  response {{{*/
if( response )
    response.write(
`<pre class='info'>${s}</pre>`
                  );

/*}}}*/
    /*}}}*/
    log_G("┌────────────────────────────────┐");
    /* HTTPS {{{*/
    let https_address = https_server  ?            https_server.address() : null;
    let https_port    = https_address ?            https_address.port     : null;
    let https_status  = https_port    ? (  "LISTENING PORT "+https_port ) : "NOT LISTENING";

    s = "HTTPS    :  "+ https_status;

    log_G("│ "+(https_server ? Y : R)+s+N);
/*  response {{{*/
if( response )
    response.write(
`<pre class='${https_server ? "info" : "error"}'>${s}</pre>`
                  );
/*}}}*/
    /*}}}*/
    /* HTTP  {{{*/

//lib_log.log_key_val( "http__server",             http__server);
    let http__address = http__server  ?            http__server.address() : null;
    let http__port    = http__address ?            http__address.port     : null;
    let http__status  = http__port    ? (  "LISTENING PORT "+http__port ) : "NOT LISTENING";

    s = "HTTP     :  "+ http__status;

    log_G("│ "+(http__server ? Y : R)+s+N);
/*  response {{{*/
if( response )
    response.write(
`<pre class='${http__server ? "info" : "error"}'>${s}</pre>
<script>document.body.contentEditable = true;</script>`
                  );

/*}}}*/
    /*}}}*/
    log_G("└────────────────────────────────┘");

    log_net_info( response );

};
/*}}}*/
/*_ log_net_info {{{*/
let     net_address;
let log_net_info = function(response)
{
    /*  response {{{*/
    if( response )
        response.write(
`<div class='info'>
 <b>Network:</b>
 <ul>`
                      );
    /*}}}*/
    let net_if  = networkInterfaces();
    let results = Object.create({});
    for(let name of Object.keys(net_if))
    {
        for(let net of net_if[name])
        {
            if (net.family === "IPv4" && !net.internal) // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            {
                if(!results[name])
                    results[name] = [];

                results[name].push(net.address);

                if(!net_address)
                    net_address = net.address;
                /*  response {{{*/
                if( response)
                    response.write("<li>"+name+" : "+net.address+"</li>\n");
                /*}}}*/
            }
        }
    }
    /*  response {{{*/
    if( response)
        response.write("</ul>\n</div>");
    /*}}}*/
console.table( results );
};
/*}}}*/

    // return {{{
    return { name: "server_network"
        ,    log_net_info
        ,    log_STATUS
        ,    get_net_address : () => net_address
    };
    //}}}
})();
try { module.exports = server_network; } catch(ex) { console.log(ex.message); }
