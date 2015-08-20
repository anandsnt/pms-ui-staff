admin.controller('ADOriginsCtrl', ['$scope', 'ADOriginsSrv', '$anchorScroll', '$timeout', '$location',
	function($scope, ADOriginsSrv, $anchorScroll, $timeout, $location) {
		BaseCtrl.call(this, $scope);
		$scope.$emit("changedSelectedMenu", 7);
		$scope.currentClickedElement = -1;
		$scope.state = {
			editStore: {}
		};

		/*
		 * To fetch charge origins list
		 */
		var fetchSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.data = data;
		};

		$scope.invokeApi(ADOriginsSrv.fetch, {}, fetchSuccessCallback);

		/*
		 * To handle enable/disable of use origins
		 */
		$scope.clickedUsedOrigins = function() {
			$scope.invokeApi(ADOriginsSrv.toggleUsedOrigins, {
				'is_use_origins': $scope.data.is_use_origins
			});
		};

		/*
		 * To render edit screen
		 * @param {int} index index of selected origins
		 */
		$scope.editItem = function(index) {
			$scope.currentClickedElement = index;
			$scope.state.editStore = angular.copy($scope.data.booking_origins[index]);
		};

		$scope.setDefaultOriginSiteminder = function() {};



		/*
		 * To get the template of edit screen
		 * @param {int} index of the selected item
		 */
		$scope.getTemplateUrl = function(index) {
			if ($scope.currentClickedElement === index) {
				return "/assets/partials/origins/adOriginsEdit.html";
			}
		};

		/*
		 * To handle cancel click
		 */
		$scope.clickedCancel = function() {
			$scope.data.name = "";
			$scope.currentClickedElement = -1;
		};

		/*
		 * To handle add new button click
		 */
		$scope.addNewClicked = function() {
			$scope.currentClickedElement = 'new';
			$timeout(function() {
				$location.hash('add-new');
				$anchorScroll();
			});
		};

		/*
		 * To handle save button in add new box.
		 */
		$scope.saveAddNew = function() {
			var postSuccess = function(data) {
				$scope.$emit('hideLoader');
				$scope.currentClickedElement = -1;
				$scope.data.name = "";
				$scope.data.booking_origins.push(data);
			};
			$scope.invokeApi(ADOriginsSrv.save, {
				'name': $scope.data.name
			}, postSuccess);
		};

		/*
		 * To handle save button in edit box.
		 */
		$scope.updateItem = function(index) {
			var postSuccess = function() {
					$scope.$emit('hideLoader');
					if ($scope.currentClickedElement !== -1) {
						$scope.data.booking_origins[$scope.currentClickedElement].name = $scope.state.editStore.name;
					}
					$scope.currentClickedElement = -1;
				},
				data = index === undefined ? $scope.state.editStore :
				$scope.data.booking_origins[index];
			$scope.invokeApi(ADOriginsSrv.update, data, postSuccess);
		};

		/*
		 * To handle delete button in edit box and list view.
		 */
		$scope.clickedDelete = function(id) {
			var successDeletionCallback = function() {
				$scope.$emit('hideLoader');
				$scope.currentClickedElement = -1;
				// delete data from scope
				angular.forEach($scope.data.booking_origins, function(item, index) {
					if (item.value === id) {
						$scope.data.booking_origins.splice(index, 1);
					}
				});
			};
			$scope.invokeApi(ADOriginsSrv.deleteItem, {
				'value': id
			}, successDeletionCallback);
		};
	}
]);