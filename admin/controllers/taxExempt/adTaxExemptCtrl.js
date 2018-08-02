admin.controller('ADTaxExemptCtrl', ['$scope', '$state', '$timeout', 'ngTableParams', 'ADTaxExemptSrv',
function($scope, $state, $timeout, ngTableParams, ADTaxExemptSrv) {
	BaseCtrl.call(this, $scope);
	ADBaseTableCtrl.call(this, $scope, ngTableParams);

	$scope.$emit("changedSelectedMenu", 5);
	/*
	 * To delete the tax exempts
	 * @param taxExemptId is tax exempt id
	 */
	$scope.deleteTaxExempt = function(taxExemptId) {
		var successCallBack = function() {
				$state.reload();
			},
			options = {
				params: {
					"id": taxExemptId
				},
				onSuccess: successCallBack
			};

		$scope.callAPI(ADTaxExemptSrv.deleteTaxExempts, options);
	};
	/*
	 * To fetch the tax exempts
	 * @param params is the params for pagination
	 */
	$scope.fetchTaxExempts =  function($defer, params) {

		var getParams = $scope.calculateGetParams(params),
			successCallBack = function(data) {
					$scope.totalCount = data.total_count;
					$scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
					$scope.data = data.results;
					$scope.currentPage = params.page();
					params.total(data.total_count);
					$defer.resolve($scope.data);
			},
			options = {
				params: getParams,
				onSuccess: successCallBack
			};

		$scope.callAPI(ADTaxExemptSrv.fetchTaxExempts, options);
	};
	/*
	 * To implement pagination
     */
	$scope.loadTable = function() {
		$scope.tableParams = new ngTableParams({
				page: 1,  // show first page
				count: $scope.displyCount // count per page
		
			}, {
				total: 0, // length of data
				getData: $scope.fetchTaxExempts
			}
		);
	};

	$scope.loadTable();
}]);
