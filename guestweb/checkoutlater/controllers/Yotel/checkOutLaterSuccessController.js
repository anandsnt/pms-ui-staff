(function() {
	var checkOutLaterSuccessController = function($scope, $http, $q, $stateParams, $state, $rootScope, LateCheckOutChargesService) {
		
		$scope.pageValid = false;
		
		if($rootScope.isCheckedout){
			$location.go('checkOutStatus');
		}
		else if(!$rootScope.isLateCheckoutAvailable){
			$state.go('checkOutConfirmation');
		}
		else{
			$scope.pageValid = true;
		};

		if($scope.pageValid){

			var charges = LateCheckOutChargesService.charges;
			var id = $stateParams.id;
			$scope.reservationID = $rootScope.reservationID;
			$scope.id = id;
			$scope.netWorkError = false;

		// already opted for late checkout, send him home with a msg
		$scope.returnHome = false;

		// data has/being posted
		$scope.posted = false;

		// data posted sucessfully
		$scope.success = false;

		// if no charges recorded (user tried to reload on success page)
		// show a message and give him option to go home
		if (!charges.length) {

			$location.path('/')
			$scope.returnHome = true;
			return;
		};
		
		// find the choosen option form list of options
		$scope.lateCheckOut = _.find(charges, function(charge) {
			if (id === charge.id) {
				return charge;
			};
		});

	
		var posting = function() {

			var deferred = $q.defer();
			var reservation_id = $scope.reservationID;
			var url = '/guest_web/apply_late_checkout';
			var data = {reservation_id: reservation_id, late_checkout_offer_id: $scope.id};
			$http.post(url, data).success(function(response){

			// prevent further late chekout later options 

			if(response.status != "failure")
				$rootScope.isLateCheckoutAvailable = false;
			else
				$scope.netWorkError = true;	
			deferred.resolve(response);

		}).error(function(){				
			$rootScope.netWorkError = true;
			deferred.reject();			
		});
		return deferred.promise;
	}

	posting().then(function (response) {
		$scope.posted = true;	
		$scope.success = response.status ? true : false;
		if($scope.success === true){
			$rootScope.checkoutTime = $scope.lateCheckOut.time +':00 '+$scope.lateCheckOut.ap
			$rootScope.checkoutTimessage = "Your new check out time is ";
		}
	});
}		
};

var dependencies = [
'$scope',
'$http',
'$q',
'$stateParams',
'$state',
'$rootScope',
'LateCheckOutChargesService',
checkOutLaterSuccessController
];

snt.controller('checkOutLaterSuccessController', dependencies);
})();