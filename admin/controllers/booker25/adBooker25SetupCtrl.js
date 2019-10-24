admin.controller('adBooker25SetupCtrl', ['$scope', 'booker25SetupValues', 'adBooker25SetupSrv', function($scope, booker25SetupValues, adBooker25SetupSrv) {
	
	BaseCtrl.call (this, $scope);
	
	/**
	 * when clicked on check box to enable/diable letshare 
	 * @return {undefiend}
	 */
	$scope.toggleBooker25Enabled = function() {
		$scope.booker25.enabled = !$scope.booker25.enabled;
	};

	/**
	 * when the save is success
	 */
	var successCallBackOfSaveBooker25Setup = function(data) {
		$scope.goBackToPreviousState();
	};

	/**
	 * when we clicked on save button
	 * @return {undefiend}
	 */
	$scope.saveBooker25Setup = function() {
		var params 	= {
            booker25: $scope.booker25
		};
        var options = {
            params: params,
            successCallBack: successCallBackOfSaveBooker25Setup
        };

        $scope.callAPI(adBooker25SetupSrv.saveBooker25Configuration, options);
	};

	/**
	 * Initialization stuffs
	 * @return {undefiend}
	 */
	var initializeMe = (function() {
		$scope.booker25 = {};
		$scope.booker25.enabled = booker25SetupValues.enabled;
	}());
}]);
