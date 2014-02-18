(function() {
	var checkOutLaterSuccessController = function($scope, $http, $q, $routeParams, $location, $rootScope, LateCheckOutChargesService) {
		var charges = LateCheckOutChargesService.charges;
		var id = $routeParams.id;
		
		$scope.reservationID = $rootScope.reservationID;
		$scope.id = id;
		console.log($rootScope.reservationID);
		// if no charges recorded (user tried to reload on success page)
		// get him back to checkout later page
		if (!charges.length) {
			$location.path('/checkOutLater');
			return;
		};
		
		$scope.lateCheckOut = _.find(charges, function(charge) {
			if (id === charge.id) {
				return charge;
			};
		});
		
		$scope.posted = false;
		var posting = function() {
			
			var deferred = $q.defer();
			var reservation_id = $scope.reservationID;
			var url = '/guest_web/apply_late_checkout';
			var data = {reservation_id: reservation_id, late_checkout_offer_id: $scope.id};
			$http.post(url, data).success(function(response){
				deferred.resolve(response);
			}).error(function(){
				deferred.reject();
			});
				
			return deferred.promise;
		}
		
		posting().then(function (response) {
			$scope.posted = true;	
			// $scope.lateCheckOut = response;
			$scope.success = response.status ? true : false;
			console.log($scope);
		});
		
	};

	var dependencies = [
		'$scope',
		'$http',
		'$q',
		'$routeParams',
		'$location',
		'$rootScope',
		'LateCheckOutChargesService',
		checkOutLaterSuccessController
	];

	snt.controller('checkOutLaterSuccessController', dependencies);
})();