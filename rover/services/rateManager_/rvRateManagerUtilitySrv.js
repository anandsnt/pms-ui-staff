angular.module('sntRover').service('rvRateManagerUtilitySrv', [
    function() {

		var service = this;

        // Mapping of restriction key to code/id.
        service.restrictionKeyToCodeMapping = {
            'closed': [1, 'CLOSED'],
            'closed_arrival': [2, 'CLOSED_ARRIVAL'],
            'closed_departure': [3, 'CLOSED_DEPARTURE'],
            'min_length_of_stay': [4, 'MIN_STAY_LENGTH'],
            'max_length_of_stay': [5, 'MAX_STAY_LENGTH'],
            'min_stay_through': [6, 'MIN_STAY_THROUGH'],
            'min_advanced_booking': [7, 'MIN_ADV_BOOKING'],
            'max_advanced_booking': [8, 'MAX_ADV_BOOKING']
        };

        // Mapping of restriction code/id to key and data type.
        service.restrictionCodeToKeyMapping = {
            1: ['closed', 'boolean'],
            2: ['closed_arrival', 'boolean'],
            3: ['closed_departure', 'boolean'],
            4: ['min_length_of_stay', 'number'],
            5: ['max_length_of_stay', 'number'],
            6: ['min_stay_through', 'number'],
            7: ['min_advanced_booking', 'number'],
            8: ['max_advanced_booking', 'number']
        };

        // Mapping of weekdays code and id for API.
        service.weekDaysMapping = {
            'sun': [0],
            'mon': [1],
            'tue': [2],
            'wed': [3],
            'thu': [4],
            'fri': [5],
            'sat': [6]
        };

        /*
         *  Method to process new restrcion data structure to convert into old structure.
         *  @param [Object] [input value as key value pair]
         *  @return [Array] [output - converted values into array structure]
         */
        service.generateOldGetApiResponseFormat = function( input ) {
            var output = [],
                key = '',
                value = '', 
                obj = {};

            for (key in input) {
                value = input[key],
                obj = {};

                if (typeof(value) === "boolean" && value) {
                    obj.status = 'ON';
                    obj.restriction_type_id = service.restrictionKeyToCodeMapping[key][0];
                    obj.is_on_rate = false;
                    obj.days = null;
                    output.push(obj);
                }
                else if (typeof(value) === "number") {
                    obj.status = 'ON';
                    obj.restriction_type_id = service.restrictionKeyToCodeMapping[key][0];
                    obj.days = value;
                    obj.is_on_rate = false;
                    output.push(obj);
                }
            }

            return output;
        };

        /*
         *  Method to Restructure restriction data, Array to Object format.
         *  @param {Array}  [restrcionsList]
         *  @return {Object} [restrictionsObj]
         */
		service.convertRestrictionsToNewApiFormat = function( restrcionsList ) {
			var restrictionsObj = {};

			_.each(restrcionsList, function( item ) {
				if (service.restrictionCodeToKeyMapping[item.restriction_type_id][1] === 'boolean') {
					restrictionsObj[service.restrictionCodeToKeyMapping[item.restriction_type_id][0]] = item.action === 'add';
				}
				else if (service.restrictionCodeToKeyMapping[item.restriction_type_id][1] === 'number') {
					restrictionsObj[service.restrictionCodeToKeyMapping[item.restriction_type_id][0]] = parseInt(item.days);
				}
			});

			return restrictionsObj;
		};

        /*
         *  Method to convert current weekday Object format into new Array format.
         *  @param {Objects} : Eg: { 'sun':true, 'thu': true }
         *  @return {Array}  : Eg: [0, 4]
         */
		service.convertWeekDaysToNewApiFormat = function( weekdays ) {
			var weekdaysList = [],
				day = '';

			for ( day in weekdays ) {
				weekdaysList.push(service.weekDaysMapping[day][0]);
			}

			return weekdaysList;
		};

        /*
         *  Method to convert current POST param to new format.
         *  @param {Object} [old post params]
         *  @return {Object} [new post params]
         */
        service.generateNewPostApiParams = function( params ) {
            var newPostApiParams = {
                from_date: '',
                to_date: '',
                restrictions: {}
            };

            if (params.details.length > 0) {
                newPostApiParams = {
                    from_date: params.details[0].from_date,
                    to_date: params.details[1] ? params.details[1].to_date : params.details[0].to_date,
                    restrictions: service.convertRestrictionsToNewApiFormat(params.details[0].restrictions)
                };

                if (params.details[1] && params.details[1].weekdays.length > 0) {
                    newPostApiParams.weekdays = service.convertWeekDaysToNewApiFormat(params.details[1].weekdays);
                }
            }
            return newPostApiParams;
        };

    }
]);