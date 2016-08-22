admin.controller('ADNotificatinsListCtrl',['$scope','$rootScope', '$state','$stateParams', 'ADNotificationsListSrv','ngTableParams', '$filter', function($scope, $state,$rootScope, $stateParams, ADNotificationsListSrv, ngTableParams, $filter){
	BaseCtrl.call(this, $scope);
	ADBaseTableCtrl.call(this, $scope, ngTableParams);
	//Fetch list of Notification
	$scope.$emit("changedSelectedMenu", 0);
	var fetchSuccess = function (data) {		
		$scope.data = data;
		$scope.$emit('hideLoader');
		$scope.tableParams = new ngTableParams({
			page: 1,
			count: $scope.data.results.length,
			sorting: {
				pms_type: 'asc'
			}
		}, {
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

	$scope.getDuration = function(activates_at, expires_at){
        var activates_at = new Date(activates_at);
        var expires_at = new Date(expires_at);
        var timeDiff = Math.abs(expires_at.getTime() - activates_at.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return (diffDays-1);
    };

	$scope.deleteNotification = function(index,id){		
		var deleteSuccess = function(data){
			FetchNotificationsList();
		};
		var deleteFailed = function(err){
			$scope.errorMessage = err;		
			$scope.$emit('hideLoader');
		};
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