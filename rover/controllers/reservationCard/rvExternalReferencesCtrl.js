sntRover.controller('rvExternalReferencesCtrl', ['$rootScope', '$scope', 'RVExternalReferencesSrv',
	function($rootScope, $scope, RVExternalReferencesSrv) {
		BaseCtrl.call(this, $scope);

		$scope.stateExternalRef = {
			viewDetails: false,
			thirdParties: [],
			references: []
		}

		$scope.toggleDetails = function() {
			var toggleView = function() {
				$scope.stateExternalRef.viewDetails = !$scope.stateExternalRef.viewDetails;
				$scope.refreshReservationDetailsScroller(100);
			};

			if (!$scope.stateExternalRef.viewDetails) {
				$scope.invokeApi(RVExternalReferencesSrv.getExternalData, null, function(reponse) {
					$scope.$emit('hideLoader');
					$scope.stateExternalRef.thirdParties = reponse.systems;
					$scope.stateExternalRef.references = reponse.references;
					toggleView();
				}, function() {
					$scope.$emit('hideLoader');
				})
			} else {
				toggleView();
			}
		};

		$scope.deleteReference = function(){
			
		};

		$scope.addNewReference = function(){

		};

	}
]);