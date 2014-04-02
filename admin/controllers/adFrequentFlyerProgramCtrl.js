admin.controller('ADFrequentFlyerProgramCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADFrequentFlyerProgramSrv',
function($scope, $state, $rootScope, $stateParams, ADFrequentFlyerProgramSrv) {
	BaseCtrl.call(this, $scope);

	var fetchSuccess = function(data) {
		$scope.data = data;
		$scope.$emit('hideLoader');
	};
	$scope.invokeApi(ADFrequentFlyerProgramSrv.fetch, {}, fetchSuccess);

	/**
	 *   A post method to update Frequent Flyer Program  for a hotel
	 *   @param {String} index value for the Frequent Flyer Program List item.
	 */

	$scope.toggleClicked = function(index) {

		// checkedStatus will be true, if it checked
		// show confirm if it is going turn on stage
		var setActive = $scope.data.frequent_flyer_program[index].is_active == 'true' ? 'false' : 'true';

		var data = {
			'id' : $scope.data.frequent_flyer_program[index].id,
			'set_active' : setActive
		};

		var postSuccess = function() {
			$scope.data.frequent_flyer_program[index].is_active = ($scope.data.frequent_flyer_program[index].is_active == 'true') ? 'false' : 'true';
			$scope.$emit('hideLoader');
		};

		$scope.invokeApi(ADFrequentFlyerProgramSrv.postFrequentFlyerProgramToggle, data, postSuccess);
	};

}]);
