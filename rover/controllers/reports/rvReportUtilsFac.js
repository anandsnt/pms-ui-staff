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

            switch ( reportTitle ) {
                case factory.reportNames['CHECK_IN_CHECK_OUT']:
                    _className = 'icon-report icon-check-in-check-out';
                    break;

                case factory.reportNames['UPSELL']:
                    _className = 'icon-report icon-upsell';
                    break;

                case factory.reportNames['WEB_CHECK_OUT_CONVERSION']:
                    _className = 'icon-report icon-check-out';
                    break;

                case factory.reportNames['WEB_CHECK_IN_CONVERSION']:
                    _className = 'icon-report icon-check-in';
                    break;

                case factory.reportNames['LATE_CHECK_OUT']:
                    _className = 'guest-status late-check-out';
                    break;

                case factory.reportNames['IN_HOUSE_GUEST']:
                    _className = 'guest-status inhouse';
                    break;

                case 'Arrival':
                    _className = 'guest-status check-in';
                    break;

                case 'Departure':
                    _className = 'guest-status check-out';
                    break;

                case 'Cancellation & No Show':
                    _className = 'guest-status cancel';
                    break;

                case 'Booking Source & Market Report':
                    _className = 'icon-report icon-booking';
                    break;

                case 'Login and out Activity':
                    _className = 'icon-report icon-activity';
                    break;

                case 'Deposit Report':
                    _className = 'icon-report icon-deposit';
                    break;

                case 'Occupancy & Revenue Summary':
                    _className = 'icon-report icon-occupancy';
                    break;

                default:
                    _className = 'icon-report';
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
