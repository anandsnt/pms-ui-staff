sntRover.controller('staycardController',['$scope','RVGuestCardSrv', 'ngDialog', function($scope, RVGuestCardSrv, ngDialog){


	$scope.guestCardData ={};
	$scope.guestCardData.contactInfo = {};
	$scope.countriesList = [];
	$scope.guestCardData.userId = '';
	$scope.guestCardData.contactInfo.birthday = '';
	$scope.paymentData = {};
	/*
	 * To get the payment tab payments list
	 */
	$scope.$on('GUESTPAYMENT', function(event, paymentData) {
		 $scope.paymentData = paymentData;
	});
	
	
	$scope.$on('guestCardUpdateData',function(event, data){
		$scope.guestCardData.contactInfo = data.contactInfo;
		$scope.guestCardData.contactInfo.avatar = data.avatar;
		$scope.guestCardData.contactInfo.vip = data.vip;
		$scope.countriesList = data.countries;
		$scope.guestCardData.userId=data.userId;
		$scope.guestCardData.guestId=data.guestId;
	});
	$scope.$on('staycardGuestData',function(event, data){
		$scope.guestCardData.contactInfo.first_name = data.guest_details.first_name;
		$scope.guestCardData.contactInfo.last_name = data.guest_details.last_name;		$scope.guestCardData.contactInfo.avatar = data.guest_details.avatar;
		$scope.guestCardData.contactInfo.city = data.guest_details.city;
		$scope.guestCardData.contactInfo.state = data.guest_details.state;
		$scope.guestCardData.contactInfo.phone = data.guest_details.phone;
		$scope.guestCardData.contactInfo.email = data.guest_details.email;
	});
	$scope.$on('reservationCardClicked',function(){
		$scope.$broadcast('reservationCardisClicked');
	});
	$scope.$on('CHANGEAVATAR', function(event, data){
	 	console.log("--------+++-------------");
	 	console.log(data);

	    var imageName = $scope.guestCardData.contactInfo.avatar.split('/')[$scope.guestCardData.contactInfo.avatar.split('/').length-1];
	
	    for (var key in avatharImgs) {
	      if((avatharImgs[key]) == imageName){
	         $scope.guestCardData.contactInfo.avatar  = data;
	      }
	    }
	 	
	 	
	 	
	 	
	 });


//setting the heading of the screen to "Search"
    $scope.heading = "Stay Card";
	$scope.menuImage = "back-arrow";   

	$scope.$on('HeaderChanged', function(event, data){
	 		$scope.heading = data;
	 });
	 
	 $scope.$on('SHOWPAYMENTLIST', function(event, data){
	 		$scope.openPaymentList(data);
	 });
  	 $scope.openPaymentList = function(data){
	 	//	$scope.paymentData.payment_id = id;
  	 	//  $scope.paymentData.index = index;
  	 	  $scope.dataToPaymentList = data;
		  ngDialog.open({
               template: '/assets/partials/payment/rvShowPaymentList.html',
               controller: 'RVShowPaymentListCtrl',
               scope:$scope
          });
	 };

}]);