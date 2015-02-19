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

router.get('/week', function (req, res, next) {

    BookingsController.getPopulatedBookingsThisWeek(function (err, bookings) {
        if (err) {
            res.status(500).send({ errorMessage: err });
        }
        else {
            res.status(200).send(bookings);
        }
    })

});

router.get('/week/client', function (req, res, next) {

    BookingsController.getWeeklyBookingsByClient(function (err, bookings) {
        if (err) {
            res.status(500).send({ errorMessage: err });
        }
        else {
            res.status(200).send(bookings);
        }
    })

});

router.get('/week/resource', function (req, res, next) {

    BookingsController.getWeeklyBookingsByResource(function (err, bookings) {
        if (err) {
            res.status(500).send({ errorMessage: err });
        }
        else {
            res.status(200).send(bookings);
        }
    })

});

router.get('/historical', function (req, res, next) {

    BookingsController.getPopulatedBookingsHistorical(function (err, bookings) {
        if (err) {
            res.status(500).send({ errorMessage: err });
        }
        else {
            res.status(200).send(bookings);
        }
    })

});

module.exports = router;