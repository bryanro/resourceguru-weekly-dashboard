define([
    'jquery',
    'underscore',
    'backbone',
    'views/resource/resource.view',
    'views/client/client.view'
    /* list of all other views used */
], function ($, _, Backbone, ResourceView, ClientView) {

    var thisRouter;

    var Router = Backbone.Router.extend({

        initialize: function () {
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
            this.resourceView = new ResourceView({  });
        },

        showClient: function () {
            this.clientView = new ClientView({  });
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