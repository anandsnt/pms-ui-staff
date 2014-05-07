admin.controller('ADFrequentFlyerProgramCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADFrequentFlyerProgramSrv','ngTableParams','$filter',
function($scope, $state, $rootScope, $stateParams, ADFrequentFlyerProgramSrv, ngTableParams, $filter) {
	BaseCtrl.call(this, $scope);

	$scope.fetchFFP = function() {
		var callback = function (data) {
			$scope.ffp = data.frequent_flyer_program;

			$scope.tableParams = new ngTableParams({
		        page: 1,            // show first page
		        count: $scope.ffp.length,    // count per page - Need to change when on pagination implemntation
		        sorting: {
		            name: 'asc'     // initial sorting
		        }
			},
			{
		        total: $scope.ffp.length, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var orderedData = params.sorting() ? $filter('orderBy')($scope.ffp, params.orderBy()) : $scope.ffp;
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        }
		    });

		    $scope.$emit('hideLoader');
		}

		$scope.invokeApi(ADFrequentFlyerProgramSrv.fetch, {}, callback);
	};

	$scope.fetchFFP();


	

	/**
	 *   A post method to update Frequent Flyer Program  for a hotel
	 *   @param {String} index value for the Frequent Flyer Program List item.
	 */

	$scope.toggleClicked = function() {

		var item = this.item;

		var data = {
			'id' : item.id,
			'set_active' : item.is_active ? false : true
		};

		var postSuccess = function() {
			$scope.$emit('hideLoader');
			item.is_active = item.is_active ? false : true;
		};

		$scope.invokeApi(ADFrequentFlyerProgramSrv.switchToggle, data, postSuccess);
	};

}]);
