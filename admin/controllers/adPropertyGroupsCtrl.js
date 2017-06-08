admin.controller('ADPropertyGroupsCtrl', ['$scope', '$stateParams', 'ADPropertyGroupsSrv', 'ngTableParams', '$filter', '$timeout', '$state', '$rootScope', '$location', '$anchorScroll',
	function($scope, $stateParams, ADPropertyGroupsSrv, ngTableParams, $filter, $timeout, $state, $rootScope, $location, $anchorScroll) {

		ADBaseTableCtrl.call(this, $scope, ngTableParams);
		$scope.$emit("changedSelectedMenu", 11); //$stateParams.menu
		$scope.currentClickedElement = -1;
		$scope.isAdd = false;
		$scope.isEdit = false;
		$scope.prefetchData = {};
		$scope.successMessage = "";

		$scope.fetchTableData = function($defer, params) {
			var getParams = $scope.calculateGetParams(params);
			var fetchSuccessOfItemList = function(data) {
				data =  {
		"total_count": 132,
		"property_groups": [{
			"id": "13290",
			"name": "Group name one",
			"linked_property_count": "3"

		}, {
			"id": "13290",
			"name": "Group name two",
			"linked_property_count": "4"

		}, {
			"id": "13290",
			"name": "Group name ten",
			"linked_property_count": "10"

		}, {
			"id": "13290",
			"name": "Group name seven",
			"linked_property_count": "7"

		}, {
			"id": "13290",
			"name": "Group name one",
			"linked_property_count": "3"

		}]

};
				$scope.$emit('hideLoader');

				$scope.currentClickedElement = -1;
				$scope.totalCount = data.total_count;
				$scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
				$scope.data = data.property_groups;
				$scope.is_connected_to_pms = data.is_connected_to_pms;
				$scope.currentPage = params.page();
	        	params.total(data.total_count);
	            $defer.resolve($scope.data);
			};

			$scope.invokeApi(ADPropertyGroupsSrv.fetch, getParams, fetchSuccessOfItemList);
		};


		$scope.loadTable = function() {
			$scope.tableParams = new ngTableParams({
			        page: 1,  // show first page
			        count: $scope.displyCount, // count per page
			        sorting: {
			            property_group: 'asc' // initial sorting
			        }
			    }, {
			        total: 0, // length of data
			        getData: $scope.fetchTableData
			    }
			);
		};

		$scope.loadTable();

		/*
		 * To fetch the required details for add screen.
		 */
		$scope.addNewClicked = function() {


			$scope.currentClickedElement = -1;

			$timeout(function() {
	            $location.hash('new-form-holder');
	            $anchorScroll();
        	});
			var fetchNewDetailsSuccessCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.isAdd = true;
				$scope.prefetchData = {};

				$scope.prefetchData = data;
			};

			$scope.invokeApi(ADPropertyGroupsSrv.fetchAddData, {}, fetchNewDetailsSuccessCallback);
		};

		/*
		 * To fetch the required details for edit screen.
		 */
		$scope.editSelected = function(index, value) {
			$scope.isAdd = false;
			$scope.editId = value;
			var data = {
				'editId': value
			};

			var editSuccessCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.currentClickedElement = index;
				$scope.prefetchData = {};
				$scope.prefetchData = data;

				$scope.isEdit = true;
				$scope.isAdd = false;
			};

			$scope.invokeApi(ADPropertyGroupsSrv.fetchEditData, data, editSuccessCallback);
		};

		/*
		 * To fetch the template for property group details add/edit screens
		 */
		$scope.getTemplateUrl = function() {

			return "/assets/partials/propertygroups/adPostingGroupDetailsForm.html";
		};

		/*
		 * To handle delete button click.
		 */
		$scope.deleteItem = function(value) {
			var deleteSuccessCallback = function(data) {
				$scope.$emit('hideLoader');
				angular.forEach($scope.data.property_groups, function(item, index) {
					if (item.value === value) {
						$scope.data.property_groups.splice(index, 1);
					}
				});
				$scope.tableParams.reload();
			};
			var data = {
				'value': value
			};

			$scope.invokeApi(ADPropertyGroupsSrv.deleteItem, data, deleteSuccessCallback);
		};

		/*
		 * To handle save button click.
		 */
		$scope.clickedSave = function() {
			var saveSuccessCallback = function(data) {
				$scope.$emit('hideLoader');
				if ($scope.isEdit) {
                                    var p = parseInt($scope.currentClickedElement);

                                    if ($scope.orderedData) {
                                    if ($scope.orderedData[p]) {
					$scope.orderedData[parseInt($scope.currentClickedElement)].property_group = data.property_group;
                                    }
                                    }

				} else {
					$scope.data.push(data);
					$scope.tableParams.reload();
				}

				$scope.currentClickedElement = -1;
				if ($scope.isAdd) {
					$scope.isAdd = false;
				}
				if ($scope.isEdit) {
					$scope.isEdit = false;
				}
				$scope.successMessage = 'Success!';
			};

			var postData = $scope.prefetchData;
			$scope.invokeApi(ADPropertyGroupsSrv.save, postData, saveSuccessCallback);
		};

		/*
		 * To handle cancel button click.
		 */
		$scope.clickedCancel = function() {
			if ($scope.isAdd) {
				$scope.isAdd = false;
			}
			if ($scope.isEdit) {
				$scope.isEdit = false;
			}
		};
	}]);