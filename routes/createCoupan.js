var express = require('express');
var router = express.Router();


var stripe = require('stripe')('sk_test_7tZHyX642LmkZN8myf1Fs6yh');

router.post('/', function(req, res, next) {
  
  stripe.coupons.create(
    {
      percent_off: req.body.price,
      duration: 'repeating',
      duration_in_months: req.body.duration,
    },
    function(err, coupon) {
      if(err) console.log(err)
      console.log(coupon)
      res.send({ statusCode: 200, message: "new coupan created "})
      
    
    }
  );
});



module.exports = router;
