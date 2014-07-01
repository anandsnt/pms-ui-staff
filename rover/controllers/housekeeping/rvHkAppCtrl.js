sntRover.controller('RVHkAppCtrl', [
	'$rootScope',
	'$scope',
	'$state',
	'ngDialog',
	function($rootScope, $scope, $state, ngDialog) {

		//when state change start happens, we need to show the activity activator to prevent further clicking
		//this will happen when prefetch the data
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) { 
		    // Show a loading message until promises are not resolved
		    $scope.$emit('showLoader');
		});

		$rootScope.$on('$stateChangeSuccess', function(e, curr, prev) { 
		    // Hide loading message
		    $scope.$emit('hideLoader');
		}); 

		$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
		    // Hide loading message
		    // TODO: Log the error in proper way
		    $scope.$emit('hideLoader');
		});

		$scope.$on("filterRoomsClicked", function(){
			$scope.filterOpen = !$scope.filterOpen;
		});

		$scope.$on('showLoader', function(){
		    $scope.hasLoader = true;
		});

		$scope.$on('hideLoader', function(){
		    $scope.hasLoader = false;
		});


		$scope.isRoomFilterOpen = function(){
		    return $scope.filterOpen;
		};

		$scope.$on("dismissFilterScreen", function(){
		    $scope.filterOpen = false;
		});
		            
		$scope.$on("showFilterScreen",function(){
		    $scope.filterOpen = true;
		});

		/**
		* Handles the OWS error - Shows a popup having OWS connection test option
		*/
		$rootScope.showOWSError = function() {

		    // Hide loading message
		    $scope.$emit('hideLoader');

		    ngDialog.open({
		        template: '/assets/partials/housekeeping/rvHkRoomDetails.html',
		        className: 'ngdialog-theme-default modal-theme',
		        controller: 'RVHkOWSErrorCtrl',
		        closeByDocument: false,
		        scope: $scope
		    });
		};
	}
]);


// adding an OWS check Interceptor here
// but should be moved to higher up above in root level
sntRover.factory('owsCheckInterceptor', function ($rootScope, $q, $location) {
	return {
		request: function (config) {
			return config;
		},
		response: function (response) {
    		return response || $q.when(response);
		},
		responseError: function(rejection) {
			if(rejection.status == 520 && rejection.config.url !== '/admin/test_pms_connection') {
				$rootScope.showOWSError && $rootScope.showOWSError();
			}
			return $q.reject(rejection);
		}
	};
});

sntRover.config(function ($httpProvider) {
	$httpProvider.interceptors.push('owsCheckInterceptor');
});