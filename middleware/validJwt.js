
const functions = require('../middleware/functions');



exports.validJwt = async (req , res  , next)=>{

  const token =  JSON.stringify(req.headers.authorization)||1234;
  try{
    let query = `select u.id as userid, a.id as tokenid, a.enddate from user u inner join authtoken a on u.id = a.userid where a.token = ${token}`;
    console.log(query);
    let queryResults =  await functions.runQuery(query);
    console.log(queryResults);
    if(queryResults.length){

        let tokenEndDate = new Date(queryResults[0].enddate);
        await tokenEndDate.setMinutes(tokenEndDate.getMinutes() - new Date().getTimezoneOffset() );
        let currentDate = new Date();
        await currentDate.setMinutes(currentDate.getMinutes() - new Date().getTimezoneOffset());
        if(tokenEndDate > currentDate){
          req.body.userid = queryResults[0].userid;
          next();
        } else {
          await functions.runQuery(`Delete from authtoken where id = ${queryResults[0].tokenid}`);
          res.send({statusCode:405, message: "Token has expired. Please login again."});
        }
    
    } else{
      res.send({statusCode:405, message: "Invalid token. Please login."})
    }
  }catch(err){
    res.send({"statusCode": 405, "message": err.message});
  }
}

