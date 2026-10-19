//┌────────────────────────────────────────────────────────────────────────────┐
//│ url_to_href.js                                       ● _TAG (261019:03h:55)
//└────────────────────────────────────────────────────────────────────────────┘
let url_to_href = (function() {
let log_this = false;//true;
// RGX_EXT_ARRAY RGX_EXT {{{
const RGX_EXT_ARRAY
    = [ "ahk"
      , "asp"
      , "awk"
      , "css"
      , "js"
      , "json"
      , "log"
      , "lua"
      , "md"
      , "tmc"
      , "txt"
      , "vim"
    ];
let   RGX_EXT;
//}}}
/*_ line_url_to_href {{{*/
let line_url_to_href = function(line, href_arg)
{
//if(href_arg) console.log("url_to_href.line_url_to_href("+href_arg+")");
// log {{{
    let href
        = (typeof document != "undefined")
        ?         document.location.href
        : href_arg;
    let root          = href  .replace(/^(.*\/\/[^\/]*)\/.*/, "$1");  // up to first '/'
    let file          = href  .replace(/^.*\/(.*)$/         , "$1");  // after last  '/'
    let folder        = href  .substr(root.length);                   // after first '/'
        folder        = folder.substr(0, folder.length -file.length); // before file

// log {{{
//console.log("➔ href    = ["+href+"]");
//console.log("➔ root    = ["+root+"]");
//console.log("➔ file    = ["+file+"]");
//console.log("%c folder = ["+ folder+"]", "color: yellow");
//console.log("🟤🔴🟠🟡🟢🔵🟣⚫⚪️");
//}}}
    //}}}
    //  RGX_EXT {{{
    if(!RGX_EXT )
    {
        let s = "";
        RGX_EXT_ARRAY.forEach((ext) => s += "|"+ext);
        s = s.substr(1);
        RGX_EXT = new RegExp("(\\S+\\.("+s+")).*$","g");
//console.log("RGX_EXT:", RGX_EXT);
    }
    //}}}

        let l_trim = line  .trim();
            l_trim = l_trim.replace(  /<[^>]*>/g,"").trim();
            l_trim = l_trim.replace(/\?to_html/ ,"").trim();
//console.log("l_trim=["+l_trim+"]");//FIXME

        //┌────────────────────────────────────────────────────────────────────────────┐
        //│ 1/2. http (no href) ➔ MAKE A *<a href='url'>url</a>*
        //└────────────────────────────────────────────────────────────────────────────┘
        let matched;
        if(line.includes("http") && !line.includes("href"))
        {
            line = line_a_from_http_no_href( line );
        }
        //┌────────────────────────────────────────────────────────────────────────────┐
        //│ 2/2 - FILE WITH SUPPORTED EXTENSION FILES: ahk, css, js, md...
        //└────────────────────────────────────────────────────────────────────────────┘
        else if(matched = line_match_supported_extension( l_trim ))
        {
if(log_this) console.log("\n%c"+ line, "background-color: #400");

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

            //  = l_trim
            //  . replace( RGX_EXT                                                 , "$1")
            //  . replace(                                             /\?to_html/ ,   "") // CLEAR: query
            //  . replace(                                              /.*[\"'`]/ ,   "") // CLEAR: quotes
            //  . replace(                                              /<\/?\w+>/g,   "") // CLEAR: <td> </td>
            //  . trim()
            //  ;
            /*}}}*/
if(log_this)
console.log("%c● path=["+path+"]", "color: #0F0");

            //┌────────────────────────────────────────────────────────────────┐
            //│ 1/2  [ SLASH ] TO [ROOTED_NAME]
            //│ i.e. [/SERVER] TO [http:192.168.1.114:447/SERVER]
            //└────────────────────────────────────────────────────────────────┘
            //{{{
            let a_href;
            if( path.startsWith("/") )
            {
                a_href = root + path;
if(log_this) console.log("%c● a_href=["+a_href+"]", "color: #F06");
            }
            //}}}
            //┌────────────────────────────────────────────────────────────────┐
            //│ 2/2 [path] SUB FOLDERS TO PARSE
            //└────────────────────────────────────────────────────────────────┘
            //{{{
            else {
                a_href = parse_sub_folders(href, root, folder, path);
if(log_this) console.log("%c● a_href=["+a_href+"]", "color: #606");
            }
            //}}}

            //┌────────────────────────────────────────────────────────────────┐
            //│ [a_href] ... encodeURI
            //└────────────────────────────────────────────────────────────────┘
            //{{{
            let  q = line.includes("?to_html") ? "?to_html":"";

            let  a = "<a href='"+ encodeURI(a_href) + q +"'>"+path+"</a>";
if(log_this) console.log("- a=["+a+"]");

            let  p = path.includes(q) ? path : (path + q);
if(log_this) console.log("- p=["+p+"]");

            line   = line.replace(p, a);
//console.log("%c"+ a_href, "background-color: #040");
//console.log("%c"+ line  , "background-color: #040");
//console.log("%c"+ line  , "background-color: #822");
            //}}}
        }
    return line;
};
/*}}}*/
/*_ parse_sub_folders {{{*/
let parse_sub_folders = function(href, root, folder, path)
{
    let folders       = folder.split("/").filter(Boolean);            // remove falsy items
    //console.log("%c folders: "+ String(folders).padStart(47) ,"background-color: #000; color: #F0F");

    let parents  = path.split("/").filter(Boolean);  // remove falsy items

    let fileName = parents.pop();
if(log_this) console.log("%c● fileName=["+fileName+"]", "background-color: #066");

    let up_count =  0;
    let sub_fold = "";
    let      f;
    let      p;
    for(     f  = folders.length-1
             ,    p  = parents.length-1
             ;   (f >= 0) && (p >= 0)
             ;  --f       , --p
       ) {
        // current dir is current parent {{{
        if(parents[p] == ".")
        {
            sub_fold   = folders[f] +"/"+ sub_fold;
            up_count  += 1;
        }
        //}}}
        // going deeper... {{{
        else if(folders[f] != parents[p])
        {
            up_count  += 1;
            sub_fold   = parents[p] +"/"+ sub_fold;
        }
        //}}}
    }
if(log_this) console.log("%c● sub_fold\=["+sub_fold+"]", "background-color: #660");

    let a_href  = root +"/";
    for(     f  = 0; f < (folders.length - up_count); ++f)
        a_href += folders[f] +"/";
    a_href     += sub_fold + fileName;

    return a_href;
};
/*}}}*/
/*_ line_a_from_http_no_href {{{*/
let line_a_from_http_no_href = function( line_in )
{
    let line_out;
            // URL IN A markdown table ● requires some syntax sanitation {{{
            //.........................(111111)(222222)(33333333)
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
                //│ ..... head  SCHEME_____URL_______  ___bound  tail
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
        =  l_trim.match(/\/\w+\/$/) // FOLDER
        || l_trim.match( RGX_EXT  );

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
    return { name: "url_to_href"
        ,    line_url_to_href
    };
})();
globalThis.url_to_href  = url_to_href;
try { module.exports = url_to_href; } catch(ex) { /*console.log(ex.message);*/ /*console.trace();*/ } /* eslint-disable-line no-unused-vars */
