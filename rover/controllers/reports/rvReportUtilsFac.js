sntRover.factory('RVReportUtilsFac', [
    '$rootScope',
    '$filter',
    '$timeout',
    function($rootScope, $filter, $timeout) {
        var factory = {};






        // standard report names list
        var __reportNames = {
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
            'RESERVATIONS_BY_USER'         : 'Reservations By User',
            'DAILY_TRANSACTIONS'           : 'Daily Transactions',
            'DAILY_PAYMENTS'               : 'Daily Payments'
        };




        // here we are trying to create CC CG objects
        // with payments CC CG
        // or without CC CG
        var __adjustChargeGroupsCodes = function (chargeGroupsAry, chargeCodesAry, setting) {
            var newChargeGroupsAry = [],
                newChargeCodesAry  = [],
                paymentId          = null,
                cgAssociated       = false,
                paymentEntry       = {};

            if ( setting == 'REMOVE_PAYMENTS' ) {
                _.each(chargeGroupsAry, function (each) {
                    if ( each.name !== 'Payments' ) {
                        newChargeGroupsAry.push(each);
                    } else {
                        paymentId = each.id;
                    };
                });

                _.each(chargeCodesAry, function (each) {
                    cgAssociated = _.find(each['associcated_charge_groups'], function(idObj) {
                        return idObj.id == paymentId;
                    });

                    if ( !cgAssociated ) {
                        newChargeCodesAry.push(each);
                    };
                });
            }

            if ( setting == 'ONLY_PAYMENTS' ) {
                paymentEntry = _.find(chargeGroupsAry, function(each) {
                    return each.name == 'Payments';
                });

                if ( !!paymentEntry ) {
                    paymentId = paymentEntry.id;
                    newChargeGroupsAry.push(paymentEntry);

                    _.each(chargeCodesAry, function (each) {
                        cgAssociated = _.find(each['associcated_charge_groups'], function(idObj) {
                            return idObj.id == paymentId;
                        });

                        if ( !!cgAssociated ) {
                            newChargeCodesAry.push(each);
                        };
                    });
                };
            };

            return {
                'chargeGroups' : newChargeGroupsAry,
                'chargeCodes'  : newChargeCodesAry
            };
        };





        // getter method to provide the required value from
        // private data store "__reportNames"
        factory.getName = function (name) {
            return __reportNames[name] ? __reportNames[name] : undefined;
        };






        // report icon class to be applied
        factory.applyIconClass = function ( reportItem ) {
            switch ( reportItem['title'] ) {
                case __reportNames['CHECK_IN_CHECK_OUT']:
                    reportItem['reportIconCls'] = 'icon-report icon-check-in-check-out';
                    break;

                case __reportNames['UPSELL']:
                    reportItem['reportIconCls'] = 'icon-report icon-upsell';
                    break;

                case __reportNames['UPSWEB_CHECK_OUT_CONVERSIONELL']:
                    reportItem['reportIconCls'] = 'icon-report icon-check-out';
                    break;

                case __reportNames['WEB_CHECK_IN_CONVERSION']:
                    reportItem['reportIconCls'] = 'icon-report icon-check-in';
                    break;

                case __reportNames['LATE_CHECK_OUT']:
                    reportItem['reportIconCls'] = 'guest-status late-check-out';
                    break;

                case __reportNames['IN_HOUSE_GUEST']:
                    reportItem['reportIconCls'] = 'guest-status inhouse';
                    break;

                case __reportNames['ARRIVAL']:
                    reportItem['reportIconCls'] = 'guest-status check-in';
                    break;

                case __reportNames['DEPARTURE']:
                    reportItem['reportIconCls'] = 'guest-status check-out';
                    break;

                case __reportNames['CANCELLATION_NO_SHOW']:
                    reportItem['reportIconCls'] = 'guest-status cancel';
                    break;

                case __reportNames['BOOKING_SOURCE_MARKET_REPORT']:
                    reportItem['reportIconCls'] = 'icon-report icon-booking';
                    break;

                case __reportNames['LOGIN_AND_OUT_ACTIVITY']:
                    reportItem['reportIconCls'] = 'icon-report icon-activity';
                    break;

                case __reportNames['DEPOSIT_REPORT']:
                    reportItem['reportIconCls'] = 'icon-report icon-deposit';
                    break;

                case __reportNames['OCCUPANCY_REVENUE_SUMMARY']:
                    reportItem['reportIconCls'] = 'icon-report icon-occupancy';
                    break;

                case __reportNames['RESERVATIONS_BY_USER']:
                    reportItem['reportIconCls'] = 'icon-report icon-reservations';
                    break;

                case __reportNames['DAILY_TRANSACTIONS']:
                case __reportNames['DAILY_PAYMENTS']:
                    reportItem['reportIconCls'] = 'icon-report icon-transactions';
                    break;

                default:
                    reportItem['reportIconCls'] = 'icon-report';
                    break;
            };
        };






        // add required flags this report
        factory.applyFlags = function ( reportItem ) {

            switch ( reportItem['title'] ) {
                case __reportNames['ARRIVAL']:
                    reportItem['hasDateLimit'] = false;
                    break;

                case __reportNames['DEPARTURE']:
                    reportItem['hasDateLimit'] = false;
                    break;

                case __reportNames['CANCELLATION_NO_SHOW']:
                    reportItem['hasDateLimit'] = false;
                    reportItem['canRemoveDate'] = true;
                    reportItem['showRemove'] = true;
                    break;

                case __reportNames['BOOKING_SOURCE_MARKET_REPORT']:
                    reportItem['canRemoveDate'] = true;
                    reportItem['showRemove'] = true;
                    reportItem['hasSourceMarketFilter'] = true;
                    reportItem['hasDateLimit'] = false;
                    reportItem['canRemoveArrivalDate'] = true;
                    reportItem['showRemoveArrivalDate'] = true;
                    reportItem['hasArrivalDateLimit'] = false;
                    break;

                case __reportNames['LOGIN_AND_OUT_ACTIVITY']:
                    reportItem['hasDateLimit'] = false;
                    reportItem['hasUserFilter'] = true;
                    break;

                case __reportNames['DEPOSIT_REPORT']:
                    reportItem['hasDateLimit'] = false;
                    reportItem['canRemoveDate'] = true;
                    reportItem['showRemove'] = true;
                    reportItem['canRemoveArrivalDate'] = true;
                    reportItem['showRemoveArrivalDate'] = true;
                    break;

                case __reportNames['OCCUPANCY_REVENUE_SUMMARY']:
                    reportItem['hasMarketsList'] = true;
                    reportItem['hasDateLimit'] = false;
                    break;

                case __reportNames['RESERVATIONS_BY_USER']:
                    reportItem['hasUserFilter'] = true;
                    reportItem['hasDateLimit'] = false;
                    reportItem['canRemoveDate'] = true;
                    reportItem['showRemove'] = true;
                    reportItem['canRemoveArrivalDate'] = true;
                    reportItem['showRemoveArrivalDate'] = true;
                    break;

                case __reportNames['DAILY_TRANSACTIONS']:
                case __reportNames['DAILY_PAYMENTS']:
                    reportItem['hasDateLimit'] = false;
                    break;

                default:
                    reportItem['show_filter'] = false;
                    reportItem['hasDateLimit'] = true;
                    break;
            };
        };





        factory.cgcc = function () {

        };






        // to process the report filters
        factory.processFilters = function ( reportItem, data ) {
            var _hasFauxSelect,
                _hasDisplaySelect,
                _hasMarketSelect,
                _hasGuaranteeSelect,
                _hasChargeGroupSelect,
                _hasChargeCodeSelect;

            var _processed_CG_CC = {};

            // going around and taking a note on filters
            _.each(reportItem['filters'], function(filter) {

                if ( (filter.value === 'INCLUDE_CHARGE_CODE' || filter.value === 'INCLUDE_CHARGE_GROUP') && _.isEmpty(_processed_CG_CC) ) {
                    if ( reportItem['title'] == __reportNames['DAILY_TRANSACTIONS'] ) {
                        _processed_CG_CC = __adjustChargeGroupsCodes( data.chargeGroups, data.chargeCodes, 'REMOVE_PAYMENTS' );
                    };

                    if ( reportItem['title'] == __reportNames['DAILY_PAYMENTS'] ) {
                        _processed_CG_CC = __adjustChargeGroupsCodes( data.chargeGroups, data.chargeCodes, 'ONLY_PAYMENTS' );
                    };
                };

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

                // check for create date range filter and keep a ref to that item
                if ( filter.value === 'CREATE_DATE_RANGE' ) {
                    reportItem['hasCreateDateFilter'] = filter;
                };

                // check for "by single date" filter and keep a ref to that item
                if ( filter.value === 'SINGLE_DATE' ) {
                    reportItem['hasSingleDateFilter'] = filter;
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
                if ( filter.value === 'INCLUDE_LAST_YEAR' ) {
                    reportItem['hasLastYear'] = filter;
                    _hasFauxSelect = true;
                    _hasMarketSelect = true;
                };

                // check for include cancelled filter and keep a ref to that item
                if ( filter.value === 'INCLUDE_CANCELLED' || filter.value === 'INCLUDE_CANCELED' ) {
                    reportItem['hasIncludeCancelled'] = filter;
                    _hasFauxSelect = true;

                    if (reportItem['title'] == 'Cancellation & No Show') {
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


                // check for include guarantee type filter and keep a ref to that item
                if ( filter.value === 'INCLUDE_GUARANTEE_TYPE' ) {
                    reportItem['hasGuaranteeType'] = filter;
                    reportItem['guaranteeTypes'] = angular.copy( data.guaranteeTypes );
                    _hasGuaranteeSelect = true;
                };

                // check for "by charge group" and keep a ref to that item
                if ( filter.value === 'INCLUDE_CHARGE_GROUP' ) {
                    reportItem['hasByChargeGroup'] = filter;
                    reportItem['chargeGroups'] = angular.copy( _processed_CG_CC.chargeGroups );
                    _hasChargeGroupSelect = true;
                };

                // check for "by charge group" and keep a ref to that item
                if ( filter.value === 'INCLUDE_CHARGE_CODE' ) {
                    reportItem['hasByChargeCode'] = filter;
                    reportItem['chargeCodes'] = angular.copy( _processed_CG_CC.chargeCodes );
                    _hasChargeCodeSelect = true;
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

            if ( _hasChargeGroupSelect ) {
                reportItem['selectChargeGroupOpen'] = false;
                reportItem['chargeGroupTitle'] = 'All Selected';
                reportItem['allChargeGroupSelected'] = true;
            };

            if ( _hasChargeCodeSelect ) {
                reportItem['selectChargeCodeOpen'] = false;
                reportItem['chargeCodeTitle'] = 'All Selected';
                reportItem['allChargeCodeSelected'] = true;
            };
        };





        // to process the report group by
        factory.processGroupBy = function ( reportItem ) {
            if ( reportItem['group_fields'] && reportItem['group_fields'].length ) {
                // adding custom name ref
                reportItem['groupByOptions'] = reportItem['group_fields'];
            };
        };






        // to reorder the sort by to match the report details column positon
        factory.reOrderSortBy = function ( reportItem ) {

            // for (arrival, departure) report the sort by items must be
            // ordered in a specific way as per the design
            // [date - name - room] > TO > [room - name - date]
            if ( reportItem['title'] == __reportNames['ARRIVAL'] ||
                 reportItem['title'] == __reportNames['DEPARTURE'] ) {
                var dateSortBy = angular.copy( reportItem['sort_fields'][0] ),
                    roomSortBy = angular.copy( reportItem['sort_fields'][2] );

                dateSortBy['colspan'] = 2;
                roomSortBy['colspan'] = 0;

                reportItem['sort_fields'][0] = roomSortBy;
                reportItem['sort_fields'][2] = dateSortBy;
            };

            // for in-house report the sort by items must be
            // ordered in a specific way as per the design
            // [name - room] > TO > [room - name]
            if ( reportItem['title'] == __reportNames['IN_HOUSE_GUEST'] ) {
                var nameSortBy = angular.copy( reportItem['sort_fields'][0] ),
                    roomSortBy = angular.copy( reportItem['sort_fields'][1] );

                nameSortBy['colspan'] = 2;
                roomSortBy['colspan'] = 0;

                reportItem['sort_fields'][0] = roomSortBy;
                reportItem['sort_fields'][1] = nameSortBy;
            };

            // for Login and out Activity report
            // the colspans should be adjusted
            // the sort descriptions should be update to design
            //    THIS MUST NOT BE CHANGED IN BACKEND
            if ( reportItem['title'] == __reportNames['LOGIN_AND_OUT_ACTIVITY'] ) {
                reportItem['sort_fields'][0]['description'] = 'Date & Time';

                reportItem['sort_fields'][0]['colspan'] = 2;
                reportItem['sort_fields'][1]['colspan'] = 2;
            };


            // need to reorder the sort_by options
            // for deposit report in the following order
            if ( reportItem['title'] == __reportNames['DEPOSIT_REPORT'] ) {
                var reservationSortBy = angular.copy( reportItem['sort_fields'][4] ),
                    nameSortBy        = angular.copy( reportItem['sort_fields'][3] ),
                    dateSortBy        = angular.copy( reportItem['sort_fields'][0] ),
                    dueDateSortBy     = angular.copy( reportItem['sort_fields'][1] ),
                    paidDateSortBy    = angular.copy( reportItem['sort_fields'][2] );

                reportItem['sort_fields'][0] = reservationSortBy;
                reportItem['sort_fields'][1] = nameSortBy;
                reportItem['sort_fields'][2] = dateSortBy;
                reportItem['sort_fields'][3] = null;
                reportItem['sort_fields'][4] = dueDateSortBy;
                reportItem['sort_fields'][5] = paidDateSortBy;
            };

            // need to reorder the sort_by options
            // for Reservation by User in the following order
            if ( reportItem['title'] == __reportNames['RESERVATIONS_BY_USER'] ) {
                var reservationType = angular.copy( reportItem['sort_fields'][6] ),
                    guestName       = angular.copy( reportItem['sort_fields'][3] ),
                    arrivalDate     = angular.copy( reportItem['sort_fields'][1] ),
                    rateAmount      = angular.copy( reportItem['sort_fields'][5] ),
                    createdOn       = angular.copy( reportItem['sort_fields'][0] ),
                    guranteeType    = angular.copy( reportItem['sort_fields'][2] ),
                    overrideAmount  = angular.copy( reportItem['sort_fields'][4] );

                reportItem['sort_fields'][0] = reservationType;
                reportItem['sort_fields'][1] = guestName;
                reportItem['sort_fields'][2] = arrivalDate;
                reportItem['sort_fields'][3] = rateAmount;
                reportItem['sort_fields'][4] = createdOn;
                reportItem['sort_fields'][5] = guranteeType;
                reportItem['sort_fields'][6] = overrideAmount;
                reportItem['sort_fields'][7] = null;
            };

            // need to reorder the sort_by options
            // for daily transactions in the following order
            if ( reportItem['title'] == __reportNames['DAILY_TRANSACTIONS'] ||
                    reportItem['title'] == __reportNames['DAILY_PAYMENTS'] ) {
                var chargeGroup = angular.copy( reportItem['sort_fields'][1] ),
                    chargeCode  = angular.copy( reportItem['sort_fields'][0] ),
                    revenue     = angular.copy( reportItem['sort_fields'][3] ),
                    mtd         = angular.copy( reportItem['sort_fields'][2] ),
                    ytd         = angular.copy( reportItem['sort_fields'][4] );

                reportItem['sort_fields'][0] = chargeGroup;
                reportItem['sort_fields'][1] = chargeCode;
                reportItem['sort_fields'][2] = null;
                reportItem['sort_fields'][3] = revenue;
                reportItem['sort_fields'][4] = null;
                reportItem['sort_fields'][5] = null;
                reportItem['sort_fields'][6] = mtd;
                reportItem['sort_fields'][7] = null;
                reportItem['sort_fields'][8] = null;
                reportItem['sort_fields'][9] = ytd;
            };
        };





        // to process the report sort by
        factory.processSortBy = function ( reportItem ) {

            // sort by options - include sort direction
            if ( reportItem['sort_fields'] && reportItem['sort_fields'].length ) {
                _.each(reportItem['sort_fields'], function(item, index, list) {

                    if ( item != null) {
                        item['sortDir'] = undefined;
                    };

                });

                // adding custom name ref for easy access
                reportItem['sortByOptions'] = reportItem['sort_fields'];
            };
        };





        // to assign inital date values for this report
        factory.initDateValues = function ( reportItem ) {
            var _getDates = factory.processDate();

            switch ( reportItem['title'] ) {

                // dates range must be the current business date
                case __reportNames['ARRIVAL']:
                case __reportNames['DEPARTURE']:
                    reportItem['fromDate']  = _getDates.businessDate;
                    reportItem['untilDate'] = _getDates.businessDate;
                    break;

                // arrival date range must be from business date to a week after
                // deposit date range must the current business date
                case __reportNames['DEPOSIT_REPORT']:
                    reportItem['fromArrivalDate']  = _getDates.businessDate;
                    reportItem['untilArrivalDate'] = _getDates.aWeekAfter;
                    /**/
                    reportItem['fromDepositDate']  = _getDates.businessDate;
                    reportItem['untilDepositDate'] = _getDates.businessDate;
                    break;

                // date range must be yesterday - relative to current business date
                case __reportNames['OCCUPANCY_REVENUE_SUMMARY']:
                    reportItem['fromDate']  = _getDates.yesterday;
                    reportItem['untilDate'] = _getDates.yesterday;
                    break;

                // date range must be yesterday - relative to current business date
                case __reportNames['DAILY_TRANSACTIONS']:
                case __reportNames['DAILY_PAYMENTS']:
                    reportItem['singleValueDate']  = _getDates.yesterday;
                    break;

                // by default date range must be from a week ago to current business date
                default:
                    reportItem['fromDate']        = _getDates.aWeekAgo;
                    reportItem['fromCancelDate']  = _getDates.aWeekAgo;
                    reportItem['fromArrivalDate'] = _getDates.aWeekAgo;
                    reportItem['fromCreateDate']  = _getDates.aWeekAgo;
                    /**/
                    reportItem['untilDate']        = _getDates.businessDate;
                    reportItem['untilCancelDate']  = _getDates.businessDate;
                    reportItem['untilArrivalDate'] = _getDates.businessDate;
                    reportItem['untilCreateDate']  = _getDates.businessDate;
                    break;
            };
        };





        // HELPER: create meaningful date names
        factory.processDate = function ( customDate, xDays ) {
            var _dateVal      = customDate ? tzIndependentDate(customDate) : $rootScope.businessDate,
                _businessDate = $filter('date')(_dateVal, 'yyyy-MM-dd'),
                _dateParts    = _businessDate.match(/(\d+)/g),
                _year  = parseInt( _dateParts[0] ),
                _month = parseInt( _dateParts[1] ) - 1,
                _date  = parseInt( _dateParts[2] );

            var returnObj = {
                'businessDate' : new Date(_year, _month, _date),
                'yesterday'    : new Date(_year, _month, _date - 1),
                'aWeekAgo'     : new Date(_year, _month, _date - 7),
                'aWeekAfter'   : new Date(_year, _month, _date + 7)
            };

            if ( parseInt(xDays) != NaN ) {
                returnObj.xDaysBefore = new Date(_year, _month, _date - xDays);
                returnObj.xDaysAfter  = new Date(_year, _month, _date + xDays);
            };

            return returnObj;
        };





        // HELPER: create time slots
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
