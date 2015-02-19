define([
    'backbone',
    'models/booking.model'
], function (Backbone, BookingModel) {
    var BookingsWeeklyResourceCollection = Backbone.Collection.extend({
        model: BookingModel,
        url: '/bookings/week/resource',
        initialize: function () {
        }
    });

    return BookingsWeeklyResourceCollection;
});