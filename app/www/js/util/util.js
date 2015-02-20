define([
    'jquery',
    'underscore',
    'moment'
], function ($, _, moment) {

    var Util = {

        START_YEAR: 2015, // first year started using ResourceGuru

        hexToRgba: function (hex, opacity) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return "rgba(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + "," + opacity + ")";
        },

        getYearsThroughNow: function () {
            var years = [];

            var firstDayOfYear = moment([this.START_YEAR, 0, 1]);
            var today = new moment();

            while (!firstDayOfYear.isAfter(today)) {

                years.push({
                    year: firstDayOfYear.format('YYYY'),
                    firstDateOfYear: firstDayOfYear.format('YYYY-MM-DD'),
                    lastDateOfYear: firstDayOfYear.clone().endOf('year').format('YYYY-MM-DD')
                });

                firstDayOfYear.add(1, 'years');
            }

            return years;
        },

        getMonthsThroughNow: function () {

            var months = [];

            var firstDayOfMonth = moment([this.START_YEAR, 0, 1]);
            var today = new moment();

            while (!firstDayOfMonth.isAfter(today)) {

                months.push({
                    monthName: firstDayOfMonth.format('MMMM'),
                    monthAbbr: firstDayOfMonth.format('MMM'),
                    year: firstDayOfMonth.format('YYYY'),
                    firstDateOfMonth: firstDayOfMonth.format('YYYY-MM-DD'),
                    lastDateOfMonth: firstDayOfMonth.clone().endOf('month').format('YYYY-MM-DD')
                });

                firstDayOfMonth.add(1, 'months');
            }

            // reverse order
            months.reverse();

            return months;
        },

        getWeeksThroughNow: function () {

            var weeks = [];

            var firstDayOfWeek = moment([this.START_YEAR, 0, 1]).startOf('week');
            var endOfThisWeek = (new moment()).endOf('week');

            while (!firstDayOfWeek.isAfter(endOfThisWeek)) {

                weeks.push({
                    firstDateOfWeek: firstDayOfWeek.format('YYYY-MM-DD'),
                    lastDateOfWeek: firstDayOfWeek.clone().endOf('week').format('YYYY-MM-DD')
                });

                firstDayOfWeek.add(1, 'weeks');
            }

            // reverse order
            weeks.reverse();

            return weeks;
        },

        numberWithCommas: function (number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    };

    Util.getMonthsThroughNow();

    return Util;

});