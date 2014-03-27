admin.controller('ADUserListCtrl',['$scope', '$state','$stateParams', 'ADUserSrv',  function($scope, $state, $stateParams, ADUserSrv){
	
	$scope.ListCtrl = function(){
		ADUserSrv.fetch().then(function(data) {
		        $scope.data = data;
		}, function(){
			console.log("fetch failed");
	
		});	
	};
	
	$scope.ListCtrl();
	
		
	$scope.UserCtrl = function(id, editstate){
	 	 // $state.go(editstate);
	 	 ADUserSrv.getUserDetails(id).then(function(data) {
		        $scope.data = data;
		        console.log( $scope.data );
		        //$scope.$parent.myScroll['rooms'].refresh();
		}, function(){
			console.log("fetch failed");
	
		});	
	};
	
		

}]);