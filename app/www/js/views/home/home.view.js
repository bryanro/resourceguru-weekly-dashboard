define([
    'jquery',
    'underscore',
    'backbone',
    'util',
    'models/booking.model',
    'collections/bookings.collection',
    'text!./home.html',
    'text!./byresource.html',
    'text!./byclient.html'
], function ($, _, Backbone, Util, BookingModel, BookingsCollection, HomeTemplate, ByResourceTemplate, ByClientTemplate) {

    var HomeView = Backbone.View.extend({

        constants: {
            colorBoxOpacity: 0.2,
            views: {
                loading: 'loading',
                byResource: 'byResource',
                byClient: 'byClient'
            }
        },

        el: $('#main-content'),

        initialize: function (options) {
            this.currentView = this.constants.views.loading;

            var that = this;
            this.bookings = new BookingsCollection();
            this.bookings.fetch({
                success: function (model, result, options) {
                    $('#view-type-resource').addClass('btn-primary');
                    that.generateByResource();
                    that.currentView = that.constants.views.byResource;
                    that.render();
                },
                error: function (model, xhr, options) {
                    alert('Error');
                }
            });

            $('.btn.view-type').on('click', {self:this}, this.changeView);
        },

        render: function () {
            if (this.currentView == 'byResource') {
                this.byResourceTemplate = _.template(ByResourceTemplate);
                this.$el.html(this.byResourceTemplate({ resourceBookings: this.resourceBookings }));
            }
            else if (this.currentView == 'byClient') {
                this.byClientTemplate = _.template(ByClientTemplate);
                this.$el.html(this.byClientTemplate({ clientBookings: this.clientBookings }));
            }
            else {
                this.homeTemplate = _.template(HomeTemplate);
                this.$el.html(this.homeTemplate({}));
            }
        },

        events: {
        },

        changeView: function (e) {
            console.log('click');
            var that = e.data.self;
            var $target = $(e.target);

            // update buttons
            $('.btn.view-type').removeClass('btn-primary');
            $target.addClass('btn-primary');

            if ($target.attr('id') == 'view-type-client') {
                that.generateByClient();
                that.currentView = that.constants.views.byClient;
            }
            else {
                that.generateByResource();
                that.currentView = that.constants.views.byResource;
            }
            that.render();
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
            console.log(this.resourceBookings);
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

    return HomeView;
});