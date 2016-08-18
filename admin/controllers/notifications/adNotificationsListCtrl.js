admin.controller('ADNotificatinsListCtrl',['$scope','$rootScope', '$state','$stateParams', 'ADNotificationsListSrv','ngTableParams', '$filter', function($scope, $state,$rootScope, $stateParams, ADNotificationsListSrv, ngTableParams, $filter){
	BaseCtrl.call(this, $scope);
	ADBaseTableCtrl.call(this, $scope, ngTableParams);
	$scope.$emit("changedSelectedMenu", 0);
	var fetchSuccess = function (data) {		
		$scope.data = data;
		$scope.$emit('hideLoader');

		// REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
		$scope.tableParams = new ngTableParams({
			// show first page
			page: 1,
			// count per page - Need to change when on pagination implemntation
			count: $scope.data.results.length,
			sorting: {
				pms_type: 'asc'
			}
		}, {
			// length of data
			total: $scope.data.results.length,
			getData: function ($defer, params)
			{
				if (params.settings().$scope == null) {
					params.settings().$scope = $scope;
				};
				var orderedData = params.sorting() ?
					$filter('orderBy')($scope.data.results, params.orderBy()) :
					$scope.data.results;
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		});
		$scope.tableParams.reload();
	};

	var FetchNotificationsList = function() {
		$scope.invokeApi(ADNotificationsListSrv.fetch, {}, fetchSuccess);
	};
	var deleteSuccess = function(data){
		FetchNotificationsList();
	}

	var deleteFailed = function(err){
		$scope.errorMessage = err;		
		$scope.$emit('hideLoader');
	}

	$scope.deleteNotification = function(index,id){
		params = {
			id :id
		};
		$scope.invokeApi(ADNotificationsListSrv.deleteNotification, params, deleteSuccess, deleteFailed);
	};

	var initMe = function(){
		FetchNotificationsList();		
	};
	initMe();


}]);