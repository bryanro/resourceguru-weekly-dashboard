var logger = require('winston');
var moment = require('moment');
var _ = require('underscore');
var profilepics = require ('../configs/profilepics');

var Util = {};

Util.handleWebRequestError = function (result, response, callback) {
    if (response && response.statusCode) {
        if (response.statusCode == 401) {
            logger.error('getBookings authentication error');
            callback('authentication error');
        }
        else if (response.statusCode == 400) {
            logger.error('getBookings bad request');
            callback('bad request');
        }
        else if (response.statusCode == 500) {
            logger.error('getBookings internal server error');
            callback('internal server error');
        }
        else {
            logger.error('getBookings error code: ' + response.statusCode);
            callback('error with resource guru');
        }
    }
    else {
        logger.error('getBookings generic error with resource guru');
        callback('error with resource guru');
    }
}

Util.getMondayOfThisWeek = function () {
    return moment().day(1).format('YYYY-MM-DD');
}

Util.getMondayOfNextWeek = function () {
    return moment().day(8).format('YYYY-MM-DD');
}

Util.isDataStale = function (lastUpdate) {
    if (Util.getMondayOfNextWeek() <= lastUpdate) {
        return true;
    }
    else {
        return false;
    }
}

Util.mergeBookingsData = function (bookings, clients, projects, resources, callback) {
    _.each(bookings, function (booking) {
        booking.client = _.findWhere(clients, { id: booking.client_id });
        booking.project = _.findWhere(projects, { id: booking.project_id });
        booking.resource = _.findWhere(resources, { id: booking.resource_id });
    });
    bookings = Util.applyProfilePics(bookings)
    callback(null, bookings);
}

Util.applyProfilePics = function (bookings) {
    _.each(bookings, function (booking) {
        var foundProfilePic = _.findWhere(profilepics, { name: booking.resource.name });
        if (foundProfilePic) {
            booking.resource.profile_pic = foundProfilePic.imageUrl;
        }
    });
    return bookings;
}

module.exports = Util;