admin.controller('ADReservationTypeListController', ['$scope', '$rootScope', 'ADReservationTypesSrv',
function($scope, $rootScope, ADReservationTypesSrv) {
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.data = [];

	$scope.listReservationTypes = function(){

		var successCallbackReservationTypes = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data.reservation_types;
		};
	   $scope.invokeApi(ADReservationTypesSrv.fetch, {} , successCallbackReservationTypes);
	};
	$scope.listReservationTypes();
	$scope.saveReservationType = function(index){
		var params = {};
		params.id = $scope.data[index].value;
		params.is_active = $scope.data[index].is_active;
	   $scope.invokeApi(ADReservationTypesSrv.save, params);
	};

}]);
