define([
    'backbone',
    'models/booking.model'
], function (Backbone, BookingModel) {
    var BookingsWeeklyClientCollection = Backbone.Collection.extend({
        model: BookingModel,
        url: '/bookings/week/client',
        initialize: function () {
        }
    });

    return BookingsWeeklyClientCollection;
});