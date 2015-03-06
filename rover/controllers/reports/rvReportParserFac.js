sntRover.factory('RVReportParserFac', [
    '$rootScope',
    '$filter',
    '$timeout',
    'RVReportUtilsFac',
    function($rootScope, $filter, $timeout, reportUtils) {
        var factory = {};






        factory.parseAPI = function ( apiResponse, reportName, isGroupedBy ) {
            if ( isGroupedBy ) {
                return $_parseDataToSubArrays( apiResponse, reportName );
            } else {
                return $_parseDataToInfo( apiResponse, reportName );
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






        function $_parseDataToInfo ( apiResponse, reportName ) {
            var retResult  = [],
                itemCopy   = {},
                customData = [],
                guestData  = {},
                noteData   = {},
                cancelData = {};

            var i, j;

            var checkGuest = function(item) {
				var guests = !!item['accompanying_names'] && !!item['accompanying_names'].length;
				var compTravelGrp = !!item['company_name'] || !!item['travel_agent_name'] || !!item['group_name'];
				return guests || compTravelGrp ? true : false;
			};

			var checkNote = function(item) {
				return !!item['notes'] && !!item['notes'].length;
			};

			var excludeReports = function(names) {
				return !!_.find(names, function(n) {
					return n == reportName;
				});
			};

			var checkCancel = function(item) {
				return excludeReports([reportUtils.getName('ARRIVAL'), reportUtils.getName('IN_HOUSE_GUEST')]) ? !!item['cancel_reason'] : false;
			};

            if ( $_isForGenericReports(reportName) ) {
				for (i = 0, j = apiResponse.length; i < j; i++) {
					itemCopy   = angular.copy( apiResponse[i] );
					customData = [];
					guestData  = {};
					noteData   = {};
					cancelData = {};

					if ( checkGuest(itemCopy) ) {
						guestData = {
							isGuestData : true,
							guestNames  : angular.copy( itemCopy['accompanying_names'] ),

							company_name      : itemCopy.company_name,
							travel_agent_name : itemCopy.travel_agent_name,
							group_name        : itemCopy.group_name,

							addOns : angular.copy( itemCopy['add_ons'] )
						};
						customData.push( guestData );
					};

					if ( checkCancel(itemCopy) ) {
						cancelData = {
							isCancelData : true,
							reason       : angular.copy( itemCopy['cancel_reason'] )
						};
						customData.push( cancelData );
					};

					if ( checkNote(itemCopy) ) {
						noteData = {
							isNoteData : true,
							notes      : angular.copy( itemCopy['notes'] )
						};
						customData.push( noteData );
					};

					// IF: we found custom items
						// set row span for the parent tr a rowspan
						// mark the class that must be added to the last tr
					// ELSE: since this tr won't have any childs, mark the class that must be added to the last tr
					if ( !!customData.length ) {
						itemCopy.rowspan = customData.length + 1;
						customData[customData.length - 1]['trCls'] = 'row-break';
					} else {
						itemCopy.trCls = 'row-break';
					};

					// do this only after the above code that adds
					// 'row-break' class to the row
					if ( reportName == reportUtils.getName('LOGIN_AND_OUT_ACTIVITY') ) {
						if ( itemCopy.hasOwnProperty('action_type') && itemCopy['action_type'] == 'INVALID_LOGIN' ) {
							itemCopy['action_type'] = 'INVALID LOGIN';
							itemCopy.trCls = 'row-break invalid';
						};

						if ( itemCopy.hasOwnProperty('date') ) {
							itemCopy['uiDate'] = itemCopy['date'].split( ', ' )[0];
							itemCopy['uiTime'] = itemCopy['date'].split( ', ' )[1];
						};
					};


					// push 'itemCopy' into 'retResult'
					itemCopy.isReport = true;
					retResult.push( itemCopy );

					// push each item in 'customData' in to 'retResult'
					for (m = 0, n = customData.length; m < n; m++) {
						retResult.push( customData[m] );
					};
				};

                // dont remove yet
                console.log( 'API reponse changed as follows: ');
                console.log( retResult );
            };

            // dont remove yet
            console.log( 'No API changes applied' );

            return retResult;
        };





        function $_parseDataToSubArrays ( apiResponse, reportName ) {
            /****
            * OUR AIM: is to transform the api response to this format
            * [
            *	[{}, {}, {}, {}],
            *	[{}, {}, {}, {}],
            *	[{}, {}, {}, {}],
            * ]
            * lets call the outer array as 'endArray' and inner arrays as 'interMedArray'
            * the secondary parser will parse each inner array and will show up as multiple
            * tables on the UI
            **/

            var returnObj         = {};
            var interMedArray     = [];
            var groupByKey        = 'guest_name';
            var currentGroupByVal = '';
            var makeCopy          = {};
            var eachKey           = '';

            // loop through the api response
            for (i = 0, j = apiResponse.length; i < j; i++) {

                // make a copy of the ith object
                makeCopy = angular.copy( apiResponse[i] );

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

            _.each(returnObj, function (value, key, list) {
                returnObj[key] = angular.copy( $_parseDataToInfo(value, reportName) );
            });

            console.log( returnObj );

            return returnObj;
        };






        return factory;
    }
]);
