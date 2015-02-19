define([
    'jquery',
    'underscore',
    'backbone',
    'util',
    'collections/bookingsweeklyresource.collection',
    'text!./resource.html'
], function ($, _, Backbone, Util, BookingsWeeklyResourceCollection, ByResourceTemplate) {

    var HomeView = Backbone.View.extend({

        constants: {
            colorBoxOpacity: 0.2
        },

        el: $('#main-content'),

        initialize: function (options) {

            var that = this;
            this.bookings = new BookingsWeeklyResourceCollection();
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
            this.byResourceTemplate = _.template(ByResourceTemplate);
            this.$el.html(this.byResourceTemplate({ resourceBookings: this.bookings }));
        },

        events: {
        }
    });

    return HomeView;
});