// list all the reservation tools list
// since we can only bring the main menu states from db

admin.controller('ADBalanceInventoryCtrl', [
	'$scope',
	'ADReservationToolsSrv',
	function($scope, ADReservationToolsSrv) {
		BaseCtrl.call(this, $scope);

		$scope.errorMessage = "";

		/*	
		 *	Handle Sync button click.
		 */
		$scope.clickedSyncButton = function() {
			var successCallback = function() {
				$scope.anyJobRunning = true;
			},
			failureCallback = function(errorMessage) {
				$scope.errorMessage = errorMessage;
			},
			data = {},
			options = {
				params: data,
				successCallBack: successCallback,
				failureCallBack: failureCallback
			};

			$scope.callAPI(ADReservationToolsSrv.reSyncRates, options);
		};
	}
]);