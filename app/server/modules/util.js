var logger = require('winston');
var moment = require('moment');
var _ = require('underscore');
var profilepics = require ('../configs/profilepics');
var nonbillable = require ('../configs/nonbillable');

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
    if (moment(Util.getMondayOfThisWeek()).isAfter(lastUpdate)) {
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
    bookings = Util.applyMetadata(bookings);
    callback(null, bookings);
}

/**
 * Apply additional metadata such as profile pics, billable flag, etc.
 * @param bookings
 * @returns {*}
 */
Util.applyMetadata = function (bookings) {
    _.each(bookings, function (booking) {
        // profile pic
        if (booking.resource) {
            var foundProfilePic = _.findWhere(profilepics, {name: booking.resource.name});
            if (foundProfilePic) {
                booking.resource.profile_pic = foundProfilePic.imageUrl;
            }
        }
        else {
            logger.error('booking.resource is not defined');
        }

        // billable flag
        if (booking.client && booking.project) {
            var foundNonBillable = _.findWhere(nonbillable, {
                client: booking.client.name,
                project: booking.project.name
            });
            if (foundNonBillable) {
                booking.project.billable = false;
            }
            else {
                booking.project.billable = true;
            }
        }
        else {
            logger.error('booking.client and booking.project are not defined');
        }
    });
    return bookings;
}

/**
 * Convert hex to rgba that can be plugged directly into the CSS style
 * @param hex includes with and without #, and also supports shorthand form
 * @param opacity between 0 and 1
 * @returns string containing "rgba(#, #, #, #)"
 */
Util.hexToRgba = function (hex, opacity) {
    // if hex isn't set, default to 0
    if (!hex) {
        hex = "#FFFFFF";
    }
    // expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return "rgba(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + "," + opacity + ")";
}

/**
 * Calculate the number of working days between startDate and endDate
 * @param startDate
 * @param endDate
 * @returns number of working days
 */
Util.numWorkingDays = function (startDate, endDate) {
    var start = moment(startDate);
    var end = moment(endDate);
    var count = 0;

    while(!start.isAfter(end)) {
        if (start.day() > 0 && start.day() < 6)
        {
            count++;
        }
        start.add(1, 'days');
    }

    return count;
}

module.exports = Util;