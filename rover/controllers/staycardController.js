sntRover.controller('staycardController',['$scope', function($scope){
	$scope.stayCardLoading = false;
	
	$scope.$on('showStaycard',function(){
		$scope.stayCardLoading = true;
	});
}]);