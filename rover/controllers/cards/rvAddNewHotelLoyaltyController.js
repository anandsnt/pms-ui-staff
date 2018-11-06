sntRover.controller('RVAddNewHotelLoyaltyController', ['$scope', '$rootScope', 'RVGuestCardLoyaltySrv', 'ngDialog', function($scope, $rootScope, RVGuestCardLoyaltySrv, ngDialog) {

	BaseCtrl.call(this, $scope);
	$scope.userMembershipTypes = $scope.loyaltyData.hotelLoyaltyData;
	$scope.userMembershipNumber = "";
	$scope.userMembershipType = "";
	$scope.userMembershipClass = "HLP";
	$scope.userMembershipLevels = [];
	$scope.userMembershipLevel = "";
	$scope.isLevelsAvailable = false;


	 $scope.memberShipTypeChanged = function() {

	 	angular.forEach($scope.userMembershipTypes, function(userMembershipType, index) {

    		if ($scope.userMembershipType === userMembershipType.hl_value) {
     			$scope.userMembershipLevels = userMembershipType.levels;
     			if ($scope.userMembershipLevels.length > 0) {
     				$scope.isLevelsAvailable = true;
     			}
     			else {
     				$scope.isLevelsAvailable = false;
     			}
    		}
       	});


	};

	$scope.save = function() {

		var loyaltyPostsuccessCallback = function(data) {
			$scope.newLoyalty.id = data.id;
			$scope.$emit('hideLoader');
			$scope.cancel();
			$rootScope.$broadcast('loyaltyProgramAdded', $scope.newLoyalty);
			$scope.$emit('REFRESH_CONTACT_INFO', {guestId: $scope.$parent.guestCardData.guestId});
		};

		var loyaltyPostErrorCallback = function(errorMessage) {
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
		};
		var user_membership = {};

		user_membership.membership_card_number = $scope.userMembershipNumber;
		user_membership.membership_class = $scope.userMembershipClass;
		user_membership.membership_type = $scope.userMembershipType;
		user_membership.membership_level = $scope.userMembershipLevel;
		$scope.newLoyalty = user_membership;

		var reservationId = $scope.reservationData && $scope.reservationData.reservationId ? $scope.reservationData.reservationId : "";

		var data = {'user_id': $scope.$parent.guestCardData.userId,
					'guest_id': $scope.$parent.guestCardData.guestId,
					'user_membership': user_membership,
					 'reservation_id': reservationId
					},
			options = {
				params: data,
				successCallBack: loyaltyPostsuccessCallback,
				failureCallBack: loyaltyPostErrorCallback
			};

			$scope.callAPI(RVGuestCardLoyaltySrv.createLoyalties, options);			
	};

	$scope.cancel = function() {
		$scope.closeDialog();
	};

}]);