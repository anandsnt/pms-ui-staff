sntRover.controller('RVAddNewFreaquentLoyaltyContrller',['$scope', '$rootScope','RVGuestCardLoyaltySrv','ngDialog', function($scope, $rootScope,RVGuestCardLoyaltySrv,ngDialog){

	BaseCtrl.call(this, $scope);
	$scope.userMembershipTypes = $scope.loyaltyData.freaquentLoyaltyData;
	$scope.userMembershipNumber = "";
	$scope.userMembershipType = "";
	$scope.userMembershipClass = "FFP";

	$scope.save = function(){

		var loyaltyPostsuccessCallback = function(data){
			$scope.newLoyalty.id = data.id;
			$scope.$emit('hideLoader');
			$scope.cancel();
			$rootScope.$broadcast('loyaltyProgramAdded', $scope.newLoyalty, "fromGuestCard");
		};

		var loyaltyPostErrorCallback = function(errorMessage){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
		};
		var user_membership = {};
		user_membership.membership_card_number = $scope.userMembershipNumber;
		user_membership.membership_class = $scope.userMembershipClass;
		user_membership.membership_type = $scope.userMembershipType;
		user_membership.membership_level = "";
		$scope.newLoyalty = user_membership;
		var data = {'user_id':$scope.$parent.guestCardData.userId,
					'guest_id':$scope.$parent.guestCardData.guestId,
					'user_membership': user_membership,
					'reservation_id':$scope.reservationData.reservationId
					};
		$scope.invokeApi(RVGuestCardLoyaltySrv.createLoyalties,data , loyaltyPostsuccessCallback, loyaltyPostErrorCallback);
	};

	$scope.cancel = function(){
		$scope.closeDialog();
	};

}]);