admin.controller('adsnapshotSetupCtrl', ['$scope', 'adSnapShotSetupSrv', 'ngTableParams', '$filter',
	function($scope, adSnapShotSetupSrv, ngTableParams, $filter) {
		BaseCtrl.call(this, $scope);
		$scope.hours = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
		$scope.minutes = ["00", "15", "30", "45"];
		$scope.primeTimes = [ "AM", "PM"];
		$scope.retry_count_options = ["1", "2", "3", "4", "5"];

		$scope.publishFullExport = function() {
			var onpublishFullExportSucces = function() {
					$scope.successMessage = 'Publishing was Success';
				},
				options = {
					params: {},
					successCallBack: onpublishFullExportSucces
				};

			$scope.callAPI(adSnapShotSetupSrv.publishFullExport, options);
		};

		$scope.saveSettings = function() {
			var onSaveSettingsSucces = function() {
					$scope.successMessage = 'Success, Your settings has been saved.';
				},
				options = {
					params: $scope.snapshotData,
					successCallBack: onSaveSettingsSucces
				};

			$scope.callAPI(adSnapShotSetupSrv.saveSettings, options);
		};

		$scope.fetchSettings = function() {
			var onFetchSettingsSucces = function(data) {
					$scope.snapshotData = data;
					// $scope.fetchExportData();
				},
				options = {
					successCallBack: onFetchSettingsSucces
				};

			$scope.callAPI(adSnapShotSetupSrv.getSettings, options);
		};

		/**
    * initialize table in view
    */
    var setUpIncrementalExportTable = function() {
        $scope.incrementalTableParams = new ngTableParams({
           page: 1,            // show first page
           count: $scope.incrementalExportData.length + 1   // had to add 1, guess 1 row is being used by the table header
            // count per page - Need to change when on pagination implemntation
            // sorting: { floor_number: 'asc'     // initial sorting
            // }
        }, {
            total: $scope.incrementalExportData.length,
            counts: [], // hides page sizes
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ?
                                    $filter('orderBy')($scope.incrementalExportData, params.orderBy()) :
                                    $scope.incrementalExportData;

                $scope.orderedData =  $scope.incrementalExportData;

                $defer.resolve(orderedData);
                $scope.showIncrementalTableDetails = true;
            }
        });
    };

    var setUpFullExportTable = function() {
        $scope.fullTableParams = new ngTableParams({
           page: 1,            // show first page
           count: $scope.fullExportData.length + 1   // had to add 1, guess 1 row is being used by the table header
            // count per page - Need to change when on pagination implemntation
            // sorting: { floor_number: 'asc'     // initial sorting
            // }
        }, {
            total: $scope.fullExportData.length,
            counts: [], // hides page sizes
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ?
                                    $filter('orderBy')($scope.fullExportData, params.orderBy()) :
                                    $scope.fullExportData;

                $scope.orderedData =  $scope.fullExportData;

                $defer.resolve(orderedData);
                $scope.showFullExportTableDetails = true;
            }
        });
    };

    $scope.fetchExportData = function() {
			var onFetchExportDataSucces = function(data) {
					$scope.fullExportData = data.full_export_data;
					$scope.incrementalExportData = data.incremental_export_data;
					setUpFullExportTable();
					setUpIncrementalExportTable();
				},
				options = {
					successCallBack: onFetchExportDataSucces
				};

			$scope.callAPI(adSnapShotSetupSrv.fetchExportData, options);
		};

		(function init() {
			$scope.errorMessage = '';
			$scope.successMessage = '';
			$scope.fetchSettings();
			$scope.fetchExportData();
		}());

	}
]);
