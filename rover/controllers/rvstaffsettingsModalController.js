sntRover.controller('RVStaffsettingsModalController', ['$scope','ngDialog', function($scope,ngDialog){

 $scope.cancelClicked = function(){
     ngDialog.close();

   };
}]);