	(function() {
		var checkinDetailsService = function() {

			this.responseData = {};
			this.setResponseData = function (responseData){
				this.responseData = responseData;
			};
			this.getResponseData = function (){
				return this.responseData;
			};
		};

		var dependencies = [
		checkinDetailsService
		];

		snt.service('checkinDetailsService', dependencies);
	})();