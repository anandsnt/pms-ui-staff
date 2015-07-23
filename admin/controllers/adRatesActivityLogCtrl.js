admin.controller('ADRatesActivityLogCtrl',['$scope', '$state','$stateParams', 'ADRateActivityLogSrv', 'ngTableParams', '$filter',  
    function($scope, $state, $stateParams, ADRateActivityLogSrv, ngTableParams, $filter){
	BaseCtrl.call(this, $scope);
        $scope.showActivityLog = false;
        $scope.activityLogData = {};
        $scope.getRateLog = function(){
            $scope.showActivityLog = true;
            $scope.$emit('showLoader');
            var rateId = $stateParams.rateId;
            var callback = function(response){
                $scope.activityLogData = response;
                $scope.$emit('hideLoader');
            };
            $scope.invokeApi(ADRateActivityLogSrv.fetchRateLog, {'id':rateId},callback);
        };
        
        $scope.toggleActivityLog = function(){
            if ($scope.detailsMenu !== 'adRateActivityLog'){
                $scope.detailsMenu = 'adRateActivityLog';
                $scope.getRateLog();
            } else {
                $scope.detailsMenu = '';
            }
        };
        $scope.isOldValue = function(value){
            if(value =="" || typeof value == "undefined" || value == null){
                return false;
            }
            else{
                return true;
            }
        };
        
    $scope.updateReport = function(){
        var callback = function(data) {
                $scope.totalResults = data.total_count;
                $scope.activityLogData = data.results;
                if ($scope.nextAction) {
                    $scope.start = $scope.start + $scope.perPage;
                    $scope.nextAction = false;
                    $scope.initSort();
                }
                if ($scope.prevAction) {
                    $scope.start = $scope.start - $scope.perPage;
                    $scope.prevAction = false;
                    $scope.initSort();
                }
                $scope.end = $scope.start + $scope.activityLogData.length - 1;
                $scope.$emit('hideLoader');
        };
        var params = {
                id: $stateParams.rateId,
                page: 1,
                per_page: 25
        };
        if($scope.isUpdateReportFilter){
            params['from_date'] = $filter('date')($scope.fromDate, 'yyyy-MM-dd');
            params['to_date'] =$filter('date')($scope.toDate, 'yyyy-MM-dd');
            if($scope.user_id)
                params['user_id'] = $scope.user_id;
        }
        params['sort_order'] = $scope.sort_order;
        params['sort_field'] = $scope.sort_field;       
        $scope.invokeApi(ADRateActivityLogSrv.filterActivityLog, params, callback);
    };
    /*
    * Sorting
    */    
    $scope.initSort =function(){
        $scope.sortOrderOfUserASC = false;
        $scope.sortOrderOfDateASC = false;
        $scope.sortOrderOfActionASC = false;
        $scope.sortOrderOfUserDSC = false;
        $scope.sortOrderOfDateDSC = false;
        $scope.sortOrderOfActionDSC = false;
    };

    $scope.sortByUserName = function(){
        $scope.sort_field ="USERNAME";
        if($scope.sortOrderOfUserASC){
            $scope.initSort();
            $scope.sortOrderOfUserDSC = true;
            $scope.sort_order="desc";
        }
        else{
            $scope.initSort();
            $scope.sortOrderOfUserASC = true;
            $scope.sort_order="asc";
        }
        $scope.updateReport();
    };

    $scope.sortByDate = function(){
        $scope.sort_field ="DATE";
        if($scope.sortOrderOfDateASC){
            $scope.initSort();
            $scope.sortOrderOfDateDSC = true;
            $scope.sort_order="desc";
        }
        else{
            $scope.initSort();
            $scope.sortOrderOfDateASC = true;
            $scope.sort_order="asc";
        }
        $scope.updateReport();
    };

    $scope.sortByAction = function(){
        $scope.sort_field ="ACTION";
        if($scope.sortOrderOfActionASC){
            $scope.initSort();
            $scope.sortOrderOfActionDSC = true;
            $scope.sort_order="desc";
        }
        else{
            $scope.initSort();
            $scope.sortOrderOfActionASC = true;
            $scope.sort_order="asc";
        }
        $scope.updateReport();
    };
        
        
        

}]);