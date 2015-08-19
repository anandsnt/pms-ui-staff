sntRover.factory('RVReportUtilsFac', [
    '$rootScope',
    '$filter',
    '$timeout',
    function($rootScope, $filter, $timeout) {
        var factory = {};

        /** @type {Object} A standard dict that can act as a central report name look uo */
        var __reportNames = {
            'CHECK_IN_CHECK_OUT'           : 'Check In / Check Out',
            'UPSELL'                       : 'Upsell',
            'WEB_CHECK_OUT_CONVERSION'     : 'Web Check Out Conversion',
            'WEB_CHECK_IN_CONVERSION'      : 'Web Check In Conversion',
            'LATE_CHECK_OUT'               : 'Late Check Out',
            'EARLY_CHECKIN'                : 'Early Check In',
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
            'DAILY_PAYMENTS'               : 'Daily Payments',
            'FORECAST_BY_DATE'             : 'Forecast',
            'ROOMS_QUEUED'                 : 'Rooms Queued',
            'FORECAST_GUEST_GROUPS'        : 'Forecast Guests & Groups',
            'MARKET_SEGMENT_STAT_REPORT'   : 'Market Segment Statistics Report',
            'COMPARISION_BY_DATE'          : 'Comparison',
            'RATE_ADJUSTMENTS_REPORT'      : 'Rate Adjustment Report'
        };

        /**
         * A simple getter to returned the actual report name form __reportNames dict
         * @param  {String} name The capitalized standard report name
         * @return {String}      The actual report name
         */
        factory.getName = function (name) {
            return __reportNames[name] ? __reportNames[name] : undefined;
        };

        var __paramNames = {
            'FROM_DATE'            : 'from_date',
            'TO_DATE'              : 'to_date',
            'CANCEL_FROM_DATE'     : 'cancel_from_date',
            'CANCEL_TO_DATE'       : 'cancel_to_date',
            'ARRIVAL_FROM_DATE'    : 'arrival_from_date',
            'ARRIVAL_TO_DATE'      : 'arrival_to_date',
            'DEPOSIT_FROM_DATE'    : 'deposit_from_date',
            'DEPOSIT_TO_DATE'      : 'deposit_to_date',
            'PAID_FROM_DATE'       : 'paid_from_date',
            'CREATE_FROM_DATE'     : 'create_from_date',
            'CREATE_TO_DATE'       : 'create_to_date',
            'ADJUSTMENT_FROM_DATE' : 'from_date',
            'ADJUSTMENT_TO_DATE'   : 'to_date',
            'SINGLE_DATE'          : 'date',

            'FROM_TIME' : 'from_time',
            'TO_TIME'   : 'to_time',

            'CHECKED_IN'  : 'checked_in',
            'CHECKED_OUT' : 'checked_out',

            'SORT_FIELD' : 'sort_field',
            'SORT_DIR'   : 'sort_dir',

            'GROUP_BY_DATE'       : 'group_by_date',
            'GROUP_BY_USER'       : 'group_by_user',
            'GROUP_BY_GROUP_NAME' : 'group_by_group_name',

            'USER_IDS'               : 'user_ids[]',
            'MARKET_IDS'             : 'market_ids[]',
            'SOURCE_IDS'             : 'source_ids[]',
            'BOOKING_ORIGIN_IDS'     : 'booking_origin_ids[]',
            'INCLUDE_GUARANTEE_TYPE' : 'include_guarantee_type[]',
            'CHARGE_GROUP_IDS'       : 'charge_group_ids[]',
            'CHARGE_CODE_IDS'        : 'charge_code_ids[]',
            'HOLD_STATUS_IDS'        : 'hold_status_ids[]'
        };

        factory.getParamName = function(name) {
            return __paramNames[name] ? __paramNames[name] : undefined;
        };






        /**
         * This is a function that can return CG & CC with no payment entries or only payment entries
         * @param  {Array} chargeGroupsAry Array of charge groups
         * @param  {Array} chargeCodesAry  Array of charge codes
         * @param  {String} setting         Remove payments or only payments
         * @return {Object}                 Processed CG & CC
         */
        var __adjustChargeGroupsCodes = function (chargeGroupsAry, chargeCodesAry, setting) {
            var newChargeGroupsAry = [],
                newChargeCodesAry  = [],
                paymentId          = null,
                cgAssociated       = false,
                paymentEntry       = {};

            if ( setting === 'REMOVE_PAYMENTS' ) {
                _.each(chargeGroupsAry, function (each) {
                    if ( each.name !== 'Payments' ) {
                        each.selected = true;
                        newChargeGroupsAry.push(each);
                    } else {
                        paymentId = each.id;
                    };
                });

                _.each(chargeCodesAry, function (each) {
                    cgAssociated = _.find(each['associcated_charge_groups'], function(idObj) {
                        return idObj.id === paymentId;
                    });

                    if ( !cgAssociated ) {
                        each.selected = true;
                        newChargeCodesAry.push(each);
                    };
                });
            }

            if ( setting === 'ONLY_PAYMENTS' ) {
                paymentEntry = _.find(chargeGroupsAry, function(each) {
                    return each.name === 'Payments';
                });

                if ( !!paymentEntry ) {
                    paymentId = paymentEntry.id;
                    paymentEntry.selected = true;
                    newChargeGroupsAry.push(paymentEntry);

                    _.each(chargeCodesAry, function (each) {
                        cgAssociated = _.find(each['associcated_charge_groups'], function(idObj) {
                            return idObj.id === paymentId;
                        });

                        if ( !!cgAssociated ) {
                            each.selected = true;
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





        /**
         * A generic method to properly and effeciently set data for report filters, or anything for that matter
         * @param  {Object} objRef   The Object where we are going to set/update the key value
         * @param  {String} key      The name of the key
         * @param  {Anything} value  The value to be set in objRef
         */
        var __setData = function(objRef, key, value) {

            // if the key doesnt exist on the objRef, create it
            if ( ! objRef.hasOwnProperty(key) ) {
                objRef[key] = {};
            };

            // merge value when its an object, else just assign
            if ( typeof value === 'object' ) {
                // DAMN! Our Angular version is very very old. Cant use this:

                $.extend( true, objRef[key], value );
            } else {
                objRef[key] = value;
            };
        };

        /** @type {Object} Array of all the filter values, new values added in future can be included here */
        var __optionFilterNames = {
            'INCLUDE_NOTES'      : true,
            'VIP_ONLY'           : true,
            'INCLUDE_VARIANCE'   : true,
            'INCLUDE_LAST_YEAR'  : true,
            'INCLUDE_CANCELLED'  : true,
            'INCLUDE_CANCELED'   : true,
            'INCLUDE_NO_SHOW'    : true,
            'SHOW_GUESTS'        : true,
            'ROVER'              : true,
            'ZEST'               : true,
            'ZEST_WEB'           : true,
            'DEPOSIT_PAID'       : true,
            'DEPOSIT_DUE'        : true,
            'DEPOSIT_PAST'       : true,
            'DUE_IN_ARRIVALS'    : true,
            'DUE_OUT_DEPARTURES' : true,
            'INCLUDE_NEW'        : true,
            'INCLUDE_BOTH'       : true,
            'EXCLUDE_NON_GTD'    : true,
            'SHOW_RATE_ADJUSTMENTS_ONLY' : true,
            'INCLUDE_TAX'        : true
        };

        var __displayFilterNames = {
            'INCLUDE_MARKET'  : true,
            'INCLUDE_SOURCE'  : true,
            'INCLUDE_ORIGIN'  : true,
            'INCLUDE_SEGMENT' : true
        };

        /**
         * Create a DS representing the found filter into the general options DS
         * @param {Object} objRef The ith report object
         * @param {Object} filter The ith report's filter object
         */
        var __pushGeneralOptionData = function(objRef, filter) {
            var selected = false;
            var mustSend = false;

            var includeCancelled = {
                        'INCLUDE_CANCELLED' : true,
                        'INCLUDE_CANCELED'  : true
                    },
                dueInDueOut = {
                        'DUE_IN_ARRIVALS'    : true,
                        'DUE_OUT_DEPARTURES' : true
                    },
                depositStatus = {
                        'DEPOSIT_PAID' : true,
                        'DEPOSIT_DUE'  : true,
                        'DEPOSIT_PAST' : true
                    };

            // if filter is this, make it selected by default
            if ( objRef['title'] === __reportNames['CANCELLATION_NO_SHOW'] && includeCancelled[filter.value] ) {
                selected = true;
                objRef['hasGeneralOptions']['title'] = filter.description;
            };

            // if filter value is either of these, make it selected by default
            if ( dueInDueOut[filter.value] ) {
                selected = true;
                objRef['hasGeneralOptions']['title'] = filter.description;
            };

            // if filter value is either of these, must include when report submit
            if ( depositStatus[filter.value] ) {
                mustSend = true;
            };

            // if filter value is either of these, must include when report submit
            if ( objRef['title'] === __reportNames['FORECAST_GUEST_GROUPS'] ) {
                objRef['hasGeneralOptions']['title'] = filter.description;
            };

            objRef['hasGeneralOptions']['data'].push({
                paramKey    : filter.value.toLowerCase(),
                description : filter.description,
                selected    : selected,
                mustSend    : mustSend
            });
        };

        /**
         * Create a DS representing the found filter into the display DS
         * @param {Object} objRef The ith report object
         * @param {Object} filter The ith report's filter object
         */
        var __pushDisplayData = function(objRef, filter) {
            objRef['hasDisplay']['data'].push({
                paramKey    : filter.value.toLowerCase(),
                description : filter.description,
                selected    : false
            });
        };






        /**
         * Apply the specific icon class for each report
         * @param  {Object} reportItem The ith report
         */
        factory.applyIconClass = function ( reportItem ) {
            switch ( reportItem['title'] ) {
                case __reportNames['CHECK_IN_CHECK_OUT']:
                    reportItem['reportIconCls'] = 'icon-report icon-check-in-check-out';
                    break;

                case __reportNames['UPSELL']:
                    reportItem['reportIconCls'] = 'icon-report icon-upsell';
                    break;

                case __reportNames['WEB_CHECK_OUT_CONVERSION']:
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

                case __reportNames['ROOMS_QUEUED']:
                    reportItem['reportIconCls'] = 'icons guest-status icon-queued';
                    break;

                case __reportNames['FORECAST_BY_DATE']:
                    reportItem['reportIconCls'] = 'icon-report icon-forecast';
                    break;

                case __reportNames['MARKET_SEGMENT_STAT_REPORT']:
                    reportItem['reportIconCls'] = 'icon-report icon-market';
                    break;

                case __reportNames['FORECAST_GUEST_GROUPS']:
                    reportItem['reportIconCls'] = 'icon-report icon-forecast';
                    break;

                case __reportNames['COMPARISION_BY_DATE']:
                    reportItem['reportIconCls'] = 'icon-report icon-comparison';
                    break;

                case __reportNames['RATE_ADJUSTMENTS_REPORT']:
                    reportItem['reportIconCls'] = 'icon-report icon-rate';
                    break;

                default:
                    reportItem['reportIconCls'] = 'icon-report';
                    break;
            };
        };






        /**
         * The various ways a particular report can behave, all specified here
         * @param  {Object} reportItem The ith report
         * @TODO: Now that I think about it, this is not very efficient, we should find a better way to define and apply the behaviour.
         * Current implementation has many dependendcy across many files. Not Good.
         */
        factory.applyFlags = function ( reportItem ) {
            switch ( reportItem['title'] ) {
                case __reportNames['ARRIVAL']:
                    reportItem['hasDateLimit'] = false;
                    break;

                case __reportNames['DEPARTURE']:
                    reportItem['hasDateLimit'] = false;
                    break;

                case __reportNames['CANCELLATION_NO_SHOW']:
                    reportItem['hasDateLimit']  = false;
                    reportItem['canRemoveDate'] = true;
                    break;

                case __reportNames['BOOKING_SOURCE_MARKET_REPORT']:
                    reportItem['canRemoveDate']       = true;
                    reportItem['hasDateLimit']        = false;
                    reportItem['hasArrivalDateLimit'] = false;
                    break;

                case __reportNames['LOGIN_AND_OUT_ACTIVITY']:
                    reportItem['hasDateLimit']  = false;
                    reportItem['hasUserFilter'] = true;
                    break;

                case __reportNames['DEPOSIT_REPORT']:
                    reportItem['hasDateLimit']  = false;
                    reportItem['canRemoveDate'] = true;
                    break;

                case __reportNames['OCCUPANCY_REVENUE_SUMMARY']:
                    reportItem['hasDateLimit'] = false;
                    break;

                case __reportNames['RESERVATIONS_BY_USER']:
                    reportItem['hasUserFilter'] = true;
                    reportItem['hasDateLimit']  = false;
                    reportItem['canRemoveDate'] = true;
                    break;

                case __reportNames['FORECAST_BY_DATE']:
                case __reportNames['DAILY_TRANSACTIONS']:
                case __reportNames['DAILY_PAYMENTS']:
                    reportItem['hasDateLimit'] = false;
                    break;

                case __reportNames['MARKET_SEGMENT_STAT_REPORT']:
                    reportItem['hasDateLimit'] = true;
                    break;

                case __reportNames['ROOMS_QUEUED']:
                    reportItem['hasSysDateLimit'] = true;
                    break;

                case __reportNames['RATE_ADJUSTMENTS_REPORT']:
                    reportItem['hasUserFilter'] = true;
                    reportItem['canRemoveDate'] = true;
                    break;

                default:
                    reportItem['hasDateLimit'] = false;     // CICO-16820: Changed to false
                    break;
            };
        };






        /**
         * Process the filters and create proper DS to show and play in UI
         * @param  {Object} reportItem The ith report
         * @param  {Object} data       Additonal data sources like CG, CC, Markets, Source etc
         */
        factory.processFilters = function ( reportItem, data ) {

            // pre-process charge groups and charge codes
            var processedCGCC = {};

            // create DS for options combo box
            __setData(reportItem, 'hasGeneralOptions', {
                type         : 'FAUX_SELECT',
                show         : false,
                selectAll    : false,
                defaultTitle : 'Select Options',
                title        : 'Select Options',
                data         : []
            });

            // create a name space for chosen options
            reportItem.chosenOptions = {};

            // create DS for display combo box
            __setData(reportItem, 'hasDisplay', {
                type         : 'FAUX_SELECT',
                show         : false,
                selectAll    : false,
                defaultTitle : 'Select displays',
                title        : 'Select displays',
                data         : []
            });

            // track all the dates avaliable on this report
            reportItem.allDates = [];

            // going around and taking a note on filters
            _.each(reportItem['filters'], function(filter) {

                if ( (filter.value === 'INCLUDE_CHARGE_CODE' || filter.value === 'INCLUDE_CHARGE_GROUP') && _.isEmpty(processedCGCC) ) {
                    if ( reportItem['title'] === __reportNames['DAILY_TRANSACTIONS'] ) {
                        processedCGCC = __adjustChargeGroupsCodes( data.chargeGroups, data.chargeCodes, 'REMOVE_PAYMENTS' );
                    };

                    if ( reportItem['title'] === __reportNames['DAILY_PAYMENTS'] ) {
                        processedCGCC = __adjustChargeGroupsCodes( data.chargeGroups, data.chargeCodes, 'ONLY_PAYMENTS' );
                    };
                };

                // check for date filter and keep a ref to that item
                if ( filter.value === 'DATE_RANGE' ) {
                    reportItem['hasDateFilter'] = filter;

                    // for 'Cancellation & No Show' report the description should be 'Arrival Date Range'
                    // rather than the default 'Date Range'
                    if ( reportItem['title'] === 'Cancellation & No Show' ) {
                        reportItem['hasDateFilter']['description'] = 'Arrival Date Range';
                    };

                    // for 'Booking Source & Market Report' report the description should be 'Booked Date'
                    if ( reportItem['title'] === 'Booking Source & Market Report' ) {
                        reportItem['hasDateFilter']['description'] = 'Booked Date';
                    };

                    // track - showRemove flag, model names.
                    // push date name to 'allDates'
                    angular.extend(reportItem['hasDateFilter'], {
                        showRemove : true,
                        fromModel  : 'fromDate',
                        untilModel : 'untilDate'
                    });
                    reportItem.allDates.push( 'hasDateFilter' );
                };

                // check for cancellation date filter and keep a ref to that item
                if ( filter.value === 'CANCELATION_DATE_RANGE' || filter.value === 'CANCELLATION_DATE_RANGE' ) {
                    reportItem['hasCancelDateFilter'] = filter;

                    // track - showRemove flag, model names.
                    // push date name to 'allDates'
                    angular.extend(reportItem['hasCancelDateFilter'], {
                        showRemove : true,
                        fromModel  : 'fromCancelDate',
                        untilModel : 'untilCancelDate'
                    });
                    reportItem.allDates.push( 'hasCancelDateFilter' );
                };

                // check for arrival date filter and keep a ref to that item
                if ( filter.value === 'ARRIVAL_DATE_RANGE' ) {
                    reportItem['hasArrivalDateFilter'] = filter;

                    // track - showRemove flag, model names.
                    // push date name to 'allDates'
                    angular.extend(reportItem['hasArrivalDateFilter'], {
                        showRemove : true,
                        fromModel  : 'fromArrivalDate',
                        untilModel : 'untilArrivalDate'
                    });
                    reportItem.allDates.push( 'hasArrivalDateFilter' );
                };

                // check for Deposit due date range filter and keep a ref to that item
                if ( filter.value === 'DEPOSIT_DATE_RANGE' ) {
                    reportItem['hasDepositDateFilter'] = filter;

                    // track - showRemove flag, model names.
                    // push date name to 'allDates'
                    angular.extend(reportItem['hasDepositDateFilter'], {
                        showRemove : true,
                        fromModel  : 'fromDepositDate',
                        untilModel : 'untilDepositDate'
                    });
                    reportItem.allDates.push( 'hasDepositDateFilter' );
                };

                // check for create date range filter and keep a ref to that item
                if ( filter.value === 'CREATE_DATE_RANGE' ) {
                    reportItem['hasCreateDateFilter'] = filter;

                    // track - showRemove flag, model names.
                    // push date name to 'allDates'
                    angular.extend(reportItem['hasCreateDateFilter'], {
                        showRemove : true,
                        fromModel  : 'fromCreateDate',
                        untilModel : 'untilCreateDate'
                    });
                    reportItem.allDates.push( 'hasCreateDateFilter' );
                };

                // check for paid date range filter and keep a ref to that item
                if ( filter.value === 'PAID_DATE_RANGE' ) {
                    reportItem['hasPaidDateRange'] = filter;

                    // track - showRemove flag, model names.
                    // push date name to 'allDates'
                    angular.extend(reportItem['hasPaidDateRange'], {
                        showRemove : true,
                        fromModel  : 'fromPaidDate',
                        untilModel : 'untilPaidDate'
                    });
                    reportItem.allDates.push( 'hasPaidDateRange' );
                };

                // check for "by single date" filter and keep a ref to that item
                if ( filter.value === 'SINGLE_DATE' ) {
                    reportItem['hasSingleDateFilter'] = filter;

                    // track - showRemove flag, model names.
                    // push date name to 'allDates'
                    angular.extend(reportItem['hasSingleDateFilter'], {
                        showRemove : true,
                        fromModel  : 'singleValueDate'
                    });
                    reportItem.allDates.push( 'hasSingleDateFilter' );
                };

                // check for rate adjustment date range filter and keep a ref to that item
                if ( filter.value === 'ADJUSTMENT_DATE_RANGE' ) {
                    reportItem['hasAdjustmentDateRange'] = filter;

                    // track - showRemove flag, model names.
                    // push date name to 'allDates'
                    angular.extend(reportItem['hasAdjustmentDateRange'], {
                        showRemove : true,
                        fromModel  : 'fromAdjustmentDate',
                        untilModel : 'untilAdjustmentDate'
                    });
                    reportItem.allDates.push( 'hasAdjustmentDateRange' );
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




                // check for include company/ta/group filter and keep a ref to that item
                if ( filter.value === 'INCLUDE_COMPANYCARD_TA_GROUP' || filter.value === 'GROUP_COMPANY_TA_CARD' ) {
                    reportItem['hasIncludeComapnyTaGroup'] = filter;
                };




                // fill up DS for options combo box
                if ( __optionFilterNames[filter.value] ) {
                    __pushGeneralOptionData( reportItem, filter );
                };

                // fill up DS for display combo box
                if ( __displayFilterNames[filter.value] ) {


                    //
                    // QUICK PATCH
                    // TODO: replace with a better solution
                    if ( reportItem.title === __reportNames['MARKET_SEGMENT_STAT_REPORT'] ) {
                        if ( filter.value === 'INCLUDE_MARKET' && data.codeSettings['is_market_on'] ) {
                            __pushDisplayData( reportItem, filter );
                        } else if ( filter.value === 'INCLUDE_ORIGIN' && data.codeSettings['is_origin_on'] ) {
                            __pushDisplayData( reportItem, filter );
                        } else if ( filter.value === 'INCLUDE_SEGMENT' && data.codeSettings['is_segments_on'] ) {
                            __pushDisplayData( reportItem, filter );
                        } else if ( filter.value === 'INCLUDE_SOURCE' && data.codeSettings['is_source_on'] ) {
                            __pushDisplayData( reportItem, filter );
                        };
                    } else {
                        __pushDisplayData( reportItem, filter );
                    };
                };




                // check for "include guarantee type" and keep a ref to that item
                // create the filter option only when there is any data
                if ( filter.value === 'INCLUDE_GUARANTEE_TYPE' && data.guaranteeTypes.length ) {
                    __setData(reportItem, 'hasGuaranteeType', {
                        type         : 'FAUX_SELECT',
                        filter       : filter,
                        show         : false,
                        selectAll    : false,
                        defaultTitle : 'Select Guarantees',
                        title        : 'Select Guarantees',
                        data         : angular.copy( data.guaranteeTypes )
                    });
                };

                // check for "by charge group" and keep a ref to that item
                // create the filter option only when there is any data
                if ( filter.value === 'INCLUDE_CHARGE_GROUP' && processedCGCC.chargeGroups.length ) {
                    __setData(reportItem, 'hasByChargeGroup', {
                        type         : 'FAUX_SELECT',
                        filter       : filter,
                        show         : false,
                        selectAll    : true,
                        defaultTitle : 'Select Groups',
                        title        : 'All Selected',
                        data         : angular.copy( processedCGCC.chargeGroups )
                    });
                };

                // check for "by charge group" and keep a ref to that item
                // create the filter option only when there is any data
                if ( filter.value === 'INCLUDE_CHARGE_CODE' && processedCGCC.chargeCodes.length ) {
                    __setData(reportItem, 'hasByChargeCode', {
                        type         : 'FAUX_SELECT',
                        filter       : filter,
                        show         : false,
                        selectAll    : true,
                        defaultTitle : 'Select Codes',
                        title        : 'All Selected',
                        data         : angular.copy( processedCGCC.chargeCodes )
                    });
                };

                // check for "show markets" and keep a ref to that item
                // create the filter option only when there is any data
                if ( filter.value === 'CHOOSE_MARKET' && data.markets.length ) {
                    __setData(reportItem, 'hasMarketsList', {
                        type         : 'FAUX_SELECT',
                        filter       : filter,
                        show         : false,
                        selectAll    : false,
                        defaultTitle : 'Select Markets',
                        title        : 'Select Markets',
                        data         : angular.copy( data.markets )
                    });
                };

                // check for "show sources" and keep a ref to that item
                // create the filter option only when there is any data
                if ( filter.value === 'CHOOSE_SOURCE' && data.sources.length ) {
                    __setData(reportItem, 'hasSourcesList', {
                        type         : 'FAUX_SELECT',
                        filter       : filter,
                        show         : false,
                        selectAll    : false,
                        defaultTitle : 'Select Sources',
                        title        : 'Select Sources',
                        data         : angular.copy( data.sources )
                    });
                };

                // check for "show origins" and keep a ref to that item
                // create the filter option only when there is any data
                if ( filter.value === 'CHOOSE_BOOKING_ORIGIN' && data.origins.length ) {
                    __setData(reportItem, 'hasOriginsList', {
                        type         : 'FAUX_SELECT',
                        filter       : filter,
                        show         : false,
                        selectAll    : false,
                        defaultTitle : 'Select Origins',
                        title        : 'Select Origins',
                        data         : angular.copy( data.origins )
                    });
                };

                // check for "hold status" and keep a ref to that item
                // create the filter option only when there is any data
                if ( filter.value === 'HOLD_STATUS' && data.holdStatus.length ) {
                    __setData(reportItem, 'hasHoldStatus', {
                        type         : 'FAUX_SELECT',
                        filter       : filter,
                        show         : false,
                        selectAll    : false,
                        defaultTitle : 'Select Hold Status',
                        title        : 'Select Hold Status',
                        data         : angular.copy( data.holdStatus )
                    });
                };
            });
        };





        // to process the report group by
        factory.processGroupBy = function ( reportItem ) {
            // remove the value for 'BLANK'
            if ( reportItem['group_fields'] && reportItem['group_fields'].length ) {
                reportItem['groupByOptions'] = _.reject(reportItem['group_fields'], { value: 'BLANK' });
            };
        };






        // to reorder the sort by to match the report details column positon
        factory.reOrderSortBy = function ( reportItem ) {

            // for (arrival, departure) report the sort by items must be
            // ordered in a specific way as per the design
            // [date - name - room] > TO > [room - name - date]
            if ( reportItem['title'] === __reportNames['ARRIVAL'] ||
                 reportItem['title'] === __reportNames['DEPARTURE'] ) {
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
            if ( reportItem['title'] === __reportNames['IN_HOUSE_GUEST'] ) {
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
            if ( reportItem['title'] === __reportNames['LOGIN_AND_OUT_ACTIVITY'] ) {
                reportItem['sort_fields'][0]['description'] = 'Date & Time';

                reportItem['sort_fields'][0]['colspan'] = 2;
                reportItem['sort_fields'][1]['colspan'] = 2;
            };


            // need to reorder the sort_by options
            // for deposit report in the following order
            if ( reportItem['title'] === __reportNames['DEPOSIT_REPORT'] ) {
                var reservationSortBy = angular.copy( reportItem['sort_fields'][4] ),
                    dueDateSortBy     = angular.copy( reportItem['sort_fields'][1] ),
                    paidDateSortBy    = angular.copy( reportItem['sort_fields'][2] );

                reportItem['sort_fields'][0] = reservationSortBy;
                reportItem['sort_fields'][1] = null;
                reportItem['sort_fields'][2] = dueDateSortBy;
                reportItem['sort_fields'][3] = null;
                reportItem['sort_fields'][4] = paidDateSortBy;
                reportItem['sort_fields'][5] = null;
            };

            // need to reorder the sort_by options
            // for Reservation by User in the following order
            if ( reportItem['title'] === __reportNames['RESERVATIONS_BY_USER'] ) {
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
            if ( reportItem['title'] === __reportNames['DAILY_TRANSACTIONS'] ||
                    reportItem['title'] === __reportNames['DAILY_PAYMENTS'] ) {
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

            // need to reorder the sort_by options
            // for rate adjustment report in the following order
            if ( reportItem['title'] === __reportNames['RATE_ADJUSTMENTS_REPORT'] ) {
                var date      = angular.copy( reportItem['sort_fields'][1] ),
                    guestUser = angular.copy( reportItem['sort_fields'][0] ),
                    user      = angular.copy( reportItem['sort_fields'][2] );

                reportItem['sort_fields'][0] = guestUser;
                reportItem['sort_fields'][1] = date;
                reportItem['sort_fields'][2] = null;
                reportItem['sort_fields'][3] = null;
                reportItem['sort_fields'][4] = null;
                reportItem['sort_fields'][5] = null;
                reportItem['sort_fields'][6] = user;
            };
        };





        // to process the report sort by
        factory.processSortBy = function ( reportItem ) {

            // sort by options - include sort direction
            if ( reportItem['sort_fields'] && reportItem['sort_fields'].length ) {
                _.each(reportItem['sort_fields'], function(item, index, list) {

                    if ( item !== null ) {
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
                    /**/
                    reportItem['fromPaidDate']  = _getDates.businessDate;
                    reportItem['untilPaidDate'] = _getDates.businessDate;
                    break;

                // date range must be yesterday - relative to current business date
                case __reportNames['OCCUPANCY_REVENUE_SUMMARY']:
                    reportItem['fromDate']  = _getDates.yesterday;
                    reportItem['untilDate'] = _getDates.yesterday;
                    break;

                // date range must be yesterday - relative to current business date
                case __reportNames['DAILY_TRANSACTIONS']:
                case __reportNames['DAILY_PAYMENTS']:
                case __reportNames['MARKET_SEGMENT_STAT_REPORT']:
                case __reportNames['COMPARISION_BY_DATE']:
                    reportItem['singleValueDate']  = _getDates.yesterday;
                    break;

                // dates range must be the current business date
                case __reportNames['FORECAST_BY_DATE']:
                case __reportNames['FORECAST_GUEST_GROUPS']:
                    reportItem['fromDate']  = _getDates.businessDate;
                    reportItem['untilDate'] = _getDates.aMonthAfter;
                    break;

                // by default date range must be from a week ago to current business date
                default:
                    reportItem['fromDate']            = _getDates.aWeekAgo;
                    reportItem['fromCancelDate']      = _getDates.aWeekAgo;
                    reportItem['fromArrivalDate']     = _getDates.aWeekAgo;
                    reportItem['fromCreateDate']      = _getDates.aWeekAgo;
                    reportItem['fromAdjustmentDate']  = _getDates.aWeekAgo;
                    /**/
                    reportItem['untilDate']            = _getDates.businessDate;
                    reportItem['untilCancelDate']      = _getDates.businessDate;
                    reportItem['untilArrivalDate']     = _getDates.businessDate;
                    reportItem['untilCreateDate']      = _getDates.businessDate;
                    reportItem['untilAdjustmentDate']  = _getDates.businessDate;
                    break;
            };
        };





        // HELPER: create meaningful date names
        factory.processDate = function ( customDate, xDays ) {
            var _dateVal      = customDate ? tzIndependentDate(customDate) : $rootScope.businessDate,
                _businessDate = $filter('date')(_dateVal, 'yyyy-MM-dd'),
                _dateParts    = _businessDate.match(/(\d+)/g);

            var _year  = parseInt( _dateParts[0] ),
                _month = parseInt( _dateParts[1] ) - 1,
                _date  = parseInt( _dateParts[2] );

            var returnObj = {
                'businessDate' : new Date(_year, _month, _date),
                'yesterday'    : new Date(_year, _month, _date - 1),
                'aWeekAgo'     : new Date(_year, _month, _date - 7),
                'aWeekAfter'   : new Date(_year, _month, _date + 7),
                'aMonthAfter'  : new Date(_year, _month, _date + 30)
            };

            if ( parseInt(xDays) !== NaN ) {
                returnObj.xDaysBefore = new Date(_year, _month, _date - xDays);
                returnObj.xDaysAfter  = new Date(_year, _month, _date + xDays);
            };

            return returnObj;
        };





        // HELPER: create time slots
        factory.createTimeSlots = function () {
            var _ret  = [],
                _hh   = '',
                _mm   = '',
                _step = 15;

            var i = m = 0,
                h = -1;

            // 4 parts in each of 24 hours (00 -> 23)
            // 4 * 24 = 96
            for (i = 0; i < 96; i++) {

                // each hour is split into 4 parts
                // x:00, x:15, x:30, x:45
                if (i % 4 === 0) {
                    h++;
                    m = 0;
                } else {
                    m += _step;
                }

                // converting h -> HH and m -> MM
                _hh = h < 10 ? '0' + h : h;
                _mm = m < 10 ? '0' + m : m;

                _ret.push({
                    'value' : _hh + ':' + _mm,
                    'name'  : _hh + ':' + _mm
                });
            };

            return _ret;
        };






        return factory;
    }
]);
