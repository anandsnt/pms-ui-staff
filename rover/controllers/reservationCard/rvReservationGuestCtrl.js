sntRover.controller('rvReservationGuestController', ['$scope', '$rootScope', 'RVReservationGuestSrv', '$stateParams', '$state', '$timeout',
	function($scope, $rootScope, RVReservationGuestSrv, $stateParams, $state, $timeout) {

		BaseCtrl.call(this, $scope);	
		//$scope.guestData = {};

		$scope.guestData = {
		    "adult_count": 10,
		    "children_count": 2,
		    "infants_count": 5,
		    "varying_occupancy": true,
		    "primary_guest_details": {
		        "first_name": "p1",
		        "last_name": "p2",
		        "is_vip": true,
		        "image": ""
		    },
		    "accompanying_guests_details": [
		        {
		            "first_name": "a1",
		            "last_name": "a2",
		            "image": "",
		            "id": 1
		        },
		        {
		            "first_name": "b1",
		            "last_name": "b2",
		            "image": "",
		            "id": 2
		        },
		        {
		            "first_name": "c1",
		            "last_name": "c2",
		            "image": "",
		            "id": 3
		        }
		    ]
		};

		$scope.init = function(){
			var successCallback = function(data){
				$scope.$emit('hideLoader');
				$scope.guestData = data;
			};
			//var data = {"reservation_id": $scope.reservationData.reservation_card.reservation_id };
			//console.log(data);
			//$scope.invokeApi(RVReservationGuestSrv.fetchGuestTabDetails, data, successCallback);
		};

		$scope.init();

		$scope.saveGuestDetails = function(){
			var successCallback = function(data){
				$scope.$emit('hideLoader');
				
			};
			//$scope.invokeApi(RVReservationGuestSrv.updateGuestTabDetails, data, successCallback);
		};


}]);