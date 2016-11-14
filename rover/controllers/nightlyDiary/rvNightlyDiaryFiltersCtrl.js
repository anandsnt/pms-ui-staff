angular.module('sntRover')
.controller('rvNightlyDiaryFiltersController',
    [   '$scope',
        '$rootScope',
        '$state',
        '$stateParams',
        '$filter',
        function(
            $scope,
            $rootScope,
            $state,
            $stateParams,
            $filter
        ){

        BaseCtrl.call(this, $scope);
        
        var getDateShift = function( startDate, shiftCount,  isRightShift ){
            var date = tzIndependentDate(startDate);
            if(isRightShift){
                date.setDate(date.getDate() + shiftCount );
            }
            else{
                date.setDate(date.getDate() - shiftCount );
            }
            date = $filter('date')(date, 'yyyy-MM-dd');
            console.log(date);
            return date;
        };

        var init = function(){
            $scope.diaryData.isSevenMode = true;
            $scope.diaryData.fromDate = tzIndependentDate($rootScope.businessDate);
            $scope.diaryData.toDate   = getDateShift( $rootScope.businessDate, 7, true);
        };
       
        // To toggle 7/21 button.
        $scope.toggleSwitchMode = function(){
            console.log("toggleSwitchMode");
            var isRightShift = true;
            $scope.diaryData.isSevenMode = !$scope.diaryData.isSevenMode;
            var isRightShift = true;
            if($scope.diaryData.isSevenMode){
                console.log('7');
                $scope.diaryData.toDate = getDateShift($scope.diaryData.fromDate, 7, isRightShift);
            }
            else{
                console.log('21');
                $scope.diaryData.toDate = getDateShift($scope.diaryData.fromDate, 21, isRightShift);
            }
            $scope.renderDiaryScreen();
        };

        $scope.clickedDateLeftShift = function(){
            var isRightShift = false;
            if($scope.diaryData.isSevenMode){
                $scope.diaryData.fromDate = getDateShift($scope.diaryData.fromDate, 7, isRightShift);
                $scope.diaryData.toDate = getDateShift($scope.diaryData.fromDate, 7, isRightShift);
            }
            else{
                $scope.diaryData.fromDate = getDateShift($scope.diaryData.fromDate, 21, isRightShift);
                $scope.diaryData.toDate = getDateShift($scope.diaryData.fromDate, 21, isRightShift);
            }
            $scope.renderDiaryScreen();
        };

        $scope.clickedDateRightShift = function(){
            var isRightShift = true;
            if($scope.diaryData.isSevenMode){
                $scope.diaryData.fromDate = getDateShift($scope.diaryData.fromDate, 7, isRightShift);
                $scope.diaryData.toDate = getDateShift($scope.diaryData.fromDate, 7, isRightShift);
            }
            else{
                $scope.diaryData.fromDate = getDateShift($scope.diaryData.fromDate, 21, isRightShift);
                $scope.diaryData.toDate = getDateShift($scope.diaryData.fromDate, 21, isRightShift);
            }
            $scope.renderDiaryScreen();
        };

        $scope.clickedResetButton = function(){
            init();
            $scope.renderDiaryScreen();
        };

        init();

}]);
