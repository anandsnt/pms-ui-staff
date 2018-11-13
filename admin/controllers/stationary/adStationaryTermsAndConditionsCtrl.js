admin.controller('ADStationaryTermsAndConditionsCtrl', ['$scope',
	'ADStationarySrv',
	function($scope, ADStationarySrv) {

		BaseCtrl.call(this, $scope);

		$scope.addNewTermsAndConditions = function() {
			$scope.newTermsAndConditions = {
				title: '',
				description: ''
			};
			$scope.displayNewTermsAndConditionsForm = true;
		};

		$scope.selectedTnCIndex = -1;

		// SELECT TERMS & CONDITIONS
		$scope.customTnCClicked = function(index) {
			$scope.selectedTnCIndex = ($scope.selectedTnCIndex === index) ? -1 : index;
		};
		$scope.cancelTnCSelection = function() {
			$scope.selectedTnCIndex = -1;
		};

		// EDIT TERMS & CONDITIONS
		$scope.deleteCustomTnC = function(entity) {

			var options = {
				params: {
					'locale': $scope.data.locale,
					'id': entity.id
				},
				successCallBack: function() {
					// delete the item from the list
					$scope.customTnCs = _.without($scope.customTnCs, entity);
					$scope.selectedTnCIndex = -1;
				},
				failureCallBack: function(response) {
					$scope.$emit('SHOW_ERROR_MSG', {
						'error': response.errors
					});
				}
			};

			$scope.callAPI(ADStationarySrv.deleteTermsAndConditions, options);
		};

		// UPDATE TERMS & CONDITIONS
		$scope.saveCustomTnC = function(entity) {
			var options = {
				params: {
					'locale': $scope.data.locale,
					'id': entity.id,
					'title': entity.title,
					'description': entity.description
				},
				successCallBack: function() {
					$scope.selectedTnCIndex = -1;
				},
				failureCallBack: function(response) {
					$scope.$emit('SHOW_ERROR_MSG', {
						'error': response.errors
					});
				}
			};

			$scope.callAPI(ADStationarySrv.updateTermsAndConditions, options);
		};

		// NEW TERMS & CONDITIONS
		$scope.cancelNewTnC = function() {
			$scope.displayNewTermsAndConditionsForm = false;
		};

		$scope.saveNewTnC = function() {
			var options = {
				params: {
					'locale': $scope.data.locale,
					'title': $scope.newTermsAndConditions.title,
					'description': $scope.newTermsAndConditions.description
				},
				successCallBack: function(response) {
					var newTnC = {
						id: response.id,
						title: angular.copy($scope.newTermsAndConditions.title),
						description: angular.copy($scope.newTermsAndConditions.description)
					};

					$scope.customTnCs.push(newTnC);
				},
				failureCallBack: function(response) {
					$scope.$emit('SHOW_ERROR_MSG', {
						'error': response.errors
					});
				}
			};

			$scope.callAPI(ADStationarySrv.createNewTermsAndConditions, options);
			$scope.cancelNewTnC();
		};

		// TERMS & CONDITIONS changed
		$scope.termsAndConditionsChanged = function(id, assigned_tc_id) {
			if (assigned_tc_id && id) {
				assigned_tc_id = assigned_tc_id === 'none' ? '' : assigned_tc_id;
				var options = {
					params: {
						'screen_id': id,
						't_and_c_id': assigned_tc_id
					},
					failureCallBack: function(response) {
						$scope.$emit('SHOW_ERROR_MSG', {
							'error': response.errors
						});
					}
				};

				$scope.callAPI(ADStationarySrv.assignTermsAndConditions, options);
			}			
		};

	}
]);