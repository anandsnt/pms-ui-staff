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
						"id": 13290,
						"name": "Group name one",
						"linked_property_count": 3

					}, {
						"id": 13290,
						"name": "Group name two",
						"linked_property_count": 3

					}, {
						"id": 13290,
						"name": "Group name three",
						"linked_property_count": 3

					}, {
						"id": 13290,
						"name": "Group name four",
						"linked_property_count": "3"

					}, {
						"id": 13290,
						"name": "Group name five",
						"linked_property_count": 3

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
				data = {
					"chain_hotels": [{
							"id": 22,
							"name": "Zoku Amsterdam",
							"belongs_to_group": "Zoku group",
							"is_already_linked_to_group": true
						},
						{
							"id": 23,
							"name": "Zoku Amsterdam test",
							"belongs_to_group": "Zoku group",
							"is_already_linked_to_group": false
						},
						{
							"id": 24,
							"name": "Zoku Amsterdam second",
							"belongs_to_group": "Zoku group",
							"is_already_linked_to_group": true
						}


					]
				};
				$scope.$emit('hideLoader');
				$scope.isAdd = true;
				$scope.prefetchData = {};

				$scope.prefetchData = data;
				angular.forEach($scope.prefetchData.chain_hotels, function(property, index) {
					property.is_checked = false;
				});
				$scope.prefetchData.linked_property_ids = [];
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
			$scope.isEdit = true;

			var editSuccessCallback = function(data) {
				data = {
					"name": "Zoku group",
					"linked_property_ids": [23, 24],
					"chain_hotels": [{
							"id": 22,
							"name": "Zoku Amsterdam",
							"belongs_to_group": "Zoku group",
							"is_already_linked_to_group": true
						},
						{
							"id": 23,
							"name": "Zoku Amsterdam test",
							"belongs_to_group": "Zoku group",
							"is_already_linked_to_group": false
						},
						{
							"id": 24,
							"name": "Zoku Amsterdam second",
							"belongs_to_group": "Zoku group",
							"is_already_linked_to_group": true
						}


					]
				};


				$scope.$emit('hideLoader');
				$scope.currentClickedElement = index;
				$scope.prefetchData = {};
				$scope.prefetchData = data;
				var linked_properties = $scope.prefetchData.linked_property_ids;

				angular.forEach($scope.prefetchData.chain_hotels, function(item) {
					item.is_checked = (linked_properties.includes(item.id)) ? 'true' : 'false';
				});
				console.log($scope.prefetchData)

				$scope.isEdit = true;
				$scope.isAdd = false;

			};

			$scope.invokeApi(ADPropertyGroupsSrv.fetchEditData, data, editSuccessCallback);
		};

		/*
		 * To fetch the template for property group details add/edit screens
		 */
		$scope.getTemplateUrl = function() {

			return "/assets/partials/chainAdmins/adPropertyGroupDetailsForm.html";


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
		$scope.clickedSave = function() {alert("test function")
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

			var postData = {
				"property_group_name": $scope.prefetchData.property_group_name,
				"linked_property_ids": $scope.prefetchData.linked_property_ids
			};
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

		/*
	    * To handle checkbox click actions
	    */

	    $scope.checkBoxClicked = function(index) {
	    	var propId = $scope.prefetchData.chain_hotels[index].id;

	    	if (!$scope.prefetchData.linked_property_ids.includes(propId)) {
	    		$scope.prefetchData.linked_property_ids.push(propId);
	    	}
	    	else {
	    		var idx = $scope.prefetchData.linked_property_ids.indexOf(propId);
	    		$scope.prefetchData.linked_property_ids.splice(idx, 1);
	    	};

	    	// $scope.prefetchData.chain_hotels[index].is_checked = ($scope.prefetchData.chain_hotels[index].is_checked === 'true') ? 'false' : 'true';
	    	$scope.prefetchData.chain_hotels[index].is_checked = ($scope.prefetchData.linked_property_ids.includes(propId)) ? 'true' : 'false';
	    };
	}]);