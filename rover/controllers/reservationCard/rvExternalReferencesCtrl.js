sntRover.controller('rvExternalReferencesCtrl', ['$rootScope', '$scope', 'RVExternalReferencesSrv',
	function($rootScope, $scope, RVExternalReferencesSrv) {

		var onFailure = function(errorMessage) {
				$scope.errorMessage = errorMessage;
			},
			save = function(reference) {
				var onSaveSuccess = function(response) {
						reference.id = response.id;
					},
					options = {
						params: {
							reference: reference,
							reservationId: $scope.reservationParentData.reservationId
						},
						successCallBack: onSaveSuccess,
						failureCallBack: onFailure
					};

				$scope.callAPI(RVExternalReferencesSrv.save, options);
			},
			update = function(reference) {
				var onUpdateSuccess = function() {
						$scope.errorMessage = "";
					},
					options = {
						params: {
							reference: reference,
							reservationId: $scope.reservationParentData.reservationId
						},
						successCallBack: onUpdateSuccess,
						failureCallBack: onFailure
					};

				$scope.callAPI(RVExternalReferencesSrv.update, options);
			},
			remove = function(reference) {
				var onDeleteSuccess = function() {
						if ($scope.stateExternalRef.references.length === 1) {
							$scope.stateExternalRef.references.push(RVExternalReferencesSrv.getEmptyRow());
						}
						$scope.stateExternalRef.references = _.without($scope.stateExternalRef.references, reference);

					},
					options = {
						params: {
							referenceId: reference.id,
							reservationId: $scope.reservationParentData.reservationId
						},
						successCallBack: onDeleteSuccess,
						failureCallBack: onFailure
					};

				$scope.callAPI(RVExternalReferencesSrv.remove, options);
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
				},
				initializeData = function(response) {
					$scope.stateExternalRef.thirdParties = response.systems;
					$scope.stateExternalRef.references = response.references;
					toggleView();
				},
				options = {
					params: $scope.reservationParentData.reservationId,
					successCallBack: initializeData
				};

			if (!$scope.stateExternalRef.viewDetails) {
				$scope.callAPI(RVExternalReferencesSrv.getExternalData, options);
			} else {
				toggleView();
			}
		};

		$scope.deleteReference = function(reference) {
			if (reference.id) {
				remove(reference);
			}
		};

		$scope.addNewRow = function() {
			$scope.stateExternalRef.references.push(RVExternalReferencesSrv.getEmptyRow());
			$scope.refreshReservationDetailsScroller(100);
		};

		$scope.onEditReference = function(reference, event) {
			if (!reference.id && reference.external_interface_type_id && reference.external_confirm_no) {
				save(reference);
			} else if (reference.id) {
				update(reference);
			}
		};
	}
]);