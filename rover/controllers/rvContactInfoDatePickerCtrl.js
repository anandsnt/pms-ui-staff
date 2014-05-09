
sntRover.controller('RVContactInfoDatePickerController',['$scope','dateFilter','ngDialog','$filter',function($scope,dateFilter,ngDialog,$filter){



   $scope.setUpData = function(){

  	 	$scope.isDateSelected = false;
  	 	$scope.birthday = $scope.guestCardData.contactInfo.birthday;




	   	$scope.date = dateFilter(new Date(), 'yyyy-MM-dd');


	   	// 	alert("date"+$scope.date);
  	 	// alert("bday"+$scope.birthday);
  	 	// alert("formatbday"+$filter('date')($scope.birthday, "yyyy-MM-dd"));


	   	$scope.maxDate =dateFilter(new Date(), 'yyyy-MM-dd');
	  
	  	var presentDate = new Date();
        $scope.endYear = presentDate.getFullYear();
	  	$scope.startYear = $scope.endYear-100;;
   };

   $scope.$watch('isDateSelected',function(){
   	if($scope.isDateSelected){
   	 $scope.guestCardData.contactInfo.birthday = dateFilter($scope.date, 'MM-dd-yyyy');
   	 ngDialog.close();
   	}
   });



   $scope.setUpData();

}]);