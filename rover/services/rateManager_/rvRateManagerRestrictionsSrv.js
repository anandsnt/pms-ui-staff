angular.module('sntRover').service('rvRateManagerRestrictionsSrv', ['$q', 'BaseWebSrvV2', 'Toggles',
    function($q, BaseWebSrvV2, Toggles) {
    	
    	var service = this;

    	// Scope object that handles various hierarchy Restrictions feature toggle values.
        service.hierarchyRestrictions = {
            houseEnabled: Toggles.isEnabled('hierarchical_house_restrictions'),
            roomTypeEnabled: Toggles.isEnabled('hierarchical_room_type_restrictions'),
            rateTypeEnabled: Toggles.isEnabled('hierarchical_rate_type_restrictions')
        };

        // Mapping of restriction type and code.
        var restrictionCodeMapping = {
            'closed': [1, 'CLOSED'],
            'closed_arrival': [2, 'CLOSED_ARRIVAL'],
            'closed_departure': [3, 'CLOSED_DEPARTURE'],
            'min_length_of_stay': [4, 'MIN_STAY_LENGTH'],
            'max_length_of_stay': [5, 'MAX_STAY_LENGTH'],
            'min_stay_through': [6, 'MIN_STAY_THROUGH'],
            'min_advanced_booking': [7, 'MIN_ADV_BOOKING'],
            'max_advanced_booking': [8, 'MAX_ADV_BOOKING']
        };

        /*
         *  Method to process new restrcion data structure to convert into old structure.
         *  @param [Object] [input value as key value pair]
         *  @return [Array] [output - converted values into array structure]
         */
        service.processRestrictions = function( input ) {
            var output = [],
                key = '',
                value = '', 
                obj = {};

            for (key in input) {
                value = input[key],
                obj = {};

                if (typeof(value) === "boolean" && value) {
                    obj.status = 'on';
                    obj.restriction_type_id = restrictionCodeMapping[key][0];
                    obj.is_on_rate = false;
                    obj.days = null;
                    output.push(obj);
                }
                else if (typeof(value) === "number") {
                    obj.restriction_type_id = restrictionCodeMapping[key][0];
                    obj.days = value;
                    obj.is_on_rate = false;
                    output.push(obj);
                }
            }

            return output;
        };

        // Handle GET api while loading RM with various filters in House Level ( Frozen Panel).
        service.processCommonRestrictions = function( restrcionsList ) {
        	// CICO-76813 : New API for hierarchyRestrictions
            if (service.hierarchyRestrictions.houseEnabled) {
                _.each(restrcionsList, function( item ) {
                    item.restrictions = service.processRestrictions(item.restrictions);
                });
            }

            return restrcionsList;
        };

        // Handle GET api while loading RM with various filters in House Level ( Frozen Panel).
        service.getURLforCommonRestrictions = function() {
        	var url = '/api/daily_rates/all_restrictions';

            // CICO-76813 : New API for hierarchyRestrictions
            if (service.hierarchyRestrictions.houseEnabled) {
                url = '/api/restrictions/house';
            }
            return url;
        };

        // Handle GET api, for individual cell click & popup in House Level ( Frozen Panel).
        service.processCommonRestrictionsCell = function( restrcionsList, params ) {
        	// CICO-76813 : New API for hierarchyRestrictions
            if (service.hierarchyRestrictions.houseEnabled && params.restriction_level === 'Hotel') {
                _.each(restrcionsList, function( item ) {
                    item.restrictions = service.processRestrictions(item.restrictions);
                });
            }

            return restrcionsList;
        };

		// Handle GET api, for individual cell click & popup in House Level ( Frozen Panel).
        service.getURLforAllRestrictionsWithStatus = function(params) {
        	var url = '/api/daily_rates/all_restriction_statuses';

            // CICO-76813 : New API for hierarchyRestrictions
            if (service.hierarchyRestrictions.houseEnabled && params.restriction_level === 'Hotel') {
                url = '/api/restrictions/house';
            }
            return url;
        };

        // Handle POST api, for individual cell click & popup in House Level ( Frozen Panel).
        service.getURLforApplyAllRestrictions = function(params) {
        	var url = '/api/daily_rates';

            // CICO-76813 : New API for hierarchyRestrictions
            if (service.hierarchyRestrictions.houseEnabled && params.restriction_level === 'Hotel') {
                url = '/api/restrictions/house';
            }
            return url;
        };

        // Mapping of restriction type and code.
        var restrictionCodeReverseMapping = {
            1: ['closed', 'boolean'],
            2: ['closed_arrival', 'boolean'],
            3: ['closed_departure', 'boolean'],
            4: ['min_length_of_stay', 'number'],
            5: ['max_length_of_stay', 'number'],
            6: ['min_stay_through', 'number'],
            7: ['min_advanced_booking', 'number'],
            8: ['max_advanced_booking', 'number']
        };

		service.reverseProcessRestrictions = function( restrcionsList ) {
			var restrictionsObj = {};

			_.each(restrcionsList, function( item ) {
				if (restrictionCodeReverseMapping[item.restriction_type_id][1] === 'boolean') {
					restrictionsObj[restrictionCodeReverseMapping[item.restriction_type_id][0]] = item.action === 'add';
				}
				else if (restrictionCodeReverseMapping[item.restriction_type_id][1] === 'number') {
					restrictionsObj[restrictionCodeReverseMapping[item.restriction_type_id][0]] = item.days;
				}
			});

			return restrictionsObj;
		};

		var weekDaysMapping = {
			'sun': [0],
			'mon': [1],
			'tue': [2],
			'wed': [3],
			'thu': [4],
			'fri': [5],
			'sat': [6]
		};

		service.processWeekDays = function( weekdays ) {
			var weekdaysList = [];

			for ( day in weekdays ) {
				weekdaysList.push(weekDaysMapping[day][0]);
			}

			return weekdaysList;
		};

        // Handle POST api, for individual cell click & popup in House Level ( Frozen Panel).
        service.processParamsforApplyAllRestrictions = function( params ) {
            if (service.hierarchyRestrictions.houseEnabled && params.restriction_level === 'Hotel') {
                params = {
                	from_date: params.details[0].from_date,
                	to_date: !!params.details[1] ? params.details[1].to_date : params.details[0].to_date,
                	restrictions: service.reverseProcessRestrictions(params.details[0].restrictions),
                	weekdays: !!params.details[1] ? service.processWeekDays(params.details[1].weekdays) : []
                }
            }

            return params;
        };

    }
]);