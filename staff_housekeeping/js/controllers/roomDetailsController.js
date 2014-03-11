hkRover.controller('roomDetailsController',['$scope', '$state', '$stateParams', 'HKRoomDetailsSrv',  
					function($scope, $state, $stateParams, HKRoomDetailsSrv){
	
	HKRoomDetailsSrv.fetch($stateParams.id).then(function(data) {
	    $scope.data = data;
	});


}]);