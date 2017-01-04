admin.controller('adsnapshotSubGroupMappingCtrl', ['$scope', 'ADChargeCodesSrv', 'adSnapShotSetupSrv', 'ngTableParams', '$filter', '$timeout', '$state', '$rootScope', '$location', '$anchorScroll',
	function($scope, ADChargeCodesSrv, adSnapShotSetupSrv, ngTableParams, $filter, $timeout, $state, $rootScope, $location, $anchorScroll) {

		ADBaseTableCtrl.call(this, $scope, ngTableParams);
		
		$scope.successMessage = "";
		$scope.subgroups = ['FB', 'AUX', 'ACC'];


		$scope.fetchTableData = function($defer, params) {
			var getParams = $scope.calculateGetParams(params);
			var fetchSuccessOfItemList = function(data) {
				$scope.$emit('hideLoader');
				// No expanded rate view
				$scope.currentClickedElement = -1;
				$scope.totalCount = data.total_count;
				$scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
				$scope.data = data.charge_codes;
				$scope.is_connected_to_pms = data.is_connected_to_pms;
				$scope.currentPage = params.page();
				params.total(data.total_count);
				$defer.resolve($scope.data);
			};

			$scope.invokeApi(ADChargeCodesSrv.fetch, getParams, fetchSuccessOfItemList);
		};


		$scope.loadTable = function() {
			$scope.tableParams = new ngTableParams({
					page: 1,  // show first page
					count: $scope.displyCount, // count per page
					sorting: {
						charge_code: 'asc' // initial sorting
					}
				}, {
					total: 0, // length of data
					getData: $scope.fetchTableData
				});
		};

		$scope.loadTable();

		$scope.saveMapping = function() {
			var mappedChargeCodes = [], mapped_charge_code;

			_.each($scope.data, function(chargeCode) {
				mapped_charge_code = {};
				mapped_charge_code.id = chargeCode.value;
				mapped_charge_code.snapshot_subgroup = chargeCode.snapshot_subgroup;
				mappedChargeCodes.push(mapped_charge_code);
			});

			var onSaveMappingsSucces = function() {
					$scope.successMessage = 'Success, Your mappings has been saved.';
				},
				options = {
					params: {'snapshot_subgroup_mappings': mappedChargeCodes},
					successCallBack: onSaveMappingsSucces
				};

			$scope.callAPI(adSnapShotSetupSrv.saveSubgroupMapping, options);
			
		};

	}
]);