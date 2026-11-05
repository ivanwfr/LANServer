//┌────────────────────────────────────────────────────────────────────────────┐
//│ js_xpath.js      ● $APROJECTS/LANServer/SERVER      ● _TAG (261101:16h:49) │
//└────────────────────────────────────────────────────────────────────────────┘
/* IMPORT {{{*/

/*}}}*/
let js_xpath = (function() { /* eslint-disable-line no-unused-vars */
/*➔ get_nodeXPath {{{*/
let get_nodeXPath = function(node)
{
    if(node ==         window  ) return "window";
    if(node instanceof Document) return "window.document";

    let  node_type_pos_array;
    for( node_type_pos_array = []
    ;    node && !(node instanceof Document)
    ;    node =   (node.nodeType == Node.ATTRIBUTE_NODE)
              ?    node.ownerElement
              :    node.parentNode
    ) {
        let node_type_pos = {};

        /* TYPE */
        switch( node.nodeType ) {
            case Node.TEXT_NODE                   : node_type_pos.name =                   "text"; break;
            case Node.ATTRIBUTE_NODE              : node_type_pos.name =      "@" + node.nodeName; break;
            case Node.PROCESSING_INSTRUCTION_NODE : node_type_pos.name = "processing-instruction"; break;
            case Node.COMMENT_NODE                : node_type_pos.name =                "comment"; break;
            case Node.ELEMENT_NODE                : node_type_pos.name =            node.nodeName; break;
        }

        /* POS */
        node_type_pos.position = get_sibling_rank( node );

        node_type_pos_array.push( node_type_pos );
    }

    let xpath = "";
    for(let i=node_type_pos_array.length-1; i >= 0; i -= 1)
    {
        let node_type_pos   = node_type_pos_array[i];
        xpath += node_type_pos.name ? ("/"+node_type_pos.name) : ".";
        if((node_type_pos.position != null) && (node_type_pos.position != "1"))
            xpath += "["+ node_type_pos.position+"]";
    }

    xpath = xpath.toLowerCase();

//  if( xpath_base && xpath.startsWith( xpath_base ))
//      xpath =        xpath.substring( xpath_base.length+1 );

    return xpath;
};
/*}}}*/
/*_ get_nodeXPath_as_key {{{*/
let get_nodeXPath_as_key = function(node)
{
    let key = get_nodeXPath( node )
        .      replace(/.html.body.(.*)/,  "$1")
        .      replace(/[^\w]+/g        ,   "_")
        .      replace(/(^_)|(_$)/      ,    "");

    return key;
};
/*}}}*/
/*➔ get_nodeXPath_target {{{*/
let get_nodeXPath_target = function(nodeXPath)
{
    let first_node;
    try {

        let evaluator  = new XPathEvaluator();
        let expression = evaluator.createExpression(nodeXPath);

        let result     = expression.evaluate(document, XPathResult.ORDERED_NODE_ITERATOR_TYPE);

        let node;
        while(node = result.iterateNext())
        {
            if(!first_node)
                first_node = node;
        }

    }
    catch(ex) {
        console.log(ex);
    }
    return first_node;
};
/*}}}*/
/*_ get_sibling_rank {{{*/
let get_sibling_rank = function(node)
{
    if(node.nodeType == Node.ATTRIBUTE_NODE) return null;

    let rank = 1;
    for(let prev_node =      node.previousElementSibling
    ;       prev_node
    ;       prev_node = prev_node.previousElementSibling
    ) {
        if(prev_node.nodeName == node.nodeName)
            rank += 1;
    }
    return rank;
 };
/*}}}*/
/*_ parse_url ● @see also SERVER/server2_listener.js {{{*/
let parse_url = function(url)
{
// log {{{
//log_X("parse_url:")
//log_X("url:")
//console.dir( url  )
//log_X("decodeURIComponent(url):")
//console.dir( decodeURIComponent(url)  )
//}}}

    // setup default parsing_failed_empty_segments
    let url_match
        = [   ""/* [0]    url */
            , ""/* [1] scheme */
            , ""/* [2]   port */
            , ""/* [3] domain */
            , ""/* [4]   path */
            , ""/* [5]  query */
        ];

    try {
        //┌────────────────────────────────────────────────────────────────────┐
        //│ https://192.168.1.14:447/SERVER/server.js
        //└────────────────────────────────────────────────────────────────────┘
        url_match
            = decodeURIComponent(url)
            . replace(     /\+/g, " ")  // encoded space
            . replace(     /\r/g, " ")  // CR
            . replace(     /\n/g, " ")  // LF
            . replace(  /\s\s+/g, " ")  // multiple spaces
            . replace(/\s*;\s*$/,  "")  // trailing separator
            . match(/^(\w+)?(:\/\/)?([^\/]+)?\/([^\?]+)?\??(.*)?/);
//┌───────────────────▲───▲─▲─────▲─▲──────▲───▲──────▲────────────────────────┐
//│                   (111) (22222) (333333)   (444444)    (55)
//│                    ▲▲▲   ▲▲▲▲▲   ▲▲▲▲▲▲     ▲▲▲▲▲▲      ▲▲
//│                  scheme  port    domain      path     query
//└────────────────────────────────────────────────────────────────────────────┘
    }
    catch(err) { console.warn(err); }

    let args
        = {   scheme : url_match[1]
          //,   port : url_match[2]
            , domain : url_match[3]
            ,   path : url_match[4]
            ,  query : url_match[5]
        };
//console.dir(args);

    return  args;
};
/*}}}*/
/*● return {{{*/
return {  name : "js_xpath"
    ,            get_nodeXPath
    ,            get_nodeXPath_as_key
    ,            get_nodeXPath_target
    ,            parse_url
};
/*}}}*/
})();
export { js_xpath }; /* eslint-disable-line no-unused-expressions, semi, no-extra-semi */
window . js_xpath = js_xpath;
