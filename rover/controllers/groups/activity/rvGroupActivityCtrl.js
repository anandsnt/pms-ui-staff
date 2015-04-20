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
			 	"id":$scope.selectedGroupOrAccountId,
			 	"page":1,
			 	"type":"group",
			 	"perPage":50
			 }
			var fetchCompleted = function(data){			
				$scope.$broadcast('PopulateLogData',data)
			}
			$scope.invokeApi(rvGroupActivitySrv.fetchActivityLog, params, fetchCompleted);
		}
		$scope.$on('updateLogdata',function(e,params){
			params["id"]=$scope.selectedGroupOrAccountId;
			params["type"] = "group";
			var fetchCompleted = function(data){
				$scope.$broadcast('PopulateLogData',data)
			}
			$scope.invokeApi(rvGroupActivitySrv.fetchActivityLog1, params, fetchCompleted);
				
		})		
		/**
		 *Show starts here!!!!
		 */
		 $scope.init();
		
	}
]);