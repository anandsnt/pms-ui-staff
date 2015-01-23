sntRover.controller('rvReservationGuestController', ['$scope', '$rootScope', 'RVReservationGuestSrv', '$stateParams', '$state', '$timeout',
	function($scope, $rootScope, RVReservationGuestSrv, $stateParams, $state, $timeout) {

		BaseCtrl.call(this, $scope);	
		$scope.guestData = {};
		var presentGuestInfo = {};
		$scope.errorMessage = '';

		$scope.init = function(){

			var successCallback = function(data){
				$scope.$emit('hideLoader');
				$scope.guestData = data;
				$scope.$emit("GETVARYINGOCCUPANCY");
				presentGuestInfo = JSON.parse(JSON.stringify($scope.guestData));
				$scope.errorMessage = '';
			};

			var errorCallback = function(errorMessage){
				$scope.$emit('hideLoader');
				$scope.errorMessage = errorMessage;
			};

			var data = {"reservation_id": $scope.reservationData.reservation_card.reservation_id };

			$scope.invokeApi(RVReservationGuestSrv.fetchGuestTabDetails, data, successCallback , errorCallback);
		};

		$scope.$on("VARYINGOCCUPANCY", function(e,data) {
			$scope.guestData.varying_occupancy = data;
		});

		/* To save guest details */
		$scope.saveGuestDetails = function(){

			var data = JSON.parse(JSON.stringify($scope.guestData));
			var dataUpdated = false;
			if (!angular.equals(data, presentGuestInfo)) {
				dataUpdated = true;
			}

			if(dataUpdated){
				
				var successCallback = function(data){
					$scope.$emit('hideLoader');
					$scope.errorMessage = '';
					$scope.$emit("GETVARYINGOCCUPANCY");
				};

				var errorCallback = function(errorMessage){
					$scope.$emit('hideLoader');
					$scope.$emit("OPENGUESTTAB");
					$scope.errorMessage = errorMessage;
				};

				angular.forEach(data.accompanying_guests_details, function(item, index) {
					delete item.image;
					if((item.first_name == "" || item.first_name == null) && (item.last_name == "" || item.last_name == null)){
						data.accompanying_guests_details.splice(index,1);
					}
				});

				var dataToSend = dclone(data,["primary_guest_details"]);
				dataToSend.reservation_id = $scope.reservationData.reservation_card.reservation_id;
				$scope.invokeApi(RVReservationGuestSrv.updateGuestTabDetails, dataToSend, successCallback , errorCallback);
			}
		};

		$scope.$on("UPDATEGUESTDEATAILS", function(e) {
			$scope.saveGuestDetails();
		});

		$scope.init();
}]);