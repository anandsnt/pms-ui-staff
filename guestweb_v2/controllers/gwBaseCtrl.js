sntGuestWeb.controller('BaseController', ['$scope', '$state', function($scope, $state) {


	$scope.errorOpts = {
      backdrop: true,
      backdropClick: true,
      templateUrl: '/assets/partials/gwCommonPopup.html',
      controller: 'ModalInstanceCtrl'
    };

	$scope.$on('showLoader', function() {
		$scope.loading = true;
	});
	$scope.$on('hideLoader', function() {
		$scope.loading = false;
	});

	$scope.fetchedCompleted = function(data) {
		$$scope.$emit('hideLoader');
	};

	$scope.fetchedFailed = function(errorMessage) {
		$scope.$emit('hideLoader');
		$state.go('seeFrontDesk');
	};
	$scope.callAPI = function(serviceApi, options) {
		var options = options ? options : {},
			params = options["params"] ? options["params"] : null,
			loader = options["loader"] ? options["loader"] : 'BLOCKER',
			showLoader = loader.toUpperCase() === 'BLOCKER' ? true : false,
			successCallBack = options["successCallBack"] ? options["successCallBack"] : options['onSuccess'] ? options['onSuccess'] : $scope.fetchedCompleted,
			failureCallBack = options["failureCallBack"] ? options["failureCallBack"] : options['onFailure'] ? options['onFailure'] : $scope.fetchedFailed,
			successCallBackParameters = options["successCallBackParameters"] ? options["successCallBackParameters"] : null,
			failureCallBackParameters = options["failureCallBackParameters"] ? options["failureCallBackParameters"] : null;

		if (showLoader) {
			$scope.$emit('showLoader');
		}


		return serviceApi(params).then(
			// success call back
			function(data) {
				if (showLoader) {
					$scope.$emit('hideLoader');
				}
				if (successCallBack) {
					if (successCallBackParameters) {
						successCallBack(data, successCallBackParameters);
					} else {
						successCallBack(data);
					}
				}
			},
			// failure callback
			function(error) {
				if (showLoader) {
					$scope.$emit('hideLoader');
				}
				if (failureCallBack) {
					if (failureCallBackParameters) {
						failureCallBack(error, failureCallBackParameters);
					} else {
						failureCallBack(error);
					}
				}
			}
		);
	};
}]);