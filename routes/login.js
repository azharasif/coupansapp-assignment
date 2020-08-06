var bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('@hapi/joi');
const crypto = require('crypto');
const router = express.Router();
const functions = require('../middleware/functions')
const con = require('../db');

const userSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
  offset: Joi.number().integer()
});


router.post('/', async function (req, res, next) {
  let validated = userSchema.validate(req.body, { abortEarly: false });
  try {
    con.beginTransaction(async function () {
      try {
        if (!validated.error) {
          let user = await functions.runQuery(`SELECT id, email, password FROM user  WHERE email = "${req.body.email}"`);
          if (user.length) {
        
            let token = crypto.randomBytes(32).toString('hex');
            var hash = bcrypt.compareSync(req.body.password, user[0].password);
            if (hash == false) {
              res.send({ statusCode: 405, message: "Invalid credentials" })
            } else {
              const response = {
                "token": token
              }
             
              let query = `Insert into authtoken (token , userid, startdate, enddate) values("${response.token}" ,${user[0].id},
              CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP,  INTERVAL 12 DAY))`;
              await functions.runQuery(query);
             
              
                con.commit();
                res.send({ statusCode: 200, data: response , message:"logged in" });
              }
           
          } else {
            res.send({ statusCode: 405, message: "Email not registered" });
          }
        } else {
          res.send({ statusCode: 405, message: validated.error.message })
        }
      } catch (err) {
        console.log(err)
        con.rollback();
        // if (err.code == 'ER_DUP_ENTRY') res.send({ statusCode: 405, message: "You have already devicetoken against this device" });
        // else {
        res.send({ statusCode: 405, message: err.message })
        // }
      }
    })
  } catch (err) {
      console.log(err)
    con.rollback();
    res.send({ statusCode: 405, message: err.message })
  }
})

module.exports = router;
