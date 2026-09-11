

let bddservice = (function(){
"use strict";

//let   config              =
//{  HOST                      : "localhost"
// , PORT                      : "5436"
// , USER                      : "postgres"
// , PASSWORD                  : "password123"
// , DATABASE                  : "postgres"
//};

let { Client }  = require("pg");


let get_topics = function(args, response)
{
    //let lang = "FR", user_id = "2dc223d3-e83c-4729-95f8-0efa517b780e";
    let { config, lang, user_id } = args;
    // console.log("get_topics, "+ args);


        let client = new Client({ host     : config.HOST
                            , port     : config.PORT
                            , user     : config.USER
                            , password : config.PASSWORD
                            , database : config.DATABASE
        });
        client.connect();


let sql_topics = `
-- récupération topics

with lang as(
        select $1::text as lang from dual  
), sub as (
        select id as subject_id from subjects
), sub_lang as (
        select subject_id, lang from lang, sub
)
select sub_lang.subject_id, libelle from sub_lang left outer join subjects_translation on sub_lang.subject_id=subjects_translation.subject_id and sub_lang.lang=subjects_translation.lang;

    `

let sql_questions = `
-- questions
with lang as(
        select $1::text as lang from dual 
), q as (
        select subject_id, id as question_id from questions
), q_lang as (
        select subject_id, question_id, lang from lang, q
)
select subject_id, q_lang.question_id, libelle from q_lang left outer join questions_translation on q_lang.question_id=questions_translation.question_id and q_lang.lang=questions_translation.lang;
`

let sql_qcm = `
-- qcm
with lang as(
        select $1::text as lang from dual 
), qcm as (
        select question_id, rank from qcm
), qcm_lang as(
        select question_id, rank, lang from lang, qcm
)
select qcm_lang.question_id, qcm_lang.rank, libelle from qcm_lang left outer join qcm_translation
        on qcm_lang.question_id=qcm_translation.question_id and qcm_lang.lang=qcm_translation.lang
        and qcm_lang.rank=qcm_translation.rank;
`

let sql_user_commentaires = `
-- RECUPERATION REMARQUES UTILISATEURS
-- récupération des commentaires libres utilisateurs

with args as (
        select uuid($1::text) as user_id from dual  
), q as (
        select id as question_id, subject_id from questions
), resp_u as (
        select question_id, commentaire from responses_libres inner join args on args.user_id=responses_libres.user_id
), qr as (
        select q.question_id, commentaire from q left outer join resp_u on q.question_id=resp_u.question_id
)
select * from qr;
`

let sql_user_qcm = `
-- récupération des réponses qcm utilisateurs

with args as (
        select uuid($1::text) as user_id from dual
), resp_u as (
        select question_id, rank from responses_qcm inner join args on args.user_id=responses_qcm.user_id
), nresp_u as (
        select question_id from qcm
        except
        select question_id from responses_qcm
), tresp_n as (
        select -1 as rank from dual
), resp_n as (
        select question_id, rank from nresp_u, tresp_n
)
select question_id, rank from resp_u union
select question_id, rank from resp_n;
`

console.log("lang:"+lang);
// callback
client.query(sql_topics, [lang], (err, res) => {
    console.log("sql_topics");
  if (err) {
    console.log(err.stack)
  } else {
    //console.log(res.rows);
    let topics = {};
    res.rows.forEach( (e)=> {
        topics[e.subject_id] = e;
    });
    client.query(    sql_questions, [lang], (err, res) => {
        console.log("sql_questions");
        //console.log("topics:"+topics);
        if (err) {
            console.log(err.stack)
        } else {
            //console.log(res.rows);
            let idx2q = {};
            res.rows.forEach( (q) =>{
                let topic = topics[q.subject_id];
                idx2q[q.question_id] = q;
                if(!('questions' in topic)){
                    topic['questions'] = {};
                }
                topic['questions'][q.question_id] = q;
            });
            client.query(    sql_qcm, [lang], (err, res) => {
                console.log("sql_qcm");
                if (err) {
                    console.log(err.stack)
                } else {
                    // console.log(res.rows);
                    res.rows.forEach( (qcm) =>{
                        let question = idx2q[qcm.question_id];
                        if(!('qcm' in question)){
                            question.qcm = {};
                        }
                        question.qcm[qcm.rank] = qcm.libelle;
                    });
                    client.query(    sql_user_commentaires, [user_id], (err, res) => {
                        console.log("sql_user_commentaires");
                        if (err) {
                            console.log(err.stack)
                        } else {
                            // console.log(res.rows);
                            res.rows.forEach( (comment) =>{
                                if(comment.commentaire){
                                    let question = idx2q[comment.question_id];
                                    question.user_comment = comment.commentaire;
                                }
                            });
                            // writeJSON("feedback_topics_json", topics, response);
                            client.query(    sql_user_qcm, [user_id], (err, res) => {
                                console.log("sql_user_qcm");
                                if (err) {
                                    console.log(err.stack)
                                } else {
                                    // console.log(res.rows);
                                    res.rows.forEach( (qcm) =>{
                                        if(qcm.rank != -1){
                                            let question = idx2q[qcm.question_id];
                                          //question.user_qcm_rank = qcm.rank; //FIXME
                                            question.     qcm_rank = qcm.rank; // @see submit_feedbacks(args)
                                        }
                                    });
                                    writeJSON("feedback_topics_json", topics, response);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
  }});
};


let submit_feedbacks = function(config, args, response)
{
    console.log("submit_feedbacks: "+ JSON.stringify(args));
    let { user_id, lang, question_id, qcm_rank, comment } = args;
    let sql_qcm_insert = `
insert into RESPONSES_QCM (user_id,question_id,rank,ts) VALUES ($1,$2,$3,now());
    `;
    let sql_qcm_update = `
update RESPONSES_QCM set rank=$1, ts=now() where user_id=$2 and question_id=$3
    `;
    let sql_comment_insert = `
insert into RESPONSES_LIBRES (user_id,question_id,commentaire,ts) VALUES ($1,$2,$3::text,now());
    `;
    let sql_comment_update = `
update RESPONSES_LIBRES set commentaire=$1, ts=now() where user_id=$2 and question_id=$3
    `;

    let client = new Client({ host     : config.HOST
                        , port     : config.PORT
                        , user     : config.USER
                        , password : config.PASSWORD
                        , database : config.DATABASE
    });
    client.connect();

    client.query(    sql_qcm_insert, [user_id, question_id, qcm_rank], (err, res) => {
        console.log("sql_qcm_insert");
        if (err) {
            client.query(sql_qcm_update, [qcm_rank, user_id, question_id], (err, res) => {
                if(!err){
                    console.log("update qcm OK: " + user_id, question_id);
                } else{
                    console.log(err);
                    console.log("MAJ qcm ERROR: " + user_id, question_id);
                }
            });
        } else {
            console.log("insert qcm OK: " + user_id, question_id);
        }
    });
    client.query(    sql_comment_insert, [user_id, question_id, comment], (err, res) => {
        console.log("sql_comment_insert");
        if (err) {
            client.query(sql_comment_update, [comment, user_id, question_id], (err, res) => {
                if(!err){
                    console.log("update commentaire OK: " + user_id, question_id);
                } else{
                    console.log(err);
                    console.log("MAJ commentaire ERROR: " + user_id, question_id);
                }
            });
        } else {
            console.log("insert commentaire OK: " + user_id, question_id);
        }
    });
    close_connection(response);

};


let writeJSON = function(js_object_name, object, response){
    response.writeHead(200, {"Content-Type" : "text/javascript;"});
    let jscode = "'use strict';\nlet " + js_object_name + " = ";
    jscode += JSON.stringify(object);
    jscode += ";";
    response.write(jscode);
    response.end();
};


let close_connection = function(response){
    response.writeHead(200);
    response.end();
};

    return {
    get_topics,
    submit_feedbacks
};

})();
try { module.exports = bddservice; } catch(ex) {console.log("erreur bddservice: "+ex)};


/*
let lang = "FR", user_id = "2dc223d3-e83c-4729-95f8-0efa517b780e";
get_topics({lang, user_id});
*/
