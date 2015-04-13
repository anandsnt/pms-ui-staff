sntRover.controller('rvGroupActivityCtrl', [
	'$scope', 
	'$rootScope', 
	'$filter', 
	'$stateParams', 
	function($scope, $rootScope, $filter, $stateParams) {
		BaseCtrl.call(this, $scope);		

		/**		
		 * initialisation and basic configuration
		 * @return {none}
		 */
		$scope.init = function(){
			//TODO- remove $scope.count = 10 for test purpose
			$scope.count = 10;			
			$scope.errorMessage = '';			
		}
		
		/**		 
		 * load next page		
		 */
		$scope.loadNextSet = function(){
		//implementation
		console.log(" implement loadNextSet");
		}

		/**
		 * load Previous page		
		 */
		$scope.loadPrevSet = function(){
			//implementation
			console.log(" implement loadPrevSet");
		}
		
		/**		 
		 * for pagination
		 * @return {boolean}		
		 */
		$scope.isPrevButtonDisabled = function(){
			//implementation
		}

		/**		 
		 * for pagination
		 * @return {boolean}		
		 */
		$scope.isNextButtonDisabled = function(){
			//implementation
		}


		/**
		 *Show starts here
		 */
		 $scope.init();
		
	}
]);