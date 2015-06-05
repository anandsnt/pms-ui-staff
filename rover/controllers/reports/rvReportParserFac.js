sntRover.factory('RVReportParserFac', [
    '$rootScope',
    '$filter',
    '$timeout',
    'RVReportUtilsFac',
    function($rootScope, $filter, $timeout, reportUtils) {
        var factory = {};






        factory.parseAPI = function ( reportName, apiResponse, options ) {

            // a very special parser for daily transaction report
            // in future we may make this check generic, if more
            // reports API structure follows the same pattern
            if ( reportName == reportUtils.getName('DAILY_TRANSACTIONS') ||
                    reportName == reportUtils.getName('DAILY_PAYMENTS')) {
                return _.isEmpty(apiResponse) ? apiResponse : $_parseNumeralData( reportName, apiResponse, options );
            }

            // otherwise a super parser for reports that can be grouped by
            else if ( !!options['groupedByKey'] ) {
                return _.isEmpty(apiResponse) ? apiResponse : $_parseDataToSubArrays( reportName, apiResponse, options['groupedByKey'] );
            }

            // a common parser that data into meaningful info like - notes, guests, addons, compTAgrp
            // this can be reused by the parsers defined above
            else {
                return _.isEmpty(apiResponse) ? apiResponse : $_parseDataToInfo( reportName, apiResponse, options );
            };
        };






        function $_isForGenericReports( name ) {
            return (name == reportUtils.getName('ARRIVAL') ||
                    name == reportUtils.getName('IN_HOUSE_GUEST') ||
                    name == reportUtils.getName('CANCELLATION_NO_SHOW') ||
                    name == reportUtils.getName('DEPARTURE') ||
                    name == reportUtils.getName('LOGIN_AND_OUT_ACTIVITY') ||
                    name == reportUtils.getName('RESERVATIONS_BY_USER')) ? true : false;
        };






        function $_parseDataToInfo ( reportName, apiResponse, options ) {
            var returnAry  = [],
                makeCopy   = {},
                customData = [],
                guestData  = {},
                noteData   = {},
                cancelData = {},
                options    = options;

            var i, j;

            var checkGuest = function(item) {
                if ( !options['checkGuest'] ) {
                    return false;
                };

                var guests = !!item['accompanying_names'] && !!item['accompanying_names'].length;
                var compTravelGrp = !!item['company_name'] || !!item['travel_agent_name'] || !!item['group_name'];
                return guests || compTravelGrp ? true : false;
            };

            var checkNote = function(item) {
                if ( !options['checkNote'] ) {
                    return false;
                };

                return !!item['notes'] && !!item['notes'].length;
            };

            var excludeReports = function(names) {
                return !!_.find(names, function(n) {
                    return n == reportName;
                });
            };

            var checkCancel = function(item) {
                if ( !options['checkCancel'] ) {
                    return false;
                };

                return excludeReports([reportUtils.getName('ARRIVAL'), reportUtils.getName('IN_HOUSE_GUEST')]) ? !!item['cancel_reason'] : false;
            };

            if ( $_isForGenericReports(reportName) ) {
                for (i = 0, j = apiResponse.length; i < j; i++) {
                    makeCopy   = angular.copy( apiResponse[i] );
                    customData = [];
                    guestData  = {};
                    noteData   = {};
                    cancelData = {};

                    if ( checkGuest(makeCopy) ) {
                        guestData = {
                            isGuestData : true,
                            guestNames  : angular.copy( makeCopy['accompanying_names'] ),

                            company_name      : makeCopy.company_name,
                            travel_agent_name : makeCopy.travel_agent_name,
                            group_name        : makeCopy.group_name,

                            addOns       : angular.copy( makeCopy['add_ons'] ),
                            addOnDetails : angular.copy( makeCopy['addon_details'] )
                        };
                        customData.push( guestData );
                    } else {
                        guestData = {
                            isGuestData : true,
                            addOnDetails : angular.copy( makeCopy['addon_details'] )
                        };
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

                    // IF: we found custom items
                        // set row span for the parent tr a rowspan
                        // mark the class that must be added to the last tr
                    // ELSE: since this tr won't have any childs, mark the class that must be added to the last tr
                    if ( !!customData.length ) {
                        makeCopy.rowspan = customData.length + 1;
                        customData[customData.length - 1]['trCls'] = 'row-break';
                    } else {
                        makeCopy.trCls = 'row-break';
                    };

                    // do this only after the above code that adds
                    // 'row-break' class to the row
                    if ( reportName == reportUtils.getName('LOGIN_AND_OUT_ACTIVITY') ) {
                        if ( makeCopy.hasOwnProperty('action_type') && makeCopy['action_type'] == 'INVALID_LOGIN' ) {
                            makeCopy['action_type'] = 'INVALID LOGIN';
                            makeCopy.trCls = 'row-break invalid';
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
                // console.log( 'API reponse changed as follows: ');
                // console.log( returnAry );
            } else {
                returnAry = apiResponse;

                // dont remove yet
                // console.log( 'No API changes applied' );
            };



            return returnAry;
        };





        function $_parseDataToSubArrays ( reportName, apiResponse, groupedByKey ) {
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
            var groupByKey        = groupedByKey;
            var currentGroupByVal = '';
            var makeCopy          = {};

            var i, j;

            // loop through the api response
            for (i = 0, j = apiResponse.length; i < j; i++) {

                // make a copy of the ith object
                makeCopy = angular.copy( apiResponse[i] );

                // catching cases where the value is "" due to old data
                if ( makeCopy[groupByKey] == '' ) {
                    makeCopy[groupByKey] = 'NA';
                };

                // if the group by key value has changed
                if ( makeCopy[groupByKey] != currentGroupByVal ) {

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
            if ( _.size(returnObj) == 0 ) {
                currentGroupByVal = makeCopy[groupByKey];
                returnObj[currentGroupByVal] = angular.copy(interMedArray);
            };


            _.each(returnObj, function (value, key, list) {
                returnObj[key] = angular.copy( $_parseDataToInfo(reportName, value) );
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

            // console.log( apiResponse );
            // return;

            for (i = 0, j = apiResponse.length; i < j; i++) {

                makeCopy = angular.copy( apiResponse[i] );
                objKeyName = key;

                for (key in makeCopy) {
                    if ( !makeCopy.hasOwnProperty(key) || key == '0' || key == 0 ) {
                        continue;
                    };
                    objKeyName = key;
                    chargeGrpObj = makeCopy[key];
                };

                // loop through the "details" in api response
                if ( chargeGrpObj['details'].length ) {
                    for (k = 0, l = chargeGrpObj['details'].length; k < l; k++) {
                        itemCopy = angular.copy( chargeGrpObj['details'][k] );

                        if ( k == 0) {
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
                chargeGrpObj['sub_total']['trCls']            = 'row-break';
                returnAry.push( chargeGrpObj['sub_total'] );
            };

            return returnAry;
        };






        return factory;
    }
]);
