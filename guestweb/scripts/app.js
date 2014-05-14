
var snt = angular.module('snt',['ngRoute','ui.bootstrap','pickadate']);

snt.controller('rootController', ['$rootScope','$scope','$attrs', 'UserService','$location','authenticationService', function($rootScope,$scope,$attrs, UserService,$location,authenticationService) {




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

   
   	if(($attrs.reservationStatus ==='CHECKIN') && ($attrs.isActiveToken ==='false'))
		$location.path('/checkinSuccess');
	else if($rootScope.isCheckin)
		$location.path('/checkinConfirmation');
	else if($rootScope.isCheckedout)
		$location.path('/checkOutNowSuccess');
	else if($attrs.isLateCheckoutAvailable  === 'false')
		$location.path('/checkOutNow');



	if($attrs.accessToken != "undefined")
		$rootScope.accessToken = $attrs.accessToken	;



}]);



(function() {
	var checkOutLandingController = function($rootScope,$location) {
		//if checkout is already done

  	if($rootScope.isCheckedin)
		$location.path('/checkinSuccess');
	else if($rootScope.isCheckin)
		$location.path('/checkinConfirmation');
	else if($rootScope.isCheckedout)
		$location.path('/checkOutNowSuccess');
	else if(!$rootScope.isLateCheckoutAvailable)
		$location.path('/checkOutNow');
	}


	var dependencies = [
	'$rootScope','$location',
	checkOutLandingController
	];

	snt.controller('checkOutLandingController', dependencies);
})();


snt.filter('customizeLabelText', function () {
    return function (input, scope) {
        return input.substring(0, 1) +" ' "+ input.substring(1, 2).toBold() +" ' "+ input.substring(2);
    }
});



