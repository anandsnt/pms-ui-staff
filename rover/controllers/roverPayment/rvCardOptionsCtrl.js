sntRover.controller('RVCardOptionsCtrl',
	['$rootScope', 
	 '$scope', 
	 '$state', 
	 'ngDialog',
	 '$location',
	 'RVPaymentSrv', 
	function($rootScope, $scope, $state, ngDialog, $location, RVPaymentSrv){
		BaseCtrl.call(this, $scope);
		
		var absoluteUrl = $location.$$absUrl;
		domainUrl = absoluteUrl.split("/staff#/")[0];
		//console.log("==========SCOPE============");
		console.log($scope);
		$scope.iFrameUrl = domainUrl + "/api/ipage/index.html?card_holder_first_name=" + $scope.passData.details.firstName + "&card_holder_last_name=" + $scope.passData.details.lastName + "&service_action=createtoken";
		$scope.shouldShowIframe = false;	
		console.log("iframe ------"+$scope.iFrameUrl);
		
		$scope.clickedOnSiteCallIn = function(){
			
			$scope.shouldShowIframe = !$scope.shouldShowIframe;
		
		};
		// $scope.clickCallIn = function(){
			// console.log("clickCallIn")
			// $scope.shouldShowIframe = true;
			// $scope.shouldShowAddNewCard = false;
		// };
	
}]);