sntRover.controller('rvGroupActivityCtrl', [
	'$scope', 
	'$rootScope', 
	'$filter', 
	'$stateParams',
	'rvGroupActivitySrv',
	function($scope, $rootScope, $filter, $stateParams,rvGroupActivitySrv) {
		BaseCtrl.call(this, $scope);		

		/**		
		 * initialisation and basic configuration
		 * @return {none}
		 */
		$scope.init = function(){		
			
			$scope.selectedGroupOrAccountId = $scope.$parent.groupConfigData.summary.group_id;
			 var params = {
			 	"group_id":$scope.selectedGroupOrAccountId,
			 	"page":1,
			 	"perPage":50
			 }
			var fetchCompleted = function(data){			
				$scope.$broadcast('PopulateLogDataForGroup',data)
			}
			$scope.invokeApi(rvGroupActivitySrv.fetchActivityLog, params, fetchCompleted);
		}
		$scope.$on('update',function(e,params){
			params["id"]=$scope.selectedGroupOrAccountId;
			var fetchCompleted = function(data){
				$scope.$broadcast('PopulateLogDataForGroup',data)
			}
			$scope.invokeApi(rvGroupActivitySrv.fetchActivityLog1, params, fetchCompleted);
				
		})		
		/**
		 *Show starts here!!!!
		 */
		 $scope.init();
		
	}
]);