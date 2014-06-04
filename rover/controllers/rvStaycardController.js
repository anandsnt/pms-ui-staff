sntRover.controller('staycardController',['$scope', function($scope){


$scope.guestCardData ={};
$scope.guestCardData.contactInfo = {};
$scope.countriesList = [];
$scope.guestCardData.userId = '';
$scope.guestCardData.contactInfo.birthday = '';
/*
 * To get the payment tab payments list
 */
$scope.$on('GUESTPAYMENT', function(event, paymentData) {
	 $scope.paymentData = paymentData;
});


$scope.$on('guestCardUpdateData',function(event, data){
	$scope.guestCardData.contactInfo = data.data;
	$scope.guestCardData.contactInfo.avatar = data.avatar;
	$scope.guestCardData.contactInfo.vip = data.vip;
	$scope.countriesList = data.countries;
	$scope.guestCardData.userId=data.userId;

});

$scope.$on('reservationCardClicked',function(){
	$scope.$broadcast('reservationCardisClicked');
});



//setting the heading of the screen to "Search"
    $scope.heading = "Stay Card";
	$scope.menuImage = "back-arrow";    

}]);