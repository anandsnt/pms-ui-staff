admin.controller('ADOracleDataCentersCtrl', ['$scope',
	'ADDataCenterSrv', 'ngTableParams', '$state', 'ngDialog',
	function($scope, ADDataCenterSrv, ngTableParams, $state, ngDialog) {

		BaseCtrl.call(this, $scope);

		var fetchDataCenters = function() {
			$scope.clearErrorMessage();
			$scope.callAPI(ADDataCenterSrv.fetchDataCenters, {
				params: {},
				successCallBack: function(response) {
					$scope.dataCentersList = response;
					$scope.screenMode = 'DATA_CENTER_LIST';
				}
			});
		};

		var resetSelectedDataCenter = function() {
			$scope.selectedDataCenter = {
				"name": "",
				"username": "",
				"password": "",
				"expiration_date": moment(new Date()).format('YYYY-MM-DD')
			};
		};

		var deletingDataCenterId = '';
		var deleteDataCenter = function() {
			$scope.callAPI(ADDataCenterSrv.deleteDataCenter, {
				params: {
					id: deletingDataCenterId
				},
				successCallBack: fetchDataCenters
			});
		};

		var checkIfDataCenterIsUsedByProperties = function() {
			// to do : chanege this API
			$scope.callAPI(ADDataCenterSrv.checkIdDataCenterIsUsed, {
				params: {
					id: deletingDataCenterId
				},
				successCallBack: function() {
					if (false) {
						ngDialog.open({
							template: '/assets/partials/dataCenters/adOracleDataCenterDeletionWarning.html',
							className: 'ngdialog-theme-default',
							scope: $scope,
							closeByDocument: true
						});
					} else {
						deleteDataCenter();
					}
				}
			});
		};

		$scope.deleteCenter = function(dataCenter) {
			deletingDataCenterId = dataCenter.id;
			checkIfDataCenterIsUsedByProperties();
		};

		$scope.showExpiryDate = function() {
			ngDialog.open({
				template: '/assets/partials/dataCenters/adOracleDataCenterExpiryDate.html',
				className: 'ngdialog ngdialog-theme-default calendar-single1',
				closeByDocument: true,
				scope: $scope
			});
		};

		$scope.addNewDataCenter = function() {
			resetSelectedDataCenter();
			$scope.screenMode = 'ADD_CENTER';
		};

		$scope.changeToListView = function() {
			$scope.screenMode = 'DATA_CENTER_LIST';
			resetSelectedDataCenter();
		};

		$scope.continueToVersionList = function() {
			ngDialog.close();
			fetchDataCenters();
		};

		$scope.editCenter = function(dataCenter) {
			$scope.selectedDataCenter = dataCenter;
			$scope.screenMode = 'EDIT_CENTER';
		};

		$scope.saveChanges = function() {
			var serviceAction = $scope.screenMode === 'EDIT_CENTER' ? ADDataCenterSrv.updateDataCenter : ADDataCenterSrv.saveNewDataCenter;

			$scope.callAPI(serviceAction, {
				params: $scope.selectedDataCenter,
				successCallBack: fetchDataCenters
			});
		};

		(function() {
			$scope.errorMessage = '';
			$scope.dataCentersList = [];

			$scope.tableParams = new ngTableParams({
				page: 1, // show first page
				count: $scope.dataCentersList.length, // count per page
				sorting: {
					name: 'asc' // initial sorting
				}
			}, {
				total: 0, // length of data
				getData: fetchDataCenters
			});

			$scope.expiryDateOptions = {
				dateFormat: 'YYYY-MM-DD',
				changeYear: true,
				changeMonth: true,
				yearRange: "0:+10",
				// minDate: 0, // TODO: Decide on prevention of past date selection
				onSelect: function() {
					console.log($scope.selectedDataCenter.expiration_date);
					ngDialog.close();
				}
			};
		})();
	}
]);