sntZestStation.controller('zsCollectNationalityCtrl', [
	'$scope',
	'$state',
	'zsEventConstants',
	'$stateParams',
	'$sce', 'countryList', 'zsCheckinSrv',
	function($scope, $state, zsEventConstants, $stateParams, $sce, countryList, zsCheckinSrv) {

		BaseCtrl.call(this, $scope);
		sntZestStation.filter('unsafe', function($sce) {
			return function(val) {
				return $sce.trustAsHtml(val);
			};
		});
		/**
		 * when the back button clicked
		 * @param  {[type]} event
		 * @return {[type]} 
		 */
		$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
			$state.go('zest_station.checkInReservationSearch');
		});

		$scope.navToPrev = function() {
			$scope.$emit(zsEventConstants.CLICKED_ON_BACK_BUTTON);
		};

		$scope.init = function() {
			$scope.countryList = countryList;
			$scope.nationalityId = "";
		};

		/**
		 * [initializeMe description]
		 * @return {[type]} [description]
		 */
		var initializeMe = function() {
			//show back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
			//show close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);

			$scope.init();
		}();

		$scope.saveNationality = function() {
			var successCallBack = function() {
				$state.go('zest_station.checkInReservationDetails');
			};
			var options = {
				params: {
					guest_id: $stateParams.guestId,
					nationality_id: $scope.nationalityId
				},
				successCallBack: successCallBack
			}
			$scope.callAPI(zsCheckinSrv.saveNationality, options);
		};
	}
]);