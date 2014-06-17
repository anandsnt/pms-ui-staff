
var snt = angular.module('snt',['ui.router','ui.bootstrap','pickadate']);

snt.controller('rootController', ['$rootScope','$scope','$attrs', '$location','$state', function($rootScope,$scope,$attrs,$location,$state) {

	//store basic details as rootscope variables
//store basic details as rootscope variables

	$rootScope.reservationID = $attrs.reservationId;
	$rootScope.hotelName     = $attrs.hotelName;
	$rootScope.userName      = $attrs.userName;
	$rootScope.checkoutDate  = $attrs.checkoutDate;
	$rootScope.checkoutTime  = $attrs.checkoutTime;
	$rootScope.userCity   	 = $attrs.city;
	$rootScope.userState     = $attrs.state;
	$rootScope.roomNo        = $attrs.roomNo;
	$rootScope.isLateCheckoutAvailable  = ($attrs.isLateCheckoutAvailable  === 'true') ? true : false;
	$rootScope.emailAddress  = $attrs.emailAddress;
	$rootScope.hotelLogo     = $attrs.hotelLogo;

	$rootScope.hotelPhone    = $attrs.hotelPhone;
	$rootScope.businessDate  = $attrs.businessDate;
	$rootScope.isCheckedout  = ($attrs.isCheckedout === 'true') ? true : false;
	$rootScope.isCheckin     =   ($attrs.isCheckin ==='true') ? true : false;

	$rootScope.reservationStatusCheckedIn = ($attrs.reservationStatus ==='CHECKIN')? true :false;
  
 	$rootScope.isActiveToken = ($attrs.isActiveToken ==='true') ? true : false;
  
 	$rootScope.isCheckedin  =  ($rootScope.reservationStatusCheckedIn  && !$rootScope.isActiveToken)


    if($attrs.isCheckin ==='true'){
 		$location.path('/checkinConfirmation');
 	}
  	else if($rootScope.isCheckedout)	{
		$state.go('checkOutStatus');	
	}
	else if($attrs.isLateCheckoutAvailable  === 'false'){
		$state.go('checkOutConfirmation');
	}else if($attrs.isLateCheckoutAvailable  === 'true'){
		$state.go('checkOutOptions');
	}

	if($attrs.accessToken != "undefined")
		$rootScope.accessToken = $attrs.accessToken	;

}]);






