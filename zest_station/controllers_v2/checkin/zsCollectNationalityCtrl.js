sntZestStation.controller('zsCollectNationalityCtrl', [
	'$scope',
	'$state',
	'zsEventConstants',
	'$stateParams',
	'$sce', 'countryList', 'zsCheckinSrv',
	function($scope, $state, zsEventConstants, $stateParams, $sce, countryList, zsCheckinSrv) {

		/**********************************************************************************************
        **      Expected state params -----> guest_id    
        **      Exit function -> successCallBack                              
        **                                                                       
        ***********************************************************************************************/

		BaseCtrl.call(this, $scope);
		sntZestStation.filter('unsafe', function($sce) {
			return function(val) {
				return $sce.trustAsHtml(val);
			};
		});

		$scope.init = function() {
			$scope.countryList = countryList;
			$scope.nationalityId = "";
		};

		/**
		 * [initializeMe description]
		 * @return {[type]} [description]
		 */
		var initializeMe = function() {
			//hide back button
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
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