const con = require('../db.js');



exports.runQuery = function (query){
  return new Promise((resolve, reject) => {
    con.query(query, (err, queryResults) => {
      if(err){
        reject(err);
      }
      else{
        resolve(queryResults);
      }
    })
  })
}