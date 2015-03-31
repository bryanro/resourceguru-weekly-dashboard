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
BookingsController.bookingsModelWeekly = {};

BookingsController.fetchBookings = function (callback) {
    auth.getAccessToken(function (err, authToken) {
        if (err) {
            callback(err);
        }
        else {
            var options = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                },
                query: {
                    limit: 0 // get all records with no limit
                }
            };

            var url = config.resourceguru.baseUriWithDomain + '/bookings';

            logger.debug('getBookings url: ' + url);

            rest.get(url, options)
                .on('success', function (result, response) {
                    logger.debug('fetchBookings: ' + result.length + ' records');
                    BookingsController.bookingsModel = result;
                    BookingsController.bookingsModel.lastUpdate = new Date();
                    callback(null, BookingsController.bookingsModel);
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

BookingsController.fetchWeeklyBookings = function (callback) {
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
                url += '?start_date=' + startDate + '&end_date=' + endDate;
            }

            logger.debug('fetchWeeklyBookings url: ' + url);

            rest.get(url, options)
                .on('success', function (result, response) {
                    logger.debug('getWeeklyBookings: ' + result.length + ' records');
                    BookingsController.bookingsModelWeekly = result;
                    BookingsController.bookingsModelWeekly.lastUpdate = new Date();
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

BookingsController.getWeeklyBookings = function (callback) {
    if (BookingsController.bookingsModelWeekly.lastUpdate && !util.isDataStale(BookingsController.bookingsModelWeekly.lastUpdate)) {
        logger.info('getBookingsWeekly data is fresh, so return from cache');
        callback(null, BookingsController.bookingsModelWeekly);
    }
    else {
        logger.info('getBookingsWeekly data is stale, so get from web service');
        BookingsController.fetchWeeklyBookings(callback);
    }
}

BookingsController.getPopulatedBookingsHistorical = function (callback) {
    BookingsController.getBookings(function (err, bookings) {
        if (err) {
            callback(err);
        }
        else {
            BookingsController.getLookupData(bookings, callback);
        }
    });
}

BookingsController.getPopulatedBookingsThisWeek = function (callback) {
    BookingsController.getWeeklyBookings(function (err, bookings) {
        if (err) {
            callback(err);
        }
        else {
            BookingsController.getLookupData(bookings, callback);
        }
    });
}

BookingsController.getLookupData = function (bookings, callback) {
    ClientsController.getClients(function (err, clients) {
        if (err) {
            callback(err);
        }
        else {
            ProjectsController.getProjects(function (err, projects) {
                if (err) {
                    callback(err);
                }
                else {
                    ResourcesController.getResources(function (err, resources) {
                        if (err) {
                            callback(err);
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

BookingsController.getWeeklyBookingsByResource = function (callback) {
    BookingsController.getPopulatedBookingsThisWeek(function (err, bookings) {
        if (err) {
            callback(err);
        }
        else {
            var resourceBookings = [];
            /*
             {
             resource: Joe,
             image: http://...,
             projects: [{ name: NGFP, client: THD, color: rgba(255,165,5,0.2) },...]
             }
             */

            _.each(bookings, function (booking) {
                // search by resource name
                var foundResourceBooking = _.findWhere(resourceBookings, {resource: booking.resource.name});
                if (foundResourceBooking) {
                    // don't add dupe
                    var foundProject = _.findWhere(foundResourceBooking.projects, {
                        name: booking.project.name,
                        client: booking.client.name
                    });
                    if (!foundProject) {
                        foundResourceBooking.projects.push({
                            name: booking.project.name,
                            client: booking.client.name,
                            color: util.hexToRgba(booking.project.color, 0.2)
                        });
                    }
                }
                else {
                    var resourceBooking = {
                        resource: booking.resource.name,
                        image: booking.resource.profile_pic,
                        projects: [{
                            name: booking.project.name,
                            client: booking.client.name,
                            color: util.hexToRgba(booking.project.color, 0.2)
                        }]
                    };

                    resourceBookings.push(resourceBooking);
                }
            });
            resourceBookings = _.sortBy(resourceBookings, function (booking) {
                return booking.resource;
            });

            callback(null, resourceBookings)
        }
    });
}

BookingsController.getWeeklyBookingsByClient = function (callback) {

    BookingsController.getPopulatedBookingsThisWeek(function (err, bookings) {
        if (err) {
            callback(err);
        }
        else {
            var clientBookings = [];
            /*
             {
             client: THD,
             projects: [{ name: NGFP, color: rgba(255,0,155,0.2), resources: [Joe,Jake,...]}],
             }
             */

            _.each(bookings, function (booking) {
                var foundClient = _.findWhere(clientBookings, {client: booking.client.name});
                if (foundClient) {
                    // don't add dupe
                    var foundProject = _.findWhere(foundClient.projects, {name: booking.project.name});
                    if (foundProject) {
                        if (!_.contains(foundProject.resources, booking.resource.name)) {
                            foundProject.resources.push(booking.resource.name);
                        }
                    }
                    else {
                        foundClient.projects.push({
                            name: booking.project.name,
                            color: util.hexToRgba(booking.project.color, 0.2),
                            resources: [booking.resource.name]
                        });
                    }
                }
                else {
                    clientBookings.push({
                        client: booking.client.name,
                        projects: [{
                            name: booking.project.name,
                            color: util.hexToRgba(booking.project.color, 0.2),
                            resources: [booking.resource.name]
                        }]
                    });
                }
            });

            callback(null, clientBookings);
        }
    });
}

module.exports = BookingsController;

logger.debug('BookingsController loaded');