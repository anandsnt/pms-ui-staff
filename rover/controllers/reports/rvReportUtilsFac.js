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
        factory.applyIconClass = function ( reportItem ) {
            switch ( reportItem['title'] ) {
                case _reportNames['CHECK_IN_CHECK_OUT']:
                    reportItem['reportIconCls'] = 'icon-report icon-check-in-check-out';
                    break;

                case _reportNames['UPSELL']:
                    reportItem['reportIconCls'] = 'icon-report icon-upsell';
                    break;

                case _reportNames['UPSWEB_CHECK_OUT_CONVERSIONELL']:
                    reportItem['reportIconCls'] = 'icon-report icon-check-out';
                    break;

                case _reportNames['WEB_CHECK_IN_CONVERSION']:
                    reportItem['reportIconCls'] = 'icon-report icon-check-in';
                    break;

                case _reportNames['LATE_CHECK_OUT']:
                    reportItem['reportIconCls'] = 'guest-status late-check-out';
                    break;

                case _reportNames['IN_HOUSE_GUEST']:
                    reportItem['reportIconCls'] = 'guest-status inhouse';
                    break;

                case _reportNames['ARRIVAL']:
                    reportItem['reportIconCls'] = 'guest-status check-in';
                    break;

                case _reportNames['DEPARTURE']:
                    reportItem['reportIconCls'] = 'guest-status check-out';
                    break;

                case _reportNames['CANCELLATION_NO_SHOW']:
                    reportItem['reportIconCls'] = 'guest-status cancel';
                    break;

                case _reportNames['BOOKING_SOURCE_MARKET_REPORT']:
                    reportItem['reportIconCls'] = 'icon-report icon-booking';
                    break;

                case _reportNames['LOGIN_AND_OUT_ACTIVITY']:
                    reportItem['reportIconCls'] = 'icon-report icon-activity';
                    break;

                case _reportNames['DEPOSIT_REPORT']:
                    reportItem['reportIconCls'] = 'icon-report icon-deposit';
                    break;

                case _reportNames['OCCUPANCY_REVENUE_SUMMARY']:
                    reportItem['reportIconCls'] = 'icon-report icon-occupancy';
                    break;

                case _reportNames['RESERVATIONS_BY_USER']:
                    reportItem['reportIconCls'] = 'icon-report icon-reservations';
                    break;

                default:
                    reportItem['reportIconCls'] = 'icon-report';
                    break;
            };
        };






        // add required flags this report
        factory.applyFlags = function ( reportItem ) {
            switch ( reportItem['title'] ) {
                case _reportNames['ARRIVAL']:
                    reportItem['hasDateLimit'] = false;
                    break;

                case _reportNames['DEPARTURE']:
                    reportItem['hasDateLimit'] = false;
                    break;

                case _reportNames['CANCELLATION_NO_SHOW']:
                    reportItem['hasDateLimit'] = false;
                    reportItem['canRemoveDate'] = true;
                    reportItem['showRemove'] = true;
                    break;

                case _reportNames['BOOKING_SOURCE_MARKET_REPORT']:
                    reportItem['canRemoveDate'] = true;
                    reportItem['showRemove'] = true;
                    reportItem['hasSourceMarketFilter'] = true;
                    reportItem['hasDateLimit'] = false;
                    reportItem['canRemoveArrivalDate'] = true;
                    reportItem['showRemoveArrivalDate'] = true;
                    reportItem['hasArrivalDateLimit'] = false;
                    break;

                case _reportNames['LOGIN_AND_OUT_ACTIVITY']:
                    reportItem['hasDateLimit'] = false;
                    reportItem['hasUserFilter'] = true;
                    break;

                case _reportNames['DEPOSIT_REPORT']:
                    reportItem['hasDateLimit'] = false;
                    reportItem['canRemoveDate'] = true;
                    reportItem['showRemove'] = true;
                    reportItem['canRemoveArrivalDate'] = true;
                    reportItem['showRemoveArrivalDate'] = true;
                    break;

                case _reportNames['OCCUPANCY_REVENUE_SUMMARY']:
                    reportItem['hasMarketsList'] = true;
                    reportItem['hasDateLimit'] = false;
                    break;

                case _reportNames['RESERVATIONS_BY_USER']:
                    reportItem['hasUserFilter'] = true;
                    reportItem['hasDateLimit'] = false;
                    reportItem['canRemoveDate'] = true;
                    reportItem['showRemove'] = true;
                    reportItem['canRemoveArrivalDate'] = true;
                    reportItem['showRemoveArrivalDate'] = true;
                    break;

                default:
                    break;
            };
        };






        // to process the report filters
        factory.processFilters = function ( reportItem, data ) {
            var _hasFauxSelect,
                _hasDisplaySelect,
                _hasMarketSelect,
                _hasGuaranteeSelect;

            // going around and taking a note on filters
            _.each(reportItem['filters'], function(filter) {

                // check for date filter and keep a ref to that item
                if ( filter.value === 'DATE_RANGE' ) {
                    reportItem['hasDateFilter'] = filter;

                    // for 'Cancellation & No Show' report the description should be 'Arrival Date Range'
                    // rather than the default 'Date Range'
                    if ( reportItem['title'] == 'Cancellation & No Show' ) {
                        reportItem['hasDateFilter']['description'] = 'Arrival Date Range';
                    };

                    // for 'Booking Source & Market Report' report the description should be 'Booked Date'
                    if ( reportItem['title'] == 'Booking Source & Market Report' ) {
                        reportItem['hasDateFilter']['description'] = 'Booked Date';
                    };
                };

                // check for cancellation date filter and keep a ref to that item
                if ( filter.value === 'CANCELATION_DATE_RANGE' || filter.value === 'CANCELLATION_DATE_RANGE' ) {
                    reportItem['hasCancelDateFilter'] = filter;
                };

                // check for arrival date filter and keep a ref to that item
                if ( filter.value === 'ARRIVAL_DATE_RANGE' ) {
                    reportItem['hasArrivalDateFilter'] = filter;
                };

                // check for Deposit due date range filter and keep a ref to that item
                if ( filter.value === 'DEPOSIT_DATE_RANGE' ) {
                    reportItem['hasDepositDateFilter'] = filter;
                };

                // check for Deposit due date range filter and keep a ref to that item
                if ( filter.value === 'CREATE_DATE_RANGE' ) {
                    reportItem['hasCreateDateFilter'] = filter;
                };

                // check for time filter and keep a ref to that item
                // create std 15min stepped time slots
                if ( filter.value === 'TIME_RANGE' ) {
                    reportItem['hasTimeFilter'] = filter;
                    reportItem['timeFilterOptions'] = factory.createTimeSlots();
                };

                // check for CICO filter and keep a ref to that item
                // create the CICO filter options
                if ( filter.value === 'CICO' ) {
                    reportItem['hasCicoFilter'] = filter;
                    reportItem['cicoOptions'] = [{
                        value: 'BOTH',
                        label: 'Show Check Ins and  Check Outs'
                    }, {
                        value: 'IN',
                        label: 'Show only Check Ins'
                    }, {
                        value: 'OUT',
                        label: 'Show only Check Outs'
                    }];
                };

                // check for include notes filter and keep a ref to that item
                if ( filter.value === 'INCLUDE_NOTES' ) {
                    reportItem['hasIncludeNotes'] = filter;
                    _hasFauxSelect = true;
                };

                // check for vip filter and keep a ref to that item
                if ( filter.value === 'VIP_ONLY' ) {
                    reportItem['hasIncludeVip'] = filter;
                    _hasFauxSelect = true;
                };

                // check for source and markets filter
                if ( filter.value === 'INCLUDE_MARKET' ) {
                    reportItem['hasMarket'] = filter;
                    _hasDisplaySelect = true;
                };

                if ( filter.value === 'INCLUDE_SOURCE' ) {
                    reportItem['hasSource'] = filter;
                    _hasDisplaySelect = true;
                };

                // INCLUDE_VARIANCE
                if ( filter.value === 'INCLUDE_VARIANCE' ) {
                    reportItem['hasVariance'] = filter;
                    _hasFauxSelect = true;
                    _hasMarketSelect = true;
                };

                // INCLUDE_LASTYEAR
                if ( filter.value === 'INCLUDE_LAST_YEAR ') {
                    reportItem['hasLastYear'] = filter;
                    _hasFauxSelect = true;
                    _hasMarketSelect = true;
                };

                // check for include cancelled filter and keep a ref to that item
                if ( filter.value === 'INCLUDE_CANCELLED' || filter.value === 'INCLUDE_CANCELED' ) {
                    reportItem['hasIncludeCancelled'] = filter;
                    _hasFauxSelect = true;

                    if (reportItem.title == 'Cancellation & No Show') {
                        reportItem['chosenIncludeCancelled'] = true;
                    };
                };

                // check for include no show filter and keep a ref to that item
                if ( filter.value === 'INCLUDE_NO_SHOW' ) {
                    reportItem['hasIncludeNoShow'] = filter;
                    _hasFauxSelect = true;
                };

                // check for include no show filter and keep a ref to that item
                if ( filter.value === 'SHOW_GUESTS' ) {
                    reportItem['hasShowGuests'] = filter;
                }

                // check for include rover users filter and keep a ref to that item
                if ( filter.value === 'ROVER' ) {
                    reportItem['hasIncludeRoverUsers'] = filter;
                    _hasFauxSelect = true;
                };

                // check for include zest users filter and keep a ref to that item
                if ( filter.value === 'ZEST' ) {
                    reportItem['hasIncludeZestUsers'] = filter;
                    _hasFauxSelect = true;
                };

                // check for include zest web users filter and keep a ref to that item
                if ( filter.value === 'ZEST_WEB' ) {
                    reportItem['hasIncludeZestWebUsers'] = filter;
                    _hasFauxSelect = true;
                };

                // check for include company/ta/group filter and keep a ref to that item
                if ( filter.value === 'INCLUDE_COMPANYCARD_TA_GROUP' ) {
                    reportItem['hasIncludeComapnyTaGroup'] = filter;
                };

                // check for include guarantee type filter and keep a ref to that item
                if ( filter.value === 'INCLUDE_GUARANTEE_TYPE' ) {
                    reportItem['hasGuaranteeType'] = filter;
                    reportItem['guaranteeTypes'] = angular.copy( data.guaranteeTypes );
                    _hasGuaranteeSelect = true;
                };

                // check for include deposit paid filter and keep a ref to that item
                if ( filter.value === 'DEPOSIT_PAID' ) {
                    reportItem['hasIncludeDepositPaid'] = filter;
                    _hasFauxSelect = true;
                };

                // check for include deposit due filter and keep a ref to that item
                if ( filter.value === 'DEPOSIT_DUE' ) {
                    reportItem['hasIncludeDepositDue'] = filter;
                    _hasFauxSelect = true;
                };

                // check for include deposit past due filter and keep a ref to that item
                if ( filter.value === 'DEPOSIT_PAST' ) {
                    reportItem['hasIncludeDepositPastDue'] = filter;
                    _hasFauxSelect = true;
                };

                // check for due in filter and keep a ref to that item
                if ( filter.value === 'DUE_IN_ARRIVALS' ) {
                    reportItem['hasDueInArrivals'] = filter;
                    reportItem['chosenDueInArrivals'] = true;
                    _hasFauxSelect = true;
                };

                // check for due out filter and keep a ref to that item
                if ( filter.value === 'DUE_OUT_DEPARTURES' ) {
                    reportItem['hasDueOutDepartures'] = filter;
                    reportItem['chosenDueOutDepartures'] = true;
                    _hasFauxSelect = true;
                };

                // check for include new and keep a ref to that item
                if ( filter.value === 'INCLUDE_NEW' ) {
                    reportItem['hasIncludeNew'] = filter;
                    _hasFauxSelect = true;
                };

                // check for include new and keep a ref to that item
                if ( filter.value === 'INCLUDE_BOTH' ) {
                    reportItem['hasIncludeBoth'] = filter;
                    _hasFauxSelect = true;
                };
            });

            // NEW! faux select DS and logic
            if ( _hasFauxSelect ) {
                reportItem['fauxSelectOpen'] = false;
                reportItem['fauxTitle'] = 'Select';
            };

            if ( _hasDisplaySelect ) {
                reportItem['selectDisplayOpen'] = false;
                reportItem['displayTitle'] = 'Select';
            };

            if ( _hasMarketSelect ) {
                reportItem['selectMarketsOpen'] = false;
                reportItem['displayTitle'] = 'Select';
                reportItem['marketTitle'] = 'Select';
            };

            if ( _hasGuaranteeSelect ) {
                reportItem['selectGuaranteeOpen'] = false;
                reportItem['guaranteeTitle'] = 'Select';
            };
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
