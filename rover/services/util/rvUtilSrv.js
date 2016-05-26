angular.module('sntRover').service('rvUtilSrv', [function(){

		var self = this;
		/**
		 * utility function to take deep copy of an object
		 * @param  {Object} 	obj - Source Object
		 * @return {Object}     Deep copied object
		 */
		this.deepCopy = function(obj){
			return (JSON.parse (JSON.stringify (obj)));
		};

		/**
		 * util function that converts a null value to a desired string.
		 * if no replace value is passed, it returns an empty string
		 * @param  {String} value       [description]
		 * @param  {String} replaceWith [description]
		 * @return {String}             [description]
		 */
		this.escapeNull = function(value, replaceWith){
	  		var newValue = "";
	  		if((typeof replaceWith !== "undefined") && (replaceWith !== null)){
	  			newValue = replaceWith;
	  		}
	  		var valueToReturn = ((value === null || typeof value === 'undefined' ) ? newValue : value);
	  		return valueToReturn;
		};

		/**
		* util function to check whether a string is empty
		* @param {String/Object}
		* @return {boolean}
		*/
		this.isEmpty = function(string){
			if (typeof string === "number") {
				string = string.toString();
			}
			return (this.escapeNull(string).trim() === '');
		};

		/**
		* function to stringify a string
		* sample use case:- directive higlight filter
		* sometimes through error parsing speial charactes
		* @param {String}
		* @return {String}
		*/
		this.stringify = function(string){
			return JSON.stringify (string);
		};

		/**
		* function to get List of dates between two dates
		* param1 {Date Object}
		* param2 {Date Object}
		* return Array of Date Objects
		*/
		this.getDatesBetweenTwoDates = function(fromDate, toDate){
		    var datesBetween = [];

		    while(fromDate <= toDate){
		        datesBetween.push(new Date(fromDate));
		        fromDate.setDate(fromDate.getDate() + 1);
		    }

		    return datesBetween;
		};

		/**
		 * to get the millisecond value against a date/date string
		 * @param  {Object/String} Date Obejct Or dateString [description]
		 * @return {String}            [millisecond]
		 */
		this.toMilliSecond = function(date_){
			var type_ 	= typeof date_,
				ms 		= '';

			switch (type_){
				case 'string':
					ms = (new tzIndependentDate(date_));
					break;
				case 'object':
					ms = date_.getTime();
					break;
			}
			return ms;
		};

		/**
		 * to add one day against a date
		 * @param  {Object/String} Date Obejct Or dateString [description]
		 * @return {String}            [millisecond]
		 */
		this.addOneDay = function(date_){
			return (this.toMilliSecond (date_) + (24 * 3600 * 1000));
		};

		/**
		 * utility function to get key value from an array having number of other. key values
		 * @param  {array} array      	[source array to process]
		 * @param  {array} wantedKeys 	[array of keys that we wanted to extract from array]
		 * @return {array}            	[array with key values we wanted]
		 */
		this.getListOfKeyValuesFromAnArray = function(array, wantedKeys){
			var arrayToReturn = [], eachItemToAdd;

			_.each(array, function(arrayIndexElement){
				eachItemToAdd = {};

				_.each(wantedKeys, function(key){
					eachItemToAdd[key] = arrayIndexElement[key];
				});
				arrayToReturn.push (eachItemToAdd);
			});

			return arrayToReturn;
		};

		/**
		 * to check whether a string is a number or not
		 * @param {Integer/String}
		 * @return {Boolean}
		 */
    	this.isNumeric = function(string){
    		return !jQuery.isArray( string ) && (string - parseFloat( string ) + 1) >= 0;
    	};

    	/**
    	* to convert a number to a string
    	* @param {String} - string to be converted
    	* @param {Integer} - if passed string is not a number, what should be retuned
    	* @return {Integer}
    	*/
    	this.convertToInteger = function(string, withWhatToBeReplacedifNotANumber){
    		withWhatToBeReplacedifNotANumber = withWhatToBeReplacedifNotANumber ? withWhatToBeReplacedifNotANumber : 0;
    		if (self.isNumeric (string)) { return parseInt (string);}
    		return withWhatToBeReplacedifNotANumber;
    	};

    	/**
    	* to convert a number to a string
    	* @param {String} - string to be converted
    	* @param {Double} - if passed string is not a number, what should be retuned
    	* @return {Double}
    	*/
    	this.convertToDouble = function(string, withWhatToBeReplacedifNotANumber){
    		withWhatToBeReplacedifNotANumber = withWhatToBeReplacedifNotANumber ? withWhatToBeReplacedifNotANumber : 0;
    		if (self.isNumeric (string)) { return parseFloat (string);}
    		return withWhatToBeReplacedifNotANumber;
    	};

    	/**
    	 * to get date string from a date picker object
    	 * @param  {Object} date_picker_object
    	 * @param  {String} seperator   default will be /
    	 * @return {String}             date string
    	 */
		this.get_date_from_date_picker = function (date_picker, seperator){
    		if (typeof seperator === "undefined") {
    			seperator = "/";
    		}
    		return (date_picker.selectedYear + seperator + (date_picker.selectedMonth + 1) + seperator
    				+ date_picker.selectedDay);
    	};


		/**
		 * @param date {date object}
		 * @return {dateObject}
		 */
		this.getFirstDayOfNextMonth = function(date) {
			var date = new tzIndependentDate(date),
				y = date.getFullYear(),
				m = date.getMonth();
			return (tzIndependentDate(new Date(y, m + 1, 1)));
		};

		/**
		 * to get the list for time selector like 1:00 AM, 1:15 AM, 1:30 AM..
		 * @param  {Integer} - interval in minutes - default 15 min
		 * @param  {String} - 24/12 hour mode - default 12 hour mode
		 * @return {Array of Objects}
		 */
		this.getListForTimeSelector = function(interval, mode) {
			//TODO: Add Date and check for DST
			var listOfTimeSelectors = [],
				i 		= 0,
				hours 	= 0,
				minutes = 0,
				ampm 	= null,
				value 	= '',
				text 	= '';

			//setting the defaults
			if (_.isUndefined (mode)) {
				mode = 12;
			}
			if (_.isUndefined (interval)) {
				interval = 15;
			}

			for(; i < 1440; i += interval) {
		        hours 	= Math.floor(i / 60);

		        minutes = i % 60;
		        if (minutes < 10){
		            minutes = '0' + minutes; // adding leading zero
		        }

		        ampm 	= hours % 24 < 12 ? 'AM' : 'PM';
		        
		        value 	= ((hours < 10) ? ("0" + hours) : hours) + ':' + minutes;
				
				hours 	= hours % mode;
		        if ((hours === 0 && mode === 12) ||(hours === 0 && mode === 24 && i <= 60)){
		            hours = 12;
		        }

		        text = hours + ':' + minutes;

		        //is 12 hour mode enabled
		        if (mode === 12) {
					text 	+= ' ' + ampm;
		        }

		        listOfTimeSelectors.push ({
					value: value,
					text: text
				});
		    }


		    return listOfTimeSelectors;
		};

		/** Method to check if the web app is accessed from a device */
		this.checkDevice = {
			any : function(){
				return !!navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i);
			},
			iOS : function(){
				return !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
			}, 
			android: function() {
        		return navigator.userAgent.match(/Android/i);
    		}
		};

        /**
         * This method returns the next time quarter to the input hours and minutes
         * in hh:mm format
         * @param hours INTEGER
         * @param minutes INTEGER
         * @returns {string}
         */
        this.roundToNextQuarter = function(hours,minutes){
                var roundedHours =  (minutes > 45 ? ++hours % 24 : hours).toString(),
                    roundedMins = ((((minutes + 14) / 15 | 0) * 15) % 60).toString();

                return (roundedHours.length === 2 ? roundedHours : "0" + roundedHours ) +
                    ":" +
                    (roundedMins.length === 2 ? roundedMins : "0" + roundedMins);
            };

}]);