sntRover.controller('RVAddNewHotelLoyaltyController',['$scope','RVGuestCardLoyaltySrv','ngDialog', function($scope,RVGuestCardLoyaltySrv,ngDialog){
	

	$scope.userMembershipTypes = $scope.loyaltyData.hotelLoyaltyData;
	$scope.userMembershipNumber = "";
	$scope.userMembershipType = "";
	$scope.userMembershipClass = "HLP";
	$scope.userMembershipLevels = [];
	$scope.userMembershipLevel = "";
	$scope.isLevelsAvailable = false;


	 $scope.memberShipTypeChanged = function(){

	 	angular.forEach($scope.userMembershipTypes,function(userMembershipType, index) {

    		if($scope.userMembershipType == userMembershipType.hl_value){
     			$scope.userMembershipLevels = userMembershipType.levels;
     			if($scope.userMembershipLevels.length >0){
     				$scope.isLevelsAvailable = true;
     			}
     			else{
     				$scope.isLevelsAvailable = false;
     			}
    		}
       	});



	};

	$scope.save = function(){

		var loyaltyPostsuccessCallback = function(data){		
			$scope.$emit('hideLoader');
		};

		var loyaltyPostErrorCallback = function(errorMessage){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
		};
		var user_membership = {};
		user_membership.membership_card_number = $scope.userMembershipNumber;
		user_membership.membership_class = $scope.userMembershipClass;
		user_membership.membership_type = $scope.userMembershipType;

		var data = {'user_id':$scope.$parent.guestCardData.userId,
					'guest_id':$scope.$parent.guestCardData.userId,
					'user_membership': user_membership
					};
		$scope.invokeApi(RVGuestCardLoyaltySrv.createLoyalties,data , loyaltyPostsuccessCallback, loyaltyPostErrorCallback);
	};

	$scope.cancel = function(){
		ngDialog.close();
	};

}]);