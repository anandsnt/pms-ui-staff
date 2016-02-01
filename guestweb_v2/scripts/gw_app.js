/*

There are different ways to invoke guest web. 

User can send mail from hotel admin or use direct URL for checkin and checkout. 

But the options available for different hotels are different. 
So make sure the hotel admin settings for checkin and checkout are turned on or off w.r.t . 
You can see all the available options for a hotel in the router file for the corresponding hotel. 
If because of some settings, if user tries to go to a state not listed in the app router (eg:app_router_yotel.js)
for the hotel ,the user will be redirected to no options page.

The initial condtions to determine the status of reseravations are extracted from the URL(calling API based on params in URL).

*/

var sntGuestWebTemplates = angular.module('sntGuestWebTemplates',[]);

var sntGuestWeb = angular.module('sntGuestWeb',['ui.router','ui.bootstrap','pickadate','oc.lazyLoad']);
sntGuestWeb.controller('rootController', ['$scope','$rootScope','$state', function($scope,$rootScope,$state){
	
	$scope.loading = true;
    $state.go('guestwebRoot');
    $scope.$on('SHOW_LOADER',function(){$scope.loading = true;});
    $scope.$on('HIDE_LOADER',function(){$scope.loading = false;});

    //in order to prevent url change or fresh url entering with states
    var routeChange = function(event, newURL) {
      event.preventDefault();
      return;
    };

    $rootScope.$on('$locationChangeStart', routeChange);
    //we are forcefully setting top url, please refer routerFile
    window.history.pushState("initial", "Showing Landing Page", "#/guestwebRoot");

    //function to handle exception when state is not found
	$scope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
		event.preventDefault();
		$state.go('noOptionAvailable'); 
	});

}]);

sntGuestWeb.controller('homeController', ['$scope','$state','reservationAndhotelData',
 function($scope,$state,reservationAndhotelData) {
	$scope.$emit('HIDE_LOADER');
	//call Utils functions to save details in a service

	//conditional page navigations
	if(reservationAndhotelData.is_external_verification === "true"){
		$state.go('externalCheckoutVerification'); //external checkout URL
	}
}]);








