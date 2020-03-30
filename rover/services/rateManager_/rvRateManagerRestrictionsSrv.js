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
            "closed": [1, 'CLOSED'],
            "closed_arrival": [2, 'CLOSED_ARRIVAL'],
            "closed_departure": [3, 'CLOSED_DEPARTURE'],
            "min_stay_through": [4, 'MIN_STAY_LENGTH'],
            "min_length_of_stay": [5, 'MAX_STAY_LENGTH'],
            "max_length_of_stay": [6, 'MIN_STAY_THROUGH'],
            "min_advanced_booking": [7, 'MIN_ADV_BOOKING'],
            "max_advanced_booking": [8, 'MAX_ADV_BOOKING']
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

    }
]);