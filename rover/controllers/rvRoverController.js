sntRover.controller('roverController',['$rootScope', '$scope', '$state','$window','RVDashboardSrv','ngDialog','$translate', function($rootScope, $scope, $state,$window,RVDashboardSrv,ngDialog, $translate){
	
 	  // if (sntapp.cardSwipeDebug ===  true)  { sntapp.cardReader.startReaderDebug(options) } ;
      // if(sntapp.cordovaLoaded){ sntapp.cardReader.startReader(options) }; 
//       
	$scope.successCallBackSwipe = function(){
		alert("succ")
	};
	
	$scope.failureCallBackSwipe = function(){
		alert("fail")
	};
	
     var options = [];
	 options["successCallBack"] = $scope.successCallBackSwipe;
	 options["failureCallBack"] = $scope.failureCallBackSwipe;
	 sntapp.setBrowser("rv_native");
	 if(sntapp.cordovaLoaded){ sntapp.cardReader.startReader(options) }; 
      // sntapp.cardReader.startReader(options) 
	
	
	
    $scope.$on("closeDrawer", function(){      
      $scope.menuOpen = false;  
      $scope.isMenuOpen();
    });

    $scope.isMenuOpen = function(){
      return $scope.menuOpen ? true : false;
    };


    $scope.$on("showLoader", function(){
        $scope.hasLoader = true;
    });

    $scope.$on("hideLoader", function(){
        $scope.hasLoader = false;
    }); 


    $scope.init = function () {
      BaseCtrl.call(this, $scope);
      $rootScope.adminRole = '';
      $scope.selectedMenuIndex = 0;
      /*
      * retrieve user info
      */
      $scope.fetchData = function(){   
  	    var fetchUserInfoSuccessCallback = function(data){
  	        $scope.userInfo = data;
  	        $scope.isPmsConfigured = $scope.userInfo.is_pms_configured;
  	        $rootScope.adminRole=$scope.userInfo.user_role;
  	        if($rootScope.adminRole == "Hotel admin" )
  	            $scope.isHotelAdmin =  true;
  	        if($rootScope.adminRole == "Hotel staff" )
  	            $scope.isHotelStaff =  true;
  	        $scope.$emit('hideLoader');
  	        $scope.getLanguage();
  	    };
  	    var fetchUserInfoFailureCallback = function(data){
  	        $scope.$emit('hideLoader');
  	    };
  	    $scope.invokeApi(RVDashboardSrv.fetchUserInfo,{},fetchUserInfoSuccessCallback,fetchUserInfoFailureCallback);  

    };   
	// Show a loading message until promises are not resolved
	$scope.$emit('showLoader');
	
	// if menu is open, close it
	 $scope.isMenuOpen();
    $scope.fetchData();
    $scope.menuOpen = false;
};
/*
 * Success callback of get language
 * @param {object} response
 */
$scope.fetchHotelDetailsSuccessCallback = function(data){

	 if(data.language)
    $translate.use(data.language.value);
   else
    $translate.use('EN');
	 $scope.$emit('hideLoader');

};
/*
 * Function to get the current hotel language
 */
$scope.getLanguage = function(){
	$scope.invokeApi(RVDashboardSrv.fetchHotelDetails,{},$scope.fetchHotelDetailsSuccessCallback);  
};

$scope.init();

/*
   * update selected menu class
   */

$scope.$on("updateRoverLeftMenu", function(e,value){
  $scope.selectedMenuIndex = value;
});

/*
   * toggle action of drawer
   */

$scope.$on("navToggled", function(){
  $scope.menuOpen = !$scope.menuOpen;
});




//when state change start happens, we need to show the activity activator to prevent further clicking
//this will happen when prefetch the data
$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) { 
	// Show a loading message until promises are not resolved
	$scope.$emit('showLoader');
	
	// if menu is open, close it
	$scope.isMenuOpen();
});

$rootScope.$on('$stateChangeSuccess', function(e, curr, prev) { 
	// Hide loading message
	$scope.$emit('hideLoader');
}); 
$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
	// Hide loading message
	$scope.$emit('hideLoader');
	//TODO: Log the error in proper way
});

$scope.settingsClicked = function(){
  if($scope.isHotelAdmin){
    $scope.selectedMenuIndex = "settings";
   $window.location.href = "/admin";
 }
  else if($scope.isHotelStaff){
          ngDialog.open({
               template: '/assets/partials/settings/rvStaffSettingModal.html',
               controller: 'RVStaffsettingsModalController',
               className: 'ngdialog-theme-plain calendar-modal'
          });
  }
};


$scope.showAddNewPaymentModal = function(passData, paymentData){
	  $scope.passData = passData;
	  $scope.paymentData = paymentData;
	  ngDialog.open({
               template: '/assets/partials/payment/rvPaymentModal.html',
               controller: 'RVPaymentMethodCtrl',
               scope:$scope
          });
};

 $scope.$on('GUESTPAYMENTDATA', function(event, paymentData) {
 	$scope.$broadcast('GUESTPAYMENT', paymentData);
 });
 $scope.closeDialog = function(){
 	$scope.$emit('hideLoader');
 	ngDialog.close();
 };

}]);
