
sntRover.controller('RVContactInfoDatePickerController',['$scope','dateFilter','ngDialog',function($scope,dateFilter,ngDialog){

$scope.setUpData = function(){

    $scope.isDateSelected = false;
    $scope.birthday = $scope.guestCardData.contactInfo.birthday;

    if($scope.birthday!= null){
      $scope.date = $scope.birthday;
      $scope.isDateSelected = true;
    }
    else{
      $scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
    }
    alert($scope.date);
    $scope.maxDate =dateFilter(new Date(), 'yyyy-MM-dd');
//data for the year dropdown
    var presentDate = new Date();
    $scope.endYear = presentDate.getFullYear();
    $scope.startYear = $scope.endYear-100;
    $scope.closePopupOnSelection = false;
};
$scope.setUpData();

$scope.$watch('closePopupOnSelection',function(){
  if($scope.closePopupOnSelection){
    $scope.guestCardData.contactInfo.birthday = $scope.date;
    ngDialog.close();
  }
});





}]);