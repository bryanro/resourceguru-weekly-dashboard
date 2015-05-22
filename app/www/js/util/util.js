define([
    'jquery',
    'underscore',
    'moment'
], function ($, _, moment) {

    var Util = {

        START_YEAR: 2015, // first year started using ResourceGuru
        REFRESH_HOUR: 6,
        refreshTimeoutSet: false,

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

                var lastDayOfYear = firstDayOfYear.clone().endOf('year');

                years.push({
                    year: firstDayOfYear.format('YYYY'),
                    firstDateOfYear: firstDayOfYear.format('YYYY-MM-DD'),
                    lastDateOfYear: lastDayOfYear.format('YYYY-MM-DD'),
                    thisYear: moment().isBetween(firstDayOfYear, lastDayOfYear)
                });

                firstDayOfYear.add(1, 'years');
            }

            return years;
        },

        getMonthsThroughNow: function (numMonthsAhead) {

            var months = [];

            var firstDayOfMonth = moment([this.START_YEAR, 0, 1]);

            var endDate = new moment(); // today
            if (numMonthsAhead) {
                endDate.add(numMonthsAhead, 'months');
            }

            while (!firstDayOfMonth.isAfter(endDate)) {

                var lastDayOfMonth = firstDayOfMonth.clone().endOf('month');

                months.push({
                    monthName: firstDayOfMonth.format('MMMM'),
                    monthAbbr: firstDayOfMonth.format('MMM'),
                    year: firstDayOfMonth.format('YYYY'),
                    firstDateOfMonth: firstDayOfMonth.format('YYYY-MM-DD'),
                    lastDateOfMonth: lastDayOfMonth.format('YYYY-MM-DD'),
                    thisMonth: moment().isBetween(firstDayOfMonth, lastDayOfMonth)

                });

                firstDayOfMonth.add(1, 'months');
            }

            // reverse order
            months.reverse();

            return months;
        },

        getWeeksThroughNow: function (numWeeksAhead) {

            var weeks = [];

            var firstDayOfWeek = moment([this.START_YEAR, 0, 1]).startOf('week').add(1, 'days');
            var endOfThisWeek = (new moment()).endOf('week').add(1, 'days');
            if (numWeeksAhead) {
                endOfThisWeek.add(numWeeksAhead, 'weeks');
            }

            while (!firstDayOfWeek.isAfter(endOfThisWeek)) {

                var lastDayOfWeek = firstDayOfWeek.clone().endOf('week');

                weeks.push({
                    firstDateOfWeek: firstDayOfWeek.format('YYYY-MM-DD'),
                    lastDateOfWeek: lastDayOfWeek.format('YYYY-MM-DD'),
                    thisWeek: moment().isBetween(firstDayOfWeek, lastDayOfWeek)
                });

                firstDayOfWeek.add(1, 'weeks');
            }

            // reverse order
            weeks.reverse();

            return weeks;
        },

        numberWithCommas: function (number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },

        refreshPageAtTime: function () {
            if (!this.refreshTimeoutSet) {
                var now = moment();
                var tomorrow = moment();
                tomorrow.hour(this.REFRESH_HOUR);
                tomorrow.minute(30);
                tomorrow.second(0);
                tomorrow.millisecond(0);
                if (now.hour() >= this.REFRESH_HOUR) {
                    tomorrow.add(1, 'days');
                }

                var timeDiff = tomorrow.format('x') - now.format('x');

                setTimeout(function () {
                    this.refreshTimeoutSet = false;
                    window.location.reload(true);
                }, timeDiff);

                this.refreshTimeoutSet = true;
            }
        },

        tablesorter: {
            theme: {
                // these classes are added to the table. To see other table classes available,
                // look here: http://getbootstrap.com/css/#tables
                table        : 'table table-bordered table-striped',
                caption      : 'caption',
                // header class names
                header       : 'bootstrap-header', // give the header a gradient background (theme.bootstrap_2.css)
                sortNone     : '',
                sortAsc      : '',
                sortDesc     : '',
                active       : '',
                hover        : '',
                // icon class names
                icons        : '',
                iconSortNone : 'bootstrap-icon-unsorted',
                iconSortAsc  : 'icon-chevron-up glyphicon glyphicon-chevron-up',
                iconSortDesc : 'icon-chevron-down glyphicon glyphicon-chevron-down',
                filterRow    : '',
                footerRow    : '',
                footerCells  : '',
                even         : '',
                odd          : ''
            },
            options: {
                theme : "bootstrap",
                widthFixed: true,
                headerTemplate : '{content} {icon}',
                widgets : [ "uitheme", "zebra" ],
                widgetOptions : {
                    zebra : ["even", "odd"]
                }
            }
        }
    };

    Util.getMonthsThroughNow();

    return Util;

});