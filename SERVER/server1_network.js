//┌────────────────────────────────────────────────────────────────────────────┐
/*│ server1_network.js           */ const SERVER_NETWORK_TAG = "(261001:00h:30)";
//└────────────────────────────────────────────────────────────────────────────┘

let server1_network = (function() {
"use strict";

//┌────────────────────────────────────────────────────────────────────────────┐
//│ REQUIRE
//└────────────────────────────────────────────────────────────────────────────┘
//● Node.js             ● os {{{
let { networkInterfaces }       = require("os"   );
//}}}
//● Server  Modules:    ● log header listener network notes qtext {{{
let server0_log      = require("./server0_log.js");
//...{{{
/* eslint-disable no-unused-vars */
// INLINING:
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
//t server1_network  = require("./server1_network.js");
//t server2_listener = require("./server2_listener.js");
//t server3_header   = require("./server3_header.js");
//t server4_file     = require("./server4_file.js");
//t server5_content  = require("./server5_content.js");
//t server6_notes    = require("./server6_notes.js");
//}}}
//● Server Config:      ● config https http modules {{{

let config;
let config_json;
let https_server;
let http__server;
let modules = [];

let onload = function(args)
{
    config              = args.config;
    config_json         = args.config_json;
    https_server        = args.https_server;
    http__server        = args.http__server;
    modules             = args.modules;
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ STATUS
//└────────────────────────────────────────────────────────────────────────────┘
/*_ log_STATUS {{{*/
let log_STATUS = function(response)
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
    /* CONFIG ● FOLDERS ● PORT ● CERT ● MODULES {{{*/
    s  = "┌───────────────────────────────────────────────────────────────────── CONFIG ─┐";

    s += LF+`
│ ${SERVER_NETWORK_TAG}
├
│ CONFIG           [${config_json        }]
│ CWD              [${process.cwd()      }]
│ LAN_FOLDER       [${config.LAN_FOLDER  }]
├
│ PORT_HTTP        [${config.PORT_HTTP   }]
│ PORT_HTTPS       [${config.PORT_HTTPS  }]
│  KEY_PEM         [${config. KEY_PEM    }]
│ CERT_PEM         [${config.CERT_PEM    }]
├
    `.trim();

    modules.forEach((m) => { s += LF+
`│ ${m.name.padEnd(16)} ${ ellipsis( JSON.stringify(Object.keys(m)).replace(/[\",]+/g," "), 80) }`;
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
    /* FOLDERS {{{*/
    let started_folder      = process.cwd().replace(/\\/g,"/");
    let server_top_folder   = process.cwd().replace(/\\/g,"/")+"/"+ config.LAN_FOLDER;

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

    // NETWORK {{{
    log_net_info( response );

    //}}}
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

    // return ● log_net_info, log_STATUS, get_net_address {{{
    return { name: "server1_network"
        ,    onload
        ,    log_net_info
        ,    log_STATUS
        ,    get_net_address : () => net_address
    };
    //}}}
})();
// module.exports {{{
try { module.exports = server1_network;                  } catch(ex) { console.log(ex.message); console.trace(); }
//}}}
