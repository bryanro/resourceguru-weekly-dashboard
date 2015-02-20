define([
    'jquery',
    'underscore',
    'backbone',
    'util',
    'models/chargeability.model',
    'text!./chargeability.html',
    './chargeabilitymetrics.view',
    './chargeabilityresources.view'
], function ($, _, Backbone, Util, ChargeabilityModel, ChargeabilityTemplate, ChargeabilityMetricsView, ChargeabilityResourcesView) {

    var ChargeabilityView = Backbone.View.extend({

        el: $('#main-content'),

        initialize: function (options) {

            var that = this;

            this.weeks = Util.getWeeksThroughNow();
            this.months = Util.getMonthsThroughNow();
            this.years = Util.getYearsThroughNow();

            that.render();

            this.chargeability = new ChargeabilityModel();
            this.chargeabilityMetricsView = new ChargeabilityMetricsView({ el: '#chargeability-metrics', chargeabilityModel: that.chargeability});
            this.chargeabilityResourcesView = new ChargeabilityResourcesView({ el: '#chargeability-resources', chargeabilityModel: that.chargeability});

            this.timeCategoryChange();
        },

        render: function () {
            this.chargeabilityTemplate = _.template(ChargeabilityTemplate);
            this.$el.html(this.chargeabilityTemplate({  }));
        },

        events: {
            "click #select-time-prev": "decrementTime",
            "click #select-time-next": "incrementTime",
            "change #select-time-category": "timeCategoryChange",
            "change #select-time-value": "timeValueChange"
        },

        decrementTime: function () {
            console.log('prev');
        },

        incrementTime: function () {
            console.log('next');
        },

        timeCategoryChange: function (e) {
            var that = this;
            $timeCategory = $('#select-time-category');
            switch($timeCategory[0].value.toLowerCase()) {
                case 'week':
                    that.populateWeeksDropdown();
                    break;
                case 'month':
                    that.populateMonthsDropdown();
                    break;
                case 'year':
                    that.populateYearsDropdown();
                    break;
                default:
                    that.populateWeeksDropdown();
            }
            this.fetchChargeabilityData();
        },

        timeValueChange: function (e) {
            this.fetchChargeabilityData();
        },

        populateWeeksDropdown: function () {
            var $selectTimeValue = $('#select-time-value');
            $selectTimeValue.html('');
            _.each(this.weeks, function (week) {
                $selectTimeValue.append('<option value="' + week.firstDateOfWeek + '">' + week.firstDateOfWeek + '</option>')
            });
        },

        populateMonthsDropdown: function () {
            var $selectTimeValue = $('#select-time-value');
            $selectTimeValue.html('');
            _.each(this.months, function (month) {
                $selectTimeValue.append('<option value="' + month.firstDateOfMonth + '">' + month.monthAbbr + ' ' + month.year + '</option>')
            });
        },

        populateYearsDropdown: function () {
            var $selectTimeValue = $('#select-time-value');
            $selectTimeValue.html('');
            _.each(this.years, function (year) {
                $selectTimeValue.append('<option value="' + year.firstDateOfYear + '">' + year.year + '</option>')
            });
        },

        fetchChargeabilityData: function () {
            var that = this;
            var timeCategory = $('#select-time-category')[0].value.toLowerCase();
            var timeValue = $('#select-time-value')[0].value;

            console.log('timeCategory: ' + timeCategory);
            console.log('timeValue: ' + timeValue);

            var startDate;
            var endDate;

            switch(timeCategory) {
                case 'week':
                    var weekInfo = _.findWhere(that.weeks, { firstDateOfWeek: timeValue });
                    startDate = weekInfo.firstDateOfWeek;
                    endDate = weekInfo.lastDateOfWeek;
                    break;
                case 'month':
                    var monthInfo = _.findWhere(that.months, { firstDateOfMonth: timeValue });
                    startDate = monthInfo.firstDateOfMonth;
                    endDate = monthInfo.lastDateOfMonth;
                    break;
                case 'year':
                    var yearInfo = _.findWhere(that.years, { firstDateOfYear: timeValue });
                    startDate = yearInfo.firstDateOfYear;
                    endDate = yearInfo.lastDateOfYear;
                    break;
                case 'default':
                    alert('error calculating start and end date');
            }

            this.chargeability.fetch({ data: {
                startDate: startDate,
                endDate: endDate
            } });
        }
    });

    return ChargeabilityView;
});