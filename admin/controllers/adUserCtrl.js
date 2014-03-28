admin.controller('ADUserListCtrl',['$scope', '$state','$stateParams', 'ADUserSrv',  function($scope, $state, $stateParams, ADUserSrv){
	
	$scope.ListCtrl = function(){
		console.log('List control');
		ADUserSrv.fetch().then(function(data) {
		        $scope.data = data;
		        console.log("length ======"+data.length);
		}, function(){
			console.log("fetch failed");
	
		});	
	};
	
	$scope.ListCtrl();
	
		

}]);