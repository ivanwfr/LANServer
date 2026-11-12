//┌────────────────────────────────────────────────────────────────────────────┐
//│ url_to_href.js                                       ● _TAG (261111:19h:14)
//└────────────────────────────────────────────────────────────────────────────┘
let url_to_href = (function() {
//{{{
let   basename;
let   a_href_to_html_array = [];
//}}}
/*● line_url_to_href {{{*/
let line_url_to_href = function(line, dir_href)
{
//if(dir_href) console.log("url_to_href.line_url_to_href("+dir_href+")");
// log {{{
    let href
        = (typeof document != "undefined")
        ?         document.location.href
        :                       dir_href;
    let root          = href  .replace(/^(.*\/\/[^\/]*)\/.*/, "$1");  // up to first '/'
    let file          = href  .replace(/^.*\/(.*)$/         , "$1");  // after last  '/'
    let folder        = href  .substr(root.length);                   // after first '/'
        folder        = folder.substr(0, folder.length -file.length); // before file

/* log {{{*/
//console.log("➔ href    = ["+href+"]");
//console.log("➔ root    = ["+root+"]");
//console.log("➔ file    = ["+file+"]");
//console.log("%c folder = ["+ folder+"]", "color: yellow");
//console.log("🟤🔴🟠🟡🟢🔵🟣⚫⚪️");
/*}}}*/
    //}}}
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ SET or CLEAR *Page relative URL* **basename** ● (runlenght)
    //└────────────────────────────────────────────────────────────────────────┘
    //{{{
    //┌────────────────────────────────────────────────────────────────────────┐
    //│ ........................111...............22222222..33.................
    //└─────────────────────────▼▼▼───────────────▼▼▼▼▼▼▼▼──▼▼─────────────────┘
    let matches = line.match(/^(\s*)basename *= *([^\s<>]*)(.*)/);
    if( matches )
    {
//log("%c basename..=["+matches[2]+"]", lbB+lb4+lf2);

        let prev = basename;
        basename = matches[2];

        let ttl = "URL basename: "+ (basename ? "Folder ["+basename+"]" : "Cleared"    );
        let tag =                   (basename ? "🟢 >> "  +basename     : "⚫ << "+prev);
        return matches[1]
            +  "<span class='basename' title='"+ttl+"'>"+tag+"</span>"
            +  matches[3]
        ;
    }

    let l_trim = line  .trim();
        l_trim = l_trim.replace(  /<[^>]*>/g,"").trim();
        l_trim = l_trim.replace(/\?to_html/ ,"").trim();

//console.log("l_trim=["+l_trim+"]");
    //}}}
    //┌────────────────────────────────────────────────────────────────────────────┐
    //│ 1/2. *http* with no *href* ➔ MAKE A *<a href='url'>url</a>*
    //└────────────────────────────────────────────────────────────────────────────┘
    // match → a_href {{{
    let matched;
    if(line.includes("http") && !line.includes("href"))
    {
        line = line_a_from_http_no_href( line );
    }
    //}}}
    //┌────────────────────────────────────────────────────────────────────────────┐
    //│ 2/2 - File with Supported EXTENSION ● i.e. .txt .ahk .css .js .md ...
    //└────────────────────────────────────────────────────────────────────────────┘
    // match → a_href root + sub folders {{{
    else if(matched = line_match_supported_extension( l_trim ))
    {
        //┌────────────────────────────────────────────────────────────────┐
        //│ PATH:
        //│ ● FROM: AFTER A MANDATORY ( SPACE          )
        //│ ● ALL.................... [ NON-SPACES     ]
        //│ ● UP TO (INCLUDED)....... [ MIME-EXTENSION ]
        //└────────────────────────────────────────────────────────────────┘
        //{{{
        let path
            = matched
            .replace(/\s.*/ ,"").trim() // inner space
            .replace(/[\*\"'`](.*)[\*\"'`]*/ ,"$1").trim() // inner space
        ;
        /*}}}*/
        //┌────────────────────────────────────────────────────────────────┐
        //│ 1/2  [ SLASH ] TO [ROOTED_NAME]
        //│ i.e. [/SERVER] TO [http:192.168.1.114:447/SERVER]
        //└────────────────────────────────────────────────────────────────┘
        //{{{
        let a_href;
        if( path.startsWith("/") )
        {
            a_href = root + path;
//console.log("%c● a_href=["+a_href+"]", "color: #F06");
        }
        //}}}
        //┌────────────────────────────────────────────────────────────────┐
        //│ 2/2 [path] SUB FOLDERS TO PARSE
        //└────────────────────────────────────────────────────────────────┘
        //{{{
        else {
//console.log(  "\nline=["+line+"]");
//console.log(    "path=["+path+"]");
//console.log(    "basename=["+basename+"]");
            if( basename ) {
                let p
                    = (path.startsWith("./") ? path.substr(2) : path);
//console.log("p=["+p+"]");
                a_href = parse_sub_folders(href, root, basename+"/.", p);
            }
            else {
                a_href = parse_sub_folders(href, root, folder, path);
            }
        }
        //}}}
//console.log("┌────────────────────────────────────────────────────────────────────┐");
//console.log(a_href);

        //┌────────────────────────────────────────────────────────────────────┐
        //│ query
        //└────────────────────────────────────────────────────────────────────┘
        let  q = (line.includes("?to_html") || a_href_to_html_array.includes( a_href )) ? "?to_html":"";
        if(  q && !a_href_to_html_array.includes( a_href ))
                   a_href_to_html_array.push    ( a_href );
//console.log("● q ["+q+"]");

        //┌────────────────────────────────────────────────────────────────────┐
        //│ a
        //└────────────────────────────────────────────────────────────────────┘
        let  a = "<a href='"+ encodeURI(a_href) + q +"'>"+path+"</a>";
//console.log("● a ["+a+"]");

        let  a_list = get_a_list(a_href, q);

        //┌────────────────────────────────────────────────────────────────────┐
        //│ p ● THE PART TO BE REPLACED BY: <a href='https://...'> path </a>
        //└────────────────────────────────────────────────────────────────────┘
        let  p = line.includes(q) ? (path + q) : path;
//console.log("● p ["+ p      +"]");

        //┌────────────────────────────────────────────────────────────────────┐
        //│ line
        //└────────────────────────────────────────────────────────────────────┘
//console.log("├────────────────────────────────────────────────────────────────────┤");
//console.log(            line    );
        line   = line.replace(p, (a_list || a));

//console.log("%c"+       line   , "background-color: #040");
//console.log("└────────────────────────────────────────────────────────────────────┘");
    }
    //}}}

    return line;
};
/*}}}*/
//_ get_RGX_EXT {{{
//{{{
const RGX_EXT_ARRAY
    = [ "ahk"
      , "asp"
      , "awk"
      , "css"
      , "json"
      , "js"
      , "log"
      , "lua"
      , "md"
      , "tmc"
      , "txt"
      , "vim"
    ];
let   RGX_EXT;
//}}}
let get_RGX_EXT = function()
{
    if(!RGX_EXT )
    {
        let s   = "";
        RGX_EXT_ARRAY.forEach((ext) => s += "|"+ext);
        s       = s.substr(1); // trim extra first pipe
        RGX_EXT = new RegExp("([\/\\a-z_A-Z0-9\.]+\\.("+s+"))","g");
//console.log("RGX_EXT:", RGX_EXT);
    }
    return RGX_EXT;
};
//}}}
/*_ get_a_list {{{*/
let get_a_list = function(a_href, q)
{
    //..........................(-----------------) /(pa))
    let matches = a_href.match(/(https?:\/\/[^\/]*)\/(.*)$/);
    if(!matches) return "";

    let root = matches[1].trim();
//console.log("root=["+root+"]");

    let path = matches[2].trim();
//console.log("path=["+path+"]");

    let is_dir = path.endsWith("/");
    if( is_dir ) path = path.slice(0,-1);
//console.log("is_dir=["+is_dir+"]");

    let a_list = "";
    let subs   = "";
    let dirs   = path.split("/");
    for(let i=0; i < dirs.length; ++i)
    {
        let d = dirs[i];
//console.log("...d=["+d+"]");//FIXME
        subs +=  d;
        if(is_dir || (i  < (dirs.length - 1))) subs += "/";
        else if(     (i == (dirs.length - 1))) subs +=   q;
        a_list += ((i > 0) ? "∙":"")+"<a href='"+ root +"/"+ subs +"'>"+ (d || "Root") +"</a>";
    }
//console.log("%c"+ a_list.replace(/→/,"→\n"), "background-color:black;");

    return a_list;
};
/*}}}*/
/*_ parse_sub_folders ● remove an overlapping folder-path-segment {{{*/
let parse_sub_folders = function(href, root, folder, path)
{
//console.log("┌───────────────────────────────────────────────────────────────────────────┐");

    let D_NAMES  = folder.split("/").filter(Boolean);
//console.log("%c D_NAMES: "+ D_NAMES                 , "background-color: #000; color: #0F0");

    let f_names  = path  .split("/").filter(Boolean);
//console.log("%c f_names: "+ f_names                 , "background-color: #000; color: #F0F");

    let fileName = f_names.pop();
//console.log("%c● fileName=["+fileName+"]"           , "background-color: #000; color: #FF0");

    let up_count =  0;
    let sub_fold = "";
    let      d,          f;
    for(     d              =  D_NAMES.length-1
        ,                f  =  f_names.length-1
        ;   (d >= 0) && (f >= 0)
        ;  --d       , --f
       ) {
        // current dir is current parent
        if(      f_names[f] == ".")
        {
            sub_fold   =       D_NAMES[d] +"/"+ sub_fold;
            up_count  += 1;
        }
        // going deeper...
        else if( f_names[f] != D_NAMES[d])
        {
            up_count  += 1;
            sub_fold   = f_names[f] +"/"+ sub_fold;
        }
//console.log(up_count+" %c sub_fold\=["+sub_fold+"]" , "background-color: #000; color: #FF0");
    }

    let a_href  = root +  "/";
    for(     d  = 0; d < (D_NAMES.length - up_count); ++d)
        a_href +=         D_NAMES[d] +"/";
    a_href     +=         sub_fold
        +                 fileName;

//console.log("%c● a_href\=["+a_href+"]"              , "background-color: #000; color: #0FF");
//console.log("└───────────────────────────────────────────────────────────────────────────┘");
    return a_href;
};
/*{{{ SAMPLE LINKS

    basename =
                   js_linkify.js
           scripts/js_linkify.js
    SERVER/scripts/js_linkify.js
    /USR/ivan/VIM/mapKeys.func.vim
                  mapKeys.func.vim

    basename = /USR/ivan/VIM
                             MAP/mapKeys.func.vim

    basename = /USR/ivan/VIM/MAP
                                 mapKeys.func.vim

}}}*/
/*}}}*/
/*_ line_a_from_http_no_href {{{*/
let line_a_from_http_no_href = function( line_in )
{
    let line_out;
            // URL IN A markdown table ● requires some syntax sanitation {{{
            //............................(111111)(222222)(33333333)
            let matches = line_in.match(/^( *<td>)(http.*)(<\/td> *)$/);  // @see /SERVER/server5_content.js markdown table to html
            if( matches ) {
                let url = matches[2];
                let   a = "<a href='"+ encodeURI(url) +"'>"+url+"</a>";
                line_out    = matches[1]+ a + matches[3]+"\n";
            }
            //}}}
            // well recognized URL {{{
            else {
                //┌────────────────────────────────────────────────────────────┐
                //│ When there is a BLANK or EOL at the end of an http URL
                //│ ●
                //│ matches[000000000000000000000000000000000000000]
                //│ matches[11][222222222222222222222][33333333][44]
                //│ ..... head  SCHEME_____URL_______  boundary  tail
                //│ .....   ▼▼  ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼  ▼▼▼▼▼▼▼▼  ▼▼
                //│ ....(/^(.*)(https?:\/\/[^>|<|\s]+)(>|<|\s|$)(.*)
                //│ ●
                //└────────────────────────────────────────────────────────────┘
                matches = line_in.match(/^(.*["'`])(https?:\/\/[^>|<]+)(["'`].*)/)
                ||        line_in.match(/^(.*)(https?:\/\/[^>|<|\s]+)(>|<|\s|$)(.*)/)
                ;
                if( matches ) {
                    let  head  = matches[1];
                    let   url  = matches[2];
                    let bound  = matches[3];
                    let tail   = matches[4] || "";

                    line_out   = head
                        +       "<a href='"+ encodeURI(url) +"'>"
                        +        url
                        +       "</a>"
                        +        bound
                        +        tail
                        +       "\n";
                }
            }
            //}}}
    return line_out;
};
/*}}}*/
/*_ line_match_supported_extension {{{*/
let line_match_supported_extension = function(l_trim)
{
    if(l_trim == "/")
        return l_trim;

    let matches
        =  l_trim.match(/\/\w+.*\/$/) // FOLDER
        || l_trim.match( get_RGX_EXT()  );

//if(matches) console.log( l_trim     );
//if(matches) console.log( matches[0] );

    return matches ? matches[0] : "";
    //    //{{{
    //    return l_trim.match(/\/\w+\/$/   ) // FOLDER
    //        || l_trim.match(/\/\w+\.ahk/)
    //        || l_trim.match(/\/\w+\.asp/)
    //        || l_trim.match(/\/\w+\.awk/)
    //        || l_trim.match(/\/\w+\.css/)
    //        || l_trim.match(/\/\w+\.js/ )
    //        || l_trim.match(/\/\w+\.json/)
    //        || l_trim.match(/\/\w+\.lua/)
    //        || l_trim.match(/\/\w+\.md/ )
    //        || l_trim.match(/\/\w+\.tmc/)
    //        || l_trim.match(/\/\w+\.txt/)
    //        || l_trim.match(/\/\w+\.vim/)
    //        || l_trim.match(/\/\w+\.log/)
    //    ;
    //    //}}}
};
/*}}}*/
//● PUBLIC {{{
    return { name: "url_to_href"
        ,    line_url_to_href
        ,    line_match_supported_extension
        ,    basename_clear: () => basename = ""
    };
//}}}
})();
globalThis.url_to_href  = url_to_href;
try { module.exports = url_to_href; } catch(ex) { /*console.log(ex.message);*/ /*console.trace();*/ } /* eslint-disable-line no-unused-vars */
