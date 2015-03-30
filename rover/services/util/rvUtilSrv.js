sntRover.service('rvUtilSrv', [function(){
		
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
	  		if((typeof replaceWith != "undefined") && (replaceWith != null)){
	  			newValue = replaceWith;
	  		}
	  		var valueToReturn = ((value == null || typeof value == 'undefined' ) ? newValue : value);
	  		return valueToReturn;
		};

		/**
		* util function to check whether a string is empty
		* @param {String/Object}
		* @return {boolean}
		*/
		this.isEmpty = function(string){
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

}]);