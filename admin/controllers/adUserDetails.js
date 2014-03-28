admin.controller('ADUserDetailsCtrl',['$scope', '$state','$stateParams', 'ADUserSrv',  function($scope, $state, $stateParams, ADUserSrv){
	
	$scope.userDetailsEdit = function(id){
	 	 ADUserSrv.getUserDetails(id).then(function(data) {
		        $scope.data = data;
		        $scope.data.email1 = $scope.data.email;
		}, function(){
			console.log("fetch failed");
	
		});	
	};
	
	$scope.userDetailsAdd = function(){
	 	
		        $scope.data = {};
		
	};
	
	var id = $stateParams.id;
	// var editState = $stateParams.page;
	if(id == ""){
		$scope.userDetailsAdd();
	} else {
		$scope.userDetailsEdit(id);
	}
	
	
	$scope.saveUserDetails = function(){
		console.log("============jphme==============");
		console.log($scope.data);
	};

}]);