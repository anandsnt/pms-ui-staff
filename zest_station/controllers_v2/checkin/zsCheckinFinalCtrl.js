sntZestStation.controller('zsCheckinFinalCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	function($scope, $stateParams, $state, zsEventConstants) {


		/**********************************************************************************************
		**		Please note that, not all the stateparams passed to this state will not be used in this state, 
        **      however we will have to pass this so as to pass again in future states which will use these.
        **       
		**		Expected state params -----> print_opted, email_opted,  print_status, email_status 
		**		and key_success			  
		**		Exit function -> $scope.navToHome								
		**																		 
		***********************************************************************************************/

		/**
		 * [initializeMe description]
		 */
		var initializeMe = function() {
			//hide back button
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			//hide close button
			$scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
			//show subtexts based upon actions selected
			var printOpted = $stateParams.print_opted === 'true';
			var emailOpted = $stateParams.email_opted === 'true';
			var printSuccess = $stateParams.print_status === "success";
			var emailSuccess = $stateParams.email_status === "success";
			var keySucess = $stateParams.key_success === "true";
			
			if (printOpted) {
				if (printSuccess && keySucess) {
					$scope.subtext = 'PRINT_SUCCESS_AND_KEY_SUCCESS';
				} else if (!printSuccess && keySucess) {
					$scope.subtext = 'PRINT_FAILED_AND_KEY_SUCCESS';
				} else if (printSuccess && !keySucess) {
					$scope.subtext = 'PRINT_SUCCESS_AND_KEY_FAILED';
				} else if (!printSuccess && !keySucess) {
					$scope.subtext = 'PRINT_FAILED_AND_KEY_FAILED';
				} else {
					$scope.subtext = "";
				}
			} else {
				if (emailSuccess && keySucess) {
					$scope.subtext = 'EMAIL_SUCCESS_AND_KEY_SUCCESS';
				} else if (!emailSuccess && keySucess) {
					$scope.subtext = 'EMAIL_FAILED_AND_KEY_SUCCESS';
				} else if (emailSuccess && !keySucess) {
					$scope.subtext = 'EMAIL_SUCCESS_AND_KEY_FAILED';
				} else if (!emailSuccess && !keySucess) {
					$scope.subtext = 'EMAIL_FAILED_AND_KEY_FAILED';
				} else {
					$scope.subtext = "";
				}
			}


		}();

		$scope.navToHome = function() {
			$state.go('zest_station.home');
		};

	}
]);