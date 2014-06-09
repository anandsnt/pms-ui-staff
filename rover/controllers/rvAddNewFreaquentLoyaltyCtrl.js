sntRover.controller('RVAddNewFreaquentLoyaltyContrller',['$scope', '$rootScope','RVGuestCardLoyaltySrv','ngDialog', function($scope, $rootScope,RVGuestCardLoyaltySrv,ngDialog){
	

	$scope.userMembershipTypes = $scope.loyaltyData.freaquentLoyaltyData;
	$scope.userMembershipNumber = "";
	$scope.userMembershipType = "";
	$scope.userMembershipClass = "FFP";

	$scope.save = function(){

		var loyaltyPostsuccessCallback = function(data){	
			$scope.newLoyalty.id = data.id;	
			$scope.$emit('hideLoader');
			$rootScope.$broadcast('loyaltyProgramAdded', $scope.newLoyalty);
		};

		var loyaltyPostErrorCallback = function(errorMessage){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
		};
		var user_membership = {};
		user_membership.membership_card_number = $scope.userMembershipNumber;
		user_membership.membership_class = $scope.userMembershipClass;
		user_membership.membership_type = $scope.userMembershipType;
		$scope.newLoyalty = user_membership;
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