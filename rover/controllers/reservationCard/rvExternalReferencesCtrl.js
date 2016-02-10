sntRover.controller('rvExternalReferencesCtrl', ['$rootScope', '$scope', 'RVExternalReferencesSrv',
	function($rootScope, $scope, RVExternalReferencesSrv) {
		BaseCtrl.call(this, $scope);

		var onFailure = function(errorMessage) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = errorMessage;
			},
			save = function(reference) {
				var onSaveSuccess = function(response) {
					reference.id = response;
					$scope.$emit('hideLoader');
				};

				$scope.invokeApi(RVExternalReferencesSrv.save, {
					reference: reference,
					reservationId: $scope.reservationParentData.reservationId
				}, onSaveSuccess, onFailure);
			},
			update = function(reference) {
				var onUpdateSuccess = function() {

					},
					onUpdateFailure = function() {

					};

				$scope.invokeApi(RVExternalReferencesSrv.update, reference, onUpdateSuccess, onFailure);
			},
			remove = function() {
				var onDeleteSuccess = function() {

					},
					onDeleteFailure = function() {

					};
				$scope.invokeApi(RVExternalReferencesSrv.remove, reference, onUpdateSuccess, onFailure);
			};

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
				$scope.invokeApi(RVExternalReferencesSrv.getExternalData,
					$scope.reservationParentData.reservationId,
					function(reponse) {
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

		$scope.deleteReference = function() {

		};

		$scope.addNewRow = function() {

		};

		$scope.onEditReference = function(reference) {
			if (!reference.id && reference.external_interface_type_id && reference.external_confirm_no) {
				save(reference);
			} else if (reference.id) {
				update(reference);
			}
		};

	}
]);