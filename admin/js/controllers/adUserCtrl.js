admin.controller('ADUserListCtrl',['$scope', '$state', 'ADUserSrv',  function($scope, $state, ADUserSrv){
	
	ADUserSrv.fetch().then(function(data) {
	        $scope.data = data;
	        //$scope.$parent.myScroll['rooms'].refresh();
	}, function(){
		console.log("fetch failed");

	});	
		
	$scope. UserCtrl = function(id, editstate){
	 	 $state.go(editstate);
	};
		

}]);