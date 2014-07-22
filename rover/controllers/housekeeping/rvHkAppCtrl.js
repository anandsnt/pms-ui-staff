sntRover.controller('RVHkAppCtrl', [
	'$rootScope',
	'$scope',
	'$state',
	'ngDialog',
	function($rootScope, $scope, $state, ngDialog) {

		BaseCtrl.call(this, $scope);
		$scope.setTitle( 'Housekeeping' );

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
	}
]);