admin.controller('ADHotelDetailsCtrl', ['$scope', 'ADHotelDetailsSrv', function($scope, ADHotelDetailsSrv){
	$scope.data = ADHotelDetailsSrv.fetch();
	console.log(JSON.stringify($scope.data));
}]);