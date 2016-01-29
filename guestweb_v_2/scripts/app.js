/*

There are different ways to invoke guest web. 

User can send mail from hotel admin or use direct URL for checkin and checkout. 

But the options available for different hotels are different. 
So make sure the hotel admin settings for checkin and checkout are turned on or off w.r.t . 
You can see all the available options for a hotel in the router file for the corresponding hotel. 
If because of some settings, if user tries to go to a state not listed in the app router (eg:app_router_yotel.js)
for the hotel ,the user will be redirected to no options page.

The initial condtions to determine the status of reseravations are extracted from the embedded data in the HTML.


Initially we had a set of HTMLs for every single hotel.

Now we are trying to minimize the difference to use the same templates as much possible.

The new set of HTMLs can be found under the folder common_templates. inside that we have generic templates
and some folder dedicated to MGM, which has some text changes specifically asked by client.

*/
var sntGuestWebTemplates = angular.module('sntGuestWebTemplates',[]);
var sntGuestWeb = angular.module('sntGuestWeb',['ui.router','ui.bootstrap','pickadate', 'oc.lazyLoad']);
sntGuestWeb.controller('rootController', ['$state', '$scope', function($state, $scope){
	$state.go('guestwebRoot');
	/*
	 * function to handle exception when state is not found
	 */
	$scope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
		event.preventDefault();
		$state.go('noOptionAvailable'); 
	});
}]);
sntGuestWeb.controller('homeController', ['$scope',
 function($scope) {
	
}]);








