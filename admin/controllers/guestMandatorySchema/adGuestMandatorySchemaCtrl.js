admin.controller('ADGuestMandatorySchemaCtrl', ['$scope',
	'ADguestMandatorySchemaSrv', 'ngTableParams', '$state', 'ngDialog',
	function($scope, ADguestMandatorySchemaSrv, ngTableParams, $state, ngDialog) {

		BaseCtrl.call(this, $scope);

		var fetchSchemaList = function() {
			$scope.clearErrorMessage();
			$scope.callAPI(ADguestMandatorySchemaSrv.fetchSchemas, {
				params: {},
				successCallBack: function(response) {
					$scope.schemaList = response;
					$scope.screenMode = 'SCHEMA_LIST';
				}
			});
		};

		var resetselectedSchema = function() {
			$scope.selectedSchema = {
				"title": "",
				"schema_json": ""
			};
		};

		$scope.deleteSchema = function(dataCenter) {
			$scope.callAPI(ADguestMandatorySchemaSrv.deleteSchema, {
				params: {
					id: dataCenter.id
				},
				successCallBack: fetchSchemaList
			});
		};


		$scope.addNewSchema = function() {
			resetselectedSchema();
			$scope.screenMode = 'ADD_SCHEMA';
		};

		$scope.changeToListView = function() {
			$scope.screenMode = 'SCHEMA_LIST';
			resetselectedSchema();
		};

		$scope.continueToVersionList = function() {
			ngDialog.close();
			fetchSchemaList();
		};

		$scope.editSchema = function(dataCenter) {
			$scope.selectedSchema = dataCenter;
			$scope.screenMode = 'EDIT_SCHEMA';
		};

		$scope.saveChanges = function() {
			var serviceAction = $scope.screenMode === 'EDIT_SCHEMA' ? ADguestMandatorySchemaSrv.updateDataCenter : ADguestMandatorySchemaSrv.saveNewDataCenter;

			$scope.callAPI(serviceAction, {
				params: $scope.selectedSchema,
				successCallBack: fetchSchemaList
			});
		};

		(function() {
			$scope.errorMessage = '';
			$scope.schemaList = [];

			$scope.tableParams = new ngTableParams({
				page: 1, // show first page
				count: $scope.schemaList.length, // count per page
				sorting: {
					name: 'asc' // initial sorting
				}
			}, {
				total: 0, // length of data
				getData: fetchSchemaList
			});
		})();
	}
]);