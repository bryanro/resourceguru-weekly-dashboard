define([
    'jquery',
    'underscore',
    'backbone',
    'util',
    'text!./resource.html'
], function ($, _, Backbone, Util, ByResourceTemplate) {

    var HomeView = Backbone.View.extend({

        constants: {
            colorBoxOpacity: 0.2
        },

        el: $('#main-content'),

        initialize: function (options) {

            var that = this;
            this.bookings = options.bookingsCollection;
            this.bookings.fetch({
                success: function (model, result, options) {
                    $('.btn.view-type').removeClass('btn-primary');
                    $('#view-type-resource').addClass('btn-primary');
                    that.generateByResource();
                    that.render();
                },
                error: function (model, xhr, options) {
                    alert('Error');
                }
            });
        },

        render: function () {
            this.byResourceTemplate = _.template(ByResourceTemplate);
            this.$el.html(this.byResourceTemplate({ resourceBookings: this.resourceBookings }));
        },

        events: {
        },

        generateByResource: function () {

            var that = this;

            var resourceBookings = [];
            /*
             {
             resource: Joe,
             image: http://...,
             projects: [{ name: NGFP, client: THD, color: rgba(255,165,5,0.2) },...]
             }
             */

            _.each(this.bookings.models, function (booking) {
                // search by resource name
                foundResourceBooking = _.findWhere(resourceBookings, { resource: booking.get('resource').name });
                if (foundResourceBooking) {
                    // don't add dupe
                    foundProject = _.findWhere(foundResourceBooking.projects, { name: booking.get('project').name, client: booking.get('client').name });
                    if (!foundProject)
                        foundResourceBooking.projects.push({
                            name: booking.get('project').name,
                            client: booking.get('client').name,
                            color: Util.hexToRgba(booking.get('project').color, that.constants.colorBoxOpacity)
                        });
                }
                else {
                    var resourceBooking = {
                        resource: booking.get('resource').name,
                        image: booking.get('resource').profile_pic,
                        projects: [{
                            name: booking.get('project').name,
                            client: booking.get('client').name,
                            color: Util.hexToRgba(booking.get('project').color, that.constants.colorBoxOpacity)
                        }]
                    };

                    resourceBookings.push(resourceBooking);
                }
            });
            this.resourceBookings = _.sortBy(resourceBookings, function (booking) {
                return booking.resource;
            });
        }
    });

    return HomeView;
});