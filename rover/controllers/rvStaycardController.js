sntRover.controller('staycardController',['$scope', function($scope){

		 $scope.guestCardData ={};
		 $scope.$on('guestCardUpdateData',function(event, data){
		 	$scope.guestCardData = data.data;
		 	$scope.countriesList = data.countries;
		
		 });
}]);