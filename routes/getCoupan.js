var express = require('express');
var 
router = express.Router();
var stripe = require('stripe')('sk_test_7tZHyX642LmkZN8myf1Fs6yh');


/* GET users listing. */
router.post('/', function(req, res, next) {
 var coupans = req.body.id
  stripe.coupons.retrieve(
    coupans,
    function(err, coupon) {
      if(err)  console.log(err)
      console.log(coupon)
      res.send({ statusCode: 200, data:coupon})
    }
  );

});

module.exports = router;
