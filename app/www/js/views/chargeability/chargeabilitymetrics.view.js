define([
    'jquery',
    'underscore',
    'backbone',
    'util',
    'text!./chargeabilitymetrics.html'
], function ($, _, Backbone, Util, ChargeabilityMetricsTemplate) {

    var ChargeabilityMetricsView = Backbone.View.extend({

        initialize: function (options) {

            var that = this;

            this.chargeability = options.chargeabilityModel;

            this.chargeability.on('sync', this.render, this);

        },

        render: function () {
            this.chargeabilityMetricsTemplate = _.template(ChargeabilityMetricsTemplate);
            this.$el.html(this.chargeabilityMetricsTemplate({
                aggregatedChargeability: this.chargeability.get('aggregatedChargeability'),
                resourceChargeability: this.chargeability.get('resourceChargeability'),
                Util: Util
            }));
        },

        events: {

        }
    });

    return ChargeabilityMetricsView;
});