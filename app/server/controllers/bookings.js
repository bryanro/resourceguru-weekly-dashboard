var auth = require('./auth');
var logger = require('winston');
var rest = require('restler');
var util = require('../modules/util');
var config = require('../../../config');
var _ = require('underscore');

var ClientsController = require('./clients');
var ProjectsController = require('./projects');
var ResourcesController = require('./resources');

var BookingsController = {};

BookingsController.bookingsModel = {};

BookingsController.fetchBookings = function (callback) {
    var startDate = util.getMondayOfThisWeek();
    var endDate = util.getMondayOfNextWeek();

    auth.getAccessToken(function (err, authToken) {
        if (err) {
            callback(err);
        }
        else {
            var options = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                }
            };

            var url = config.resourceguru.baseUriWithDomain + '/bookings';
            if (startDate && endDate) {
                url += '?start_date=' + startDate + '&end_date=' + endDate ;
            }

            logger.debug('getBookings url: ' + url);

            rest.get(url, options)
                .on('success', function (result, response) {
                    logger.debug('getBookings: ' + result.length + ' records');
                    BookingsController.bookingsModel = result;
                    BookingsController.bookingsModel.lastUpdate = new Date();
                    callback(null, result);
                })
                .on('fail', function (result, response) {
                    util.handleWebRequestError(result, response, callback);
                })
                .on('error', function (result, response) {
                    util.handleWebRequestError(result, response, callback);
                });
        }
    });
}

BookingsController.getBookings = function (callback) {
    if (BookingsController.bookingsModel.lastUpdate && !util.isDataStale(BookingsController.bookingsModel.lastUpdate)) {
        logger.info('getBookings data is fresh, so return from cache');
        callback(null, BookingsController.bookingsModel);
    }
    else {
        logger.info('getBookings data is stale, so get from web service');
        BookingsController.fetchBookings(callback);
    }
}

BookingsController.getBookingsThisWeek = function (callback) {
    BookingsController.getBookings(function (err, bookings) {
        if (err) {

        }
        else {
            ClientsController.getClients(function (err, clients) {
                if (err) {

                }
                else {
                    ProjectsController.getProjects(function (err, projects) {
                       if (err) {

                       }
                        else {
                           ResourcesController.getResources(function (err, resources) {
                               if (err) {

                               }
                               else {
                                   util.mergeBookingsData(bookings, clients, projects, resources, callback);
                               }
                           });
                       }
                    });
                }
            });
        }
    })
}

module.exports = BookingsController;

logger.debug('BookingsController loaded');