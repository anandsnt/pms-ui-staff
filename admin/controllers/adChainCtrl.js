
admin.controller('ADChainListCtrl',['$scope', '$rootScope','adChainsSrv', function($scope, $rootScope,adChainsSrv){
	
	$scope.menuOpen = false;
	$scope.chainsArray = [];

	adChainsSrv.fetch().then(function(data) {
		$scope.chainsArray = data;

	},function(){
		console.log("error controller");
	});	


	
    
 	$scope.isMenuOpen = function(){
        return $scope.menuOpen ? true : false;
    };
}]);

    