sntRover.controller('RVGuestCardLoyaltyController',['$scope','RVGuestCardLoyaltySrv','ngDialog',function($scope,RVGuestCardLoyaltySrv,ngDialog){
	
	$scope.init = function(){
			
		var loyaltyFetchsuccessCallback = function(data){		
			$scope.$emit('hideLoader');
			$scope.loyaltyData = data;
			// alert("ef");
			// console.log(data)
		};

		var loyaltyFetchErrorCallback = function(errorMessage){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
		};

		var data = {'userID':$scope.$parent.guestCardData.userId};
		$scope.invokeApi(RVGuestCardLoyaltySrv.fetchLoyalties,data , loyaltyFetchsuccessCallback, loyaltyFetchErrorCallback);
	};

	$scope.init();


	$scope.addNewFreaquentLoyality =  function(){
		 ngDialog.open({
                  template: '/assets/partials/guestCard/guestCardaddFreaquentLoyaltyPopup.html',
                  controller: 'RVAddNewFreaquentLoyaltyContrller',
                  className: 'ngdialog-theme-default',
                  scope: $scope
                });
	};

	$scope.addNewHotelLoyality =  function(){
		 ngDialog.open({
                  template: '/assets/partials/guestCard/guestCardaddHotelLoyaltyPopup.html',
                  controller: 'RVAddNewHotelLoyaltyController',
                  className: 'ngdialog-theme-default',
                  scope: $scope
                });
	}
}]);