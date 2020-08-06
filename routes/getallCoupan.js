var express = require('express');

var router = express.Router();
var stripe = require('stripe')('sk_test_7tZHyX642LmkZN8myf1Fs6yh');


router.get('/', function(req, res, next) {
    stripe.coupons.list(
        {limit: 2},
        function(err, coupons) {
            if(err) console.log(err)
           console.log(coupons)
           res.send({ statusCode: 200, data:coupons})
        }
      );

});

module.exports = router;
