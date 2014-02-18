(function() {
	var checkOutLaterSuccessController = function($scope, $http, $q, $routeParams, $location, LateCheckOutChargesService) {
		var charges = LateCheckOutChargesService.charges;
		var id = $routeParams.id;
		
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
			var reservation_id = '';
			var url = '/guest_web/apply_late_checkout';
			var data = {reservation_id: reservation_id};
			$http.post(url,{
    		params:data}).success(function(response){
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
		'LateCheckOutChargesService',
		checkOutLaterSuccessController
	];

	snt.controller('checkOutLaterSuccessController', dependencies);
})();