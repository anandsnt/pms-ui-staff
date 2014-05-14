sntRover.controller('staycardController',['$scope', function($scope){


		 $scope.guestCardData ={};
		 $scope.$on('guestCardUpdateData',function(event, data){
		 	$scope.guestCardData.contactInfo = data.data;
		 	$scope.countriesList = data.countries;
		 	$scope.guestCardData.userId=data.userId;
		
		 });

	 //setting the heading of the screen to "Search"
    $scope.heading = "Stay Card";

}]);