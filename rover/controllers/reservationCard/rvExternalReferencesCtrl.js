sntRover.controller('rvExternalReferencesCtrl', ['$rootScope', '$scope', 'RVExternalReferencesSrv', '$filter',
	function($rootScope, $scope, RVExternalReferencesSrv, $filter) {
		BaseCtrl.call(this, $scope);

		var resetScroller = function(timer) {
				$scope.$emit("CHILD_CONTENT_MOD", timer || 0);
			},
			save = function(reference) {
				var onSaveSuccess = function(response) {
						$scope.errorMessage = "";
						reference.id = response.id;
					},
					options = {
						params: {
							reference: reference,
							reservationId: $scope.reservationParentData.reservationId
						},
						successCallBack: onSaveSuccess
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
						successCallBack: onUpdateSuccess
					};

				$scope.callAPI(RVExternalReferencesSrv.update, options);
			},
			remove = function(reference) {
				var onDeleteSuccess = function() {
						$scope.errorMessage = "";
						if ($scope.stateExternalRef.references.length === 1) {
							$scope.stateExternalRef.references.push(RVExternalReferencesSrv.getEmptyRow());
						}
						$scope.stateExternalRef.references = _.without($scope.stateExternalRef.references, reference);
						resetScroller();
					},
					options = {
						params: {
							referenceId: reference.id,
							reservationId: $scope.reservationParentData.reservationId
						},
						successCallBack: onDeleteSuccess
					};

				$scope.callAPI(RVExternalReferencesSrv.remove, options);
			};

		$scope.stateExternalRef = {
			viewDetails: false,
			thirdParties: [],
			references: []
		};

		$scope.toggleDetails = function() {
			var toggleView = function() {
					$scope.stateExternalRef.viewDetails = !$scope.stateExternalRef.viewDetails;
					resetScroller(100);
				},
				initializeData = function(response) {
					$scope.stateExternalRef.thirdParties = response.systems;
					$scope.stateExternalRef.references = response.references;
					_.each($scope.stateExternalRef.references, function (reference) {
						if(reference.is_primary){
							reference.external_confirm_no += $filter('translate')('PRIMARY_EXTERNAL_REFERENCE');
						}
					});
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
			resetScroller(100);
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