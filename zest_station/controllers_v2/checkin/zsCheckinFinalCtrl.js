sntZestStation.controller('zsCheckinFinalCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	function($scope, $stateParams, $state, zsEventConstants) {

		/**
		 * [initializeMe description]
		 */
		var initializeMe = function() {
			//hide back button
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
			//hide close button
			$scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);

			var printOpted = $stateParams.printopted === "true";
			var emailOpted = $stateParams.emailopted === "true";
			var keySucess = $stateParams.keysucess === "true";

			if(printOpted && keySucess){
				$scope.subtext = 'PRINT_AND_KEY_SUCESS';
			}
			else if(printOpted && !keySucess){
				$scope.subtext = 'PRINT_SUCCES_AND_KEY_FAILED';
			}
			else if(emailOpted && keySucess){
				$scope.subtext = 'EMAIL_AND_KEY_SUCESS';
			}
			else{
				$scope.subtext = 'EMAIL_SUCCES_AND_KEY_FAILED';
			}
		}();

		$scope.navToHome = function(){
			$state.go('zest_station.home');
		};

	}
]);