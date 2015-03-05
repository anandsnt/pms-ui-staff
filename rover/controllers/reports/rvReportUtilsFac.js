sntRover.factory('RVReportUtilsFac', [
    '$rootScope',
    '$filter',
    '$timeout',
    function($rootScope, $filter, $timeout) {
        var factory = {};

        // standard report names list
        var _reportNames = {
            'CHECK_IN_CHECK_OUT'           : 'Check In / Check Out',
            'UPSELL'                       : 'Upsell',
            'WEB_CHECK_OUT_CONVERSION'     : 'Web Check Out Conversion',
            'WEB_CHECK_IN_CONVERSION'      : 'Web Check In Conversion',
            'LATE_CHECK_OUT'               : 'Late Check Out',
            'IN_HOUSE_GUEST'               : 'In-House Guests',
            'ARRIVAL'                      : 'Arrival',
            'DEPARTURE'                    : 'Departure',
            'BOOKING_SOURCE_MARKET_REPORT' : 'Booking Source & Market Report',
            'CANCELLATION_NO_SHOW'         : 'Cancellation & No Show',
            'DEPOSIT_REPORT'               : 'Deposit Report',
            'LOGIN_AND_OUT_ACTIVITY'       : 'Login and out Activity',
            'OCCUPANCY_REVENUE_SUMMARY'    : 'Occupancy & Revenue Summary',
            'RESERVATIONS_BY_USER'         : 'Reservations By User'
        };

        // getter method to provide the required value from
        // private data store "_reportNames"
        factory.getName = function (name) {
            return _reportNames[name] ? _reportNames[name] : undefined;
        };

        // report icon class to be applied
        factory.applyIconClass = function (reportTitle) {
            var _className = '';

            // add report icon class
            switch (reportList[i]['title']) {
                case 'Check In / Check Out':
                    reportList[i]['reportIconCls'] = 'icon-report icon-check-in-check-out';
                    break;

                case 'Upsell':
                    reportList[i]['reportIconCls'] = 'icon-report icon-upsell';
                    break;

                case 'Web Check Out Conversion':
                    reportList[i]['reportIconCls'] = 'icon-report icon-check-out';
                    break;

                case 'Web Check In Conversion':
                    reportList[i]['reportIconCls'] = 'icon-report icon-check-in';
                    break;

                case 'Late Check Out':
                    reportList[i]['reportIconCls'] = 'guest-status late-check-out';
                    break;

                case 'In-House Guests':
                    reportList[i]['reportIconCls'] = 'guest-status inhouse';
                    break;

                case 'Arrival':
                    reportList[i]['reportIconCls'] = 'guest-status check-in';
                    reportList[i]['hasDateLimit'] = false;
                    break;

                case 'Departure':
                    reportList[i]['reportIconCls'] = 'guest-status check-out';
                    reportList[i]['hasDateLimit'] = false;
                    break;

                case 'Cancellation & No Show':
                    reportList[i]['reportIconCls'] = 'guest-status cancel';
                    reportList[i]['hasDateLimit'] = false;
                    reportList[i]['canRemoveDate'] = true;
                    reportList[i]['showRemove'] = true;
                    break;

                case 'Booking Source & Market Report':
                    reportList[i]['reportIconCls'] = 'icon-report icon-booking';
                    reportList[i]['canRemoveDate'] = true;
                    reportList[i]['showRemove'] = true;
                    reportList[i]['hasSourceMarketFilter'] = true;
                    reportList[i]['hasDateLimit'] = false;

                    reportList[i]['canRemoveArrivalDate'] = true;
                    reportList[i]['showRemoveArrivalDate'] = true;
                    reportList[i]['hasArrivalDateLimit'] = false;
                    break;

                case 'Login and out Activity':
                    reportList[i]['reportIconCls'] = 'icon-report icon-activity';
                    reportList[i]['hasDateLimit'] = false;
                    break;

                case 'Deposit Report':
                    reportList[i]['reportIconCls'] = 'icon-report icon-deposit';
                    reportList[i]['hasDateLimit'] = false;
                    reportList[i]['canRemoveDate'] = true;
                    reportList[i]['showRemove'] = true;
                    reportList[i]['canRemoveArrivalDate'] = true;
                    reportList[i]['showRemoveArrivalDate'] = true;
                    break;

                case 'Occupancy & Revenue Summary':
                    reportList[i]['reportIconCls'] = 'icon-report icon-occupancy';
                    reportList[i]['hasMarketsList'] = true;
                    reportList[i]['hasDateLimit'] = false;
                    // CICO-10202 start populating the markets list
                    populateMarketsList();
                    break;

                case 'Reservations By User':
                    reportList[i]['reportIconCls'] = 'icon-report icon-reservations';
                    reportList[i]['hasDateLimit'] = false;
                    reportList[i]['canRemoveDate'] = true;
                    reportList[i]['showRemove'] = true;
                    reportList[i]['canRemoveArrivalDate'] = true;
                    reportList[i]['showRemoveArrivalDate'] = true;
                    break;

                default:
                    reportList[i]['reportIconCls'] = 'icon-report';
                    break;
            };

            return _className;
        };

        // to process the report filters
        factory.processFilters = function () {

        };

        // to reorder the sort by to match the report details column positon
        factory.reOrderSortBy = function (reportTitle) {

        };

        // to process the report sort by
        factory.processSortBy = function () {

        };

        // to process the report group by
        factory.processGroupBy = function () {

        };

        factory.createTimeSlots = function () {
            var _ret = [],
                _hh = '',
                _mm = '',
                _step = 15;

            var i = m = 0,
                h = -1;

            for (i = 0; i < 96; i++) {
                if (i % 4 == 0) {
                    h++;
                    m = 0;
                } else {
                    m += _step;
                }

                _hh = h < 10 ? '0' + h : h;
                _mm = m < 10 ? '0' + m : m;

                _ret.push({
                    'value': _hh + ':' + _mm,
                    'name': _hh + ':' + _mm
                });
            };

            return _ret;
        };

        return factory;
    }
]);
