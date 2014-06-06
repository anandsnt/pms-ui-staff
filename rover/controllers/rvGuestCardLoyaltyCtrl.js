sntRover.controller('rvGuestCardLoyaltyController',['$scope','RVGuestCardLoyaltySrv', function($scope,RVGuestCardLoyaltySrv){
	
	$scope.init = function(){
			
		var loyaltyFetchsuccessCallback = function(data){		
			$scope.$emit('hideLoader');
			alert("rf");
			console.log(data);
			$scope.loyaltyData = data;
		};

		var loyaltyFetchErrorCallback = function(errorMessage){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
		};
		var data = {'userID':$scope.guestCardData.userId};
		$scope.invokeApi(RVGuestCardLoyaltySrv.fetchLoyalties,data , loyaltyFetchsuccessCallback, loyaltyFetchErrorCallback);
	};
	$scope.init();
}]);