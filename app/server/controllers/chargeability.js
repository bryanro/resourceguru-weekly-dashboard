var auth = require('./auth');
var logger = require('winston');
var rest = require('restler');
var util = require('../modules/util');
var config = require('../../../config');
var _ = require('underscore');
var moment = require('moment');
var BookingsController = require('./bookings');

var ChargeabilityController = {};

ChargeabilityController.getChargeabilityForPeriod = function (startDate, endDate, callback) {

    BookingsController.getPopulatedBookingsHistorical(function (err, bookings) {

        var filteredBookings = ChargeabilityController.filterByTime(bookings, startDate, endDate);

        var resourceChargeability = ChargeabilityController.calculateResourceChargeability(filteredBookings);
        var aggregatedChargeability = ChargeabilityController.calculateAggregatedChargeability(resourceChargeability);

        callback({
            filteredBookings: filteredBookings,
            resourceChargeability: resourceChargeability,
            aggregatedChargeability: aggregatedChargeability
        });
    });
}

ChargeabilityController.filterByTime = function (bookings, startDate, endDate) {
    var filteredBookings = [];

    _.each(bookings, function (booking) {
        // durations: [{ date: '2015-01-01', date: 480, ...}]
        var filteredDurations = _.filter(booking.durations, function (duration) {
            var durationMoment = moment(duration.date);
            // if the duration's date is within the start and end date (inclusive) add it to the array
            if (durationMoment.isSame(startDate) || durationMoment.isSame(endDate)
                    || (durationMoment.isAfter(startDate) && durationMoment.isBefore(endDate))) {
                return true;
            }
        });
        // if there was at least one duration in the time period, add it back
        if (filteredDurations && filteredDurations.length > 0) {
            booking.durations = filteredDurations;
            booking.utilization = ChargeabilityController.calculateBookingUtilization(filteredDurations);
            filteredBookings.push(booking);
        }
    });

    return filteredBookings;
}

ChargeabilityController.calculateBookingUtilization = function (durations) {
    var hoursBooked = _.reduce(durations, function (memo, duration) {
        return memo + (duration.duration / 60); // duration is in min, so divide by 60 to get hours
    }, 0);
    var hoursPossible = durations.length * 8; // number of days * 8
    var utilizationPct = (hoursBooked / hoursPossible * 100).toFixed(0);
    return {
        hoursBooked: hoursBooked,
        hoursPossible: hoursPossible,
        utilizationPct: utilizationPct
    };
}

ChargeabilityController.calculateResourceChargeability = function (bookings) {
    var resourceBookings = [];
    /*
     {
     resource: Joe,
     image: http://...,
     projects: [{ name: NGFP, client: THD, color: rgba(255,165,5,0.2) },...],
     chargeability: { hoursBooked: 120, hoursCharged: 90, hoursPossible: 120, utilizationPct: 100, chargeabilityPct: 75 }
     }
     */

    _.each(bookings, function (booking) {
        // search by resource name
        var foundResourceBooking = _.findWhere(resourceBookings, {resource: booking.resource.name});
        if (foundResourceBooking) {
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

            // update chargeability
            foundResourceBooking.chargeability.hoursBooked += booking.utilization.hoursBooked;
            foundResourceBooking.chargeability.hoursCharged += (booking.project.billable ? booking.utilization.hoursBooked : 0);
            foundResourceBooking.chargeability.hoursPossible += booking.utilization.hoursPossible;
            foundResourceBooking.chargeability.utilizationPct = ((foundResourceBooking.chargeability.hoursBooked / foundResourceBooking.chargeability.hoursPossible) * 100).toFixed(0);
            foundResourceBooking.chargeability.utilizationPct = ((foundResourceBooking.chargeability.hoursCharged / foundResourceBooking.chargeability.hoursPossible) * 100).toFixed(0);
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

            resourceBooking.chargeability = {
                hoursBooked: booking.utilization.hoursBooked,
                hoursCharged: (booking.project.billable ? booking.utilization.hoursBooked : 0),
                hoursPossible: booking.utilization.hoursPossible,
                utilizationPct: ((booking.utilization.hoursBooked / booking.utilization.hoursPossible) * 100).toFixed(0),
                chargeabilityPct: (((booking.project.billable ? booking.utilization.hoursBooked : 0) / booking.utilization.hoursPossible) * 100).toFixed(0)
            }

            resourceBookings.push(resourceBooking);
        }
    });
    resourceBookings = _.sortBy(resourceBookings, function (booking) {
        return booking.resource;
    });

    return resourceBookings;
}

ChargeabilityController.calculateAggregatedChargeability = function (resourceBookings) {
    /*
    {
        hoursBooked: 100,
        hoursCharged: 80,
        hoursPossible: 100,
        utilizationPct: 100,
        chargeabilityPct: 80
    }
     */
    var agg = {
        hoursBooked: 0,
        hoursCharged: 0,
        hoursPossible: 0
    }
    _.each(resourceBookings, function (booking) {
        agg.hoursBooked += booking.chargeability.hoursBooked;
        agg.hoursCharged += booking.chargeability.hoursCharged;
        agg.hoursPossible += booking.chargeability.hoursPossible;
    });

    agg.utilizationPct = ((agg.hoursBooked / agg.hoursPossible) * 100).toFixed(0);
    agg.chargeabilityPct = ((agg.hoursCharged / agg.hoursPossible) * 100).toFixed(0);

    return agg;
}



module.exports = ChargeabilityController;

logger.debug('ChargeabilityController loaded');