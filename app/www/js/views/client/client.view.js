define([
    'jquery',
    'underscore',
    'backbone',
    'util',
    'collections/bookingsweeklyclient.collection',
    'text!./client.html'
], function ($, _, Backbone, Util, BookingsWeeklyClientCollection, ByClientTemplate) {

    var ClientView = Backbone.View.extend({

        constants: {
            colorBoxOpacity: 0.2,
        },

        el: $('#main-content'),

        initialize: function (options) {

            var that = this;
            //this.bookings = options.bookingsCollection;
            this.bookings = new BookingsWeeklyClientCollection();
            this.bookings.fetch({
                success: function (model, result, options) {
                    that.render();
                },
                error: function (model, xhr, options) {
                    alert('Error');
                }
            });
        },

        render: function () {
            this.byClientTemplate = _.template(ByClientTemplate);
            this.$el.html(this.byClientTemplate({ clientBookings: this.bookings }));
        },

        events: {
        }
    });

    return ClientView;
});