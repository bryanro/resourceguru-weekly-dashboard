var express = require('express');
var router = express.Router();
var logger = require('winston');
var util = require('../modules/util');
var config = require('../../../config');
var ChargeabilityController = require('../controllers/chargeability');

router.get('/', function (req, res, next) {

    var startDate = req.param('startDate');
    var endDate = req.param('endDate');
    var password = req.cookies.adminPw;

    if (config.disallowChargeability || password !== config.chargeabilityPassword) {
        logger.warn('disallowChargeability flag is set to true, so do not allow access');
        res.status(401).send('Unauthorized');
    }
    else {
        ChargeabilityController.getChargeabilityForPeriod(startDate, endDate, function (err, chargeability) {
            if (err) {
                res.status(500).send({ errorMessage: err });
            }
            else {
                res.status(200).send(chargeability);
            }
        });
    }
});

module.exports = router;