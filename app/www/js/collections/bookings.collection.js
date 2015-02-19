define([
    'backbone',
    'models/booking.model'
], function (Backbone, BookingModel) {
    var BookingCollection = Backbone.Collection.extend({
        model: BookingModel,
        url: '/bookings/extract',
        initialize: function () {
        }
    });

    return BookingCollection;
});