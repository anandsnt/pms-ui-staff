/**
 * Checkin -terms & conditions ctrl
 */
sntGuestWeb.controller('gwTermsAndConditionsController', ['$scope', '$state', '$controller', 'GwWebSrv',
	function($scope, $state, $controller, GwWebSrv) {

		$controller('BaseController', {
			$scope: $scope
		});
		var init = function() {
			var screenIdentifier = "TERMS_AND_CONDITIONS";
			$scope.screenCMSDetails = GwWebSrv.extractScreenDetails(screenIdentifier);
		}();

		$scope.termsAndConditions = GwWebSrv.zestwebData.termsAndConditions;

		$scope.agreeClicked = function(){
			if(GwWebSrv.zestwebData.guestPromptAddressOn){
				$state.go('updateGuestDetails');
			}
			else if(GwWebSrv.zestwebData.isAutoCheckinOn){
		      	$state.go('etaUpdation');
		    }
		    else{
		       $state.go('checkinFinal');
		    };
		};
		$scope.cancelClicked = function(){
			//to do
		};

	}
]);