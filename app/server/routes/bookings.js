var express = require('express');
var router = express.Router();
var util = require('../modules/util')
var BookingsController = require('../controllers/bookings');

router.get('/', function (req, res, next) {

    BookingsController.getBookings(function (err, bookings) {
        if (err) {
            res.status(500).send({ errorMessage: err });
        }
        else {
            res.status(200).send(bookings);
        }
    });
});

router.get('/extract', function (req, res, next) {

    BookingsController.getBookingsExtract(function (err, bookings) {
        if (err) {
            res.status(500).send({ errorMessage: err });
        }
        else {
            res.status(200).send(bookings);
        }
    })

});

module.exports = router;