define([
    'jquery',
    'underscore',
    'backbone',
    'util',
    'tablesorter',
    'text!./chargeabilityresources.html'
], function ($, _, Backbone, Util, Tablesorter, ChargeabilityResourcesTemplate) {

    var ChargeabilityResourcesView = Backbone.View.extend({

        initialize: function (options) {
            $.tablesorter.themes.bootstrap = Util.tablesorter.theme;
            this.chargeability = options.chargeabilityModel;
            this.chargeability.on('sync', this.render, this);
        },

        render: function () {
            this.chargeabilityResourcesTemplate = _.template(ChargeabilityResourcesTemplate);
            this.$el.html(this.chargeabilityResourcesTemplate({
                resourceChargeability: this.chargeability.get('resourceChargeability'),
                Util: Util
            }));
            $('#table-chargeability-resources').tablesorter(Util.tablesorter.options);
        },

        events: {

        }
    });

    return ChargeabilityResourcesView;
});