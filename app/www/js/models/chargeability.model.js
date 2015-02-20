define([
    'backbone'
], function (Backbone) {
    var ChargeabilityModel = Backbone.Model.extend({
        idAttribute: '_id',
        initialize: function () {
        },
        urlRoot: '/chargeability'
    });

    return ChargeabilityModel;
});