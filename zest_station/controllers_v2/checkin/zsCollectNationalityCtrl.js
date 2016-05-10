sntZestStation.controller('zsCollectNationalityCtrl', [
	'$scope',
	'$state',
	'zsEventConstants',
	'$stateParams',
	'$sce', 'countryList', 'zsCheckinSrv',
	function($scope, $state, zsEventConstants, $stateParams, $sce, countryList, zsCheckinSrv) {

		/**********************************************************************************************
		**		Please note that, not all the stateparams passed to this state will not be used in this state, 
        **      however we will have to pass this so as to pass again to future states which will use these.
		**
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
         * when the back button clicked
         * @param  {[type]} event
         * @return {[type]}
         */
        $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
            $state.go('zest_station.checkInReservationSearch');
        });

		/**
		 * [initializeMe description]
		 * @return {[type]} [description]
		 */
		var initializeMe = function() {
			//hide back button
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