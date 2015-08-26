sntRover.factory('RVReportParserFac', [
    '$rootScope',
    '$filter',
    '$timeout',
    'RVReportNamesConst',
    function($rootScope, $filter, $timeout, reportNames) {
        var factory = {};






        factory.parseAPI = function ( reportName, apiResponse, options ) {

            // a very special parser for daily transaction report
            // in future we may make this check generic, if more
            // reports API structure follows the same pattern
            if ( reportName === reportNames['DAILY_TRANSACTIONS'] || reportName === reportNames['DAILY_PAYMENTS'] ) {
                return _.isEmpty(apiResponse) ? apiResponse : $_parseNumeralData( reportName, apiResponse, options );
            }

            // a very special parser for daily transaction report
            // in future we may make this check generic, if more
            // reports API structure follows the same pattern
            else if ( reportName == reportNames['RATE_ADJUSTMENTS_REPORT'] ) {
                return _.isEmpty(apiResponse) ? apiResponse : $_parseRateAdjustments( reportName, apiResponse, options );
            }

            else if ( reportName == reportNames['GROUP_PICKUP_REPORT'] ) {
                return _.isEmpty(apiResponse) ? apiResponse : $_parseGroupPickupReport( reportName, apiResponse, options );
            }

            // a very special parser for deposit report
            else if ( reportName === reportNames['DEPOSIT_REPORT'] ) {
                return _.isEmpty(apiResponse) ? apiResponse : $_parseDepositReport( reportName, apiResponse, options );
            }

            // otherwise a super parser for reports that can be grouped by
            else if ( !!options['groupedByKey'] ) {
                return _.isEmpty(apiResponse) ? apiResponse : $_parseDataToSubArrays( reportName, apiResponse, options );
            }

            // a common parser that data into meaningful info like - notes, guests, addons, compTAgrp
            // this can be reused by the parsers defined above
            else {
                return _.isEmpty(apiResponse) ? apiResponse : $_parseDataToInfo( reportName, apiResponse, options );
            };
        };






        function $_isForGenericReports( name ) {
            return ( name === reportNames['ARRIVAL'] ||
                    name === reportNames['IN_HOUSE_GUEST'] ||
                    name === reportNames['CANCELLATION_NO_SHOW'] ||
                    name === reportNames['DEPARTURE'] ||
                    name === reportNames['LOGIN_AND_OUT_ACTIVITY'] ||
                    name === reportNames['RESERVATIONS_BY_USER'] ) ? true : false;
        };






        function $_parseDataToInfo ( reportName, apiResponse, options ) {
            var returnAry  = [],
                makeCopy   = {},
                customData = [],
                guestData  = {},
                noteData   = {},
                cancelData = {},
                adjustData = [],
                options    = options;

            var i, j;

            var excludeReports = function(names) {
                return !!_.find(names, function(n) {
                    return n === reportName;
                });
            };

            var checkGuest = function(item) {
                var check = !!options['checkGuest'] && !!item['accompanying_names'] && !!item['accompanying_names'].length;
                return check;
            };

            var checkCompTrvlGrp = function(item) {
                var check = !!item['company_name'] || !!item['travel_agent_name'] || !!item['group_name'];
                return check;
            };

            var checkAddOns = function(item) {
                var check = (!!item['add_ons'] && !!item['add_ons'].length) || !!item['addon_details'];
                return check;
            };

            var checkNote = function(item) {
                var check = !!options['checkNote'] && !!item['notes'] && !!item['notes'].length;
                return check;
            };

            var checkCancel = function(item) {
                var check = !!options['checkCancel'] && excludeReports( [reportNames['ARRIVAL'], reportNames['IN_HOUSE_GUEST']] );
                return check ? !!item['cancel_reason'] : false;
            };

            var checkRateAdjust = function(item) {
                var check = !!options['checkRateAdjust'] && !!item['rate_adjustment_reasons'] && !!item['rate_adjustment_reasons'].length;
                return check;
            };

            if ( $_isForGenericReports(reportName) ) {
                for (i = 0, j = apiResponse.length; i < j; i++) {
                    makeCopy   = angular.copy( apiResponse[i] );
                    customData = [];
                    guestData  = {};
                    noteData   = {};
                    cancelData = {};
                    adjustData = [];

                    if ( checkGuest(makeCopy) ) {
                        angular.extend(guestData, {
                            isGuestData : true,
                            guestNames  : angular.copy( makeCopy['accompanying_names'] )
                        });
                    };

                    if ( checkCompTrvlGrp(makeCopy) ) {
                        angular.extend(guestData, {
                            isGuestData       : true,
                            company_name      : makeCopy.company_name,
                            travel_agent_name : makeCopy.travel_agent_name,
                            group_name        : makeCopy.group_name
                        });
                    };

                    if ( checkAddOns(makeCopy) ) {
                        angular.extend(guestData, {
                            isGuestData  : true,
                            addOns       : angular.copy( makeCopy['add_ons'] ),
                            addOnDetails : angular.copy( makeCopy['addon_details'] )
                        });
                    };

                    if ( _.size(guestData) ) {
                        customData.push( guestData );
                    };



                    if ( checkCancel(makeCopy) ) {
                        cancelData = {
                            isCancelData : true,
                            reason       : angular.copy( makeCopy['cancel_reason'] )
                        };
                        customData.push( cancelData );
                    };


                    if ( checkNote(makeCopy) ) {
                        noteData = {
                            isNoteData : true,
                            notes      : angular.copy( makeCopy['notes'] )
                        };
                        customData.push( noteData );
                    };


                    if ( checkRateAdjust(makeCopy) ) {
                        adjustData = {
                            isAdjustData : true,
                            reasons      : angular.copy( makeCopy['rate_adjustment_reasons'] )
                        };
                        customData.push( adjustData );
                    };

                    // IF: we found custom items
                        // set row span for the parent tr a rowspan
                        // mark the class that must be added to the last tr
                    // ELSE: since this tr won't have any childs, mark the class that must be added to the last tr
                    if ( !!customData.length ) {
                        makeCopy.rowspan = customData.length + 1;
                        customData[customData.length - 1]['className'] = 'row-break';
                    } else {
                        makeCopy.className = 'row-break';
                    };

                    // do this only after the above code that adds
                    // 'row-break' class to the row
                    if ( reportName === reportNames['LOGIN_AND_OUT_ACTIVITY'] ) {
                        if ( makeCopy.hasOwnProperty('action_type') && makeCopy['action_type'] === 'INVALID_LOGIN' ) {
                            makeCopy['action_type'] = 'INVALID LOGIN';
                            makeCopy.className = 'row-break invalid';
                        };

                        if ( makeCopy.hasOwnProperty('date') ) {
                            makeCopy['uiDate'] = makeCopy['date'].split( ', ' )[0];
                            makeCopy['uiTime'] = makeCopy['date'].split( ', ' )[1];
                        };
                    };


                    // push 'makeCopy' into 'returnAry'
                    makeCopy.isReport = true;
                    returnAry.push( makeCopy );

                    // push each item in 'customData' in to 'returnAry'
                    for (m = 0, n = customData.length; m < n; m++) {
                        returnAry.push( customData[m] );
                    };
                };

                // dont remove yet
            } else {
                returnAry = apiResponse;
                // dont remove yet
            };

            return returnAry;
        };





        function $_parseDataToSubArrays ( reportName, apiResponse, options ) {
            /****
            * OUR AIM: is to transform the api response to this format
            * [
            *   [{}, {}, {}, {}],
            *   [{}, {}, {}, {}],
            *   [{}, {}, {}, {}],
            * ]
            * lets call the outer array as 'endArray' and inner arrays as 'interMedArray'
            * the secondary parser will parse each inner array and will show up as multiple
            * tables on the UI
            **/

            var returnObj         = {};
            var interMedArray     = [];
            var groupByKey        = options['groupedByKey'];
            var currentGroupByVal = '';
            var makeCopy          = {};

            var i, j;

            // loop through the api response
            for (i = 0, j = apiResponse.length; i < j; i++) {

                // make a copy of the ith object
                makeCopy = angular.copy( apiResponse[i] );

                // catching cases where the value is "" due to old data
                if ( makeCopy[groupByKey] === '' ) {
                    makeCopy[groupByKey] = 'UNDEFINED';
                };

                // if the group by key value has changed
                if ( makeCopy[groupByKey] !== currentGroupByVal ) {

                    // insert the intermediate array to the returnObj
                    if ( interMedArray.length ) {
                        returnObj[currentGroupByVal] = angular.copy(interMedArray);
                    };

                    // save the new value
                    currentGroupByVal = makeCopy[groupByKey];

                    // init a new intermediate array and start filling from that
                    interMedArray = [];
                    interMedArray.push( makeCopy );
                } else {

                    // the group by key value has not changed yet
                    // keep pushing into the current intermediate array
                    interMedArray.push( makeCopy );
                };
            };

            // if all the 'groupByKey' values are the same
            // no entries had been inserted into 'returnObj'
            // if so, let push them here
            if ( _.size(returnObj) === 0 ) {
                currentGroupByVal = makeCopy[groupByKey];
                returnObj[currentGroupByVal] = angular.copy(interMedArray);
            };


            _.each(returnObj, function (value, key, list) {
                returnObj[key] = angular.copy( $_parseDataToInfo(reportName, value, options) );
            });


            return returnObj;
        };





        function $_parseNumeralData ( reportName, apiResponse, options ) {
            var returnAry = [],
                makeCopy = {},
                objKeyName = '',
                chargeGrpObj = {},
                itemCopy = {};

            var i, j, key, k, l;

            for (i = 0, j = apiResponse.length; i < j; i++) {

                makeCopy = angular.copy( apiResponse[i] );
                objKeyName = key;

                for (key in makeCopy) {
                    if ( !makeCopy.hasOwnProperty(key) || key === '0' || key === 0 ) {
                        continue;
                    };
                    objKeyName = key;
                    chargeGrpObj = makeCopy[key];
                };

                // loop through the "details" in api response
                if ( chargeGrpObj['details'].length ) {
                    for (k = 0, l = chargeGrpObj['details'].length; k < l; k++) {
                        itemCopy = angular.copy( chargeGrpObj['details'][k] );

                        if ( k === 0) {
                            itemCopy.chargeGroupName = objKeyName;
                            itemCopy.rowspan = l + 1;  // which is chargeGrpObj['details'].length
                        };

                        itemCopy.isReport = true;

                        returnAry.push( itemCopy );
                    };
                }
                // if there are no entries in "details", we need to fill 'NA'
                else {
                    itemCopy = {};

                    itemCopy.chargeGroupName = objKeyName;
                    itemCopy.rowspan = 2;
                    itemCopy.isReport = true;

                    returnAry.push( itemCopy );
                };

                // next insert "sub_total" from api response to retrunAry
                chargeGrpObj['sub_total']['isReportSubTotal'] = true;
                chargeGrpObj['sub_total']['chargeGroupName']  = objKeyName;
                chargeGrpObj['sub_total']['className']        = 'row-break';
                returnAry.push( chargeGrpObj['sub_total'] );
            };

            return returnAry;
        };




        function $_parseRateAdjustments ( reportName, apiResponse, options ) {
            var returnAry = [],
                customData = [],
                makeCopy,
                stayDates,
                stayDatesTotal;

            var i, j, k, l;

            // loop through the api response
            for (i = 0, j = apiResponse.length; i < j; i++) {

                // we'll work with a copy of the ith item
                makeCopy = angular.copy( apiResponse[i] );

                // if we have 'stay_dates' for this reservation
                if ( makeCopy.hasOwnProperty('stay_dates') && makeCopy['stay_dates'].length ) {
                    for (k = 0, l = makeCopy['stay_dates'].length; k < l; k++) {
                        stayDates = makeCopy['stay_dates'][k];

                        // include the first stayDates details in the
                        // same row as that of the main reservation details
                        if ( k === 0 ) {
                            angular.extend(makeCopy, {
                                'isReport'        : true,
                                'rowspan'         : l + 1,
                                'stay_date'       : stayDates.stay_date,
                                'original_amount' : stayDates.original_amount,
                                'adjusted_amount' : stayDates.adjusted_amount,
                                'variance'        : stayDates.variance,
                                'reason'          : stayDates.reason,
                                'adjusted_by'     : stayDates.adjusted_by
                            });
                            returnAry.push( makeCopy );
                        }

                        // create additional sub rows to represent the
                        // rest of the stay_dates
                        else {
                            customData = {};
                            angular.extend(customData, {
                                'isSubReport'     : true,
                                'stay_date'       : stayDates.stay_date,
                                'original_amount' : stayDates.original_amount,
                                'adjusted_amount' : stayDates.adjusted_amount,
                                'variance'        : stayDates.variance,
                                'reason'          : stayDates.reason,
                                'adjusted_by'     : stayDates.adjusted_by
                            });
                            returnAry.push( customData );
                        };
                    };
                } else {
                    returnAry.push( makeCopy );
                };

                // if we have 'stay_dates_total' for this reservation
                if ( makeCopy.hasOwnProperty('stay_dates_total') && makeCopy['stay_dates_total'].hasOwnProperty('original_amount') ) {
                    stayDatesTotal = makeCopy['stay_dates_total'];
                    customData = {};

                    angular.extend(customData, {
                        'isSubTotal'      : true,
                        'className'       : 'row-break',
                        'original_amount' : stayDatesTotal.original_amount,
                        'adjusted_amount' : stayDatesTotal.adjusted_amount,
                        'variance'        : stayDatesTotal.variance
                    });
                    returnAry.push( customData );
                } else {
                    returnAry.push( makeCopy );
                };
            };

            return returnAry;
        };



        function $_parseGroupPickupReport ( reportName, apiResponse, options ) {
            var returnAry = [],
                customData = [],
                makeCopy,
                groupData,
                groupDataTotal;

            var i, j, k, l;

            // loop through the api response
            for (i = 0, j = apiResponse.length; i < j; i++) {

                // we'll work with a copy of the ith item
                makeCopy = angular.copy( apiResponse[i] );

                // if we have 'group_data' for this group
                if ( makeCopy.hasOwnProperty('group_data') && makeCopy['group_data'].length ) {
                    for ( k = 0, l = makeCopy['group_data'].length; k < l; k++ ) {
                        groupData = makeCopy['group_data'][k];

                        // include the first groupData details in the
                        // same row as that of the main group details
                        if ( k === 0 ) {
                            angular.extend(makeCopy, {
                                'isReport'              : true,
                                'rowspan'               : l + 1,
                                'date'                  : groupData.date,
                                'hold_status'           : groupData.hold_status,
                                'room_type'             : groupData.room_type,
                                'rooms_available'       : groupData.rooms_available,
                                'rooms_held_non_deduct' : groupData.rooms_held_non_deduct,
                                'rooms_held_deduct'     : groupData.rooms_held_deduct,
                                'rooms_held_picked_up'  : groupData.rooms_held_picked_up,
                                'pickup_percentage'     : groupData.pickup_percentage,
                            });
                            returnAry.push( makeCopy );
                        }

                        // create additional sub rows to represent the
                        // rest of the stay_dates
                        else {
                            customData = {};
                            angular.extend(customData, {
                                'isSubReport'           : true,
                                'date'                  : groupData.date,
                                'hold_status'           : groupData.hold_status,
                                'room_type'             : groupData.room_type,
                                'rooms_available'       : groupData.rooms_available,
                                'rooms_held_non_deduct' : groupData.rooms_held_non_deduct,
                                'rooms_held_deduct'     : groupData.rooms_held_deduct,
                                'rooms_held_picked_up'  : groupData.rooms_held_picked_up,
                                'pickup_percentage'     : groupData.pickup_percentage,
                            });
                            returnAry.push( customData );
                        };
                    };
                } else {
                    returnAry.push( makeCopy );
                };

                // if we have 'group_total' for this group
                if ( makeCopy.hasOwnProperty('group_total') && makeCopy['group_total'].hasOwnProperty('rooms_available') ) {
                    groupDataTotal = makeCopy['group_total'];
                    customData = {};

                    angular.extend(customData, {
                        'isSubTotal'            : true,
                        'className'             : 'row-break',
                        'rooms_available'       : groupDataTotal.rooms_available,
                        'rooms_held_non_deduct' : groupDataTotal.rooms_held_non_deduct,
                        'rooms_held_deduct'     : groupDataTotal.rooms_held_deduct,
                        'rooms_held_picked_up'  : groupDataTotal.rooms_held_picked_up,
                        'pickup_percentage'     : groupDataTotal.pickup_percentage,
                    });
                    returnAry.push( customData );
                } else {
                    returnAry.push( makeCopy );
                };
            };

            console.log(returnAry);

            return returnAry;
        };



        function $_parseDepositReport ( reportName, apiResponse, options ) {
            var returnAry  = [],
                customData = [],
                makeCopy,
                depositData,
                depositTotals;

            var i, j, k, l;

            // loop through the api response
            for (i = 0, j = apiResponse.length; i < j; i++) {

                // we'll work with a copy of the ith item
                makeCopy = angular.copy( apiResponse[i] );

                // if we have 'deposit_data' for this reservation
                if ( makeCopy.hasOwnProperty('deposit_data') && makeCopy['deposit_data'].length ) {

                    // loop through the 'deposit_data'
                    for (k = 0, l = makeCopy['deposit_data'].length; k < l; k++) {
                        depositData = makeCopy['deposit_data'][k];

                        // include the first depositData details in the
                        // same row as that of the main reservation details
                        if ( k === 0 ) {
                            angular.extend(makeCopy, {
                                'isReport'               : true,
                                'rowspan'                : l + 1,
                                'deposit_payment_status' : depositData.deposit_payment_status,
                                'due_date'               : depositData.due_date,
                                'deposit_due_amount'     : depositData.deposit_due_amount,
                                'paid_date'              : depositData.paid_date,
                                'paid_amount'            : depositData.paid_amount
                            });
                            returnAry.push( makeCopy );
                        }

                        // create additional sub rows to represent the
                        // rest of the 'deposit_data'
                        else {
                            customData = {};
                            angular.extend(customData, {
                                'isSubReport'            : true,
                                'deposit_payment_status' : depositData.deposit_payment_status,
                                'due_date'               : depositData.due_date,
                                'deposit_due_amount'     : depositData.deposit_due_amount,
                                'paid_date'              : depositData.paid_date,
                                'paid_amount'            : depositData.paid_amount
                            });
                            returnAry.push( customData );
                        };
                    };

                    // if this is the last loop
                    if ( makeCopy.hasOwnProperty('deposit_totals') && ! _.isEmpty(makeCopy['deposit_totals']) ) {
                        depositTotals = makeCopy['deposit_totals'];

                        customData = {};
                        angular.extend(customData, {
                            'isSubTotal'         : true,
                            'className'          : 'row-break',
                            'deposit_due_amount' : depositTotals.deposit_due_amount,
                            'paid_amount'        : depositTotals.paid_amount
                        });
                        returnAry.push( customData );
                    }
                };

            };

            return returnAry;
        };



        /**
         * THIS IS DEPRICATED!!!
         * KEEPING HERE FOR ANY FUTURE NEEDS
         */
        /**
         * We have to convert an array of objects 'apiResponse'
         * into a grouped by 'adjust_by' key-value pairs.
         *
         * Each key will be the 'adjust_by' username and its value
         * will be an array of objects. Each object will represent
         * an reservation (unique key 'confirmation_no')
         *
         * @param {Array} apiResponse [{}, {}, {}, {}, {}]
         * @return {Object} =>        { us1: [{}, {}, {}], us2: [{}, {}], us3: [{}] }
         */
        function $_preParseGroupedRateAdjustments ( reportName, apiResponse, options ) {

            /**
             * THIS IS DEPRICATED!!!
             * KEEPING HERE FOR ANY FUTURE NEEDS
             */

            var makeCopy,
                withOutStay,
                usersInThisRes;

            var kth,
                userId,
                userNa,
                uid,
                keyId;

            var tempObj   = {},
                returnObj = {};

            var i, j, k, l;

            for( i = 0, j = apiResponse.length; i < j; i++ ) {

                // create a copy of ith apiResponse
                makeCopy = angular.copy( apiResponse[i] );

                // copy the reservation details and an empty 'stay_dates' array
                withOutStay = angular.copy({
                    'guest_name'      : makeCopy.guest_name,
                    'confirmation_no' : makeCopy.confirmation_no,
                    'arrival_date'    : makeCopy.arrival_date,
                    'departure_date'  : makeCopy.departure_date,
                    'stay_dates'      : []
                });

                // loop and generate an object
                // representing (same) reservation with
                // only that user, so a set of that will be
                // an object of objects
                usersInThisRes = {};
                for( k = 0, l = makeCopy['stay_dates'].length; k < l; k++ ) {
                    kth = makeCopy['stay_dates'][k];
                    userId = kth['adjusted_user_id'] || 'Unknown';
                    userNa = kth['adjusted_by'] || 'Unknown';

                    // create a very unique 'uid', we'll remove 'userId' from it later
                    uid = userId + '__' + userNa;

                    if ( usersInThisRes[uid] === undefined ) {
                        usersInThisRes[uid] = angular.copy( withOutStay );
                    };

                    // for each user just push only its associate 'stay_dates' changes
                    usersInThisRes[uid]['stay_dates'].push( kth );
                };

                // inset the just found reservation
                // each with only details of 'stay_dates'
                // changes of just one user, into a 'tempObj'
                for( keyId in usersInThisRes ) {
                    if ( ! usersInThisRes.hasOwnProperty(keyId) ) {
                        continue;
                    };

                    if ( tempObj[keyId] === undefined ) {
                        tempObj[keyId] = [];
                    };

                    tempObj[keyId].push( usersInThisRes[keyId] );
                };
            };

            // now that all the data has been grouped
            // we need to remove the 'adjusted_user_id'
            // part from 'uid', and have the 'returnObj' in that format
            returnObj = {};
            for( keyId in tempObj ) {
                if ( ! tempObj.hasOwnProperty(keyId) ) {
                    continue;
                };

                // only take the user name part
                onlyUserNa = keyId.split('__')[1];

                // oh, also we will parse each entry to nG repeat format
                returnObj[onlyUserNa] = $_parseRateAdjustments( reportName, tempObj[keyId], options );
            };

            return returnObj;
        };



        return factory;
    }
]);
