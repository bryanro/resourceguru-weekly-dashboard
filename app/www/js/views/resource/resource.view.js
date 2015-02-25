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
            this.filterBookings();
            this.byResourceTemplate = _.template(ByResourceTemplate);
            this.$el.html(this.byResourceTemplate({ resourceBookings: this.bookings }));

            Util.refreshPageAtTime();
        },

        events: {
        },

        filterBookings: function () {
            var that = this;

            _.each(this.bookings.models, function (booking) {
                booking.set('projects', _.reject(booking.get('projects'), function (project) {
                    return (project.client == 'BlueFletch Internal' && project.name == 'Business Development');
                }));
                if (booking.get('projects').length < 1) {
                    that.bookings.remove(booking);
                }
            });
        }
    });

    return HomeView;
});