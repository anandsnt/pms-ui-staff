admin.controller('ADUserListCtrl',['$scope', '$state','$stateParams', 'ADUserSrv',  function($scope, $state, $stateParams, ADUserSrv){
	
	$scope.ListCtrl = function(){
		ADUserSrv.fetch().then(function(data) {
		        $scope.data = data;
		}, function(){
			console.log("fetch failed");
	
		});	
	};
	
	$scope.ListCtrl();
	
		

}]);