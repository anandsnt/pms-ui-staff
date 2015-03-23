sntRover.controller('rvGroupConfigurationCtrl', ['$scope', '$rootScope', 'rvGroupSrv', '$filter', '$stateParams', 'rvGroupConfigurationSrv',
	function($scope, $rootScope, rvGroupSrv, $filter, $stateParams, rvGroupConfigurationSrv) {
		BaseCtrl.call(this, $scope);


		var title = $stateParams.id === "NEW_GROUP" ? $filter('translate')('NEW_GROUP') : $filter('translate')('GROUPS');
		$scope.setHeadingTitle(title);

		$scope.groupConfigState = {
			activeTab: $stateParams.activeTab, // Possible values are SUMMARY, ROOM_BLOCK, ROOMING, ACCOUNT, TRANSACTIONS, ACTIVITY
			summary: {}
		}

		var initGroupConfig = function() {
			var onFetchSummarySuccess = function(summary) {
				$scope.$emit('hideLoader');
				$scope.groupConfigState.summary = summary.summary;
			}

			var onFetchSummaryFailure = function(errorMessage) {
				$scope.$emit('hideLoader');
			}

			$scope.invokeApi(rvGroupConfigurationSrv.getGroupSummary, {
				groupId: $stateParams.id
			}, onFetchSummarySuccess, onFetchSummaryFailure);
		}

		$scope.openDemographicsPopup = function(){
			console.log('openDemographicsPopup');
		}

		initGroupConfig();

	}
]);