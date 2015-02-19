var express = require('express');
var router = express.Router();
var util = require('../modules/util');
var ChargeabilityController = require('../controllers/chargeability');

router.get('/', function (req, res, next) {

    var startDate = req.param('startDate');
    var endDate = req.param('endDate');

    if (!startDate) {
        startDate = new Date(2015, 0, 1);
    }
    if (!endDate) {
        endDate = util.getMondayOfThisWeek();
    }

    ChargeabilityController.getChargeabilityForPeriod(startDate, endDate, function (err, clients) {
        if (err) {
            res.status(500).send({ errorMessage: err });
        }
        else {
            res.status(200).send(clients);
        }
    });
});

module.exports = router;