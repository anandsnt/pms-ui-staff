
admin.controller('ADChainListCtrl',['$scope', '$rootScope','adChainsSrv', function($scope, $rootScope,adChainsSrv){
	
	$scope.menuOpen = false;
	$scope.chainsList = [];

	adChainsSrv.fetch().then(function(data) {
		$scope.chainsList = data;

	},function(){
		console.log("error controller");
	});	


	
    
 	$scope.isMenuOpen = function(){
        return $scope.menuOpen ? true : false;
    };
}]);

    