var express = require('express');
var  router = express.Router();
var stripe = require('stripe')('sk_test_7tZHyX642LmkZN8myf1Fs6yh');


router.post('/', function(req, res, next) {
  
    coupan_id = req.body.id
stripe.coupons.del(
    coupan_id,
    function(err, confirmation) {
        if(err) console.log(err)
      console.log(confirmation)

      res.send({ statusCode: 200, message: " coupan deleted "})
    }
  );

});

module.exports = router;
