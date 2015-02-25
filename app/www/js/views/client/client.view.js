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
            this.filterBookings();
            this.byClientTemplate = _.template(ByClientTemplate);
            this.$el.html(this.byClientTemplate({ clientBookings: this.bookings }));

            Util.refreshPageAtTime();
        },

        events: {
        },

        filterBookings: function () {
            // remove BlueFletch Internal - Business Development
            var BlueFletchInternal = _.find(this.bookings.models, function (booking) {
                return booking.get('client') == 'BlueFletch Internal';
            });
            BlueFletchInternal.set('projects', _.reject(BlueFletchInternal.get('projects'), function (project) {
                return project.name == 'Business Development';
            }));
        }
    });

    return ClientView;
});