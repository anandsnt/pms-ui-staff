
(function() {
	var checkOutStatusController = function($scope, baseWebService,$q,$http,$rootScope) {
//to be deleted
	$scope.finalMessage = "Thank You for staying with us!"
	$scope.posted = false;


		$scope.posted = false;
		var posting = function() {
			var deferred = $q.defer();
			var reservation_id = '';
			var url = '/guest_web/home/checkout_guest';
			var data = {'reservation_id':$rootScope.reservationID};
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
		'baseWebService','$q','$http','$rootScope',
		checkOutStatusController
	];

	snt.controller('checkOutStatusController', dependencies);
})();