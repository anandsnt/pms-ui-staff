sntRover.controller('rvAccountActivityCtrl', [
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
			$scope.selectedGroupOrAccountId =$scope.$parent.accountConfigData.summary.posting_account_id;
			 var params = {
			 	"id":$scope.selectedGroupOrAccountId,
			 	"page":1,
			 	"perPage":50
			 }
			var fetchCompleted = function(data){			
				$scope.$broadcast('PopulateLogData',data)
			}
			$scope.invokeApi(rvGroupActivitySrv.fetchActivityLog, params, fetchCompleted);
		}
		$scope.$on('updateLogdata',function(e,params){			
			params["id"]=$scope.selectedGroupOrAccountId;
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