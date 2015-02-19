define([
    'jquery',
    'underscore',
    'backbone',
    'util',
    'text!./client.html'
], function ($, _, Backbone, Util, ByClientTemplate) {

    var ClientView = Backbone.View.extend({

        constants: {
            colorBoxOpacity: 0.2,
        },

        el: $('#main-content'),

        initialize: function (options) {

            var that = this;
            this.bookings = options.bookingsCollection;
            this.bookings.fetch({
                success: function (model, result, options) {
                    that.generateByClient();
                    that.render();
                },
                error: function (model, xhr, options) {
                    alert('Error');
                }
            });
        },

        render: function () {
            this.byClientTemplate = _.template(ByClientTemplate);
            this.$el.html(this.byClientTemplate({ clientBookings: this.clientBookings }));
        },

        events: {
        },

        generateByClient: function () {
            var that = this;

            var clientBookings = [];
            /*
             {
             client: THD,
             projects: [{ name: NGFP, color: rgba(255,0,155,0.2), resources: [Joe,Jake,...]}],
             }
             */

            _.each(this.bookings.models, function (booking) {
                var foundClient = _.findWhere(clientBookings, { client: booking.get('client').name });
                if (foundClient) {
                    // don't add dupe
                    var foundProject = _.findWhere(foundClient.projects, { name: booking.get('project').name });
                    if (foundProject) {
                        if (!_.contains(foundProject.resources, booking.get('resource').name)) {
                            foundProject.resources.push(booking.get('resource').name);
                        }
                    }
                    else {
                        foundClient.projects.push({
                            name: booking.get('project').name,
                            color: Util.hexToRgba(booking.get('project').color, that.constants.colorBoxOpacity),
                            resources: [booking.get('resource').name]
                        });
                    }
                }
                else {
                    clientBookings.push({
                        client: booking.get('client').name,
                        projects: [{
                            name: booking.get('project').name,
                            color: Util.hexToRgba(booking.get('project').color, that.constants.colorBoxOpacity),
                            resources: [booking.get('resource').name]
                        }]
                    });
                }
            });
            this.clientBookings = clientBookings;
        }
    });

    return ClientView;
});