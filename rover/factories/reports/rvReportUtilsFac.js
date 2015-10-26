sntRover.factory('RVReportUtilsFac', [
    '$rootScope',
    '$filter',
    '$timeout',
    '$q',
    'RVReportNamesConst',
    'RVReportFiltersConst',
    'RVreportsSubSrv',
    function($rootScope, $filter, $timeout, $q, reportNames, reportFilters, reportsSubSrv) {
        var factory = {};

        /**
         * This function can return CG & CC with no payment entries or with only payment entries
         * @param  {Array} chargeGroupsAry Array of charge groups
         * @param  {Array} chargeCodesAry  Array of charge codes
         * @param  {String} setting         Remove payments or only payments
         * @return {Object}                 Processed CG & CC
         */
        var __adjustChargeGroupsCodes = function (chargeGroupsAry, chargeCodesAry, setting, selected) {
            var chargeGroupsAryCopy,
                chargeCodesAryCopy,
                newChargeGroupsAry = [],
                newChargeCodesAry  = [],
                paymentId          = null,
                cgAssociated       = false,
                paymentEntry       = {};

            var selected = 'boolean' == typeof selected ? selected : true;

            chargeGroupsAryCopy = angular.copy( chargeGroupsAry );
            chargeCodesAryCopy = angular.copy( chargeCodesAry );

            if ( 'REMOVE_PAYMENTS' === setting ) {
                _.each(chargeGroupsAryCopy, function (each) {
                    if ( each.name !== 'Payments' ) {
                        each.selected = selected;
                        newChargeGroupsAry.push( each );
                    } else {
                        paymentId = each.id;
                    };
                });

                _.each(chargeCodesAryCopy, function (each) {
                    cgAssociated = _.find(each['associcated_charge_groups'], function(idObj) {
                        return idObj.id === paymentId;
                    });

                    if ( !cgAssociated ) {
                        each.selected = selected;
                        newChargeCodesAry.push( each );
                    };
                });
            } else if ( 'ONLY_PAYMENTS' === setting ) {
                paymentEntry = _.find(chargeGroupsAryCopy, function(each) {
                    return 'Payments' === each.name;
                });

                if ( !!paymentEntry ) {
                    paymentId = paymentEntry.id;
                    paymentEntry.selected = selected;
                    newChargeGroupsAry.push(paymentEntry);

                    _.each(chargeCodesAryCopy, function (each) {
                        cgAssociated = _.find(each['associcated_charge_groups'], function(idObj) {
                            return idObj.id === paymentId;
                        });

                        if ( !!cgAssociated ) {
                            each.selected = selected;
                            newChargeCodesAry.push(each);
                        };
                    });
                };
            } else {
                _.each(chargeGroupsAryCopy, function(each) {
                    each.selected = selected;
                    newChargeGroupsAry.push(each);
                });

                _.each(chargeCodesAryCopy, function(each) {
                    each.selected = selected;
                    newChargeCodesAry.push(each);
                });
            };

            return {
                'chargeGroups' : newChargeGroupsAry,
                'chargeCodes'  : newChargeCodesAry
            };
        };


        var selectAllAddonGroups = function(data) {
            var data = data;

            _.each(data, function(item) {
                item.selected = true;
            });

            return data;
        };

        var selectAllAddons = function(data) {
            var data = data;

            _.each(data, function(item) {
                _.each(item['list_of_addons'], function(entry) {
                    entry.selected = true;
                });
            });

            return data;
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
            if ( 'object' === typeof value ) {
                // DAMN! Our Angular version is very very old. Cant use this:
                // angular.merge( {}, objRef[key], value );
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
            'INCLUDE_TAX'        : true,
            'INCLUDE_TAX_RATE': true,
            'INCLUDE_ADDON_RATE': true,
            'INCLUDE_ADDONS': true
        };

        var __displayFilterNames = {
            'INCLUDE_MARKET'  : true,
            'INCLUDE_SOURCE'  : true,
            'INCLUDE_ORIGIN'  : true,
            'INCLUDE_SEGMENT' : true
        };

        var _guestOrAccountFilterNames = {
            'GUEST': true,
            'ACCOUNT': true
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
            if ( objRef['title'] == reportNames['CANCELLATION_NO_SHOW'] && includeCancelled[filter.value] ) {
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
            if ( objRef['title'] == reportNames['FORECAST_GUEST_GROUPS'] ) {
                objRef['hasGeneralOptions']['title'] = filter.description;
            };

            // if filter is this, make it selected by default
            if ( objRef['title'] == reportNames['DAILY_PRODUCTION'] && filter.value == 'INCLUDE_ADDONS' ) {
                selected = true;
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
         * Create a DS representing the found filter into the display DS
         * @param {Object} objRef The ith report object
         * @param {Object} filter The ith report's filter object
         */
        var __pushGuestOrAccountData = function(objRef, filter) {
            objRef['hasGuestOrAccountFilter']['data'].push({
                paramKey    : filter.value.toLowerCase(),
                description : filter.description,
                selected    : true
            });
        };


        /**
         * Apply the specific icon class for each report
         * @param  {Object} report The ith report
         */
        factory.applyIconClass = function ( report ) {
            switch ( report['title'] ) {
                case reportNames['CHECK_IN_CHECK_OUT']:
                    report['reportIconCls'] = 'icon-report icon-check-in-check-out';
                    break;

                case reportNames['UPSELL']:
                    report['reportIconCls'] = 'icon-report icon-upsell';
                    break;

                case reportNames['WEB_CHECK_OUT_CONVERSION']:
                    report['reportIconCls'] = 'icon-report icon-check-out';
                    break;

                case reportNames['WEB_CHECK_IN_CONVERSION']:
                    report['reportIconCls'] = 'icon-report icon-check-in';
                    break;

                case reportNames['LATE_CHECK_OUT']:
                    report['reportIconCls'] = 'guest-status late-check-out';
                    break;

                case reportNames['IN_HOUSE_GUEST']:
                    report['reportIconCls'] = 'guest-status inhouse';
                    break;

                case reportNames['ARRIVAL']:
                    report['reportIconCls'] = 'guest-status check-in';
                    break;

                case reportNames['DEPARTURE']:
                    report['reportIconCls'] = 'guest-status check-out';
                    break;

                case reportNames['CANCELLATION_NO_SHOW']:
                    report['reportIconCls'] = 'guest-status cancel';
                    break;

                case reportNames['BOOKING_SOURCE_MARKET_REPORT']:
                    report['reportIconCls'] = 'icon-report icon-booking';
                    break;

                case reportNames['LOGIN_AND_OUT_ACTIVITY']:
                    report['reportIconCls'] = 'icon-report icon-activity';
                    break;

                case reportNames['DEPOSIT_REPORT']:
                    report['reportIconCls'] = 'icon-report icon-deposit';
                    break;

                case reportNames['GROUP_DEPOSIT_REPORT']:
                    report['reportIconCls'] = 'icon-report icon-deposit';
                    break;

                case reportNames['OCCUPANCY_REVENUE_SUMMARY']:
                    report['reportIconCls'] = 'icon-report icon-occupancy';
                    break;

                case reportNames['RESERVATIONS_BY_USER']:
                    report['reportIconCls'] = 'icon-report icon-reservations';
                    break;

                case reportNames['DAILY_TRANSACTIONS']:
                case reportNames['DAILY_PAYMENTS']:
                    report['reportIconCls'] = 'icon-report icon-transactions';
                    break;

                case reportNames['ROOMS_QUEUED']:
                    report['reportIconCls'] = 'icons guest-status icon-queued';
                    break;

                case reportNames['FORECAST_BY_DATE']:
                    report['reportIconCls'] = 'icon-report icon-forecast';
                    break;

                case reportNames['MARKET_SEGMENT_STAT_REPORT']:
                    report['reportIconCls'] = 'icon-report icon-market';
                    break;

                case reportNames['FORECAST_GUEST_GROUPS']:
                    report['reportIconCls'] = 'icon-report icon-forecast';
                    break;

                case reportNames['COMPARISION_BY_DATE']:
                    report['reportIconCls'] = 'icon-report icon-comparison';
                    break;

                case reportNames['RATE_ADJUSTMENTS_REPORT']:
                    report['reportIconCls'] = 'icon-report icon-rate';
                    break;

                case reportNames['GROUP_PICKUP_REPORT']:
                    report['reportIconCls'] = 'icon-report icon-group';
                    break;

                case reportNames['DAILY_PRODUCTION']:
                    report['reportIconCls'] = 'icon-report icon-forecast';
                    break;

                case reportNames['AR_SUMMARY_REPORT']:
                    report['reportIconCls'] = 'icon-report icon-balance';
                    break;

                case reportNames['GUEST_BALANCE_REPORT']:
                    report['reportIconCls'] = 'icon-report icon-balance';
                    break;

                default:
                    report['reportIconCls'] = 'icon-report';
                    break;
            };
        };


        /**
         * The various ways a particular report can behave, all specified here
         * @param  {Object} report The ith report
         * @TODO: Now that I think about it, this is not very efficient, we should find a better way to define and apply the behaviour.
         * Current implementation has many dependendcy across many files. Not Good.
         */
        factory.applyFlags = function ( report ) {
            switch ( report['title'] ) {
                case reportNames['ARRIVAL']:
                    report['hasDateLimit'] = false;
                    break;

                case reportNames['DEPARTURE']:
                    report['hasDateLimit'] = false;
                    break;

                case reportNames['CANCELLATION_NO_SHOW']:
                    report['hasDateLimit']  = false;
                    report['canRemoveDate'] = true;
                    break;

                case reportNames['BOOKING_SOURCE_MARKET_REPORT']:
                    report['canRemoveDate']       = true;
                    report['hasDateLimit']        = false;
                    report['hasArrivalDateLimit'] = false;
                    break;

                case reportNames['LOGIN_AND_OUT_ACTIVITY']:
                    report['hasDateLimit']  = false;
                    report['hasUserFilter'] = true;
                    break;

                case reportNames['DEPOSIT_REPORT']:
                    report['hasDateLimit']  = false;
                    report['canRemoveDate'] = true;
                    break;

                case reportNames['GROUP_DEPOSIT_REPORT']:
                    report['hasDateLimit']  = false;
                    report['canRemoveDate'] = true;
                    break;

                case reportNames['OCCUPANCY_REVENUE_SUMMARY']:                    
                    report['hasPrevDateLimit'] = true;
                    break;

                case reportNames['RESERVATIONS_BY_USER']:
                    report['hasUserFilter'] = true;
                    report['hasDateLimit']  = false;
                    report['canRemoveDate'] = true;
                    break;

                case reportNames['FORECAST_BY_DATE']:
                case reportNames['DAILY_TRANSACTIONS']:
                case reportNames['DAILY_PAYMENTS']:
                    report['hasDateLimit'] = false;
                    break;

                case reportNames['MARKET_SEGMENT_STAT_REPORT']:
                    report['hasDateLimit'] = true;
                    break;

                case reportNames['ROOMS_QUEUED']:
                    report['hasSysDateLimit'] = true;
                    break;

                case reportNames['RATE_ADJUSTMENTS_REPORT']:
                    report['hasUserFilter'] = true;
                    report['canRemoveDate'] = true;
                    break;

                case reportNames['ADDON_FORECAST']:
                    report['canRemoveDate'] = true;
                    break;

                case reportNames['DAILY_PRODUCTION']:
                    report['hasDateLimit']  = false;
                    report['canRemoveDate'] = true;
                    break;

                default:
                    report['hasDateLimit'] = false;     // CICO-16820: Changed to false
                    break;
            };
        };





        factory.addIncludeUserFilter = function( report ) {
            switch ( report['title'] ) {
                case reportNames['LOGIN_AND_OUT_ACTIVITY']:
                case reportNames['RATE_ADJUSTMENTS_REPORT']:
                case reportNames['RESERVATIONS_BY_USER']:
                    report['filters'].push({
                        'value': "INCLUDE_USER_NAMES",
                        'description': "Include User Names"
                    });
                    break;

                default:
                    // no op
                    break;
            };
        };

        /**
         * Process the filters and create proper DS to show and play in UI
         * @param  {Object} report The ith report
         * @param  {Object} data       Additonal data sources like CG, CC, Markets, Source etc
         */
        factory.processFilters = function ( report, data ) {

            // pre-process charge groups and charge codes
            var processedCGCC = {};

            // create DS for options combo box
            __setData(report, 'hasGeneralOptions', {
                type         : 'FAUX_SELECT',
                show         : false,
                selectAll    : false,
                defaultTitle : 'Select Options',
                title        : 'Select Options',
                data         : []
            });

            // create a name space for chosen options
            report.chosenOptions = {};

            // create DS for display combo box
            __setData(report, 'hasDisplay', {
                type         : 'FAUX_SELECT',
                show         : false,
                selectAll    : false,
                defaultTitle : 'Select displays',
                title        : 'Select displays',
                data         : []
            });

            // create DS for guest or account
            __setData(report, 'hasGuestOrAccountFilter', {
                type         : 'FAUX_SELECT',
                show         : false,
                selectAll    : true,
                defaultTitle : 'Select',
                title        : 'All Selected',
                data         : []
            });

            // track all the dates avaliable on this report
            report.allDates = [];

            // going around and taking a note on filters
            _.each(report['filters'], function(filter) {

                if ( (filter.value === 'INCLUDE_CHARGE_CODE' || filter.value === 'INCLUDE_CHARGE_GROUP') && _.isEmpty(processedCGCC) ) {
                    if ( report['title'] === reportNames['DAILY_TRANSACTIONS'] ) {
                        processedCGCC = __adjustChargeGroupsCodes( data.chargeNAddonGroups, data.chargeCodes, 'REMOVE_PAYMENTS' );
                    } else if ( report['title'] === reportNames['DAILY_PAYMENTS'] ) {
                        processedCGCC = __adjustChargeGroupsCodes( data.chargeNAddonGroups, data.chargeCodes, 'ONLY_PAYMENTS' );
                    } else {
                        processedCGCC = __adjustChargeGroupsCodes( data.chargeNAddonGroups, data.chargeCodes, '' );
                    };
                };

                // check for date filter and keep a ref to that item
                if ( filter.value === 'DATE_RANGE' ) {
                    report['hasDateFilter'] = filter;

                    // for 'Cancellation & No Show' report the description should be 'Arrival Date Range'
                    // rather than the default 'Date Range'
                    if ( report['title'] === 'Cancellation & No Show' ) {
                        report['hasDateFilter']['description'] = 'Arrival Date Range';
                    };

                    // for 'Booking Source & Market Report' report the description should be 'Booked Date'
                    if ( report['title'] === 'Booking Source & Market Report' ) {
                        report['hasDateFilter']['description'] = 'Booked Date';
                    };

                    // track - showRemove flag, model names.
                    // push date name to 'allDates'
                    angular.extend(report['hasDateFilter'], {
                        showRemove : true,
                        fromModel  : 'fromDate',
                        untilModel : 'untilDate'
                    });
                    report.allDates.push( 'hasDateFilter' );
                };

                // check for cancellation date filter and keep a ref to that item
                if ( filter.value === 'CANCELATION_DATE_RANGE' || filter.value === 'CANCELLATION_DATE_RANGE' ) {
                    report['hasCancelDateFilter'] = filter;

                    // track - showRemove flag, model names.
                    // push date name to 'allDates'
                    angular.extend(report['hasCancelDateFilter'], {
                        showRemove : true,
                        fromModel  : 'fromCancelDate',
                        untilModel : 'untilCancelDate'
                    });
                    report.allDates.push( 'hasCancelDateFilter' );
                };

                // check for arrival date filter and keep a ref to that item
                if ( filter.value === 'ARRIVAL_DATE_RANGE' ) {
                    report['hasArrivalDateFilter'] = filter;

                    // track - showRemove flag, model names.
                    // push date name to 'allDates'
                    angular.extend(report['hasArrivalDateFilter'], {
                        showRemove : true,
                        fromModel  : 'fromArrivalDate',
                        untilModel : 'untilArrivalDate'
                    });
                    report.allDates.push( 'hasArrivalDateFilter' );
                };

                // check for group start date filter and keep a ref to that item
                if ( filter.value === 'GROUP_START_DATE_RANGE' ) {
                    report['hasGroupStartDateRange'] = filter;

                    // track - showRemove flag, model names.
                    // push date name to 'allDates'
                    angular.extend(report['hasGroupStartDateRange'], {
                        showRemove : true,
                        fromModel  : 'groupStartDate',
                        untilModel : 'groupEndDate'
                    });
                    report.allDates.push( 'hasGroupStartDateRange' );
                };

                // check for Deposit due date range filter and keep a ref to that item
                if ( filter.value === 'DEPOSIT_DATE_RANGE' ) {
                    report['hasDepositDateFilter'] = filter;

                    // track - showRemove flag, model names.
                    // push date name to 'allDates'
                    angular.extend(report['hasDepositDateFilter'], {
                        showRemove : true,
                        fromModel  : 'fromDepositDate',
                        untilModel : 'untilDepositDate'
                    });
                    report.allDates.push( 'hasDepositDateFilter' );
                };

                // check for create date range filter and keep a ref to that item
                if ( filter.value === 'CREATE_DATE_RANGE' ) {
                    report['hasCreateDateFilter'] = filter;

                    // track - showRemove flag, model names.
                    // push date name to 'allDates'
                    angular.extend(report['hasCreateDateFilter'], {
                        showRemove : true,
                        fromModel  : 'fromCreateDate',
                        untilModel : 'untilCreateDate'
                    });
                    report.allDates.push( 'hasCreateDateFilter' );
                };

                // check for paid date range filter and keep a ref to that item
                if ( filter.value === 'PAID_DATE_RANGE' ) {
                    report['hasPaidDateRange'] = filter;

                    // track - showRemove flag, model names.
                    // push date name to 'allDates'
                    angular.extend(report['hasPaidDateRange'], {
                        showRemove : true,
                        fromModel  : 'fromPaidDate',
                        untilModel : 'untilPaidDate'
                    });
                    report.allDates.push( 'hasPaidDateRange' );
                };

                // check for "by single date" filter and keep a ref to that item
                if ( filter.value === 'SINGLE_DATE' ) {
                    report['hasSingleDateFilter'] = filter;

                    // track - showRemove flag, model names.
                    // push date name to 'allDates'
                    angular.extend(report['hasSingleDateFilter'], {
                        showRemove : true,
                        fromModel  : 'singleValueDate'
                    });
                    report.allDates.push( 'hasSingleDateFilter' );
                };

                // check for rate adjustment date range filter and keep a ref to that item
                if ( filter.value === 'ADJUSTMENT_DATE_RANGE' ) {
                    report['hasAdjustmentDateRange'] = filter;

                    // track - showRemove flag, model names.
                    // push date name to 'allDates'
                    angular.extend(report['hasAdjustmentDateRange'], {
                        showRemove : true,
                        fromModel  : 'fromAdjustmentDate',
                        untilModel : 'untilAdjustmentDate'
                    });
                    report.allDates.push( 'hasAdjustmentDateRange' );
                };




                // check for time filter and keep a ref to that item
                // create std 15min stepped time slots
                if ( filter.value === 'TIME_RANGE' ) {
                    report['hasTimeFilter'] = filter;
                    report['timeFilterOptions'] = factory.createTimeSlots();
                };




                // check for CICO filter and keep a ref to that item
                // create the CICO filter options
                if ( filter.value === 'CICO' ) {
                    report['hasCicoFilter'] = filter;
                    report['cicoOptions'] = [{
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
                    report['hasIncludeComapnyTaGroup'] = filter;
                };




                // fill up DS for options combo box
                if ( __optionFilterNames[filter.value] ) {
                    __pushGeneralOptionData( report, filter );
                };

                // fill up DS for display combo box
                if ( __displayFilterNames[filter.value] ) {

                    //__pushDisplayData( report, filter );
                    //
                    // QUICK PATCH
                    // TODO: replace with a better solution
                    if ( report.title == reportNames['MARKET_SEGMENT_STAT_REPORT'] ) {
                        if ( filter.value == 'INCLUDE_MARKET' && data.codeSettings['is_market_on'] ) {
                            __pushDisplayData( report, filter );
                        } else if ( filter.value === 'INCLUDE_ORIGIN' && data.codeSettings['is_origin_on'] ) {
                            __pushDisplayData( report, filter );
                        } else if ( filter.value === 'INCLUDE_SEGMENT' && data.codeSettings['is_segments_on'] ) {
                            __pushDisplayData( report, filter );
                        } else if ( filter.value === 'INCLUDE_SOURCE' && data.codeSettings['is_source_on'] ) {
                            __pushDisplayData( report, filter );
                        };
                    } else {
                        __pushDisplayData( report, filter );
                    };
                };

                // fill up DS for options combo box
                if ( _guestOrAccountFilterNames[filter.value] ) {
                    __pushGuestOrAccountData( report, filter );
                };


            });
        };

        factory.findFillFilters = function( reportItem, reportList ) {
            var deferred = $q.defer();

            var requested = 0,
                completed = 0;

            var checkAllCompleted = function() {
                if ( completed == requested ) {

                    // tryin to figure out if all the filters for this
                    // reportItem has been filled, if so make it 'allFiltersProcessed'
                    anyFilterLeft = _.find(filters, function(each) {
                        return ! each.hasOwnProperty( 'filled' );
                    });

                    if ( undefined == anyFilterLeft ) {
                        reportItem.allFiltersProcessed = true;
                    };

                    // finally resolve the promise
                    deferred.resolve();
                };
            };

            var filters       = reportItem['filters'],
                anyFilterLeft = undefined;

            _.each(filters, function(filter) {

                if ( 'INCLUDE_GUARANTEE_TYPE' == filter.value && ! filter.filled ) {
                    requested++;
                    reportsSubSrv.fetchGuaranteeTypes()
                        .then( fillGarntTypes );  
                }

                else if ( 'CHOOSE_MARKET' == filter.value && ! filter.filled ) {
                    requested++;
                    reportsSubSrv.fetchMarkets()
                        .then( fillMarkets );
                }

                else if ( 'CHOOSE_SOURCE' == filter.value && ! filter.filled ) {
                    requested++;
                    reportsSubSrv.fetchSources()
                        .then( fillSources );
                }

                else if ( 'CHOOSE_BOOKING_ORIGIN' == filter.value && ! filter.filled ) {
                    requested++;
                    reportsSubSrv.fetchBookingOrigins()
                        .then( fillBookingOrigins );
                }

                else if ( 'HOLD_STATUS' == filter.value && ! filter.filled ) {
                    requested++;
                    reportsSubSrv.fetchHoldStatus()
                        .then( fillHoldStatus );
                }

                else if ( 'RESERVATION_STATUS' == filter.value && ! filter.filled ) {
                    requested++;
                    reportsSubSrv.fetchReservationStatus()
                        .then( fillResStatus );
                }

                else if ( ('INCLUDE_CHARGE_GROUP' == filter.value && ! filter.filled) || ('ADDON_GROUPS' == filter.value && ! filter.filled) ) {
                    
                    // fetch charge groups
                    requested++;
                    reportsSubSrv.fetchChargeNAddonGroups()
                        .then(function(chargeNAddonGroups) {

                            // then fetch charge code
                            requested++;
                            reportsSubSrv.fetchChargeCodes()
                                .then( fillCGCC.bind(null, chargeNAddonGroups) );

                            // along with that fetch addons
                            requested++;
                            reportsSubSrv.fetchAddons({ 'addon_group_ids' : _.pluck(chargeNAddonGroups, 'id') })
                                .then( fillAGAs.bind(null, chargeNAddonGroups) );
                        });
                }

                else {
                    // no op
                };
            });           
            
            // lets just resolve the deferred already!
            if ( 0 == requested ) {
                checkAllCompleted();
            };

            function fillGarntTypes (data) {
                var foundFilter;

                _.each(reportList, function(report) {
                    foundFilter = _.find(report['filters'], { value: 'INCLUDE_GUARANTEE_TYPE' });

                    if ( !! foundFilter ) {
                        foundFilter['filled'] = true;
                        __setData(report, 'hasGuaranteeType', {
                            type         : 'FAUX_SELECT',
                            filter       : foundFilter,
                            show         : false,
                            selectAll    : false,
                            defaultTitle : 'Select Guarantees',
                            title        : 'Select Guarantees',
                            data         : angular.copy( data )
                        });
                    };
                });

                completed++
                checkAllCompleted();
            };

            function fillMarkets (data) {
                var foundFilter;

                _.each(reportList, function(report) {
                    foundFilter = _.find(report['filters'], { value: 'CHOOSE_MARKET' });

                    if ( !! foundFilter ) {
                        foundFilter['filled'] = true;
                        __setData(report, 'hasMarketsList', {
                            type         : 'FAUX_SELECT',
                            filter       : foundFilter,
                            show         : false,
                            selectAll    : false,
                            defaultTitle : 'Select Markets',
                            title        : 'Select Markets',
                            data         : angular.copy( data )
                        });
                    };
                });

                completed++
                checkAllCompleted();
            };

            function fillSources (data) {
                var foundFilter;

                _.each(reportList, function(report) {
                    foundFilter = _.find(report['filters'], { value: 'CHOOSE_SOURCE' });

                    if ( !! foundFilter ) {
                        foundFilter['filled'] = true;
                        __setData(report, 'hasSourcesList', {
                            type         : 'FAUX_SELECT',
                            filter       : foundFilter,
                            show         : false,
                            selectAll    : false,
                            defaultTitle : 'Select Sources',
                            title        : 'Select Sources',
                            data         : angular.copy( data )
                        });
                        report['filters']['filled'] = true;
                    };
                });

                completed++
                checkAllCompleted();
            };

            function fillBookingOrigins (data) {
                var foundFilter;

                _.each(reportList, function(report) {
                    foundFilter = _.find(report['filters'], { value: 'CHOOSE_BOOKING_ORIGIN' });

                    if ( !! foundFilter ) {
                        foundFilter['filled'] = true;
                        __setData(report, 'hasOriginsList', {
                            type         : 'FAUX_SELECT',
                            filter       : foundFilter,
                            show         : false,
                            selectAll    : false,
                            defaultTitle : 'Select Origins',
                            title        : 'Select Origins',
                            data         : angular.copy( data )
                        });
                    };
                });

                completed++
                checkAllCompleted();
            };

            function fillHoldStatus (data) {
                var foundFilter;

                _.each(reportList, function(report) {
                    foundFilter = _.find(report['filters'], { value: 'HOLD_STATUS' });

                    if ( !! foundFilter ) {
                        foundFilter['filled'] = true;
                        __setData(report, 'hasHoldStatus', {
                            type         : 'FAUX_SELECT',
                            filter       : foundFilter,
                            show         : false,
                            selectAll    : false,
                            defaultTitle : 'Select Hold Status',
                            title        : 'Select Hold Status',
                            data         : angular.copy( data )
                        });
                    };
                });

                completed++
                checkAllCompleted();
            };

            function fillResStatus (data) {
                var foundFilter,
                    customData;

                _.each(reportList, function(report) {
                    foundFilter = _.find(report['filters'], { value: 'RESERVATION_STATUS' });
                    if ( !! foundFilter ) {
                        foundFilter['filled'] = true;

                        // CICO-20405: Required custom data for only deposit reports ¯\_(ツ)_/¯
                        customData = angular.copy( data );
                        if ( report['title'] === reportNames['DEPOSIT_REPORT'] ) {
                            customData = [
                                {id: -2, status: "DUE IN", selected: true},
                                {id: -1, status: "DUE OUT", selected: true},
                                {id: 1,  status: "RESERVED", selected: true},
                                {id: 2,  status: "CHECKED IN", selected: true},
                                {id: 3,  status: "CHECKED OUT", selected: true},
                                {id: 4,  status: "NO SHOW", selected: true},
                                {id: 5,  status: "CANCEL", selected: true}
                            ];
                        };

                        __setData(report, 'hasReservationStatus', {
                            type         : 'FAUX_SELECT',
                            filter       : foundFilter,
                            show         : false,
                            selectAll    : false,
                            defaultTitle : 'Select Status',
                            title        : 'Select Status',
                            data         : angular.copy( customData )
                        });

                        if ( report['title'] === reportNames['DEPOSIT_REPORT'] ) {
                            report['hasReservationStatus'].selectAll = true;
                            report['hasReservationStatus'].title = 'All Selected';
                        };
                    };
                });

                completed++;
                checkAllCompleted();
            };

            // fill charge group and charge codes
            function fillCGCC (chargeNAddonGroups, chargeCodes) {
                var foundCG,
                    foundCC,
                    processedCGCC;

                    var title,
                        selected;

                _.each(reportList, function(report) {

                    if ( report['title'] === reportNames['DAILY_TRANSACTIONS'] ) {
                        selected = true;
                        processedCGCC = __adjustChargeGroupsCodes( chargeNAddonGroups, chargeCodes, 'REMOVE_PAYMENTS', selected );
                    }
                    /**/
                    else if ( report['title'] === reportNames['DAILY_PAYMENTS'] ) {
                        selected = true;
                        processedCGCC = __adjustChargeGroupsCodes( chargeNAddonGroups, chargeCodes, 'ONLY_PAYMENTS', selected );
                    }
                    /**/
                    else if ( report['title'] === reportNames['DAILY_PRODUCTION'] ) {
                        selected = false;
                        processedCGCC = __adjustChargeGroupsCodes( chargeNAddonGroups, chargeCodes, 'NONE', selected );
                    }
                    /**/
                    else {
                        selected = true;
                        processedCGCC = __adjustChargeGroupsCodes( chargeNAddonGroups, chargeCodes, 'NONE', selected );
                    };

                    foundCG = _.find(report['filters'], { value: 'INCLUDE_CHARGE_GROUP' });

                    if ( !! foundCG ) {
                        foundCG['filled'] = true;
                        __setData(report, 'hasByChargeGroup', {
                            type         : 'FAUX_SELECT',
                            filter       : foundCG,
                            show         : false,
                            selectAll    : selected,
                            defaultTitle : 'Select Groups',
                            title        : selected ? 'All Selected' : 'Select Groups',
                            data         : angular.copy( processedCGCC.chargeGroups )
                        });
                    };

                    foundCG = _.find(report['filters'], { value: 'INCLUDE_CHARGE_CODE' });

                    if ( !!foundCG ) {
                        foundCG['filled'] = true;
                        __setData(report, 'hasByChargeCode', {
                            type         : 'FAUX_SELECT',
                            filter       : foundCG,
                            show         : false,
                            selectAll    : selected,
                            defaultTitle : 'Select Codes',
                            title        : selected ? 'All Selected' : 'Select Codes',
                            data         : angular.copy( processedCGCC.chargeCodes )
                        });
                    };
                });

                completed += 2;
                checkAllCompleted();
            };

            // fill addon group and addons
            function fillAGAs (chargeNAddonGroups, addons) {
                var foundAG,
                    foundAs;

                _.each(reportList, function(report) {
                    foundAG = _.find(report['filters'], { value: 'ADDON_GROUPS' });

                    if ( !! foundAG ) {
                        foundAG['filled'] = true;
                        __setData(report, 'hasAddonGroups', {
                            type         : 'FAUX_SELECT',
                            filter       : foundAG,
                            show         : false,
                            selectAll    : true,
                            defaultTitle : 'Select Addon Group',
                            title        : 'All Selected',
                            data         : selectAllAddonGroups( angular.copy(chargeNAddonGroups) ),
                        });
                    };

                    foundAs = _.find(report['filters'], { value: 'ADDONS' });

                    if ( !!foundAs ) {
                        foundAs['filled'] = true;
                        __setData(report, 'hasAddons', {
                            type         : 'FAUX_SELECT',
                            filter       : foundAs,
                            show         : false,
                            selectAll    : true,
                            defaultTitle : 'Select Addon',
                            title        : 'All Selected',
                            data         : selectAllAddons( angular.copy(addons) )
                        });
                    };
                });

                completed++
                checkAllCompleted();
            };

            return deferred.promise;
        };





        // to process the report group by
        factory.processGroupBy = function ( report ) {
            // remove the value for 'BLANK'
            if ( report['group_fields'] && report['group_fields'].length ) {
                report['groupByOptions'] = _.reject(report['group_fields'], { value: 'BLANK' });
            };
        };






        // to reorder the sort by to match the report details column positon
        factory.reOrderSortBy = function ( report ) {

            // for (arrival, departure) report the sort by items must be
            // ordered in a specific way as per the design
            // [date - name - room] > TO > [room - name - date]
            if ( report['title'] === reportNames['ARRIVAL'] ||
                 report['title'] === reportNames['DEPARTURE'] ) {
                var dateSortBy = angular.copy( report['sort_fields'][0] ),
                    roomSortBy = angular.copy( report['sort_fields'][2] );

                dateSortBy['colspan'] = 2;
                roomSortBy['colspan'] = 0;

                report['sort_fields'][0] = roomSortBy;
                report['sort_fields'][2] = dateSortBy;
            };

            // for AR Summary report the sort by items must be
            // ordered in a specific way as per the design
            // [name - account - balance] > TO > [balance - account - name]
            if ( report['title'] === reportNames['AR_SUMMARY_REPORT']) {
                var nameSortBy    = angular.copy( _.find(report['sort_fields'], { 'value': 'ACCOUNT_NAME' }) ),
                    accountSortBy = angular.copy( _.find(report['sort_fields'], { 'value': 'ACCOUNT_NO' }) ),
                    balanceSortBy = angular.copy( _.find(report['sort_fields'], { 'value': 'BALANCE' }) );

                report['sort_fields'][0] = nameSortBy;
                report['sort_fields'][1] = accountSortBy;
                report['sort_fields'][2] = null;
                report['sort_fields'][3] = null;
                report['sort_fields'][4] = balanceSortBy;
            };

            // for in-house report the sort by items must be
            // ordered in a specific way as per the design
            // [name - room] > TO > [room - name]
            if ( report['title'] === reportNames['IN_HOUSE_GUEST'] ) {
                var nameSortBy = angular.copy( report['sort_fields'][0] ),
                    roomSortBy = angular.copy( report['sort_fields'][1] );

                nameSortBy['colspan'] = 2;
                roomSortBy['colspan'] = 0;

                report['sort_fields'][0] = roomSortBy;
                report['sort_fields'][1] = nameSortBy;
            };

            // for Login and out Activity report
            // the colspans should be adjusted
            // the sort descriptions should be update to design
            //    THIS MUST NOT BE CHANGED IN BACKEND
            if ( report['title'] === reportNames['LOGIN_AND_OUT_ACTIVITY'] ) {
                report['sort_fields'][0]['description'] = 'Date & Time';

                report['sort_fields'][0]['colspan'] = 2;
                report['sort_fields'][1]['colspan'] = 2;
            };


            // need to reorder the sort_by options
            // for deposit report in the following order
            if ( report['title'] === reportNames['DEPOSIT_REPORT'] ) {
                var reservationSortBy = angular.copy( report['sort_fields'][4] ),
                    dueDateSortBy     = angular.copy( report['sort_fields'][1] ),
                    paidDateSortBy    = angular.copy( report['sort_fields'][2] );

                report['sort_fields'][0] = reservationSortBy;
                report['sort_fields'][1] = null;
                report['sort_fields'][2] = dueDateSortBy;
                report['sort_fields'][3] = null;
                report['sort_fields'][4] = paidDateSortBy;
                report['sort_fields'][5] = null;
            };

            // need to reorder the sort_by options
            // for group deposit report in the following order
            if ( report['title'] === reportNames['GROUP_DEPOSIT_REPORT'] ) {
                var reservationSortBy = angular.copy( report['sort_fields'][4] ),
                    dueDateSortBy     = angular.copy( report['sort_fields'][1] ),
                    paidDateSortBy    = angular.copy( report['sort_fields'][2] );

                report['sort_fields'][0] = reservationSortBy;
                report['sort_fields'][1] = null;
                report['sort_fields'][2] = dueDateSortBy;
                report['sort_fields'][3] = null;
                report['sort_fields'][4] = paidDateSortBy;
                report['sort_fields'][5] = null;
            };

            // need to reorder the sort_by options
            // for Reservation by User in the following order
            if ( report['title'] === reportNames['RESERVATIONS_BY_USER'] ) {
                var reservationType = angular.copy( report['sort_fields'][6] ),
                    guestName       = angular.copy( report['sort_fields'][3] ),
                    arrivalDate     = angular.copy( report['sort_fields'][1] ),
                    rateAmount      = angular.copy( report['sort_fields'][5] ),
                    createdOn       = angular.copy( report['sort_fields'][0] ),
                    guranteeType    = angular.copy( report['sort_fields'][2] ),
                    overrideAmount  = angular.copy( report['sort_fields'][4] );

                report['sort_fields'][0] = reservationType;
                report['sort_fields'][1] = guestName;
                report['sort_fields'][2] = arrivalDate;
                report['sort_fields'][3] = rateAmount;
                report['sort_fields'][4] = createdOn;
                report['sort_fields'][5] = guranteeType;
                report['sort_fields'][6] = overrideAmount;
                report['sort_fields'][7] = null;
            };

            // need to reorder the sort_by options
            // for daily transactions in the following order
            if ( report['title'] === reportNames['DAILY_TRANSACTIONS'] ||
                    report['title'] === reportNames['DAILY_PAYMENTS'] ) {
                var chargeGroup = angular.copy( report['sort_fields'][1] ),
                    chargeCode  = angular.copy( report['sort_fields'][0] ),
                    revenue     = angular.copy( report['sort_fields'][3] ),
                    mtd         = angular.copy( report['sort_fields'][2] ),
                    ytd         = angular.copy( report['sort_fields'][4] );

                report['sort_fields'][0] = chargeGroup;
                report['sort_fields'][1] = chargeCode;
                report['sort_fields'][2] = null;
                report['sort_fields'][3] = revenue;
                report['sort_fields'][4] = null;
                report['sort_fields'][5] = null;
                report['sort_fields'][6] = mtd;
                report['sort_fields'][7] = null;
                report['sort_fields'][8] = null;
                report['sort_fields'][9] = ytd;
            };

            // need to reorder the sort_by options
            // for rate adjustment report in the following order
            if ( report['title'] === reportNames['RATE_ADJUSTMENTS_REPORT'] ) {
                var date      = angular.copy( report['sort_fields'][1] ),
                    guestUser = angular.copy( report['sort_fields'][0] ),
                    user      = angular.copy( report['sort_fields'][2] );

                report['sort_fields'][0] = guestUser;
                report['sort_fields'][1] = date;
                report['sort_fields'][2] = null;
                report['sort_fields'][3] = null;
                report['sort_fields'][4] = null;
                report['sort_fields'][5] = null;
                report['sort_fields'][6] = user;
            };

            // need to reorder the sort_by options
            // for group pick report in the following order
            if ( report['title'] === reportNames['GROUP_PICKUP_REPORT'] ) {
                var groupName  = angular.copy( report['sort_fields'][1] ),
                    date       = angular.copy( report['sort_fields'][0] ),
                    holdStatus = angular.copy( report['sort_fields'][2] );

                report['sort_fields'][0] = groupName;
                report['sort_fields'][1] = date;
                report['sort_fields'][2] = holdStatus;
                report['sort_fields'][3] = null;
                report['sort_fields'][4] = null;
                report['sort_fields'][5] = null;
                report['sort_fields'][6] = null;
                report['sort_fields'][7] = null;
                report['sort_fields'][8] = null;
            };

            // need to reorder the sort_by options
            // for guest balance report in the following order
            if ( report['title'] === reportNames['GUEST_BALANCE_REPORT'] ) {
                var balance = angular.copy( _.find(report['sort_fields'], { 'value': 'BALANCE' }) ),
                    name    = angular.copy( _.find(report['sort_fields'], { 'value': 'NAME' }) ),
                    room    = angular.copy( _.find(report['sort_fields'], { 'value': 'ROOM_NO' }) );

                report['sort_fields'][0] = name;
                report['sort_fields'][1] = room;
                report['sort_fields'][2] = null;
                report['sort_fields'][3] = null;
                report['sort_fields'][4] = balance;
            };
        };





        // to process the report sort by
        factory.processSortBy = function ( report ) {

            // sort by options - include sort direction
            if ( report['sort_fields'] && report['sort_fields'].length ) {
                _.each(report['sort_fields'], function(item, index, list) {

                    if ( !! item ) {
                        item['sortDir'] = undefined;
                    };

                });

                // adding custom name ref for easy access
                report['sortByOptions'] = report['sort_fields'];

                // making sort by room type default
                if ( report['title'] === reportNames['DAILY_PRODUCTION'] ) {
                    report['sort_fields'][3]['sortDir'] = true;
                    report['chosenSortBy'] = report['sort_fields'][3]['value'];
                };
            };
        };





        // to assign inital date values for this report
        factory.initDateValues = function ( report ) {
            var _getDates = factory.processDate();

            switch ( report['title'] ) {

                // dates range must be the current business date
                case reportNames['ARRIVAL']:
                case reportNames['DEPARTURE']:
                    report['fromDate']  = _getDates.businessDate;
                    report['untilDate'] = _getDates.businessDate;
                    break;

                // arrival date range must be from business date to a week after
                // deposit date range must the current business date
                case reportNames['DEPOSIT_REPORT']:
                    report['fromArrivalDate']  = _getDates.businessDate;
                    report['untilArrivalDate'] = _getDates.aWeekAfter;
                    /**/
                    report['fromDepositDate']  = _getDates.businessDate;
                    report['untilDepositDate'] = _getDates.businessDate;
                    /**/
                    report['fromPaidDate']  = _getDates.businessDate;
                    report['untilPaidDate'] = _getDates.businessDate;
                    break;

                // arrival date range must be from business date to a week after
                // deposit date range must the current business date
                case reportNames['GROUP_DEPOSIT_REPORT']:
                    report['groupStartDate']  = _getDates.businessDate;
                    report['groupEndDate'] = _getDates.twentyEightDaysAfter;
                    /**/
                    /*report['fromDepositDate']  = _getDates.businessDate;
                    report['untilDepositDate'] = _getDates.businessDate;*/
                    /**/
                    report['fromPaidDate']  = _getDates.twentyEightDaysBefore;
                    report['untilPaidDate'] = _getDates.businessDate;
                    break;

                // date range must be yesterday - relative to current business date
                case reportNames['OCCUPANCY_REVENUE_SUMMARY']:
                    report['fromDate']  = _getDates.yesterday;
                    report['untilDate'] = _getDates.yesterday;
                    break;

                // date range must be yesterday - relative to current business date
                case reportNames['DAILY_TRANSACTIONS']:
                case reportNames['DAILY_PAYMENTS']:
                case reportNames['MARKET_SEGMENT_STAT_REPORT']:
                case reportNames['COMPARISION_BY_DATE']:
                    report['singleValueDate']  = _getDates.yesterday;
                    break;

                // dates range must be the current business date
                case reportNames['FORECAST_BY_DATE']:
                case reportNames['FORECAST_GUEST_GROUPS']:
                    report['fromDate']  = _getDates.businessDate;
                    report['untilDate'] = _getDates.aMonthAfter;
                    break;

                case reportNames['ADDON_FORECAST']:
                    report['fromDate']  = _getDates.businessDate;
                    report['untilDate'] = _getDates.businessDate;
                    break;

                case reportNames['DAILY_PRODUCTION']:
                    report['fromDate']  = _getDates.monthStart;
                    report['untilDate'] = _getDates.businessDate;
                    break;

                // by default date range must be from a week ago to current business date
                default:
                    report['fromDate']            = _getDates.aWeekAgo;
                    report['fromCancelDate']      = _getDates.aWeekAgo;
                    report['fromArrivalDate']     = _getDates.aWeekAgo;
                    report['fromCreateDate']      = _getDates.aWeekAgo;
                    report['fromAdjustmentDate']  = _getDates.aWeekAgo;
                    /**/
                    report['untilDate']            = _getDates.businessDate;
                    report['untilCancelDate']      = _getDates.businessDate;
                    report['untilArrivalDate']     = _getDates.businessDate;
                    report['untilCreateDate']      = _getDates.businessDate;
                    report['untilAdjustmentDate']  = _getDates.businessDate;
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
                'tomorrow'     : new Date(_year, _month, _date + 1),
                'aWeekAgo'     : new Date(_year, _month, _date - 7),
                'aWeekAfter'   : new Date(_year, _month, _date + 7),
                'aMonthAfter'  : new Date(_year, _month, _date + 30),
                'monthStart'   : new Date(_year, _month, 1),
                'twentyEightDaysBefore': new Date(_year, _month, _date - 28),
                'twentyEightDaysAfter' : new Date(_year, _month, _date + 28),
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
