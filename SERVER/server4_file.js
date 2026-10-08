//┌────────────────────────────────────────────────────────────────────────────┐
//│ server4_file.js                                        _TAG (261008:01h:37)
//└────────────────────────────────────────────────────────────────────────────┘
/* IMPORT {{{*/

/*}}}*/
let server4_file = (function() {
"use strict";

//┌────────────────────────────────────────────────────────────────────────────┐
//│ REQUIRE
//└────────────────────────────────────────────────────────────────────────────┘
//● Node.js Modules     ● fs path os.networkInterfaces {{{
let   fs                        = require("fs"   );
let   path                      = require("path" );
let { networkInterfaces }       = require("os"   ); /* eslint-disable-line no-unused-vars */
//}}}
//● Server Modules:     ● log header listener folder network notes qtext {{{
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
let server1_network  = require("./server1_network.js");
//t server2_listener = require("./server2_listener.js");
//t server3_header   = require("./server3_header.js");
//t server4_file     = require("./server4_file.js");
let server5_content  = require("./server5_content.js");
//t server6_notes    = require("./server6_notes.js");
//}}}
//● Server Config:      ● config https http modules {{{

let config;

let onload = function(args)
{
    config              = args.config;
};
/*}}}*/


//┌────────────────────────────────────────────────────────────────────────────┐
//│ SERVE FILE OR FOLDER
//└────────────────────────────────────────────────────────────────────────────┘
/*_ fs_read_file_or_folder {{{*/
let fs_read_file_or_folder = function(request,response,uri)
{
// log {{{
let caller = "fs_read_file_or_folder";
//}}}
        let server_top_folder   = process.cwd().replace(/\\/g,"/")+"/"+ config.LAN_FOLDER;
        let   reqPath  = decodeURIComponent(request.url.split("?")[0]);
        let file_path  = path.join(server_top_folder, reqPath);
// log {{{
//console.dir(                   uri             )
//console.dir(                   request         )
//console.dir("request.url \t["+ request.url +"]")
//console.dir("reqPath     \t["+ reqPath     +"]")
//console.dir("file_path   \t["+ file_path   +"]")
//}}}
        if( file_path == "query")
            file_path  = uri.query.match(/qtext=([^\?]+)/)[1];
// log {{{
//log_G("  ┌────────────────────────────────────────────────────────────────────────────┐\n"
//     +"● │ READFILE:\n"
//     +"  │      uri.path =["+ uri.path  +"]\n"
//     +"  │      uri.query=["+ uri.query +"]\n"
//     +"  │      file_path=["+ file_path +"]\n"
//     +"  └────────────────────────────────────────────────────────────────────────────┘");
//}}}
        fs.stat(file_path, (err, stats) => {
            /* err {{{*/
            if(err) {
                server0_log.writeHead(response, caller, 404);

                response.end("Not found: ["+file_path+"]");
                return;
            }
            /*}}}*/
            /* directory {{{*/
            if(stats.isDirectory())
            {
                fs_readDir(request, response, reqPath, file_path);

            }
            /*}}}*/
            /* file {{{*/
            else {
                fs.readFile(  file_path
                            , function(read_err, data) {
                                server5_content
                                .send_file_content( request
                                                  , file_path
                                                  , uri.query
                                                  , response
                                                  , read_err
                                                  , data);
                            });
            }
            /*}}}*/
        });

//      log_B("┌──────────────────────────────────────────────────────────────────────────────┐\n"
//           +"● SERVE FILES ["+uri.path +"]\n"
//           +"└──────────────────────────────────────────────────────────────────────────────┘");
if(is_logging()) log_B("● SERVING FILE ["+uri.path+"]");
        return "fs.readFile";
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ DIRECTORY LISTING
//└────────────────────────────────────────────────────────────────────────────┘
/* CSS TAGS ● folder js img file {{{*/
const CUSTOM_HTML_TAG_FOLDER        = "folder_tag";
const CUSTOM_HTML_TAG_JS            = "js_tag"    ;
const CUSTOM_HTML_TAG_IMG           = "img_tag"   ;
const CUSTOM_HTML_TAG_FILE          = "file_tag"  ;
/*}}}*/
/* FOLDER PAGE CSS ● [STYLE_DIR] {{{*/
const STYLE_DIR = `
<!DOCTYPE html>
<html lang="en">
 <head> <!--{{{-->
  <!-- meta {{{-->
  <meta charset="utf-8">
  <meta name="color-scheme" content="light only">
  <!--}}}-->
<!-- style {{{-->
  <style>
/* style CUSTOM_HTML_TAG_... {{{*/
    ${ CUSTOM_HTML_TAG_FOLDER},
    ${ CUSTOM_HTML_TAG_JS    },
    ${ CUSTOM_HTML_TAG_IMG   },
    ${ CUSTOM_HTML_TAG_FILE  } {
        display     :  inline-block;
        border-radius: 0.5em;
    }
    ${ CUSTOM_HTML_TAG_FOLDER}         { margin-top: 1em; }

/*}}}*/
/* style CUSTOM_HTML_TAG_...::before {{{*/

    ${ CUSTOM_HTML_TAG_FOLDER}::before,
    ${ CUSTOM_HTML_TAG_JS    }::before,
    ${ CUSTOM_HTML_TAG_IMG   }::before,
    ${ CUSTOM_HTML_TAG_FILE  }::before {
        display         :  inline-block;
        margin-right    :  0.5em;
        min-width       :    2em;
        padding         :  0 0.25em;
        vertical-align  :  middle;
/*{{{
        outline         :  1px solid #8888;
        outline-offset  :  2px;
        text-align      :  center;
}}}*/
        text-align      :  end;
    }
    ${ CUSTOM_HTML_TAG_FOLDER}::before { content: '📂'; color: #FF0; }
    ${ CUSTOM_HTML_TAG_JS    }::before { content: '💻'; color: #FF0; }
    ${ CUSTOM_HTML_TAG_IMG   }::before { content: '📷'; color: #0AF; }
    ${ CUSTOM_HTML_TAG_FILE  }::before { content:  '…'; color: #F00; }

/*}}}*/
/* style body input div_copy li {{{*/
   body      { color: #FEE; background-color: #111; line-height: 1.5em; }
A:link    {            color: #8FF; }
A:visited {            color: #F0F; }
   input  {
    width           : 80%;
    letter-spacing  : 0.2em;'
    height          : 1em;
    color           : #FFF4;
    background-color: transparent;
    border          : none;
   }
   #div_copy {
       display      : contents;
       border-radius: 0.5em;
       border       : 1px solid white;
       background   : #8888;
   }
   #div_copy::before {
    content         : "📋🗁";
    position        : fixed;
    top             : 2em;
    left            : 1em;
   }
   #div_copy,
   #div_copy * {
       cursor: pointer;
   }
   #div_copy * {
/*{{{
    pointer-events: none;
       position     : fixed;
       top          : 2em;
       left         : 2em;
}}}*/
   }
   #div_copy.clicked::after {
     content        : "...path is in the clipboard";
     font-style     : italic;
     font-size      : 150%;
     color          : #888F;
   }
   #div_copy.clicked>INPUT {
/*{{{
    opacity: 0.5;
}}}*/
    display: none;
   }
/*
   LI:nth-of-type(odd) { padding-left: 3em; }
*/
   LI        { padding-left: 2em; }
   LI:has(B) { padding-left: 0em !important; margin: 1em; }
/*}}}*/
  </style>
<!--}}}-->
 </head>
<!--}}}-->
 <body> <!--{{{-->
  <div   id  ="div_copy"
      title  ="copy folder path\nto clipboard"
      onmousedown='this.querySelector("INPUT").select();
               document.execCommand("copy"); this.classList.add   ("clicked");
               setTimeout(()              => this.querySelector("A").click() , 2500);
/*{{{
}}}*/
               setTimeout(()              => this.classList.remove("clicked"), 3000);
      '>
       
       Index of<a  href="about:blank"
          title="copy path and...\n...open a new tab..."
         target="LANServer drive"
       ></a>
       <input type="text" value="{file_path}">
      </div>
  <br>      <b    style='margin-left:4em;'                  > {top_title} </b>
  <br>      <b    style='margin-left:4em;'                  > {link_list} </b>
  <ul>
   {dir_items}
  </ul>
 </body> <!--}}}-->
</html>
`;
/*}}}*/
/*_ fs_readDir {{{*/
let fs_readDir = function(request, response, reqPath, file_path)
{
/*{{{*/
let caller = "fs_readDir";
/*}}}*/
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ [top_list]  ● no href                        ● above SERVER TOP FOLDER │
    //└────────────────────────────────────────────────────────────────────────┘
    //{{{
    let server_top_folder= process.cwd().replace(/\\/g,"/")+"/"+ config.LAN_FOLDER;
    let head_path        =  server_top_folder.replace(/^[\/\\]|[\/\\]$/g,  "");
    let head_list        =  head_path        .replace(/[\/\\]/g         , " ").split(" ");

    let top_list         =  [];
    head_list.map((name) => top_list.push({ name }));

    //}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ [dir_list] ● <a href>dir-name<>             ● below SERVER TOP FOLDER  │
    //└────────────────────────────────────────────────────────────────────────┘
    //{{{
    let scheme          =  request.socket.encrypted ?            "https" : "http";
    let port            =  request.socket.encrypted ? config.PORT_HTTPS  : config.PORT_HTTP;

    let dir_path        =  file_path.substring( server_top_folder.length ).replace(/^[\/\\]|[\/\\]$/g,"");
    let dir_list        =   dir_path.replace(/\\/g,"_bs_").split("_bs_");

    let net_address     = server1_network.get_net_address();

    let href_root       =  scheme +"://"+ net_address +":"+ port;
    let href            =  href_root;

    let url_list        =  [];
    dir_list.map((name) => { href += "/"+encodeURI( name ); url_list.push({ name, href }); });

    //}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ [folder_title] ● [top_list]         ● [dir_list <a href>dir_name</a>   │
    //└────────────────────────────────────────────────────────────────────────┘
    //{{{
    let top_title       = ""; top_list.map((a) => { top_title += " ⚫ <b>"+                    a.name          +"</b>"; });

    if( url_list[0].name && (url_list[0].name != "Root"))
        url_list.unshift({ name: "Root", href: href_root });

    let link_list       = ""; url_list.map((a) => { link_list += " 🟣 <a href='"+ a.href +"'>"+ (a.name||"Root") +"</a>"; });

    //}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ [readdir] ● BOLD ENTRY NAME
    //└────────────────────────────────────────────────────────────────────────┘
    //{{{
    fs.readdir(file_path, (read_err, files) => {
        files.unshift("..");
        let dir_items
            = files.map((name) => ""+get_dirEntry_link(reqPath, name)+"\n")
            . join("");
        server0_log.writeHead(response, caller, 200, { "Content-Type": "text/html" });

        response.end( STYLE_DIR.replace("{file_path}", file_path)
                      .         replace("{top_title}", top_title)
                      .         replace("{link_list}", link_list)
                      .         replace("{dir_items}", dir_items)
                    );
    });
    //}}}
};
/*}}}*/

//┌────────────────────────────────────────────────────────────────────────────┐
//│ private
//└────────────────────────────────────────────────────────────────────────────┘
/*_ get_dirEntry_link {{{*/
let get_dirEntry_link = function(reqPath, name)
{
    return "<li>"
        +   "<a href="+ path.join(encodeURI(reqPath), encodeURI(name) ) +">"
        +   "<"+        get_dirEntry_tag(  name ) +"/>"+ name
        +   "</a>"
        +  "</li>";
};
/*}}}*/
/*_ get_dirEntry_tag {{{*/
let get_dirEntry_tag = function(name)
{
    let dirEntry_tag;

    let matches = name.match(/\.(\w+)$/);
    let     ext = matches ? matches[1] : "";
    switch( ext ) {
    case   "jpg":
    case   "gif":
    case   "png": dirEntry_tag              = CUSTOM_HTML_TAG_IMG ; break;
    case   "js" : dirEntry_tag              = CUSTOM_HTML_TAG_JS  ; break;
    default     : dirEntry_tag
                = name.match(/^[A-Z_]+$/)   ? CUSTOM_HTML_TAG_FOLDER    // all caps //FIXME
                                            : CUSTOM_HTML_TAG_FILE;
    }

    return dirEntry_tag;
};
/*}}}*/

    // return ●     server2_listener, dispatch {{{
    return { name: "server4_file"
        ,    onload
        ,    fs_read_file_or_folder
    };
    //}}}
})();
//    module.exports {{{
try { module.exports = server4_file;                     } catch(ex) { console.log(ex.message); console.trace(); }
//}}}
