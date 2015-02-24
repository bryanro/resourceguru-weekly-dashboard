define([
    'jquery',
    'underscore',
    'backbone',
    'views/resource/resource.view',
    'views/client/client.view',
    'views/chargeability/chargeability.view'
    /* list of all other views used */
], function ($, _, Backbone, ResourceView, ClientView, ChargeabilityView) {

    var thisRouter;

    var Router = Backbone.Router.extend({

        initialize: function () {
        },

        routes: {
            'resource': 'showResource',
            'client': 'showClient',
            'chargeability': 'showChargeability',
            // Default
            '*actions': 'showDefault'
        },

        showDefault: function () {
            this.navigate('//client', {trigger: true});
        },

        showResource: function () {
            if (!this.resourceView) {
                this.resourceView = new ResourceView({  });
            }
            else {
                this.resourceView.render();
            }
        },

        showClient: function () {
            if (!this.clientView) {
                this.clientView = new ClientView({  });
            }
            else {
                this.clientView.render();
            }
        },

        showChargeability: function () {
            if (!this.chargeabilityView) {
                this.chargeabilityView = new ChargeabilityView({  });
            }
            else {
                this.chargeabilityView.render();
            }
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