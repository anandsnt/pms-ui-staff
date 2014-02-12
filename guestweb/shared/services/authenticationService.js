(function() {
	var authenticationService = function() {
	
		var token = ''
		var reservationidID    = ''
		var checkoutType = ''


		var setAuthenticationDetails = function(authenticationData){

			this.token 			  = authenticationData.token
			this.reservationidID  = authenticationData.reservationidID
			this.checkoutType 	  = authenticationData.checkoutType

		}

		return {
			setAuthenticationDetails: setAuthenticationDetails,
			token 					: token,
			reservationidID		    : reservationidID,
			checkoutType 			: checkoutType


		}
	};

	var dependencies = [
		authenticationService
	];

	snt.factory('authenticationService', dependencies);
})();