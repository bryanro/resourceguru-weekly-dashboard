define([
    'backbone'
], function (Backbone) {
    var BookingModel = Backbone.Model.extend({
        idAttribute: '_id',
        initialize: function () {
        },
        urlRoot: '/bookings'
    });

    return BookingModel;
});