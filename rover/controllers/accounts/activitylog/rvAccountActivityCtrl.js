sntRover.controller('rvAccountActivityCtrl', [
	'$scope', 
	'$rootScope', 
	'$filter', 
	'$stateParams',
	'rvGroupAccountActivitySrv',
	function($scope, $rootScope, $filter, $stateParams,rvGroupAccountActivitySrv) {
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
			 	"type":"account",
			 	"per_page":50
			 }
			var fetchCompleted = function(data){			
				$scope.$broadcast('PopulateLogData',data)
			}
			$scope.invokeApi(rvGroupAccountActivitySrv.fetchActivityLog, params, fetchCompleted);
		}
		$scope.$on('updateLogdata',function(e,params){			
			params["id"]= $scope.selectedGroupOrAccountId;
			params["type"] = "account";
			var fetchCompleted = function(data){
				$scope.$broadcast('PopulateLogData',data)
			}
			$scope.invokeApi(rvGroupAccountActivitySrv.fetchActivityLog, params, fetchCompleted);
				
		})		
		/**
		 *Show starts here!!!!
		 */
		 $scope.init();
		
	}
]);