define([
    'jquery',
    'underscore',
    'backbone',
    'util',
    'text!./chargeabilityresources.html'
], function ($, _, Backbone, Util, ChargeabilityResourcesTemplate) {

    var ChargeabilityResourcesView = Backbone.View.extend({

        initialize: function (options) {

            var that = this;

            this.chargeability = options.chargeabilityModel;

            this.chargeability.on('sync', this.render, this);

        },

        render: function () {
            this.chargeabilityResourcesTemplate = _.template(ChargeabilityResourcesTemplate);
            this.$el.html(this.chargeabilityResourcesTemplate({
                resourceChargeability: this.chargeability.get('resourceChargeability'),
                Util: Util
            }));
        },

        events: {

        }
    });

    return ChargeabilityResourcesView;
});