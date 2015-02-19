define([
    'jquery',
    'underscore',
    'backbone',
    'collections/bookings.collection',
    'views/resource/resource.view',
    'views/client/client.view'
    /* list of all other views used */
], function ($, _, Backbone, BookingsCollection, ResourceView, ClientView) {

    var thisRouter;

    var Router = Backbone.Router.extend({

        initialize: function () {
            this.bookingsCollection = new BookingsCollection();
        },

        routes: {
            'resource': 'showResource',
            'client': 'showClient',
            // Default
            '*actions': 'showDefault'
        },

        showDefault: function () {
            this.navigate('//resource', {trigger: true});
        },

        showResource: function () {
            this.resourceView = new ResourceView({ bookingsCollection: this.bookingsCollection });
            this.resourceView.render();
        },

        showClient: function () {
            this.clientView = new ClientView({ bookingsCollection: this.bookingsCollection });
            this.clientView.render();
        }
    });

    var initialize = function () {
        var app_router = new Router();
        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});