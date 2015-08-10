admin.controller('ADcampaignDatepicker',['$scope','ngDialog','$rootScope','$filter',function($scope,ngDialog,$rootScope,$filter){

//if no date is selected .Make bussiness date as default CICO-8703

$scope.setUpData = function(){
    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        minDate: tzIndependentDate($rootScope.businessDate),
        onSelect: function(dateText, inst) {
            $scope.campaignData.end_date_for_display = $filter('date')(tzIndependentDate($scope.campaignData.end_date), 'yyyy-MM-dd');
            console.log($scope.campaignData.end_date_for_display);
            ngDialog.close();
        }
    };
};
$scope.setUpData();

}]);