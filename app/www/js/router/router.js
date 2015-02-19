define([
  'jquery',
  'underscore',
  'backbone',
  'views/home/home.view'
  /* list of all other views used */
], function ($, _, Backbone, HomeView) {

    var thisRouter;

    var Router = Backbone.Router.extend({

        initialize: function () {
        },

        routes: {
            // Default
            '*actions': 'showDefault'
        },

        showDefault: function () {
            this.homeView = new HomeView();
            this.homeView.render();
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