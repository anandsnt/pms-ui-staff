sntRover.controller('RVJournalSummaryController', ['$scope','$rootScope', 'RVJournalSrv','$timeout',function($scope, $rootScope, RVJournalSrv, $timeout) {
	BaseCtrl.call(this, $scope);
    $scope.errorMessage = "";

    $scope.setScroller('summary_content',{});
    var refreshSummaryScroller = function () {
        setTimeout(function(){$scope.refreshScroller('summary_content');}, 500);
    };

    $rootScope.$on('REFRESHSUMMARYCONTENT',function () {
        refreshSummaryScroller();
    });

	var initSummaryData = function(){

		var successCallBackFetchSummaryData = function(responce){
			$scope.data.summaryData = {};
			$scope.data.summaryData = responce.data;
            $scope.errorMessage = "";
            refreshSummaryScroller();
            $scope.$emit('hideLoader');
		};

        var params = {
            "date": $scope.data.summaryDate
        };
		$scope.invokeApi(RVJournalSrv.fetchSummaryData, params, successCallBackFetchSummaryData);
    };

    /** Handle Expand/Collapse on Level1 **/
    $scope.toggleJournalSummaryItem = function () {

        //var toggleItem = $scope.data.summaryData.charge_groups[];

        /*var successCallBackFetchRevenueDataChargeCodes = function(data){
            if(data.charge_codes.length > 0){
                toggleItem.charge_codes = data.charge_codes;
                toggleItem.active = !toggleItem.active;
                refreshRevenueScroller();
                $scope.data.selectedChargeCode  = '';
            }
            $scope.errorMessage = "";
            $scope.$emit('hideLoader');
        };

        // Call api only while expanding the tab ..
        if(!toggleItem.active){

            var postData = {
                "from_date":$scope.data.fromDate,
                "to_date":$scope.data.toDate,
                "charge_group_id": toggleItem.id,
                "employee_ids" : $scope.data.selectedEmployeeList ,
                "department_ids" : $scope.data.selectedDepartmentList
            };
            $scope.invokeApi(RVJournalSrv.fetchRevenueDataByChargeCodes, postData, successCallBackFetchRevenueDataChargeCodes);
        }
        else{
            toggleItem.active = !toggleItem.active;
        }*/
    };

	initSummaryData();

}]);