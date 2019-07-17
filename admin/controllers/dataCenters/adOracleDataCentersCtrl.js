admin.controller('ADOracleDataCentersCtrl', ['$scope',
	'ADDataCenterSrv', 'ngTableParams', '$state', 'ngDialog',
	function($scope, ADDataCenterSrv, ngTableParams, $state, ngDialog) {

		BaseCtrl.call(this, $scope);

		var fetchDataCenters = function() {
			$scope.clearErrorMessage();
			$scope.callAPI(ADDataCenterSrv.fetchDataCenters, {
				params: {},
				successCallBack: function(response) {
					$scope.dataCentersList = response.results;
					$scope.screenMode = 'DATA_CENTER_LIST';
				}
			});
		};

		var resetselectedDataCenter = function() {
			$scope.selectedDataCenter = {
				"name": "",
				"url": "",
				"port": "",
				"user_name": "",
				"password": "",
				"expiry_date": moment(new Date()).format('MM-DD-YYYY')
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
			$scope.callAPI(ADDataCenterSrv.fetchDataCenters, {
				params: {},
				successCallBack: function() {
					if (true) {
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
			resetselectedDataCenter();
			$scope.screenMode = 'ADD_CENTER';
		};

		$scope.changeToListView = function() {
			$scope.screenMode = 'DATA_CENTER_LIST';
			resetselectedDataCenter();
		};

		$scope.continueToVersionList = function() {
			ngDialog.close();
			fetchDataCenters();
		};

		$scope.editCenter = function(dataCenter) {
			dataCenter.expiry_date = "01-02-1977";
			$scope.selectedDataCenter = dataCenter;
			$scope.screenMode = 'EDIT_CENTER';
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
				changeYear: true,
				changeMonth: true,
				yearRange: "0:+10",
				// minDate: 0, // TODO: Decide on prevention of past date selection
				onSelect: function() {
					console.log($scope.selectedDataCenter.expiry_date);
					ngDialog.close();
				}
			};
		})();
	}
]);