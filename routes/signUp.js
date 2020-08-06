const mysql = require("mysql"); var bcrypt = require('bcryptjs');
const express = require('express');
const Joi = require('@hapi/joi');
const router = express.Router();
const functions = require('../middleware/functions')
const connection = require('../db');

const schema = Joi.object().keys({
  fullname: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  city: Joi.string().required()

});
router.post('/', function (req, res) {

  connection.beginTransaction(async function () {
    try {
      let validation = schema.validate(req.body, { abortEarly: false });
      if (!validation.error) {
        const hashedPassword = bcrypt.hashSync(req.body.password, 8);
        let query = `Insert into user (fullname, phone, email, password ,city) values("${req.body.fullname}","${req.body.phone}", "${req.body.email}", "${hashedPassword}","${req.body.city}")`;
        console.log(query);
        var result =await functions.runQuery(query)
        connection.commit();
        res.send({ statusCode: 200, message: "Signed in successfully" });
      } else {
        res.send({ statusCode: 405, message: validation.error.message });
      }
    } catch (err) {
      connection.rollback();
      if (err.code == 'ER_DUP_ENTRY') {
        res.send({ statusCode: 405, message: 'Email/mobile No. already registered' });
      } else {
        res.send({ statusCode: 405, message: err.message });
      }
    }

  })

})

module.exports = router;
